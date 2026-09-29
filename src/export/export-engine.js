export const EXPORT_ENGINE_VERSION = '1.0.0';

export const EXPORT_TYPE = Object.freeze({
  PDF: 'pdf',
  PRINT: 'print',
  DOCX: 'docx',
  BLANK_DOCX: 'blank-docx'
});

export const EXPORT_STATE = Object.freeze({
  REQUESTED: 'requested',
  PREPARING: 'preparing',
  RENDERING: 'rendering',
  VALIDATING: 'validating',
  COMPLETED: 'completed',
  COMPLETED_WITH_CONSTRAINTS: 'completed-with-constraints',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const id = (value, fallback) => String(value || fallback);

export function createExportRequest(input = {}) {
  if (!input.documentSnapshot) throw new Error('Export requires a document snapshot.');
  if (!input.template) throw new Error('Export requires a template definition.');
  const outputType = String(input.outputType || '');
  if (!Object.values(EXPORT_TYPE).includes(outputType)) {
    throw new Error('Unsupported export type.');
  }

  return Object.freeze({
    version: EXPORT_ENGINE_VERSION,
    requestId: id(input.requestId, 'export_' + Date.now().toString(36)),
    outputType,
    documentSnapshot: clone(input.documentSnapshot),
    template: clone(input.template),
    presentation: isObject(input.presentation) ? clone(input.presentation) : {},
    layoutResult: isObject(input.layoutResult) ? clone(input.layoutResult) : null,
    assets: Array.isArray(input.assets) ? clone(input.assets) : [],
    requestedAt: input.requestedAt || new Date().toISOString()
  });
}

export function createExportState(input = {}) {
  return {
    version: EXPORT_ENGINE_VERSION,
    state: EXPORT_STATE.REQUESTED,
    requestId: input.requestId || null,
    artifactId: null,
    outputType: input.outputType || null,
    validation: null,
    constraints: [],
    error: null
  };
}

export function validateExportRequest(request) {
  const errors = [];
  const warnings = [];

  if (!request?.documentSnapshot) errors.push('DOCUMENT_SNAPSHOT_REQUIRED');
  if (!request?.template?.id) errors.push('TEMPLATE_ID_REQUIRED');
  if (!request?.template?.version) errors.push('TEMPLATE_VERSION_REQUIRED');
  if (!Object.values(EXPORT_TYPE).includes(request?.outputType)) errors.push('OUTPUT_TYPE_UNSUPPORTED');

  const capabilities = request?.template?.capabilities || {};
  const capabilityKey = {
    [EXPORT_TYPE.PDF]: 'pdf',
    [EXPORT_TYPE.PRINT]: 'print',
    [EXPORT_TYPE.DOCX]: 'generatedDocx',
    [EXPORT_TYPE.BLANK_DOCX]: 'blankDocx'
  }[request?.outputType];

  if (capabilityKey && capabilities[capabilityKey] === false) {
    errors.push('TEMPLATE_OUTPUT_NOT_SUPPORTED');
  }

  if (request?.layoutResult?.hasOverflow) errors.push('LAYOUT_OVERFLOW');
  if (Array.isArray(request?.layoutResult?.diagnostics)) {
    for (const diagnostic of request.layoutResult.diagnostics) {
      if (diagnostic?.state === 'overflow') warnings.push({ code: 'LAYOUT_OVERFLOW_DIAGNOSTIC', blockId: diagnostic.blockId });
    }
  }

  if (request?.outputType === EXPORT_TYPE.BLANK_DOCX && request?.documentSnapshot?.masterProfileId) {
    warnings.push({ code: 'BLANK_DOCX_MUST_NOT_CONTAIN_USER_DATA' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function createArtifactRecord(request, input = {}) {
  if (!request?.requestId) throw new Error('A valid export request is required.');
  const validation = input.validation || validateExportRequest(request);
  if (!validation.valid) throw new Error('Cannot create artifact from an invalid export request.');

  const artifactId = id(input.artifactId, 'artifact_' + Date.now().toString(36));
  const status = validation.warnings.length
    ? EXPORT_STATE.COMPLETED_WITH_CONSTRAINTS
    : EXPORT_STATE.COMPLETED;

  return Object.freeze({
    version: EXPORT_ENGINE_VERSION,
    artifactId,
    outputType: request.outputType,
    state: status,
    source: {
      masterProfileId: request.documentSnapshot.masterProfileId || null,
      targetedCVId: request.documentSnapshot.targetedCVId || null,
      masterProfileRevision: request.documentSnapshot.masterProfileRevision || null,
      targetedCVRevision: request.documentSnapshot.targetedCVRevision || null,
      templateId: request.template.id,
      templateVersion: request.template.version,
      presentation: clone(request.presentation)
    },
    validation: clone(validation),
    generation: {
      requestId: request.requestId,
      engineVersion: EXPORT_ENGINE_VERSION,
      createdAt: input.createdAt || new Date().toISOString()
    },
    metadata: isObject(input.metadata) ? clone(input.metadata) : {}
  });
}

export function transitionExportState(state, nextState, details = {}) {
  if (!Object.values(EXPORT_STATE).includes(nextState)) throw new Error('Unknown export state.');
  const next = clone(state);
  next.state = nextState;
  if (details.error) next.error = clone(details.error);
  if (Array.isArray(details.constraints)) next.constraints = clone(details.constraints);
  if (details.validation) next.validation = clone(details.validation);
  if (details.artifactId) next.artifactId = String(details.artifactId);
  return next;
}

export function validateArtifactRecord(artifact) {
  const errors = [];
  if (!artifact?.artifactId) errors.push('ARTIFACT_ID_REQUIRED');
  if (!Object.values(EXPORT_TYPE).includes(artifact?.outputType)) errors.push('OUTPUT_TYPE_REQUIRED');
  if (!artifact?.source?.templateId || !artifact?.source?.templateVersion) errors.push('TEMPLATE_PROVENANCE_REQUIRED');
  if (!artifact?.generation?.requestId) errors.push('REQUEST_PROVENANCE_REQUIRED');
  if (!artifact?.generation?.engineVersion) errors.push('ENGINE_VERSION_REQUIRED');
  if (!artifact?.validation) errors.push('VALIDATION_RESULT_REQUIRED');
  return { valid: errors.length === 0, errors };
}
