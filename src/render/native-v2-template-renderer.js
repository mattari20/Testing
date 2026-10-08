import { getSkillsLanguagesPresentationContract, getAllowedProficiencyForListStyle } from '../templates/skills-languages-presentation-contract.js';
import { getSkillOrLanguageProficiency, getSkillOrLanguageValue, PROFICIENCY_LABELS } from '../core/skills-languages.js';
export const NATIVE_TEMPLATE_RENDERER_VERSION = '3.16.0';

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const IDENTITY_ALIASES = Object.freeze({
  fullName: ['fullName', 'name'],
  jobTitle: ['jobTitle', 'job'],
  phone: ['phone', 'mobile', 'contactNumber'],
  address: ['address', 'location'],
  dateOfBirth: ['dateOfBirth', 'dob'],
  linkedin: ['linkedin', 'linkedinUrl'],
  website: ['website', 'websiteUrl'],
  whatsapp: ['whatsapp', 'whatsappNumber'],
  cnic: ['cnic', 'nationalId'],
  religion: ['religion']
});

const ENTRY_ALIASES = Object.freeze({
  role: ['role', 'title', 'position', 'jobTitle'],
  title: ['title', 'role', 'position', 'jobTitle', 'name'],
  company: ['company', 'employer', 'organization', 'institution'],
  dates: ['dates', 'duration', 'year', 'years'],
  duration: ['duration', 'dates', 'year', 'years'],
  description: ['description', 'desc', 'details', 'summary'],
  desc: ['desc', 'description', 'details', 'summary'],
  institution: ['institution', 'institute', 'school', 'university'],
  institute: ['institute', 'institution', 'school', 'university'],
  degree: ['degree', 'qualification', 'program'],
  year: ['year', 'dates', 'duration', 'years'],
  grade: ['grade', 'gpa', 'result'],
  name: ['name', 'title', 'projectName', 'achievement'],
  achievement: ['achievement', 'title', 'name', 'description', 'desc'],
  skill: ['skill', 'value', 'name'],
  language: ['language', 'value', 'name']
});

function readPath(source, path) {
  if (!path) return undefined;
  const parts = String(path).split('.');
  let value = source;
  for (const key of parts) {
    if (value == null) return undefined;
    value = value[key];
  }
  return value;
}

export function findCanonicalSection(snapshot, sectionType) {
  const sections = Array.isArray(snapshot?.careerData?.sections) ? snapshot.careerData.sections : [];
  return sections.find(section => String(section.type) === String(sectionType)) || null;
}

function entryDateKey(entry, sectionType) {
  const values = entry?.values || {};
  if (String(sectionType)==='experience') return String(values.startDate || values.dates || '').trim();
  const raw = String(values.dates || values.startDate || '').trim();
  const matches = raw.match(/(19\d{2}|20\d{2}|21\d{2})/g);
  return matches?.[0] || raw;
}
function orderEntries(snapshot, section) {
  const entries = Array.isArray(section?.entries) ? [...section.entries] : [];
  const sortDirection = snapshot?.configuration?.presentation?.entrySort?.[String(section?.type)] || ((String(section?.type)==='experience' || String(section?.type)==='education') ? 'desc' : null);
  if (sortDirection && (String(section?.type)==='experience' || String(section?.type)==='education')) {
    return entries.sort((a,b)=>{
      const ad=entryDateKey(a,section.type), bd=entryDateKey(b,section.type);
      if(ad && bd && ad!==bd) return sortDirection==='asc' ? ad.localeCompare(bd) : bd.localeCompare(ad);
      if(ad!==bd) return ad ? -1 : 1;
      return (Number(a.order)||0)-(Number(b.order)||0);
    });
  }
  const order = Array.isArray(snapshot?.configuration?.entryOrder?.[String(section?.id)])
    ? snapshot.configuration.entryOrder[String(section.id)].map(String) : [];
  const rank = new Map(order.map((id,index)=>[id,index]));
  return entries.sort((a,b)=>{
    const ar=rank.has(String(a.id))?rank.get(String(a.id)):Number.MAX_SAFE_INTEGER;
    const br=rank.has(String(b.id))?rank.get(String(b.id)):Number.MAX_SAFE_INTEGER;
    if(ar!==br)return ar-br;
    return (Number(a.order)||0)-(Number(b.order)||0);
  });
}

function hasProfilePhoto(snapshot) {
  const hiddenAssets = Array.isArray(snapshot?.configuration?.hiddenAssets) ? snapshot.configuration.hiddenAssets.map(String) : [];
  const assets = Array.isArray(snapshot?.careerData?.assets) ? snapshot.careerData.assets : [];
  return !hiddenAssets.includes('profile-photo') && assets.some(item => String(item?.key || item?.id || '') === 'profile-photo' && meaningfulAsset(item));
}
function meaningfulAsset(asset) {
  return Boolean(asset?.url || asset?.src);
}

export function isCanonicalSectionVisible(snapshot, section) {
  if (!section || section.visibility === false) return false;
  const hidden = Array.isArray(snapshot?.configuration?.hiddenSections)
    ? snapshot.configuration.hiddenSections.map(String)
    : [];
  return !hidden.includes(String(section.id)) && !hidden.includes(String(section.type));
}

export function getVisibleEntries(snapshot, section) {
  if (!section || !isCanonicalSectionVisible(snapshot, section)) return [];
  const hidden = Array.isArray(snapshot?.configuration?.hiddenEntries)
    ? snapshot.configuration.hiddenEntries.map(String)
    : [];
  const sectionId = String(section.id || section.type || '');
  return orderEntries(snapshot, section)
    .filter(entry => entry?.visibility !== false)
    .filter(entry => !hidden.includes(sectionId + ':' + String(entry.id)))
    .filter(entry => !hidden.includes(String(entry.id)));
}

function resolveIdentity(snapshot, key) {
  const identity = isObject(snapshot?.careerData?.identity) ? snapshot.careerData.identity : {};
  const candidates = IDENTITY_ALIASES[key] || [key];
  for (const candidate of candidates) {
    if (identity[candidate] !== undefined && identity[candidate] !== null) {
      const value=identity[candidate];
      return String(key)==='dateOfBirth' ? formatLongDate(value) : value;
    }
  }
  return undefined;
}

export function resolveNativeValue(snapshot, binding, context = {}) {
  const path = String(binding || '');

  if (path.startsWith('identity.')) {
    return resolveIdentity(snapshot, path.slice('identity.'.length));
  }

  if (path.startsWith('asset:')) {
    const assetKey = path.slice('asset:'.length);
    const assets = Array.isArray(snapshot?.careerData?.assets) ? snapshot.careerData.assets : [];
    const asset = assets.find(item => String(item?.key || item?.id || '') === assetKey);
    return asset?.url || asset?.src || undefined;
  }

  if (path.startsWith('section:')) {
    const [, sectionType, fieldKey] = path.split(':');
    const section = findCanonicalSection(snapshot, sectionType);
    if (!section || !isCanonicalSectionVisible(snapshot, section)) return undefined;
    const field = findSectionField(section, fieldKey);
    return field?.value;
  }

  if (context.entry && path) return resolveEntryValue(context.entry, path);
  if (context.values && path) return resolveEntryValue({ values: context.values }, path);
  if (context.item && path) {
    const item = context.item;
    const candidates = ENTRY_ALIASES[String(path)] || [String(path)];
    for (const candidate of candidates) {
      if (item[candidate] !== undefined && item[candidate] !== null) return item[candidate];
    }
    return undefined;
  }
  return readPath(snapshot, path);
}

function formatMonthYear(value) {
  const raw = String(value || '').trim();
  if (!/^\d{4}-\d{2}$/.test(raw)) return raw;
  const [year, month] = raw.split('-').map(Number);
  if (!year || !month || month < 1 || month > 12) return raw;
  return new Intl.DateTimeFormat('en-US', { month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(Date.UTC(year, month - 1, 1)));
}
function formatLongDate(value){
  const raw=String(value||'').trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const [year,month,day]=raw.split('-').map(Number);
  if(!year||!month||!day)return raw;
  const date=new Date(Date.UTC(year,month-1,day));
  if(Number.isNaN(date.getTime()))return raw;
  const mod100=day%100;
  const suffix=mod100>=11&&mod100<=13?'th':({1:'st',2:'nd',3:'rd'}[day%10]||'th');
  return day+suffix+' '+new Intl.DateTimeFormat('en-US',{month:'long',timeZone:'UTC'}).format(date)+', '+year;
}

function resolveDurationValue(values) {
  const start = String(values?.startDate || '').trim();
  const end = String(values?.endDate || '').trim();
  if (!start && !end) return undefined;
  const startText = formatMonthYear(start);
  const endText = end ? formatMonthYear(end) : 'Present';
  if (!startText) return endText;
  return startText + ' — ' + endText;
}

function resolveEntryValue(entry, key) {
  const values = isObject(entry?.values) ? entry.values : (isObject(entry) ? entry : {});
  const requestedKey = String(key);
  if (requestedKey === 'dates' || requestedKey === 'duration') {
    const duration = resolveDurationValue(values);
    if (duration) return duration;
  }
  const candidates = ENTRY_ALIASES[requestedKey] || [requestedKey];
  for (const candidate of candidates) {
    if (values[candidate] !== undefined && values[candidate] !== null && String(values[candidate]).trim() !== '') return values[candidate];
  }
  return undefined;
}
function canonicalEntryKey(key, sectionType) {
  const raw = String(key);
  const map = {
    experience: { title: 'role', duration: 'dates', desc: 'description' },
    education: { institute: 'institution', year: 'dates' },
    projects: { title: 'name', desc: 'description' },
    achievements: { achievement: 'achievement', title: 'achievement', desc: 'achievement' }
  };
  return map[String(sectionType)]?.[raw] || raw;
}

function meaningful(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function setSafeAttribute(element, attribute, value) {
  if (!element || !attribute || !meaningful(value)) return;
  const text = String(value);
  if ((attribute === 'src' || attribute === 'href') && /^(javascript:|data:text\/html)/i.test(text.trim())) return;
  element.setAttribute(attribute, text);
}

function removeUndefinedTextNodes(root) {
  const walker = root.ownerDocument?.createTreeWalker
    ? root.ownerDocument.createTreeWalker(root, 4)
    : null;
  if (!walker) return;
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  for (const textNode of nodes) {
    if (textNode.nodeValue.trim() === 'undefined') textNode.remove();
  }
}

function applyVisibility(root, snapshot, context = {}) {
  for (const element of [...root.querySelectorAll('[data-v2-visible-when]')]) {
    const binding = element.getAttribute('data-v2-visible-when') || '';
    let value;
    if (binding.startsWith('section:')) {
      const [, sectionType] = binding.split(':');
      value = sectionType === 'photo' ? hasProfilePhoto(snapshot) : isCanonicalSectionVisible(snapshot, findCanonicalSection(snapshot, sectionType));
    } else {
      value = resolveNativeValue(snapshot, binding, context);
    }
    if (!meaningful(value)) element.remove();
  }
}

function resolveDomEntry(snapshot, element) {
  const holder = element?.closest?.('[data-v2-preview-entry-id][data-v2-preview-section-type]');
  if (!holder) return null;
  const section = findCanonicalSection(snapshot, holder.getAttribute('data-v2-preview-section-type'));
  if (!section) return null;
  const entryId = holder.getAttribute('data-v2-preview-entry-id');
  return (Array.isArray(section.entries) ? section.entries : []).find(entry => String(entry.id) === String(entryId)) || null;
}

function applyValues(root, snapshot, context = {}) {
  for (const element of root.querySelectorAll('[data-v2-value]')) {
    const value = resolveNativeValue(snapshot, element.getAttribute('data-v2-value'), context);
    element.textContent = value == null ? '' : String(value);
  }

  for (const element of root.querySelectorAll('[data-v2-entry-value]')) {
    const key = element.getAttribute('data-v2-entry-value');
    const value = resolveEntryValue(context.entry || resolveDomEntry(snapshot, element), key);
    element.textContent = value == null ? '' : String(value);
  }

  if (context.item) {
    for (const element of root.querySelectorAll('[data-v2-item-value]')) {
      const key = element.getAttribute('data-v2-item-value');
      const value = resolveEntryValue(context.item, key);
      element.textContent = value == null ? '' : String(value);
    }
  }

  for (const element of root.querySelectorAll('[data-v2-bind-src]')) {
    const value = resolveNativeValue(snapshot, element.getAttribute('data-v2-bind-src'), context);
    setSafeAttribute(element, 'src', value);
  }
}


function findSectionByType(snapshot, sectionType) {
  const sections = Array.isArray(snapshot?.careerData?.sections) ? snapshot.careerData.sections : [];
  return sections.find(section => String(section.type) === String(sectionType)) || null;
}

function findSectionField(section, fieldKey) {
  const fields = Array.isArray(section?.fields) ? section.fields : [];
  return fields.find(field =>
    String(field.id) === String(fieldKey) ||
    String(field.metadata?.semanticKey || '') === String(fieldKey) ||
    String(field.label || '').toLowerCase() === String(fieldKey).toLowerCase()
  ) || (String(fieldKey).toLowerCase() === 'text' ? fields.find(field => field?.visibility !== false) || null : null);
}

function applyPreviewEditTargets(root, snapshot) {
  for (const element of [...root.querySelectorAll('[data-v2-value]')]) {
    const binding = element.getAttribute('data-v2-value') || '';
    if (!binding.startsWith('identity.')) continue;
    const key = binding.slice('identity.'.length);
    element.setAttribute('data-v2-preview-edit', 'identity');
    element.setAttribute('data-v2-preview-target', JSON.stringify({ key }));
    element.setAttribute('contenteditable', 'true');
    element.setAttribute('spellcheck', 'false');
  }

  for (const element of [...root.querySelectorAll('[data-v2-value^="section:"]')]) {
    const parts = (element.getAttribute('data-v2-value') || '').split(':');
    const sectionType = parts[1];
    const fieldKey = parts.slice(2).join(':');
    const section = findSectionByType(snapshot, sectionType);
    const field = findSectionField(section, fieldKey);
    if (!section || !field) continue;
    element.setAttribute('data-v2-preview-edit', 'field');
    element.setAttribute('data-v2-preview-target', JSON.stringify({ sectionId: section.id, fieldId: field.id }));
    element.setAttribute('contenteditable', 'true');
    element.setAttribute('spellcheck', 'false');
  }

  for (const element of [...root.querySelectorAll('[data-v2-entry-value]')]) {
    const entryRoot = element.closest('[data-v2-preview-entry-id]');
    const entryId = entryRoot?.getAttribute('data-v2-preview-entry-id');
    const sectionType = entryRoot?.getAttribute('data-v2-preview-section-type');
    if (!entryId || !sectionType) continue;
    const section = findSectionByType(snapshot, sectionType);
    if (!section) continue;
    element.setAttribute('data-v2-preview-edit', 'entry');
    element.setAttribute('data-v2-preview-target', JSON.stringify({
      sectionId: section.id,
      entryId,
      key: canonicalEntryKey(element.getAttribute('data-v2-entry-value'), sectionType)
    }));
    element.setAttribute('contenteditable', 'true');
    element.setAttribute('spellcheck', 'false');
  }
}

function applyRepeats(root, snapshot) {
  for (const container of [...root.querySelectorAll('[data-v2-repeat]')]) {
    const binding = container.getAttribute('data-v2-repeat') || '';
    const parts = binding.split(':');
    const sectionType = parts[0];
    const mode = parts[1] || 'entries';
    const section = findCanonicalSection(snapshot, sectionType);
    const hiddenEntries = Array.isArray(snapshot?.configuration?.hiddenEntries) ? snapshot.configuration.hiddenEntries.map(String) : [];
    const sectionId = String(section?.id || sectionType || '');
    const visibleEntries = (Array.isArray(section?.entries) ? section.entries : [])
      .filter(entry => entry?.visibility !== false)
      .filter(entry => !hiddenEntries.includes(sectionId + ':' + String(entry.id)) && !hiddenEntries.includes(String(entry.id)));
    const entries = mode === 'values'
      ? visibleEntries
          .map(entry => {
            const values = entry.values || entry;
            const key = sectionType === 'skills' ? 'skill' : sectionType === 'languages' ? 'language' : 'value';
            return { entry, item: { ...values, value: values?.[key] ?? values?.value ?? '' } };
          })
          .filter(({item}) => item && String(item.value || '').trim())
      : getVisibleEntries(snapshot, section).map(entry => ({ entry, item: entry }));

    if (!section || !isCanonicalSectionVisible(snapshot, section)) {
      container.remove();
      continue;
    }

    const prototype = container.cloneNode(true);
    prototype.removeAttribute('data-v2-repeat');
    prototype.removeAttribute('data-v2-item');
    prototype.removeAttribute('data-v2-repeat-item');

    const parent = container.parentNode;
    if (!parent) continue;
    const fragment = container.ownerDocument.createDocumentFragment();

    for (const record of entries) {
      const {entry,item}=record;
      const cloneNode = prototype.cloneNode(true);
      cloneNode.setAttribute('data-v2-preview-entry-id', String(entry.id || ''));
      cloneNode.setAttribute('data-v2-preview-section-type', String(sectionType));
      if (sectionType === 'skills' || sectionType === 'languages') {
        cloneNode.setAttribute('data-v2-skills-languages-item', sectionType);
        cloneNode.setAttribute('data-v2-skills-languages-entry-id', String(entry.id || ''));
      }
      const context = mode === 'values' ? { item, entry } : { entry };
      applyValues(cloneNode, snapshot, context);
      if (mode === 'values') {
        for (const element of cloneNode.querySelectorAll('[data-v2-item-value]')) {
          const key = element.getAttribute('data-v2-item-value') || '';
          const direct = item?.[key];
          const canonical = item?.value;
          const value = direct ?? canonical;
          if (value !== undefined && value !== null) element.textContent = String(value);
        }
      }
      applyVisibility(cloneNode, snapshot, context);
      fragment.appendChild(cloneNode);
    }
    parent.replaceChild(fragment, container);
  }
}

function applyItemValueFallbacks(root, snapshot) {
  const sectionByType = new Map(
    (Array.isArray(snapshot?.careerData?.sections) ? snapshot.careerData.sections : [])
      .map(section => [String(section.type), section])
  );
  const keyToSection = { skill: 'skills', language: 'languages' };
  for (const element of root.querySelectorAll('[data-v2-item-value]')) {
    if (String(element.textContent || '').trim()) continue;
    const key = String(element.getAttribute('data-v2-item-value') || '');
    const section = sectionByType.get(keyToSection[key]);
    if (!section) continue;
    const field = (Array.isArray(section.fields) ? section.fields : [])
      .find(item => item?.visibility !== false && item?.value != null && String(item.value).trim());
    if (field) element.textContent = String(field.value);
  }
}


const PROFICIENCY_LABELS_FALLBACK = Object.freeze({
  skills: Object.freeze(['','Beginner','Intermediate','Proficient','Advanced','Expert']),
  languages: Object.freeze(['','Basic','Conversational','Proficient','Fluent','Native / Bilingual'])
});

const T01_SKILLS_RATING_COMPATIBILITY = Object.freeze({
  tags: Object.freeze(['off']),
  compact: Object.freeze(['off','text','stars']),
  bullets: Object.freeze(['off','text','stars','bars','dots'])
});

function resolveAllowedProficiency(templateId,type,listStyle,contract){
  return getAllowedProficiencyForListStyle(contract[type],listStyle);
}

function renderProficiencyNode(root, type, entry, style) {
  const value = getSkillOrLanguageProficiency(entry);
  if (!value || style === 'off') return null;
  const label = (PROFICIENCY_LABELS[type] || PROFICIENCY_LABELS_FALLBACK[type] || [])[value] || '';
  const holder = root.ownerDocument.createElement('span');
  holder.className = 'v2-proficiency';
  holder.setAttribute('data-v2-proficiency-style', style);
  holder.setAttribute('data-v2-proficiency-level', String(value));
  holder.setAttribute('aria-label', label + ', ' + value + ' out of 5');
  holder.setAttribute('title', label + ' — ' + value + ' / 5');
  if (style === 'text') {
    const text = root.ownerDocument.createElement('span');
    text.className = 'v2-proficiency-label';
    text.textContent = label;
    holder.appendChild(text);
  } else if (style === 'bars' && root.getAttribute('data-v2-template-id') === 't04-modern-blue-corporate_modern' && type === 'languages') {
    const text = root.ownerDocument.createElement('span');
    text.className = 'lang-level-text';
    text.textContent = label;
    holder.appendChild(text);
    const bg = root.ownerDocument.createElement('span');
    bg.className = 'lang-bar-bg';
    const fill = root.ownerDocument.createElement('span');
    fill.className = 'lang-bar-fill';
    fill.style.width = String(value * 20) + '%';
    fill.setAttribute('aria-hidden','true');
    bg.appendChild(fill);
    holder.appendChild(bg);
  } else {
    const visual = root.ownerDocument.createElement('span');
    visual.className = 'v2-proficiency-visual';
    for (let i=1;i<=5;i++) {
      const item = root.ownerDocument.createElement('i');
      item.setAttribute('aria-hidden','true');
      if (style === 'stars') {
        item.className = 'v2-proficiency-star v2-proficiency-visual-item' + (i<=value?' is-on':'');
        item.textContent = i<=value ? '★' : '☆';
      } else if (style === 'dots') {
        item.className = 'v2-proficiency-dot v2-proficiency-visual-item' + (i<=value?' is-on':'');
      } else if (style === 'bars') {
        item.className = 'v2-proficiency-bar v2-proficiency-visual-item' + (i<=value?' is-on':'');
      }
      visual.appendChild(item);
    }
    holder.appendChild(visual);
    // Visual proficiency intentionally has no visible numeric score such as 5/5.
  }
  return holder;
}

function parseRgbColor(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw || raw === 'transparent') return null;
  const hex = raw.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    const h = hex[1];
    const expanded = h.length <= 4 ? h.split('').map(ch => ch + ch).join('') : h;
    const hasAlpha = expanded.length === 8;
    const alpha = hasAlpha ? parseInt(expanded.slice(6,8),16) / 255 : 1;
    if (alpha <= 0) return null;
    return {
      r: parseInt(expanded.slice(0,2),16),
      g: parseInt(expanded.slice(2,4),16),
      b: parseInt(expanded.slice(4,6),16),
      a: alpha
    };
  }
  const match = raw.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/);
  if (!match) return null;
  const alpha = match[4] == null ? 1 : Number(match[4]);
  if (!Number.isFinite(alpha) || alpha <= 0) return null;
  return { r:Number(match[1]), g:Number(match[2]), b:Number(match[3]), a:alpha };
}

function relativeLuminance(color) {
  if (!color) return 1;
  const channel = value => {
    const s = Math.max(0, Math.min(255, Number(value) || 0)) / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

function contrastRatio(a,b) {
  if (!a || !b) return 1;
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1,l2)+0.05) / (Math.min(l1,l2)+0.05);
}

function mixColors(a,b,amount) {
  if (!a) return b;
  if (!b) return a;
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  return {
    r:Math.round(a.r + (b.r-a.r)*t),
    g:Math.round(a.g + (b.g-a.g)*t),
    b:Math.round(a.b + (b.b-a.b)*t),
    a:1
  };
}

function rgbString(color) {
  return color ? 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')' : '';
}

function findEffectiveBackground(element) {
  const view = element?.ownerDocument?.defaultView;
  if (!view?.getComputedStyle) return null;
  let current = element?.parentElement || null;
  while (current && current.nodeType === 1) {
    const style = view.getComputedStyle(current);
    const background = parseRgbColor(style.backgroundColor);
    if (background) return background;
    current = current.parentElement;
  }
  return null;
}

function getThemeColor(root) {
  const view = root?.ownerDocument?.defaultView;
  if (!view?.getComputedStyle) return null;

  // Prefer the actual rendered accent used by the template. Some native
  // templates expose legacy/default CSS variables that can remain blue while
  // the visible section ribbons are using the user's selected accent.
  const accentSelectors = [
    '.section-label',
    '.sidebar-label',
    '.photo-ribbon',
    '.section-title',
    '.section-heading'
  ];

  for (const selector of accentSelectors) {
    const candidates = [...root.querySelectorAll(selector)];
    for (const candidate of candidates) {
      const background = parseRgbColor(view.getComputedStyle(candidate).backgroundColor);
      if (!background) continue;
      const luminance = relativeLuminance(background);
      if (luminance < 0.92 && (contrastRatio(background, {r:255,g:255,b:255,a:1}) >= 2.2
        || contrastRatio(background, {r:31,g:41,b:55,a:1}) >= 2.2)) {
        return background;
      }
    }
  }

  const style = view.getComputedStyle(root);
  return parseRgbColor(style.getPropertyValue('--theme-color'))
    || parseRgbColor(style.getPropertyValue('--primary'))
    || parseRgbColor(style.color);
}

function applySkillsLanguagesColorSystem(element, root) {
  if (!element?.style) return;
  const surface = findEffectiveBackground(element) || {r:255,g:255,b:255,a:1};
  const theme = getThemeColor(root || element) || {r:37,g:99,b:235,a:1};
  const white = {r:255,g:255,b:255,a:1};
  const dark = {r:31,g:41,b:55,a:1};
  const surfaceLuminance = relativeLuminance(surface);

  let pillBackground;
  let pillText;
  let mode;

  const themeWhiteContrast = contrastRatio(theme, white);
  const themeDarkContrast = contrastRatio(theme, dark);
  const themeSurfaceContrast = contrastRatio(theme, surface);

  if (surfaceLuminance < 0.25) {
    // Dark surface: a light pill is safer and cleaner than stacking a dark theme
    // color on an already-dark sidebar/card.
    pillBackground = white;
    pillText = themeDarkContrast >= 4.5 ? theme : dark;
    mode = 'light-surface';
  } else if (themeSurfaceContrast >= 2.2 && themeWhiteContrast >= 4.5) {
    // Normal light/medium surface: preserve the template brand color.
    pillBackground = theme;
    pillText = white;
    mode = 'theme-fill';
  } else if (themeSurfaceContrast >= 2.2 && themeDarkContrast >= 4.5) {
    // Theme color is too light for white text, so use the same brand fill with
    // a dark readable foreground.
    pillBackground = theme;
    pillText = dark;
    mode = 'theme-fill-dark-text';
  } else {
    // Low-separation surface: use a subtle theme tint, preserving the section
    // color without creating a heavy block or poor contrast.
    pillBackground = mixColors(surface, theme, surfaceLuminance > 0.55 ? 0.16 : 0.24);
    pillText = contrastRatio(pillBackground, theme) >= 4.5 ? theme : dark;
    mode = 'soft-theme';
  }

  element.style.setProperty('--v2-skills-language-rating-color', surfaceLuminance < 0.25 ? '#FFFFFF' : rgbString(theme));
  element.style.setProperty('--v2-skills-language-pill-bg', rgbString(pillBackground));
  element.style.setProperty('--v2-skills-language-pill-text', rgbString(pillText));
  element.style.setProperty('--v2-skills-language-pill-border', rgbString(theme));
  element.setAttribute('data-v2-rating-contrast', surfaceLuminance < 0.25 ? 'light' : 'theme');
  element.setAttribute('data-v2-pill-mode', mode);

  // Apply resolved pill colors directly at item level so native selectors
  // such as ".skill-tag { color:#000 !important; }" cannot override them.
  if (element.matches?.('[data-v2-list-style="pills"]')) {
    element.style.setProperty('background-color', rgbString(pillBackground), 'important');
    element.style.setProperty('color', rgbString(pillText), 'important');
    element.style.setProperty('border-color', rgbString(theme), 'important');
    element.querySelectorAll?.('[data-v2-item-value]').forEach(valueNode => {
      valueNode.style.setProperty('color', rgbString(pillText), 'important');
    });
  }
}

function applyListStyles(root, snapshot) {
  const templateId=String(root.getAttribute('data-v2-template-id')||snapshot?.configuration?.template?.id||'');
  if (!root.querySelector('[data-v2-proficiency-normalization]')) {
    const style=root.ownerDocument.createElement('style');
    style.setAttribute('data-v2-proficiency-normalization','true');
    style.textContent=''
      + '[data-v2-template-root] [data-v2-skills-languages-item]{box-sizing:border-box!important;color:inherit!important;}'
      + '[data-v2-template-root] [data-v2-list-style="tags"]{display:inline!important;width:auto!important;margin:0 5px 0 0!important;padding:0!important;white-space:normal!important;vertical-align:baseline!important;}'
      + '[data-v2-template-root] [data-v2-list-style="tags"] [data-v2-item-value]{display:inline!important;white-space:normal!important;}'
      + '[data-v2-template-root] [data-v2-list-style="pills"]{display:inline-flex!important;align-items:center!important;width:auto!important;margin:0 6px 6px 0!important;padding:4px 9px!important;background:var(--v2-skills-language-pill-bg,var(--theme-color,currentColor))!important;color:var(--v2-skills-language-pill-text,var(--primary-contrast,#FFFFFF))!important;border:1px solid var(--v2-skills-language-pill-border,var(--theme-color,currentColor))!important;border-radius:999px!important;white-space:nowrap!important;vertical-align:top!important;font-weight:600!important;line-height:1.15!important;box-sizing:border-box!important;}'
      + '[data-v2-template-root] [data-v2-list-style="compact"]{display:inline-flex!important;align-items:center!important;gap:4px!important;width:auto!important;margin:0 6px 3px 0!important;white-space:nowrap!important;}'
      + '[data-v2-template-root] [data-v2-list-style="inline"]{display:inline!important;width:auto!important;margin:0 5px 0 0!important;white-space:normal!important;}'
      + '[data-v2-template-root] .v2-list-separator{display:inline!important;margin:0 4px!important;opacity:.7!important;white-space:pre!important;}'
      + '[data-v2-template-root] [data-v2-list-style="inline"]{vertical-align:baseline!important;}'
      + '[data-v2-template-root] [data-v2-list-style="bullets"]{display:block!important;width:auto!important;box-sizing:border-box!important;margin:0 0 5px 0!important;padding:0 0 0 13px!important;position:relative!important;list-style:none!important;white-space:normal!important;flex:0 0 100%!important;}'
      + '[data-v2-template-root] [data-v2-list-style="bullets"]::before{content:"•"!important;position:absolute!important;left:0!important;top:0!important;font-size:1em!important;line-height:1.35!important;}'
      + '[data-v2-template-root] [data-v2-list-style="stacked"]{display:block!important;width:100%!important;margin:0 0 5px 0!important;white-space:normal!important;}'
      + '[data-v2-template-root] .v2-proficiency{color:var(--v2-skills-language-rating-color,currentColor)!important;}'
      + '[data-v2-template-root] .v2-proficiency[data-v2-proficiency-style="text"]{display:inline-flex!important;align-items:center!important;margin-left:11px!important;padding-left:11px!important;border-left:1px solid currentColor!important;opacity:.84!important;white-space:nowrap!important;}'
      + '[data-v2-template-root] .v2-proficiency[data-v2-proficiency-style="text"] .v2-proficiency-label{font-size:.8em!important;font-weight:700!important;letter-spacing:.01em!important;white-space:nowrap!important;}'
      + '[data-v2-template-root] .v2-proficiency-visual{display:inline-flex!important;align-items:center!important;gap:4px!important;height:18px!important;vertical-align:middle!important;line-height:1!important;}'
      + '[data-v2-template-root] .v2-proficiency-visual-item{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:14px!important;height:14px!important;min-width:14px!important;max-width:14px!important;box-sizing:border-box!important;flex:0 0 14px!important;margin:0!important;padding:0!important;line-height:14px!important;vertical-align:middle!important;}'
      + '[data-v2-template-root] .v2-proficiency-star{font-size:16px!important;font-family:Arial,sans-serif!important;font-weight:700!important;line-height:14px!important;}'
      + '[data-v2-template-root] .v2-proficiency-bar{height:9px!important;border:1.5px solid currentColor!important;border-radius:2px!important;}'
      + '[data-v2-template-root] .v2-proficiency-bar.is-on{background:currentColor!important;}'
      + '[data-v2-template-root] .v2-proficiency-dot{width:13px!important;height:13px!important;min-width:13px!important;max-width:13px!important;flex-basis:13px!important;border:1.5px solid currentColor!important;border-radius:50%!important;}'
      + '[data-v2-template-root] .v2-proficiency-dot.is-on{background:currentColor!important;}';
    root.prepend(style);
  }

  const contract=getSkillsLanguagesPresentationContract(templateId);
  const presentation=snapshot?.configuration?.presentation||{};

  for (const type of ['skills','languages']) {
    const selected=String(presentation?.listStyles?.[type]||contract[type].default);
    const allowed=resolveAllowedProficiency(templateId,type,selected,contract);
    const configured=String(presentation?.ratings?.[type]?.style||contract[type].proficiencyDefault);
    const proficiencyStyle=allowed.includes(configured)
      ? configured
      : (allowed.includes(contract[type].proficiencyDefault)?contract[type].proficiencyDefault:'off');
    const section=findCanonicalSection(snapshot,type);
    const visibleEntries=(section?.entries||[]).filter(entry=>entry?.visibility!==false);
    const entries=new Map(visibleEntries.map(entry=>[String(entry.id),entry]));
    const count=visibleEntries.length;

    root.querySelectorAll('[data-v2-skills-languages-item="'+type+'"]').forEach(element=>{
      element.setAttribute('data-v2-list-style',selected);
      const entryId=String(element.getAttribute('data-v2-skills-languages-entry-id')||'');
      const entry=entries.get(entryId);
      if(!entry) return;

      const index=visibleEntries.findIndex(item=>String(item.id)===entryId);
      element.setAttribute('data-v2-list-index',String(Math.max(0,index)));
      element.setAttribute('data-v2-list-count',String(count));
      element.setAttribute('data-v2-list-last',String(index === count - 1));

      element.setAttribute('data-v2-proficiency-style',proficiencyStyle);
      element.setAttribute('data-v2-proficiency-level',String(getSkillOrLanguageProficiency(entry)));
      element.querySelectorAll('.v2-proficiency').forEach(node=>node.remove());

      if (selected === 'tags' || selected === 'inline') {
        element.querySelectorAll('.v2-list-separator').forEach(node => node.remove());
        if (selected === 'tags' && index < count - 1) {
          const valueNode = element.querySelector('[data-v2-item-value]');
          if (valueNode) {
            const separator = root.ownerDocument.createElement('span');
            separator.className = 'v2-list-separator';
            separator.setAttribute('aria-hidden','true');
            separator.textContent = ',';
            valueNode.appendChild(separator);
          }
        } else if (selected === 'inline' && index < count - 1) {
          const valueNode = element.querySelector('[data-v2-item-value]');
          if (valueNode) {
            const separator = root.ownerDocument.createElement('span');
            separator.className = 'v2-list-separator';
            separator.setAttribute('aria-hidden','true');
            separator.textContent = ' · ';
            valueNode.appendChild(separator);
          }
        }
      }
      const node=renderProficiencyNode(root,type,entry,proficiencyStyle);
      if(node) {
        const valueNode=element.querySelector('[data-v2-item-value]');
        (valueNode?.parentElement||element).appendChild(node);
        applySkillsLanguagesColorSystem(node, root);
      }
      applySkillsLanguagesColorSystem(element, root);
    });
  }
}

function applyTheme(root, snapshot) {
  const themes = {
    navy:{primary:'#30364F',dark:'#151927',light:'#D7DAE3',contrast:'#FFFFFF'},
    blue:{primary:'#2563EB',dark:'#173B8F',light:'#DBE7FF',contrast:'#FFFFFF'},
    teal:{primary:'#0F766E',dark:'#0B4F4A',light:'#D7F0ED',contrast:'#FFFFFF'},
    green:{primary:'#166534',dark:'#0B3D1F',light:'#DCEFE2',contrast:'#FFFFFF'},
    burgundy:{primary:'#8B1E3F',dark:'#4D1025',light:'#F0DCE4',contrast:'#FFFFFF'},
    charcoal:{primary:'#374151',dark:'#1F2937',light:'#E5E7EB',contrast:'#FFFFFF'},
    purple:{primary:'#6D28D9',dark:'#3B167D',light:'#E9DEFF',contrast:'#FFFFFF'},
    orange:{primary:'#C2410C',dark:'#7C2D12',light:'#FCE2D4',contrast:'#FFFFFF'}
  };
  const theme=themes[String(snapshot?.configuration?.presentation?.themeColor||'navy')]||themes.navy;
  root.style.setProperty('--primary',theme.primary);
  root.style.setProperty('--primary-dark',theme.dark);
  root.style.setProperty('--theme-color',theme.primary);
  root.style.setProperty('--dark-bg',theme.light);
  root.style.setProperty('--primary-light',theme.light);
  root.style.setProperty('--primary-contrast',theme.contrast);
}

function applySectionOrder(root, snapshot) {
  const configured = Array.isArray(snapshot?.configuration?.sectionOrder) ? snapshot.configuration.sectionOrder.map(String) : [];
  if (!configured.length) return;
  const rank = new Map(configured.map((id,index)=>[id,index]));
  const headings = [...root.querySelectorAll('[data-v2-section]')];
  const groups = [];
  const seen = new Set();
  for (const heading of headings) {
    const type=String(heading.getAttribute('data-v2-section')||'');
    if(!type || seen.has(type)) continue;
    seen.add(type);
    const section=findCanonicalSection(snapshot,type);
    const parent=heading.parentElement;
    if(!parent) continue;
    const group=[heading];
    let next=heading.nextElementSibling;
    while(next && !next.hasAttribute('data-v2-section')) {
      const following=next.nextElementSibling;
      group.push(next);
      next=following;
    }
    groups.push({sectionId:String(section?.id||type),parent,group});
  }
  const byParent=new Map();
  for(const group of groups){
    if(!byParent.has(group.parent))byParent.set(group.parent,[]);
    byParent.get(group.parent).push(group);
  }
  for(const [parent,parentGroups] of byParent){
    parentGroups.sort((a,b)=>{
      const ar=rank.has(a.sectionId)?rank.get(a.sectionId):Number.MAX_SAFE_INTEGER;
      const br=rank.has(b.sectionId)?rank.get(b.sectionId):Number.MAX_SAFE_INTEGER;
      return ar-br;
    });
    for(const item of parentGroups)for(const node of item.group)parent.appendChild(node);
  }
}

function applyCustomSections(root, snapshot) {
  const sections=Array.isArray(snapshot?.careerData?.sections)?snapshot.careerData.sections:[];
  const hidden=new Set(Array.isArray(snapshot?.configuration?.hiddenSections)?snapshot.configuration.hiddenSections.map(String):[]);
  const placements=snapshot?.configuration?.presentation?.sectionPlacement||{};
  const configuredOrder=Array.isArray(snapshot?.configuration?.sectionOrder)?snapshot.configuration.sectionOrder.map(String):[];
  const rank=new Map(configuredOrder.map((id,index)=>[id,index]));
  const main=root.querySelector('.cv-main, main, [data-v2-column="left"]');
  const sidebar=root.querySelector('.cv-sidebar, aside, [data-v2-column="right"]');
  const fallback=main||sidebar||root;
  const staticGroupStart=(parent,targetRank)=>{
    const headings=[...parent.children].filter(el=>el.hasAttribute?.('data-v2-section'));
    for(const heading of headings){
      const type=String(heading.getAttribute('data-v2-section')||'');
      const section=findCanonicalSection(snapshot,type);
      const sectionId=String(section?.id||type);
      const sectionRank=rank.has(sectionId)?rank.get(sectionId):Number.MAX_SAFE_INTEGER;
      if(sectionRank>targetRank)return heading;
    }
    return null;
  };
  sections.filter(section=>String(section?.type||'')==='custom')
    .filter(section=>{
      const sid=String(section.id||'');
      return sid&&section.visibility!==false&&!hidden.has(sid);
    })
    .sort((a,b)=>{
      const ar=rank.has(String(a.id))?rank.get(String(a.id)):Number.MAX_SAFE_INTEGER;
      const br=rank.has(String(b.id))?rank.get(String(b.id)):Number.MAX_SAFE_INTEGER;
      return ar-br;
    })
    .forEach(section=>{
      const sid=String(section.id||'');
      const target=String(placements[sid]||'left')==='right'?(sidebar||fallback):(main||fallback);
      if(!target)return;
      const wrapper=root.ownerDocument.createElement('section'); wrapper.className='v2-custom-preview-section'; wrapper.setAttribute('data-v2-custom-section-id',sid);
      const heading=root.ownerDocument.createElement('div'); heading.className='v2-custom-preview-heading'; heading.textContent=String(section.title||'New Section'); wrapper.appendChild(heading);
      for(const field of Array.isArray(section.fields)?section.fields:[]){
        if(field?.visibility===false)continue;
        const value=field?.value==null?'':String(field.value);
        if(!value.trim())continue;
        const row=root.ownerDocument.createElement('div'); row.className='v2-custom-preview-field';
        const label=root.ownerDocument.createElement('b'); label.textContent=String(field.label||'Field')+' :';
        const content=root.ownerDocument.createElement('span'); content.textContent=value;
        row.append(label,content); wrapper.appendChild(row);
      }
      const targetRank=rank.has(sid)?rank.get(sid):Number.MAX_SAFE_INTEGER;
      const before=staticGroupStart(target,targetRank);
      if(before)target.insertBefore(wrapper,before); else target.appendChild(wrapper);
    });
  const style=root.ownerDocument.createElement('style');
  style.textContent=`
    [data-v2-template-root] .v2-custom-preview-section{display:block!important;margin:12px 0 14px!important;color:inherit!important}
    [data-v2-template-root] .v2-custom-preview-heading{font-size:10.5pt!important;font-weight:750!important;text-transform:uppercase!important;letter-spacing:.7px!important;color:inherit!important;border-bottom:1px solid currentColor!important;padding-bottom:5px!important;margin:0 0 8px!important;opacity:.9}
    [data-v2-template-root] .v2-custom-preview-field{display:flex!important;gap:8px!important;align-items:flex-start!important;margin:0 0 6px!important;font-size:9pt!important;line-height:1.4!important;word-break:break-word!important}
    [data-v2-template-root] .v2-custom-preview-field b{font-weight:700!important;flex:0 0 auto!important}
    [data-v2-template-root] .v2-custom-preview-field span{min-width:0!important}
  `;
  root.prepend(style);
}
function identityLabel(key){
  const labels={dateOfBirth:'Date of Birth',cnic:'CNIC',religion:'Religion',nationality:'Nationality',gender:'Gender',maritalStatus:'Marital Status',website:'Website',linkedin:'LinkedIn',whatsapp:'WhatsApp',location:'Location'};
  return labels[String(key)]||String(key).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase());
}
function applyIdentityExtras(root,snapshot){
  const identity=isObject(snapshot?.careerData?.identity)?snapshot.careerData.identity:{};
  const hidden=new Set(Array.isArray(snapshot?.configuration?.hiddenIdentityFields)?snapshot.configuration.hiddenIdentityFields.map(String):[]);
  const configured=new Set(Array.isArray(snapshot?.configuration?.identityFields)?snapshot.configuration.identityFields.map(String):[]);
  const bound=new Set();
  root.querySelectorAll('[data-v2-value^="identity."]').forEach(el=>{
    const binding=String(el.getAttribute('data-v2-value')||'');
    bound.add(binding.slice('identity.'.length));
  });
  const excluded=new Set(['fullName','jobTitle','email','phone']);
  const keys=[...new Set([...configured,...Object.keys(identity)])].filter(key=>!excluded.has(String(key)));
  const labelForKey=key=>{
    const labels={location:'Location',dateOfBirth:'Date of Birth',cnic:'CNIC',religion:'Religion',nationality:'Nationality',gender:'Gender',maritalStatus:'Marital Status',website:'Website',linkedin:'LinkedIn',whatsapp:'WhatsApp'};
    return labels[String(key)]||String(key).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase());
  };
  const makeRow=key=>{
    const row=root.ownerDocument.createElement('div'); row.className='contact-row v2-identity-extra-row'; row.setAttribute('data-v2-identity-extra',key);
    const label=root.ownerDocument.createElement('b'); label.textContent=labelForKey(key)+' :';
    const value=root.ownerDocument.createElement('span'); value.setAttribute('data-v2-value','identity.'+key);
    row.append(label,value); return row;
  };
  const personalLabel=[...root.querySelectorAll('.sidebar-label,.section-label,.sidebar-title,.contact-title')]
    .find(el=>/personal\s+information|personal\s+info/i.test(String(el.textContent||'')));
  const missing=keys.filter(key=>!bound.has(key)&&!hidden.has(key)&&meaningful(identity[key]));
  if(personalLabel){
    const parent=personalLabel.parentElement;
    if(parent&&missing.length){
      const fragment=root.ownerDocument.createDocumentFragment();
      missing.forEach(key=>fragment.appendChild(makeRow(key)));
      const next=[...parent.children].find(el=>el!==personalLabel&&el.hasAttribute?.('data-v2-section'));
      if(next) parent.insertBefore(fragment,next); else parent.appendChild(fragment);
    }
    return;
  }
  if(!missing.length)return;
  const sidebar=root.querySelector('.cv-sidebar, aside, [data-v2-column="right"]');
  const main=root.querySelector('.cv-main, main, [data-v2-column="left"]');
  const target=sidebar||main||root;
  const wrapper=root.ownerDocument.createElement('section'); wrapper.className='v2-identity-extra-section';
  const heading=root.ownerDocument.createElement('div'); heading.className='v2-identity-extra-heading'; heading.textContent='Personal Information';
  wrapper.appendChild(heading); missing.forEach(key=>wrapper.appendChild(makeRow(key)));
  const firstSection=[...target.children].find(el=>el.hasAttribute?.('data-v2-section'));
  if(firstSection) target.insertBefore(wrapper,firstSection);
  else if(target===main){
    const header=[...target.children].find(el=>el.tagName==='HEADER');
    if(header&&header.nextSibling) target.insertBefore(wrapper,header.nextSibling); else target.appendChild(wrapper);
  } else target.appendChild(wrapper);
  const style=root.ownerDocument.createElement('style');
  style.textContent=`
    [data-v2-template-root] .v2-identity-extra-section{display:block!important;margin:10px 0 14px!important;color:inherit!important}
    [data-v2-template-root] .v2-identity-extra-heading{font-size:10.5pt!important;font-weight:750!important;text-transform:uppercase!important;letter-spacing:.7px!important;color:inherit!important;border-bottom:1px solid currentColor!important;padding-bottom:5px!important;margin:0 0 8px!important;opacity:.9}
    [data-v2-template-root] .v2-identity-extra-row{display:flex!important;gap:8px!important;align-items:flex-start!important;margin:0 0 6px!important;font-size:9pt!important;line-height:1.35!important;word-break:break-word!important}
    [data-v2-template-root] .v2-identity-extra-row b,
    [data-v2-template-root] .v2-identity-extra-row span{font-weight:inherit!important;min-width:0!important}
  `;
  root.prepend(style);
}
function applyIdentityVisibility(root, snapshot) {
  const hidden = new Set(Array.isArray(snapshot?.configuration?.hiddenIdentityFields)
    ? snapshot.configuration.hiddenIdentityFields.map(String) : []);
  for (const element of [...root.querySelectorAll('[data-v2-visible-when]')]) {
    const binding = element.getAttribute('data-v2-visible-when') || '';
    if (!binding.startsWith('identity.')) continue;
    const key = binding.slice('identity.'.length);
    if (hidden.has(key)) element.remove();
  }
}

function applySectionVisibility(root, snapshot) {
  for (const element of [...root.querySelectorAll('[data-v2-section][data-v2-visible-when]')]) {
    const binding = element.getAttribute('data-v2-visible-when') || '';
    if (binding.startsWith('section:')) {
      const [, type] = binding.split(':');
      if (type === 'photo' ? !hasProfilePhoto(snapshot) : !isCanonicalSectionVisible(snapshot, findCanonicalSection(snapshot, type))) element.remove();
    }
  }
}

export function createNativeRenderDefinition(input = {}) {
  if (!input.id) throw new Error('Native template id is required.');
  if (!input.sourceHtml) throw new Error('Native template sourceHtml is required.');
  return Object.freeze({
    version: NATIVE_TEMPLATE_RENDERER_VERSION,
    id: String(input.id),
    templateVersion: String(input.templateVersion || '2.0.0'),
    sourceHtml: String(input.sourceHtml),
    metadata: isObject(input.metadata) ? clone(input.metadata) : {}
  });
}

export function renderNativeTemplateSource(definition, snapshot, documentRef) {
  if (!definition?.sourceHtml) throw new Error('Native template source is required.');
  if (!documentRef || typeof documentRef.createElement !== 'function') {
    throw new Error('A browser document reference is required.');
  }

  const host = documentRef.createElement('div');
  host.innerHTML = definition.sourceHtml;
  const root = host.querySelector('[data-v2-template-root]') || host.querySelector('[data-v2-template-id]') || host.firstElementChild || host;
  // Native templates may ship their presentation CSS in an inline <style> block.
  // Keep that style with the rendered preview instead of dropping it when selecting the root element.
  const templateStyles = [...host.querySelectorAll('style')];
  templateStyles.forEach(style => root.prepend(style.cloneNode(true)));

  applyTheme(root, snapshot);
  applyIdentityVisibility(root, snapshot);
  applySectionVisibility(root, snapshot);
  applyRepeats(root, snapshot);
  applyListStyles(root, snapshot);
  applySectionOrder(root, snapshot);
  applyCustomSections(root, snapshot);
  applyIdentityExtras(root, snapshot);
  applyItemValueFallbacks(root, snapshot);
  applyVisibility(root, snapshot);
  applyValues(root, snapshot);
  applyPreviewEditTargets(root, snapshot);
  removeUndefinedTextNodes(root);

  return {
    version: NATIVE_TEMPLATE_RENDERER_VERSION,
    state: 'ready',
    templateId: definition.id,
    templateVersion: definition.templateVersion,
    root,
    html: root.outerHTML,
    diagnostics: []
  };
}
