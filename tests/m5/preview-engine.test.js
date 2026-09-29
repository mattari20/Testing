import assert from 'node:assert/strict';
import {
  createPreviewRequest, createPreviewState, applyPaginationToPreview,
  setPreviewPage, setPreviewZoom, createPreviewResult, PREVIEW_STATE
} from '../../src/preview/preview-engine.js';

const request = createPreviewRequest({
  documentSnapshot: { masterProfileId: 'profile-1', targetedCVId: 'cv-1', masterProfileRevision: 2, targetedCVRevision: 3 },
  template: { id: 'template-1', version: '1.0.0' },
  presentation: { theme: 'blue' },
  pageModel: { format: 'A4' }
});
assert.equal(request.template.id, 'template-1');

let state = createPreviewState();
assert.equal(state.status, PREVIEW_STATE.EMPTY);

state = applyPaginationToPreview(state, {
  pageCount: 2, hasOverflow: false,
  pages: [{ number: 1, blocks: [] }, { number: 2, blocks: [] }], diagnostics: []
});
assert.equal(state.status, PREVIEW_STATE.READY);
assert.equal(state.pageCount, 2);

state = setPreviewPage(state, 2);
assert.equal(state.currentPage, 2);
state = setPreviewPage(state, 99);
assert.equal(state.currentPage, 2);

state = setPreviewZoom(state, 2);
assert.equal(state.zoom, 2);
state = setPreviewZoom(state, 99);
assert.equal(state.zoom, 4);

const result = createPreviewResult(request, {
  pageCount: 1, hasOverflow: false,
  pages: [{ number: 1, blocks: [] }], diagnostics: []
});
assert.equal(result.status, PREVIEW_STATE.READY);
assert.equal(result.source.templateId, 'template-1');
assert.equal(result.source.masterProfileRevision, 2);

const errorState = applyPaginationToPreview(createPreviewState(), {
  pageCount: 1, hasOverflow: true,
  pages: [{ number: 1, blocks: [{ id: 'x', state: 'overflow' }] }],
  diagnostics: [{ blockId: 'x', state: 'overflow' }]
});
assert.equal(errorState.status, PREVIEW_STATE.ERROR);
assert.equal(errorState.error.code, 'LAYOUT_OVERFLOW');

console.log('M5 preview engine tests passed.');
