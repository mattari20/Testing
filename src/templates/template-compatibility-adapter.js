import { CAPABILITY, V1_TEMPLATE_COMPATIBILITY_STATE } from './template-engine.js';

export const V1_ADAPTER_VERSION = '1.0.0';

export const V1_SOURCE_CONCEPT = Object.freeze({
  TOKEN: 'scalar-field-binding',
  OBJECT_LOOP: 'repeatable-entry-binding',
  PRIMITIVE_LOOP: 'repeatable-value-binding',
  VISIBILITY: 'document-visibility-binding',
  THEME: 'presentation-theme-binding'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const DEFAULT_BINDINGS = Object.freeze({
  full_name: 'identity.fullName',
  job_title: 'identity.jobTitle',
  email: 'identity.email',
  phone: 'identity.phone',
  whatsapp: 'identity.whatsapp',
  address: 'identity.address',
  dob: 'identity.dateOfBirth',
  cnic: 'identity.cnic',
  religion: 'identity.religion',
  linkedin: 'identity.linkedin',
  website: 'identity.website',
  summary_text: 'summary.text'
});

function normalizeBinding(binding) {
  if (!isObject(binding)) return { source: null, target: null, status: CAPABILITY.UNKNOWN };
  return {
    source: binding.source == null ? null : String(binding.source),
    target: binding.target == null ? null : String(binding.target),
    status: Object.values(CAPABILITY).includes(binding.status) ? binding.status : CAPABILITY.UNKNOWN
  };
}

export function createV1CompatibilityAdapter(input = {}) {
  const templateId = String(input.templateId || '');
  if (!templateId) throw new Error('V1 adapter requires templateId.');
  return Object.freeze({
    version: V1_ADAPTER_VERSION,
    source: 'v1-golden-baseline',
    templateId,
    templateVersion: String(input.templateVersion || 'v1-baseline'),
    sourceState: input.sourceState || V1_TEMPLATE_COMPATIBILITY_STATE.ASSET_RECONCILIATION,
    bindings: clone(input.bindings || {}),
    loops: clone(input.loops || {}),
    visibility: clone(input.visibility || {}),
    theme: clone(input.theme || {}),
    assets: clone(input.assets || {}),
    diagnostics: clone(input.diagnostics || []),
    metadata: clone(input.metadata || {})
  });
}

export function createDefaultV1Bindings(overrides = {}) {
  return Object.freeze({ ...DEFAULT_BINDINGS, ...(isObject(overrides) ? clone(overrides) : {}) });
}

export function mapV1ConceptsToV2(input = {}) {
  const bindings = isObject(input.bindings) ? input.bindings : {};
  const normalizedBindings = {};
  for (const [source, target] of Object.entries(bindings)) {
    normalizedBindings[String(source)] = normalizeBinding(
      typeof target === 'string' ? { source, target, status: CAPABILITY.SUPPORTED } : target
    );
  }

  return {
    adapterVersion: V1_ADAPTER_VERSION,
    templateId: String(input.templateId || ''),
    concepts: {
      tokens: normalizedBindings,
      objectLoops: clone(input.objectLoops || {}),
      primitiveLoops: clone(input.primitiveLoops || {}),
      visibility: clone(input.visibility || {}),
      theme: clone(input.theme || {})
    }
  };
}

export function buildV1AdapterFromTemplate(template, input = {}) {
  if (!template || !template.id) throw new Error('A V1 template definition is required.');
  const sourceBindings = isObject(input.bindings) ? input.bindings : createDefaultV1Bindings();
  const mapped = mapV1ConceptsToV2({
    templateId: template.id,
    bindings: sourceBindings,
    objectLoops: input.objectLoops,
    primitiveLoops: input.primitiveLoops,
    visibility: input.visibility,
    theme: input.theme
  });

  return createV1CompatibilityAdapter({
    templateId: template.id,
    templateVersion: template.version,
    sourceState: template.compatibility?.sourceState,
    bindings: mapped.concepts.tokens,
    loops: {
      object: mapped.concepts.objectLoops,
      primitive: mapped.concepts.primitiveLoops
    },
    visibility: mapped.concepts.visibility,
    theme: mapped.concepts.theme,
    assets: input.assets,
    diagnostics: input.diagnostics
  });
}

export function evaluateV1AdapterReadiness(adapter) {
  const diagnostics = [];
  if (!adapter || !adapter.templateId) diagnostics.push('Adapter templateId is required.');
  if (!adapter || !adapter.version) diagnostics.push('Adapter version is required.');
  if (adapter?.sourceState === V1_TEMPLATE_COMPATIBILITY_STATE.ASSET_RECONCILIATION) {
    diagnostics.push('V1 source/assets still require reconciliation.');
  }
  const unresolved = Object.values(adapter?.bindings || {}).filter(binding => binding.status === CAPABILITY.UNKNOWN);
  if (unresolved.length) diagnostics.push('One or more V1 bindings remain unknown.');
  return {
    ready: diagnostics.length === 0,
    diagnostics
  };
}

export function switchV2TemplateWithoutDataMutation(configuration = {}, targetTemplate, compatibility = {}) {
  if (!targetTemplate || !targetTemplate.id) throw new Error('Target template is required.');
  const next = clone(configuration);
  next.template = {
    ...(isObject(next.template) ? next.template : {}),
    id: String(targetTemplate.id),
    version: String(targetTemplate.version || '1.0.0'),
    compatibility: clone(compatibility)
  };
  return next;
}
