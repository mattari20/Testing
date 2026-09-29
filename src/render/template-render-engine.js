export const TEMPLATE_RENDER_ENGINE_VERSION = '1.0.0';

export const RENDER_STATE = Object.freeze({
  READY: 'ready',
  EMPTY: 'empty',
  ERROR: 'error'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function readPath(source, path) {
  if (!path) return undefined;
  return String(path).split('.').reduce((value, key) => value == null ? undefined : value[key], source);
}

function setAttributeSafely(element, name, value) {
  if (name === 'textContent' || name === 'innerHTML') return;
  const stringValue = value == null ? '' : String(value);
  if (name === 'href' || name === 'src') {
    const lower = stringValue.trim().toLowerCase();
    if (lower.startsWith('javascript:') || lower.startsWith('data:text/html')) return;
  }
  element.setAttribute(name, stringValue);
}

export function createRenderDefinition(input = {}) {
  const id = String(input.id || '');
  if (!id) throw new Error('Render definition id is required.');
  if (!input.sourceHtml && !input.html) throw new Error('Render definition sourceHtml is required.');

  return Object.freeze({
    version: TEMPLATE_RENDER_ENGINE_VERSION,
    id,
    templateVersion: String(input.templateVersion || '1.0.0'),
    sourceHtml: String(input.sourceHtml || input.html),
    bindingPlan: isObject(input.bindingPlan) ? clone(input.bindingPlan) : {},
    rootSelector: String(input.rootSelector || '[data-v2-template-root]'),
    metadata: isObject(input.metadata) ? clone(input.metadata) : {}
  });
}

export function resolveBindingValue(snapshot, binding) {
  if (typeof binding === 'string') return readPath(snapshot, binding);
  if (!isObject(binding)) return undefined;
  return readPath(snapshot, binding.path);
}

export function createBindingPlan(entries = {}) {
  const plan = {};
  for (const [selector, binding] of Object.entries(isObject(entries) ? entries : {})) {
    if (typeof binding === 'string') {
      plan[String(selector)] = { path: binding, mode: 'text' };
    } else if (isObject(binding)) {
      plan[String(selector)] = {
        path: binding.path == null ? null : String(binding.path),
        mode: binding.mode === 'attribute' ? 'attribute' : 'text',
        attribute: binding.attribute == null ? null : String(binding.attribute)
      };
    }
  }
  return plan;
}

export function renderTemplateSource(definition, snapshot, documentRef) {
  if (!definition?.sourceHtml) throw new Error('Template source is required.');
  if (!documentRef || typeof documentRef.createElement !== 'function') {
    throw new Error('A browser document reference is required.');
  }

  const host = documentRef.createElement('div');
  host.innerHTML = definition.sourceHtml;

  const plan = definition.bindingPlan || {};
  const diagnostics = [];

  for (const [selector, binding] of Object.entries(plan)) {
    const elements = host.querySelectorAll(selector);
    if (!elements.length) {
      diagnostics.push({ selector, code: 'BINDING_TARGET_NOT_FOUND' });
      continue;
    }

    const value = resolveBindingValue(snapshot, binding);
    for (const element of elements) {
      if (binding.mode === 'attribute' && binding.attribute) {
        setAttributeSafely(element, binding.attribute, value);
      } else {
        element.textContent = value == null ? '' : String(value);
      }
    }
  }

  return {
    version: TEMPLATE_RENDER_ENGINE_VERSION,
    state: RENDER_STATE.READY,
    root: host,
    html: host.innerHTML,
    diagnostics,
    templateId: definition.id,
    templateVersion: definition.templateVersion
  };
}

export function measureRenderedTemplate(root, measureDocument = globalThis.document) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    throw new Error('Rendered template root is required.');
  }

  const targets = root.querySelectorAll('[data-v2-layout-block]');
  const blocks = [];

  for (const element of targets) {
    const rect = typeof element.getBoundingClientRect === 'function'
      ? element.getBoundingClientRect()
      : { height: 0, width: 0, top: 0, left: 0 };

    blocks.push({
      id: element.getAttribute('data-v2-layout-block-id') || element.id || 'block_' + blocks.length,
      measuredHeight: Math.max(0, Number(rect.height) || 0),
      measuredWidth: Math.max(0, Number(rect.width) || 0),
      top: Number(rect.top) || 0,
      left: Number(rect.left) || 0,
      kind: element.getAttribute('data-v2-layout-kind') || 'custom'
    });
  }

  return {
    version: TEMPLATE_RENDER_ENGINE_VERSION,
    measuredAt: new Date().toISOString(),
    viewport: {
      width: Number(measureDocument?.defaultView?.innerWidth) || null,
      height: Number(measureDocument?.defaultView?.innerHeight) || null
    },
    blocks
  };
}

export function buildSemanticLayoutBlocks(measurement = {}) {
  return (Array.isArray(measurement.blocks) ? measurement.blocks : []).map((block, index) => ({
    id: String(block.id || 'block_' + index),
    kind: String(block.kind || 'custom'),
    measuredHeight: Math.max(0, Number(block.measuredHeight) || 0),
    metadata: {
      measuredWidth: Math.max(0, Number(block.measuredWidth) || 0),
      top: Number(block.top) || 0,
      left: Number(block.left) || 0
    }
  }));
}

export function createRenderResult(rendered, measurement = null) {
  return {
    version: TEMPLATE_RENDER_ENGINE_VERSION,
    state: rendered?.state || RENDER_STATE.EMPTY,
    templateId: rendered?.templateId || null,
    templateVersion: rendered?.templateVersion || null,
    html: rendered?.html || '',
    diagnostics: clone(rendered?.diagnostics || []),
    measurement: measurement ? clone(measurement) : null,
    layoutBlocks: measurement ? buildSemanticLayoutBlocks(measurement) : []
  };
}
