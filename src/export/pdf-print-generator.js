import { EXPORT_TYPE } from './export-engine.js';
import { assertProductionExportReady } from './production-export.js';

export const PDF_PRINT_GENERATOR_VERSION = '1.0.0';

export const GENERATION_MODE = Object.freeze({
  PDF: EXPORT_TYPE.PDF,
  PRINT: EXPORT_TYPE.PRINT
});

function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

function validateMode(mode) {
  if (!Object.values(GENERATION_MODE).includes(mode)) {
    throw new Error('Unsupported PDF/print generation mode: ' + mode);
  }
}

export function createPdfPrintGenerationPlan(input = {}) {
  const mode = input.outputType || GENERATION_MODE.PDF;
  validateMode(mode);

  const ready = assertProductionExportReady({
    ...input,
    outputType: mode
  });

  return Object.freeze({
    generatorVersion: PDF_PRINT_GENERATOR_VERSION,
    mode,
    status: 'ready',
    request: ready.request,
    documentSnapshot: clone(input.documentSnapshot),
    layoutResult: clone(input.layoutResult),
    template: clone(input.template),
    generation: {
      pageCount: Array.isArray(input.layoutResult?.pages) ? input.layoutResult.pages.length : null,
      semanticPaginationRequired: true,
      providerBoundary: true
    }
  });
}

export function createPdfArtifactManifest(input = {}) {
  const plan = createPdfPrintGenerationPlan({ ...input, outputType: GENERATION_MODE.PDF });
  return Object.freeze({
    artifactType: EXPORT_TYPE.PDF,
    generatorVersion: PDF_PRINT_GENERATOR_VERSION,
    status: 'planned',
    pageCount: plan.generation.pageCount,
    templateId: plan.template?.id || null,
    templateVersion: plan.template?.version || null,
    sourceDocumentId: plan.documentSnapshot?.targetedCVId || null,
    binaryGeneration: 'provider-boundary',
    validation: { valid: true, errors: [] }
  });
}

export function createPrintArtifactManifest(input = {}) {
  const plan = createPdfPrintGenerationPlan({ ...input, outputType: GENERATION_MODE.PRINT });
  return Object.freeze({
    artifactType: EXPORT_TYPE.PRINT,
    generatorVersion: PDF_PRINT_GENERATOR_VERSION,
    status: 'planned',
    pageCount: plan.generation.pageCount,
    templateId: plan.template?.id || null,
    templateVersion: plan.template?.version || null,
    sourceDocumentId: plan.documentSnapshot?.targetedCVId || null,
    binaryGeneration: 'browser-print-boundary',
    validation: { valid: true, errors: [] }
  });
}
