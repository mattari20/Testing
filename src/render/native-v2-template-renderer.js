export const NATIVE_TEMPLATE_RENDERER_VERSION = '1.0.0';

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function readPath(source, path) {
  if (!path) return undefined;
  return String(path).split('.').reduce((value, key) => value == null ? undefined : value[key], source);
}

function visibleById(configuration, collection, id, type) {
  const hidden = Array.isArray(configuration?.[collection]) ? configuration[collection].map(String) : [];
  return !hidden.includes(String(id)) && !hidden.includes(String(type));
}

export function findCanonicalSection(snapshot, sectionType) {
  const sections = Array.isArray(snapshot?.careerData?.sections) ? snapshot.careerData.sections : [];
  return sections.find(section => String(section.type) === String(sectionType)) || null;
}

export function isCanonicalSectionVisible(snapshot, section) {
  if (!section || section.visibility === false) return false;
  return visibleById(snapshot?.configuration, 'hiddenSections', section.id, section.type);
}

export function getVisibleEntries(snapshot, section) {
  if (!section || !isCanonicalSectionVisible(snapshot, section)) return [];
  const hiddenEntries = Array.isArray(snapshot?.configuration?.hiddenEntries)
    ? snapshot.configuration.hiddenEntries.map(String)
    : [];
  return (Array.isArray(section.entries) ? section.entries : [])
    .filter(entry => entry?.visibility !== false)
    .filter(entry => !hiddenEntries.includes(String(entry.id)));
}

export function resolveNativeBinding(snapshot, binding, context = null) {
  const path = String(binding || '');
  if (!path) return undefined;

  if (context && !path.startsWith('identity.') && !path.startsWith('section:')) {
    return readPath(context.values || context, path);
  }

  if (path.startsWith('section:')) {
    const [, sectionType, fieldKey] = path.split(':');
    const section = findCanonicalSection(snapshot, sectionType);
    if (!section || !isCanonicalSectionVisible(snapshot, section)) return undefined;
    const field = (section.fields || []).find(item => String(item.id) === String(fieldKey) || String(item.metadata?.semanticKey || '') === String(fieldKey));
    if (field) return field.value;
    const firstMatch = (section.fields || []).find(item => String(item.label || '').toLowerCase() === String(fieldKey).toLowerCase());
    return firstMatch ? firstMatch.value : undefined;
  }

  return readPath(snapshot, path);
}

function setAttributeSafely(element, attribute, value) {
  if (!element || !attribute) return;
  const stringValue = value == null ? '' : String(value);
  if ((attribute === 'src' || attribute === 'href') && /^(javascript:|data:text\/html)/i.test(stringValue.trim())) return;
  element.setAttribute(attribute, stringValue);
}

function hasMeaningfulValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function applyFields(root, snapshot, context) {
  for (const element of root.querySelectorAll('[data-v2-field]')) {
    const binding = element.getAttribute('data-v2-field');
    const value = resolveNativeBinding(snapshot, binding, context);
    element.textContent = value == null ? '' : String(value);
  }
  for (const element of root.querySelectorAll('[data-v2-attr-src]')) {
    const binding = element.getAttribute('data-v2-attr-src');
    setAttributeSafely(element, 'src', resolveNativeBinding(snapshot, binding, context));
  }
  for (const element of root.querySelectorAll('[data-v2-if]')) {
    const binding = element.getAttribute('data-v2-if');
    const value = resolveNativeBinding(snapshot, binding, context);
    if (!hasMeaningfulValue(value)) element.remove();
  }
}

function applyRepeats(root, snapshot) {
  const repeats = [...root.querySelectorAll('[data-v2-repeat]')];
  for (const container of repeats) {
    if (!container.isConnected && container !== root) continue;
    const sectionType = container.getAttribute('data-v2-repeat');
    const section = findCanonicalSection(snapshot, sectionType);
    const entries = getVisibleEntries(snapshot, section);
    const prototype = container.querySelector(':scope > [data-v2-repeat-item]');
    if (!prototype) continue;
    container.innerHTML = '';
    for (const entry of entries) {
      const item = prototype.cloneNode(true);
      item.removeAttribute('data-v2-repeat-item');
      applyRepeats(item, snapshot);
      applyFields(item, snapshot, entry);
      container.appendChild(item);
    }
    if (!entries.length && container.parentElement?.hasAttribute('data-v2-section')) {
      container.parentElement.remove();
    }
  }
}

function applySectionVisibility(root, snapshot) {
  for (const sectionElement of [...root.querySelectorAll('[data-v2-section]')]) {
    const sectionType = sectionElement.getAttribute('data-v2-section');
    const section = findCanonicalSection(snapshot, sectionType);
    if (!isCanonicalSectionVisible(snapshot, section)) sectionElement.remove();
  }
}

export function createNativeRenderDefinition(input = {}) {
  if (!input.id) throw new Error('Native template id is required.');
  if (!input.sourceHtml) throw new Error('Native template sourceHtml is required.');
  return Object.freeze({
    version: NATIVE_TEMPLATE_RENDERER_VERSION,
    id: String(input.id),
    templateVersion: String(input.templateVersion || '1.0.0'),
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
  const root = host.querySelector('[data-v2-template-root]') || host.firstElementChild || host;
  applySectionVisibility(root, snapshot);
  applyRepeats(root, snapshot);
  applyFields(root, snapshot, null);
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
