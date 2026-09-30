export const TEMPLATE_ENGINE_VERSION = '1.0.0';

export const TEMPLATE_STATUS = Object.freeze({
  DRAFT: 'draft',
  TESTING: 'testing',
  PUBLISHED: 'published',
  DEPRECATED: 'deprecated',
  RETIRED: 'retired'
});

export const CAPABILITY = Object.freeze({
  SUPPORTED: 'supported',
  CONSTRAINED: 'supported_with_constraints',
  ADAPTABLE: 'adaptable',
  PRESERVED: 'unsupported_but_preserved',
  UNKNOWN: 'unknown',
  RETIRED: 'retired'
});

export const V1_TEMPLATE_COMPATIBILITY_STATE = Object.freeze({
  ASSET_RECONCILIATION: 'asset-reconciliation'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const list = value => Array.isArray(value) ? [...new Set(value.map(String))] : [];

function normalizeCapability(value) {
  return Object.values(CAPABILITY).includes(value) ? value : CAPABILITY.UNKNOWN;
}

function normalizeCapabilities(input = {}) {
  const source = isObject(input) ? input : {};
  const result = {};
  for (const [key, value] of Object.entries(source)) {
    result[String(key)] = normalizeCapability(value);
  }
  return result;
}

function normalizeOutput(input = {}) {
  const source = isObject(input) ? input : {};
  return {
    web: source.web === true,
    pdf: source.pdf === true,
    print: source.print === true,
    docx: source.docx === true,
    blankDocx: source.blankDocx === true,
    onlineCV: source.onlineCV === true,
    samplePdf: source.samplePdf === true
  };
}

function normalizeMetadata(input = {}) {
  const source = isObject(input) ? input : {};
  return {
    id: String(source.id || ''),
    name: String(source.name || ''),
    version: String(source.version || '1.0.0'),
    status: Object.values(TEMPLATE_STATUS).includes(source.status) ? source.status : TEMPLATE_STATUS.DRAFT,
    sourceLineage: source.sourceLineage ? String(source.sourceLineage) : null,
    careerLevel: list(source.careerLevel),
    industry: list(source.industry),
    style: list(source.style),
    supportedSections: list(source.supportedSections),
    supportedFields: list(source.supportedFields),
    supportedFieldTypes: list(source.supportedFieldTypes),
    supportedVariants: list(source.supportedVariants),
    capabilities: normalizeCapabilities(source.capabilities),
    outputs: normalizeOutput(source.outputs),
    pageModel: isObject(source.pageModel) ? clone(source.pageModel) : {},
    theme: isObject(source.theme) ? clone(source.theme) : {},
    photo: isObject(source.photo) ? clone(source.photo) : {},
    ats: isObject(source.ats) ? clone(source.ats) : {},
    accessibility: isObject(source.accessibility) ? clone(source.accessibility) : {},
    responsive: isObject(source.responsive) ? clone(source.responsive) : {},
    commercial: isObject(source.commercial) ? clone(source.commercial) : {},
    discovery: isObject(source.discovery) ? clone(source.discovery) : {},
    demo: isObject(source.demo) ? clone(source.demo) : {},
    assets: isObject(source.assets) ? clone(source.assets) : {},
    compatibility: isObject(source.compatibility) ? clone(source.compatibility) : {},
    metadata: isObject(source.metadata) ? clone(source.metadata) : {}
  };
}

export function createTemplateDefinition(input = {}) {
  const template = normalizeMetadata(input);
  if (!template.id) throw new Error('Template id is required.');
  if (!template.name) throw new Error('Template name is required.');
  return Object.freeze(template);
}

export function createTemplateRegistry(initialTemplates = []) {
  const templates = new Map();
  const registry = {
    version: TEMPLATE_ENGINE_VERSION,
    register(template) {
      const normalized = createTemplateDefinition(template);
      if (templates.has(normalized.id)) throw new Error('Template already registered: ' + normalized.id);
      templates.set(normalized.id, normalized);
      return normalized;
    },
    replace(template) {
      const normalized = createTemplateDefinition(template);
      if (!templates.has(normalized.id)) throw new Error('Template not registered: ' + normalized.id);
      templates.set(normalized.id, normalized);
      return normalized;
    },
    get(id) { return templates.get(String(id)) || null; },
    list(options = {}) {
      const status = options.status;
      return [...templates.values()].filter(t => !status || t.status === status).map(clone);
    },
    has(id) { return templates.has(String(id)); },
    size() { return templates.size; }
  };
  for (const template of initialTemplates) registry.register(template);
  return registry;
}

export function resolveCapability(template, contentKey) {
  if (!template) return CAPABILITY.UNKNOWN;
  return normalizeCapability(template.capabilities[String(contentKey)]);
}

export function evaluateTemplateCompatibility(template, requestedContent = {}) {
  const results = {};
  for (const [key, required] of Object.entries(isObject(requestedContent) ? requestedContent : {})) {
    if (!required) continue;
    results[key] = resolveCapability(template, key);
  }
  const values = Object.values(results);
  const blocking = values.some(value => value === CAPABILITY.UNKNOWN || value === CAPABILITY.PRESERVED || value === CAPABILITY.RETIRED);
  const constrained = values.some(value => value === CAPABILITY.CONSTRAINED || value === CAPABILITY.ADAPTABLE);
  return {
    templateId: template ? template.id : null,
    results,
    compatible: !blocking,
    requiresReview: blocking || constrained
  };
}

export function explainCompatibility(template, requestedContent = {}) {
  const evaluation = evaluateTemplateCompatibility(template, requestedContent);
  return Object.entries(evaluation.results).map(([content, capability]) => ({
    content,
    capability,
    action: capability === CAPABILITY.SUPPORTED ? 'render' :
      capability === CAPABILITY.CONSTRAINED ? 'render_with_constraints' :
      capability === CAPABILITY.ADAPTABLE ? 'adapt_or_use_approved_variant' :
      capability === CAPABILITY.PRESERVED ? 'preserve_source_and_notify' :
      capability === CAPABILITY.RETIRED ? 'do_not_select' :
      'establish_compatibility_before_use'
  }));
}

export function switchTemplateConfiguration(configuration = {}, templateId, compatibility = {}) {
  const current = isObject(configuration) ? clone(configuration) : {};
  current.template = {
    ...(isObject(current.template) ? current.template : {}),
    id: String(templateId),
    version: compatibility.version ? String(compatibility.version) : (current.template?.version || null),
    compatibility: clone(compatibility)
  };
  return current;
}
