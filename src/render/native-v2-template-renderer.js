export const NATIVE_TEMPLATE_RENDERER_VERSION = '2.2.0';

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const IDENTITY_ALIASES = Object.freeze({
  fullName: ['fullName', 'name'],
  jobTitle: ['jobTitle', 'job'],
  dateOfBirth: ['dateOfBirth', 'dob']
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

  if (context.entry && path) return context.entry.values?.[path];
  if (context.item && path) return context.item[path];
  return readPath(snapshot, path);
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
      value = isCanonicalSectionVisible(snapshot, findCanonicalSection(snapshot, sectionType));
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
    const value = context.entry?.values?.[key];
    element.textContent = value == null ? '' : String(value);
  }

  for (const element of root.querySelectorAll('[data-v2-item-value]')) {
    const key = element.getAttribute('data-v2-item-value');
    const value = context.item?.[key];
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
  ) || null;
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
      ? ((Array.isArray(section?.entries) ? section.entries : [])
        .filter(entry => entry?.visibility !== false)
        .map(entry => entry.values || entry)
        .filter(Boolean))
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
      if (!isCanonicalSectionVisible(snapshot, findCanonicalSection(snapshot, type))) element.remove();
    }
  }
}


function collectTemplateBoundSectionTypes(root) {
  const types = new Set();
  for (const element of root.querySelectorAll('[data-v2-repeat]')) {
    const type = String(element.getAttribute('data-v2-repeat') || '').split(':')[0];
    if (type) types.add(type);
  }
  for (const element of root.querySelectorAll('[data-v2-value^="section:"]')) {
    const parts = String(element.getAttribute('data-v2-value') || '').split(':');
    if (parts[1]) types.add(parts[1]);
  }
  for (const element of root.querySelectorAll('[data-v2-visible-when^="section:"]')) {
    const type = String(element.getAttribute('data-v2-visible-when') || '').split(':')[1];
    if (type) types.add(type);
  }
  return types;
}

function appendGenericSectionBlocks(root, snapshot, definition, boundTypes) {
  const sections = Array.isArray(snapshot?.careerData?.sections) ? snapshot.careerData.sections : [];
  const unbound = sections.filter(section =>
    section && !boundTypes.has(String(section.type)) && isCanonicalSectionVisible(snapshot, section)
  );
  if (!unbound.length) return;

  const documentRef = root.ownerDocument;
  const host = root.querySelector('main') || root;
  const isT02 = /t02/i.test(String(definition?.id || ''));
  for (const section of unbound) {
    const block = documentRef.createElement('section');
    block.className = 'v2-dynamic-section';
    block.setAttribute('data-v2-dynamic-section', String(section.type));
    block.style.cssText = 'display:block;width:100%;margin:18px 0 0;padding:0;break-inside:avoid;page-break-inside:avoid;';
    const heading = documentRef.createElement('h2');
    heading.className = isT02 ? 'section-label' : 'section-title';
    heading.textContent = String(section.title || section.type || 'Additional Section');
    heading.style.cssText = 'margin-top:14px;margin-bottom:8px;';
    block.appendChild(heading);

    const fieldDefinitions = Array.isArray(section.metadata?.fieldDefinitions) ? section.metadata.fieldDefinitions : [];
    const fields = Array.isArray(section.fields) ? section.fields : [];
    for (const field of fields) {
      if (!field || field.visibility === false || !meaningful(field.value)) continue;
      const line = documentRef.createElement('div');
      line.className = 'v2-dynamic-section-field';
      line.style.cssText = 'margin:4px 0;white-space:pre-wrap;overflow-wrap:anywhere;';
      const label = documentRef.createElement('strong');
      label.textContent = String(field.label || field.id || '');
      const value = documentRef.createElement('span');
      value.textContent = String(field.value ?? '');
      line.append(label, documentRef.createTextNode(': '), value);
      block.appendChild(line);
    }

    const entries = getVisibleEntries(snapshot, section);
    for (const entry of entries) {
      const entryBlock = documentRef.createElement('div');
      entryBlock.className = 'v2-dynamic-section-entry';
      entryBlock.setAttribute('data-v2-preview-entry-id', String(entry.id || ''));
      entryBlock.setAttribute('data-v2-preview-section-type', String(section.type));
      entryBlock.style.cssText = 'margin:8px 0 12px;break-inside:avoid;page-break-inside:avoid;';
      const values = isObject(entry.values) ? entry.values : {};
      const definitions = new Map(fieldDefinitions.map(field => [String(field.key || field.id), field]));
      for (const [key, rawValue] of Object.entries(values)) {
        if (rawValue == null || String(rawValue).trim() === '') continue;
        const line = documentRef.createElement('div');
        line.className = 'v2-dynamic-section-value';
        line.style.cssText = 'margin:3px 0;white-space:pre-wrap;overflow-wrap:anywhere;';
        const label = documentRef.createElement('strong');
        label.textContent = String(definitions.get(key)?.label || key.replace(/[-_]/g, ' ').replace(/\b\w/g, character => character.toUpperCase()));
        const value = documentRef.createElement('span');
        value.setAttribute('data-v2-dynamic-entry-value', key);
        value.setAttribute('data-v2-preview-edit', 'entry');
        value.setAttribute('data-v2-preview-target', JSON.stringify({
          sectionId: section.id,
          entryId: entry.id,
          key
        }));
        value.setAttribute('contenteditable', 'true');
        value.setAttribute('spellcheck', 'false');
        value.textContent = String(rawValue);
        line.append(label, documentRef.createTextNode(': '), value);
        entryBlock.appendChild(line);
      }
      block.appendChild(entryBlock);
    }
    host.appendChild(block);
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

  const boundSectionTypes = collectTemplateBoundSectionTypes(root);
  applySectionVisibility(root, snapshot);
  applyRepeats(root, snapshot);
  applyVisibility(root, snapshot);
  applyValues(root, snapshot);
  appendGenericSectionBlocks(root, snapshot, definition, boundSectionTypes);
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
