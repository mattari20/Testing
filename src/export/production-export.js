import { validateExportRequest, EXPORT_TYPE } from './export-engine.js';

export const PRODUCTION_EXPORT_VERSION = '1.0.0';

export const EXPORT_STATUS = Object.freeze({
  READY: 'ready',
  BLOCKED: 'blocked'
});

function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

export function createProductionExportRequest(input = {}) {
  const request = {
    ...input,
    exportType: input.exportType || EXPORT_TYPE.PDF,
    documentSnapshot: clone(input.documentSnapshot),
    layoutResult: clone(input.layoutResult),
    template: clone(input.template),
    presentation: clone(input.presentation || {})
  };

  const validation = validateExportRequest(request);
  return Object.freeze({
    productionExportVersion: PRODUCTION_EXPORT_VERSION,
    status: validation.valid ? EXPORT_STATUS.READY : EXPORT_STATUS.BLOCKED,
    request: Object.freeze(request),
    validation
  });
}

export function assertProductionExportReady(input) {
  const result = createProductionExportRequest(input);
  if (result.status !== EXPORT_STATUS.READY) {
    throw new Error('Export is blocked: ' + result.validation.errors.join('; '));
  }
  return result;
}

export function createExportArtifactPlan(input) {
  const ready = assertProductionExportReady(input);
  return Object.freeze({
    status: EXPORT_STATUS.READY,
    artifact: {
      artifactId: String(input.artifactId || 'artifact-pending'),
      exportType: input.exportType,
      documentSnapshot: clone(input.documentSnapshot),
      templateId: input.template?.id || null,
      templateVersion: input.template?.version || null,
      layoutVersion: input.layoutResult?.version || null,
      provenance: clone(input.provenance || {}),
      binaryGeneration: 'provider-boundary'
    },
    validation: ready.validation
  });
}
