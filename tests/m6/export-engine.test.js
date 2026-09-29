import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPORT_TYPE,
  EXPORT_STATE,
  createExportRequest,
  validateExportRequest,
  createArtifactRecord,
  transitionExportState,
  validateArtifactRecord
} from '../../src/export/export-engine.js';

const base = {
  documentSnapshot: {
    masterProfileId: 'profile-1',
    targetedCVId: 'cv-1',
    masterProfileRevision: 'p-r3',
    targetedCVRevision: 'cv-r5'
  },
  template: {
    id: 'template-1',
    version: '2.0.0',
    capabilities: { pdf: true, print: true, generatedDocx: true, blankDocx: true }
  },
  layoutResult: {
    pageCount: 2,
    hasOverflow: false,
    diagnostics: []
  }
};

test('creates an export request from a coherent snapshot', () => {
  const request = createExportRequest({ ...base, outputType: EXPORT_TYPE.PDF });
  assert.equal(request.outputType, EXPORT_TYPE.PDF);
  assert.equal(request.documentSnapshot.targetedCVRevision, 'cv-r5');
});

test('rejects unsupported output types', () => {
  assert.throws(() => createExportRequest({ ...base, outputType: 'html-download' }));
});

test('blocks export when layout has unresolved overflow', () => {
  const request = createExportRequest({
    ...base,
    outputType: EXPORT_TYPE.PDF,
    layoutResult: { pageCount: 2, hasOverflow: true, diagnostics: [] }
  });
  const result = validateExportRequest(request);
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('LAYOUT_OVERFLOW'));
});

test('distinguishes blank DOCX from generated user-data DOCX', () => {
  const request = createExportRequest({ ...base, outputType: EXPORT_TYPE.BLANK_DOCX });
  const result = validateExportRequest(request);
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some(w => w.code === 'BLANK_DOCX_MUST_NOT_CONTAIN_USER_DATA'));
});

test('creates immutable-style artifact provenance from source revisions', () => {
  const request = createExportRequest({ ...base, outputType: EXPORT_TYPE.PDF });
  const artifact = createArtifactRecord(request, { artifactId: 'artifact-1' });
  assert.equal(artifact.artifactId, 'artifact-1');
  assert.equal(artifact.source.masterProfileRevision, 'p-r3');
  assert.equal(artifact.source.targetedCVRevision, 'cv-r5');
  assert.equal(artifact.source.templateVersion, '2.0.0');
  assert.equal(artifact.state, EXPORT_STATE.COMPLETED);
  assert.equal(validateArtifactRecord(artifact).valid, true);
});

test('completed artifact records preserve constraints when validation warns', () => {
  const request = createExportRequest({ ...base, outputType: EXPORT_TYPE.PDF });
  const artifact = createArtifactRecord(request, {
    artifactId: 'artifact-2',
    validation: { valid: true, errors: [], warnings: [{ code: 'FONT_SUBSTITUTION' }] }
  });
  assert.equal(artifact.state, EXPORT_STATE.COMPLETED_WITH_CONSTRAINTS);
  assert.equal(artifact.validation.warnings.length, 1);
});

test('export state transitions remain explicit', () => {
  let state = {
    state: EXPORT_STATE.REQUESTED,
    requestId: 'req-1',
    artifactId: null,
    validation: null,
    constraints: [],
    error: null
  };
  state = transitionExportState(state, EXPORT_STATE.PREPARING);
  state = transitionExportState(state, EXPORT_STATE.RENDERING);
  state = transitionExportState(state, EXPORT_STATE.VALIDATING);
  state = transitionExportState(state, EXPORT_STATE.COMPLETED, { artifactId: 'artifact-3' });
  assert.equal(state.state, EXPORT_STATE.COMPLETED);
  assert.equal(state.artifactId, 'artifact-3');
});

test('artifact validation rejects missing provenance', () => {
  const result = validateArtifactRecord({ artifactId: 'a', outputType: EXPORT_TYPE.PDF });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('TEMPLATE_PROVENANCE_REQUIRED'));
});
