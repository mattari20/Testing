export const NATIVE_TEMPLATE_RENDERER_VERSION = '2.3.0';

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
  achievement: ['achievement', 'title', 'name', 'description', 'desc']
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

function hasProfilePhoto(snapshot) {
  const assets = Array.isArray(snapshot?.careerData?.assets) ? snapshot.careerData.assets : [];
  return assets.some(item => String(item?.key || item?.id || '') === 'profile-photo' && meaningfulAsset(item));
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
  return (Array.isArray(section.entries) ? section.entries : [])
    .filter(entry => entry?.visibility !== false)
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
    const field = (section.fields || []).find(item =>
      String(item.id) === String(fieldKey) ||
      String(item.metadata?.semanticKey || '') === String(fieldKey) ||
      String(item.label || '').toLowerCase() === String(fieldKey).toLowerCase()
    );
    return field?.value;
  }

  if (context.entry && path) return resolveEntryValue(context.entry, path);
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

function resolveEntryValue(entry, key) {
  const values = isObject(entry?.values) ? entry.values : (isObject(entry) ? entry : {});
  const candidates = ENTRY_ALIASES[String(key)] || [String(key)];
  for (const candidate of candidates) {
    if (values[candidate] !== undefined && values[candidate] !== null && String(values[candidate]).trim() !== '') {
      return values[candidate];
    }
  }
  return undefined;
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

function applyValues(root, snapshot, context = {}) {
  for (const element of root.querySelectorAll('[data-v2-value]')) {
    const value = resolveNativeValue(snapshot, element.getAttribute('data-v2-value'), context);
    element.textContent = value == null ? '' : String(value);
  }

  for (const element of root.querySelectorAll('[data-v2-entry-value]')) {
    const key = element.getAttribute('data-v2-entry-value');
    const value = resolveEntryValue(context.entry, key);
    element.textContent = value == null ? '' : String(value);
  }

  for (const element of root.querySelectorAll('[data-v2-item-value]')) {
    const key = element.getAttribute('data-v2-item-value');
    const value = resolveEntryValue(context.item, key);
    element.textContent = value == null ? '' : String(value);
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
      key: element.getAttribute('data-v2-entry-value')
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
          const entryValues = (Array.isArray(section?.entries) ? section.entries : [])
            .filter(entry => entry?.visibility !== false)
            .map(entry => entry.values || entry)
            .filter(Boolean);
          if (entryValues.length) return entryValues;
          const fields = Array.isArray(section?.fields) ? section.fields : [];
          return fields
            .filter(field => field?.visibility !== false)
            .flatMap(field => {
              const raw = field?.value;
              if (raw == null) return [];
              if (sectionType === 'skills' || sectionType === 'languages') {
                return String(raw).split(/[,\n]+/).map(value => value.trim()).filter(Boolean).map(value => ({ value }));
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
      applyVisibility(cloneNode, snapshot, context);
      fragment.appendChild(cloneNode);
    }

    parent.replaceChild(fragment, container);
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

  applySectionVisibility(root, snapshot);
  applyRepeats(root, snapshot);
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
