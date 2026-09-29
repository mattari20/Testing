export const PRESENTATION_VARIANT_ENGINE_VERSION = '1.0.0';

export const VARIANT_LEVEL = Object.freeze({
  FIELD: 'field',
  ENTRY: 'entry',
  SECTION: 'section',
  DOCUMENT: 'document'
});

export const VARIANT_STATE = Object.freeze({
  SUPPORTED: 'supported',
  CONSTRAINED: 'supported_with_constraints',
  ADAPTABLE: 'adaptable',
  PRESERVED: 'unsupported_but_preserved',
  UNKNOWN: 'unknown'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function list(value) {
  return Array.isArray(value) ? [...new Set(value.map(String))] : [];
}

export function createPresentationVariant(input = {}) {
  const id = String(input.id || '');
  if (!id) throw new Error('Presentation variant id is required.');
  const level = String(input.level || VARIANT_LEVEL.SECTION);
  if (!Object.values(VARIANT_LEVEL).includes(level)) throw new Error('Unsupported presentation variant level: ' + level);

  return Object.freeze({
    id,
    version: String(input.version || '1.0.0'),
    level,
    name: String(input.name || id),
    semanticType: input.semanticType == null ? null : String(input.semanticType),
    dataTypes: list(input.dataTypes),
    sections: list(input.sections),
    fieldTypes: list(input.fieldTypes),
    compatibleTemplates: list(input.compatibleTemplates),
    incompatibleTemplates: list(input.incompatibleTemplates),
    exports: isObject(input.exports) ? clone(input.exports) : {},
    accessibility: isObject(input.accessibility) ? clone(input.accessibility) : {},
    requirements: isObject(input.requirements) ? clone(input.requirements) : {},
    metadata: isObject(input.metadata) ? clone(input.metadata) : {}
  });
}

export function createVariantRegistry(initialVariants = []) {
  const variants = new Map();
  const registry = {
    version: PRESENTATION_VARIANT_ENGINE_VERSION,
    register(input) {
      const variant = createPresentationVariant(input);
      if (variants.has(variant.id)) throw new Error('Presentation variant already registered: ' + variant.id);
      variants.set(variant.id, variant);
      return variant;
    },
    replace(input) {
      const variant = createPresentationVariant(input);
      if (!variants.has(variant.id)) throw new Error('Presentation variant not registered: ' + variant.id);
      variants.set(variant.id, variant);
      return variant;
    },
    get(id) { return variants.get(String(id)) || null; },
    list() { return [...variants.values()].map(clone); },
    size() { return variants.size; }
  };
  for (const variant of initialVariants) registry.register(variant);
  return registry;
}

function matchesList(value, allowed) {
  return !allowed.length || allowed.includes(String(value));
}

export function evaluateVariantCompatibility(variant, context = {}) {
  if (!variant) return { state: VARIANT_STATE.UNKNOWN, compatible: false, reasons: ['Variant is not defined.'] };

  const reasons = [];
  const templateId = context.templateId == null ? null : String(context.templateId);
  if (variant.incompatibleTemplates.includes(templateId)) reasons.push('Template explicitly excludes this variant.');
  if (variant.compatibleTemplates.length && !variant.compatibleTemplates.includes(templateId)) reasons.push('Template is not listed as compatible.');

  if (context.fieldType && !matchesList(context.fieldType, variant.fieldTypes)) reasons.push('Field type is not supported by this variant.');
  if (context.semanticType && variant.semanticType && String(context.semanticType) !== variant.semanticType) reasons.push('Semantic type is incompatible.');
  if (context.sectionType && !matchesList(context.sectionType, variant.sections)) reasons.push('Section type is not supported by this variant.');
  if (context.dataType && !matchesList(context.dataType, variant.dataTypes)) reasons.push('Data type is not supported by this variant.');

  if (reasons.length) return { state: VARIANT_STATE.PRESERVED, compatible: false, reasons };
  if (variant.requirements?.requiresMeasuredLayout === true && context.measuredLayout !== true) {
    return { state: VARIANT_STATE.CONSTRAINED, compatible: true, reasons: ['Measured layout is required before final rendering.'] };
  }
  return { state: VARIANT_STATE.SUPPORTED, compatible: true, reasons: [] };
}

export function listCompatibleVariants(registry, context = {}) {
  if (!registry || typeof registry.list !== 'function') throw new Error('Variant registry is required.');
  return registry.list().map(variant => {
    const evaluation = evaluateVariantCompatibility(variant, context);
    return { variant, ...evaluation };
  }).filter(item => item.compatible);
}

export function chooseVariantFallback(registry, requestedVariantId, context = {}, fallbackIds = []) {
  const requested = registry.get(requestedVariantId);
  if (requested) {
    const evaluation = evaluateVariantCompatibility(requested, context);
    if (evaluation.compatible) return { selectedVariantId: requested.id, reason: 'requested-compatible', evaluation };
  }

  for (const id of fallbackIds) {
    const candidate = registry.get(id);
    if (!candidate) continue;
    const evaluation = evaluateVariantCompatibility(candidate, context);
    if (evaluation.compatible) return { selectedVariantId: candidate.id, reason: 'approved-fallback', evaluation };
  }

  const first = listCompatibleVariants(registry, context)[0];
  return first
    ? { selectedVariantId: first.variant.id, reason: 'first-compatible', evaluation: first }
    : { selectedVariantId: null, reason: 'no-compatible-variant', evaluation: { state: VARIANT_STATE.PRESERVED, compatible: false, reasons: ['No compatible presentation variant is available.'] } };
}

export function setVariantSelection(configuration = {}, scope, targetId, variantId) {
  if (!scope || !targetId || !variantId) throw new Error('scope, targetId and variantId are required.');
  const next = clone(configuration);
  next.presentation = isObject(next.presentation) ? next.presentation : {};
  next.presentation.variants = isObject(next.presentation.variants) ? next.presentation.variants : {};
  next.presentation.variants[scope] = isObject(next.presentation.variants[scope]) ? next.presentation.variants[scope] : {};
  next.presentation.variants[scope][String(targetId)] = String(variantId);
  return next;
}

export function getVariantSelection(configuration = {}, scope, targetId) {
  return configuration?.presentation?.variants?.[scope]?.[String(targetId)] || null;
}

export function validateVariantSelection(configuration = {}, registry, context = {}) {
  const selections = configuration?.presentation?.variants || {};
  const issues = [];
  for (const [scope, targets] of Object.entries(selections)) {
    for (const [targetId, variantId] of Object.entries(targets || {})) {
      const variant = registry.get(variantId);
      if (!variant) {
        issues.push({ scope, targetId, variantId, state: VARIANT_STATE.UNKNOWN, message: 'Selected variant is not registered.' });
        continue;
      }
      const evaluation = evaluateVariantCompatibility(variant, context);
      if (!evaluation.compatible) issues.push({ scope, targetId, variantId, ...evaluation });
    }
  }
  return { valid: issues.length === 0, issues };
}
