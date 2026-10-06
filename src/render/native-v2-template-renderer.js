export const NATIVE_TEMPLATE_RENDERER_VERSION = '2.7.0';

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
    if (identity[candidate] !== undefined && identity[candidate] !== null) return identity[candidate];
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
  return new Intl.DateTimeFormat('en-US', { month:'long', year:'numeric' }).format(new Date(year, month - 1, 1));
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
  const candidates = ENTRY_ALIASES[requestedKey] || [requestedKey];
  for (const candidate of candidates) {
    if (values[candidate] !== undefined && values[candidate] !== null && String(values[candidate]).trim() !== '') {
      return values[candidate];
    }
  }
  if (requestedKey === 'dates' || requestedKey === 'duration') {
    const duration = resolveDurationValue(values);
    if (duration) return duration;
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
    const entries = mode === 'values'
      ? (() => {
          const hiddenEntries = Array.isArray(snapshot?.configuration?.hiddenEntries) ? snapshot.configuration.hiddenEntries.map(String) : [];
          const hiddenFields = Array.isArray(snapshot?.configuration?.hiddenFields) ? snapshot.configuration.hiddenFields.map(String) : [];
          const sectionId = String(section?.id || sectionType || '');
          const entryValues = (Array.isArray(section?.entries) ? section.entries : [])
            .filter(entry => entry?.visibility !== false)
            .filter(entry => !hiddenEntries.includes(sectionId + ':' + String(entry.id)) && !hiddenEntries.includes(String(entry.id)))
            .map(entry => entry.values || entry)
            .filter(Boolean);
          if (entryValues.length) return entryValues;
          const fields = Array.isArray(section?.fields) ? section.fields : [];
          return fields
            .filter(field => field?.visibility !== false)
            .filter(field => !hiddenFields.includes(sectionId + ':' + String(field.id)) && !hiddenFields.includes(String(field.id)))
            .flatMap(field => {
              const raw = field?.value;
              if (raw == null) return [];
              if (sectionType === 'skills' || sectionType === 'languages') {
                return String(raw).split(/[,\n]+/).map(value => value.trim()).filter(Boolean).map(value => ({
                  [sectionType === 'skills' ? 'skill' : 'language']: value,
                  value
                }));
              }
              return [{ value: raw }];
            });
        })()
      : getVisibleEntries(snapshot, section);

    if (!section || !isCanonicalSectionVisible(snapshot, section)) {
      container.remove();
      continue;
    }

    const prototype = container.cloneNode(true);
    const repeatAttribute = prototype.getAttribute('data-v2-repeat');
    prototype.removeAttribute('data-v2-repeat');
    prototype.removeAttribute('data-v2-item');
    const repeatItem = prototype.getAttribute('data-v2-repeat-item');
    prototype.removeAttribute('data-v2-repeat-item');

    // This native T01 form uses the repeated element itself as the prototype.
    const parent = container.parentNode;
    if (!parent) continue;
    const fragment = container.ownerDocument.createDocumentFragment();

    for (const item of entries) {
      const cloneNode = prototype.cloneNode(true);
      if (mode === 'entries') {
        cloneNode.setAttribute('data-v2-preview-entry-id', String(item.id || ''));
        cloneNode.setAttribute('data-v2-preview-section-type', String(sectionType));
      }
      const context = mode === 'values' ? { item } : { entry: item };
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


function applyListStyles(root, snapshot) {
  const styles = snapshot?.configuration?.presentation?.listStyles || {};
  const selected = {
    skills: String(styles.skills || 'tags'),
    languages: String(styles.languages || 'stacked')
  };
  const styleElement = root.ownerDocument.createElement('style');
  styleElement.textContent = `
    [data-v2-template-root] .v2-list-skills-tags{display:inline-block!important;background:var(--primary-light)!important;color:var(--primary)!important;border:1px solid var(--primary)!important;border-radius:999px!important;padding:4px 9px!important;margin:0 4px 6px 0!important;font-size:10px!important;font-weight:700!important}
    [data-v2-template-root] .v2-list-skills-inline{display:inline!important;background:none!important;border:0!important;padding:0!important;margin:0!important;color:inherit!important}
    [data-v2-template-root] .v2-list-skills-inline:not(:last-child)::after{content:', ';white-space:pre}
    [data-v2-template-root] .v2-list-skills-bullets{display:list-item!important;margin:0 0 5px 18px!important;padding:0!important}
    [data-v2-template-root] .v2-list-skills-compact{display:block!important;margin:0 0 4px!important;padding:0!important}
    [data-v2-template-root] .v2-list-languages-stacked{display:block!important;margin:0 0 10px!important}
    [data-v2-template-root] .v2-list-languages-inline{display:inline!important;margin:0!important}
    [data-v2-template-root] .v2-list-languages-inline:not(:last-child)::after{content:', ';white-space:pre}
    [data-v2-template-root] .v2-list-languages-pills{display:inline-block!important;background:var(--primary)!important;color:var(--primary-contrast)!important;border-radius:999px!important;padding:4px 9px!important;margin:0 4px 6px 0!important;font-size:10px!important;font-weight:700!important}
    [data-v2-template-root] .v2-list-languages-compact{display:block!important;margin:0 0 5px!important;padding:0!important}
  `;
  root.prepend(styleElement);
  const skillClass='v2-list-skills-'+(selected.skills==='inline'||selected.skills==='bullets'||selected.skills==='compact'?selected.skills:'tags');
  const languageClass='v2-list-languages-'+(selected.languages==='inline'||selected.languages==='pills'||selected.languages==='compact'?selected.languages:'stacked');
  root.querySelectorAll('.skill-tag').forEach(element => element.classList.add(skillClass));
  root.querySelectorAll('.lang-item').forEach(element => element.classList.add(languageClass));
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
