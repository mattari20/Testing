import { evaluateTemplateCompatibility } from '../templates/template-engine.js';
import { evaluateVariantCompatibility } from '../templates/presentation-variant-engine.js';

export const CV_TEMPLATE_CAPABILITY_RESOLUTION_VERSION = '1.0.0';

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function resolveTemplateCapabilities(template, requestedContent = {}, variants = [], context = {}) {
  const compatibility = evaluateTemplateCompatibility(template, requestedContent);
  const variantResults = (Array.isArray(variants) ? variants : []).map(variant => ({
    variantId: variant?.id || null,
    ...evaluateVariantCompatibility(variant, { ...context, templateId: template?.id || context.templateId })
  }));
  const blockingVariants = variantResults.filter(item => !item.compatible);
  const constrainedVariants = variantResults.filter(item => item.compatible && item.state !== 'supported');
  return Object.freeze({
    version: CV_TEMPLATE_CAPABILITY_RESOLUTION_VERSION,
    templateId: template?.id || null,
    templateVersion: template?.version || null,
    compatibility: clone(compatibility),
    variants: clone(variantResults),
    compatible: compatibility.compatible && blockingVariants.length === 0,
    requiresReview: compatibility.requiresReview || constrainedVariants.length > 0,
    blockingReasons: [
      ...Object.entries(compatibility.results || {}).filter(([, value]) => ['unknown','unsupported_but_preserved','retired'].includes(value)).map(([key, value]) => ({ type: 'template', key, capability: value })),
      ...blockingVariants.map(item => ({ type: 'variant', variantId: item.variantId, reasons: item.reasons }))
    ]
  });
}

export function selectResolvedVariant(capabilityResult, preferredVariantId = null) {
  const variants = Array.isArray(capabilityResult?.variants) ? capabilityResult.variants : [];
  if (preferredVariantId) {
    const preferred = variants.find(item => item.variantId === String(preferredVariantId) && item.compatible);
    if (preferred) return Object.freeze({ variantId: preferred.variantId, reason: 'preferred-compatible', state: preferred.state });
  }
  const first = variants.find(item => item.compatible);
  return Object.freeze(first
    ? { variantId: first.variantId, reason: 'first-compatible', state: first.state }
    : { variantId: null, reason: 'no-compatible-variant', state: 'unsupported_but_preserved' });
}

export function validateCapabilityResolution(result) {
  const errors = [];
  if (!result || result.version !== CV_TEMPLATE_CAPABILITY_RESOLUTION_VERSION) errors.push('Capability resolution version is invalid.');
  if (!result?.templateId) errors.push('Template id is required.');
  if (!isObject(result?.compatibility)) errors.push('Template compatibility result is required.');
  if (!Array.isArray(result?.variants)) errors.push('Variant resolution must be an array.');
  return Object.freeze({ valid: errors.length === 0, errors });
}
