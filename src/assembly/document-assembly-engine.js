import { createDocumentSnapshot, validateM1 } from '../core/career-document-core.js';
import { evaluateTemplateCompatibility } from '../templates/template-engine.js';
import { validateVariantSelection, chooseVariantFallback } from '../templates/presentation-variant-engine.js';
import { paginateBlocks, createLayoutResult } from '../layout/layout-pagination-engine.js';
import { createPreviewRequest, createPreviewResult } from '../preview/preview-engine.js';
import { createExportRequest, validateExportRequest, EXPORT_TYPE } from '../export/export-engine.js';

export const ASSEMBLY_ENGINE_VERSION = '1.0.0';

export const ASSEMBLY_STATE = Object.freeze({
  READY: 'ready',
  BLOCKED: 'blocked'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function visibleContent(profile, cv) {
  const hiddenSections = new Set(cv.configuration?.hiddenSections || []);
  const hiddenFields = new Set(cv.configuration?.hiddenFields || []);
  const hiddenEntries = new Set(cv.configuration?.hiddenEntries || []);
  const requested = {};

  for (const section of profile.careerData.sections || []) {
    if (section.visibility === false || hiddenSections.has(section.id)) continue;
    requested[section.type || section.id] = true;
    for (const field of section.fields || []) {
      if (field.visibility !== false && !hiddenFields.has(field.id)) requested[field.type || field.id] = true;
    }
    for (const entry of section.entries || []) {
      if (entry.visibility !== false && !hiddenEntries.has(entry.id)) requested[section.type || section.id] = true;
    }
  }
  return requested;
}

function selectedVariants(cv) {
  return clone(cv.configuration?.presentation?.variants || {});
}

function flattenVariantSelections(selections) {
  const result = [];
  for (const [scope, targets] of Object.entries(selections || {})) {
    for (const [targetId, variantId] of Object.entries(targets || {})) {
      result.push({ scope, targetId, variantId });
    }
  }
  return result;
}

function makeBlockPlan(blocks) {
  return Array.isArray(blocks) ? clone(blocks) : [];
}

export function createAssemblyRequest(input = {}) {
  if (!input.profile || !input.targetedCV) throw new Error('Assembly requires a Master Profile and Targeted CV.');
  if (!input.templateRegistry) throw new Error('Assembly requires a template registry.');
  if (!input.variantRegistry) throw new Error('Assembly requires a presentation variant registry.');

  return Object.freeze({
    version: ASSEMBLY_ENGINE_VERSION,
    profile: input.profile,
    targetedCV: input.targetedCV,
    templateId: String(input.templateId || input.targetedCV.configuration?.template?.id || ''),
    templateRegistry: input.templateRegistry,
    variantRegistry: input.variantRegistry,
    pageModel: isObject(input.pageModel) ? clone(input.pageModel) : {},
    layoutBlocks: makeBlockPlan(input.layoutBlocks),
    presentation: isObject(input.presentation) ? clone(input.presentation) : {},
    assets: Array.isArray(input.assets) ? clone(input.assets) : []
  });
}

export function assembleDocument(input = {}) {
  const request = createAssemblyRequest(input);
  const validation = validateM1(request.profile, request.targetedCV);
  const errors = [...validation.profile.errors, ...validation.targetedCV.errors];
  if (!request.templateId) errors.push('TEMPLATE_ID_REQUIRED');

  const template = request.templateRegistry.get(request.templateId);
  if (!template) errors.push('TEMPLATE_NOT_FOUND');

  if (errors.length) {
    return {
      version: ASSEMBLY_ENGINE_VERSION,
      state: ASSEMBLY_STATE.BLOCKED,
      errors,
      validation
    };
  }

  const snapshot = createDocumentSnapshot(request.profile, request.targetedCV);

  const contentCompatibility = evaluateTemplateCompatibility(
    template,
    visibleContent(request.profile, request.targetedCV)
  );

  const variantValidation = validateVariantSelection(
    request.targetedCV.configuration,
    request.variantRegistry,
    { templateId: template.id }
  );

  const variantSelections = flattenVariantSelections(selectedVariants(request.targetedCV));
  const resolvedVariants = [];
  for (const selection of variantSelections) {
    const fallback = chooseVariantFallback(
      request.variantRegistry,
      selection.variantId,
      { templateId: template.id },
      []
    );
    resolvedVariants.push({
      scope: selection.scope,
      targetId: selection.targetId,
      requestedVariantId: selection.variantId,
      ...fallback
    });
  }

  const compatibilityErrors = [];
  if (!contentCompatibility.compatible) {
    compatibilityErrors.push('TEMPLATE_CONTENT_COMPATIBILITY_BLOCKED');
  }
  if (!variantValidation.valid) {
    compatibilityErrors.push('PRESENTATION_VARIANT_INCOMPATIBILITY');
  }

  const pagination = paginateBlocks(request.layoutBlocks, request.pageModel);
  const layoutResult = createLayoutResult(pagination, {
    assemblyVersion: ASSEMBLY_ENGINE_VERSION,
    templateId: template.id,
    templateVersion: template.version
  });

  if (layoutResult.hasOverflow) compatibilityErrors.push('LAYOUT_OVERFLOW');

  const state = compatibilityErrors.length ? ASSEMBLY_STATE.BLOCKED : ASSEMBLY_STATE.READY;

  const previewRequest = createPreviewRequest({
    documentSnapshot: snapshot,
    template,
    presentation: request.presentation,
    pageModel: layoutResult.pageModel
  });
  const previewResult = createPreviewResult(previewRequest, pagination, {
    resolvedVariants
  });

  const exports = {};
  for (const outputType of Object.values(EXPORT_TYPE)) {
    const exportRequest = createExportRequest({
      documentSnapshot: snapshot,
      template,
      presentation: { ...request.presentation, variants: resolvedVariants },
      layoutResult,
      assets: request.assets,
      outputType
    });
    exports[outputType] = {
      request: exportRequest,
      validation: validateExportRequest(exportRequest)
    };
  }

  return {
    version: ASSEMBLY_ENGINE_VERSION,
    state,
    errors: compatibilityErrors,
    validation,
    snapshot,
    template: clone(template),
    compatibility: contentCompatibility,
    variants: {
      savedSelections: selectedVariants(request.targetedCV),
      validation: variantValidation,
      resolved: resolvedVariants
    },
    layout: layoutResult,
    preview: previewResult,
    exports
  };
}
