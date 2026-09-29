import { EXPORT_TYPE } from './export-engine.js';
import { assertProductionExportReady } from './production-export.js';

export const DOCX_GENERATOR_VERSION = '1.0.0';

export const DOCX_MODE = Object.freeze({
  GENERATED: EXPORT_TYPE.DOCX,
  BLANK: EXPORT_TYPE.BLANK_DOCX
});

function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

function validateMode(mode) {
  if (!Object.values(DOCX_MODE).includes(mode)) {
    throw new Error('Unsupported DOCX generation mode: ' + mode);
  }
}

export function createDocxGenerationPlan(input = {}) {
  const mode = input.outputType || DOCX_MODE.GENERATED;
  validateMode(mode);

  const ready = assertProductionExportReady({
    ...input,
    outputType: mode
  });

  if (mode === DOCX_MODE.BLANK && input.documentSnapshot) {
    throw new Error('Blank DOCX generation must not receive a generated document snapshot.');
  }

  if (mode === DOCX_MODE.GENERATED && !input.documentSnapshot) {
    throw new Error('Generated DOCX requires a document snapshot.');
  }

  return Object.freeze({
    generatorVersion: DOCX_GENERATOR_VERSION,
    mode,
    status: 'ready',
    request: ready.request,
    documentSnapshot: clone(input.documentSnapshot),
    layoutResult: clone(input.layoutResult),
    template: clone(input.template),
    generation: {
      editable: mode === DOCX_MODE.GENERATED,
      blank: mode === DOCX_MODE.BLANK,
      semanticContentRequired: mode === DOCX_MODE.GENERATED,
      providerBoundary: true
    }
  });
}

export function createGeneratedDocxArtifactManifest(input = {}) {
  const plan = createDocxGenerationPlan({ ...input, outputType: DOCX_MODE.GENERATED });
  return Object.freeze({
    artifactType: EXPORT_TYPE.DOCX,
    generatorVersion: DOCX_GENERATOR_VERSION,
    status: 'planned',
    editable: true,
    blank: false,
    templateId: plan.template?.id || null,
    templateVersion: plan.template?.version || null,
    sourceDocumentId: plan.documentSnapshot?.targetedCVId || null,
    binaryGeneration: 'provider-boundary',
    validation: { valid: true, errors: [] }
  });
}

export function createBlankDocxArtifactManifest(input = {}) {
  const plan = createDocxGenerationPlan({
    ...input,
    outputType: DOCX_MODE.BLANK,
    documentSnapshot: undefined
  });
  return Object.freeze({
    artifactType: EXPORT_TYPE.BLANK_DOCX,
    generatorVersion: DOCX_GENERATOR_VERSION,
    status: 'planned',
    editable: true,
    blank: true,
    templateId: plan.template?.id || null,
    templateVersion: plan.template?.version || null,
    sourceDocumentId: null,
    binaryGeneration: 'provider-boundary',
    validation: { valid: true, errors: [] }
  });
}
