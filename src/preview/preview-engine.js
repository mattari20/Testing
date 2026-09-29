export const PREVIEW_ENGINE_VERSION = '1.0.0';

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export const PREVIEW_STATE = Object.freeze({
  READY: 'ready',
  EMPTY: 'empty',
  RENDERING: 'rendering',
  ERROR: 'error'
});

export function createPreviewRequest(input = {}) {
  if (!input.documentSnapshot) throw new Error('Preview requires a document snapshot.');
  if (!input.template) throw new Error('Preview requires a template definition.');
  return Object.freeze({
    version: PREVIEW_ENGINE_VERSION,
    requestId: String(input.requestId || 'preview_' + Date.now().toString(36)),
    documentSnapshot: clone(input.documentSnapshot),
    template: clone(input.template),
    presentation: isObject(input.presentation) ? clone(input.presentation) : {},
    pageModel: isObject(input.pageModel) ? clone(input.pageModel) : {},
    viewport: isObject(input.viewport) ? clone(input.viewport) : {},
    requestedAt: input.requestedAt || new Date().toISOString()
  });
}

export function createPreviewState(input = {}) {
  return {
    version: PREVIEW_ENGINE_VERSION,
    status: PREVIEW_STATE.EMPTY,
    requestId: null,
    pageCount: 0,
    currentPage: 1,
    zoom: 1,
    pages: [],
    diagnostics: [],
    error: null,
    metadata: isObject(input.metadata) ? clone(input.metadata) : {}
  };
}

export function applyPaginationToPreview(state, paginationResult) {
  if (!paginationResult || !Array.isArray(paginationResult.pages)) throw new Error('Valid pagination result is required.');
  const next = clone(state);
  next.status = paginationResult.hasOverflow ? PREVIEW_STATE.ERROR : PREVIEW_STATE.READY;
  next.pageCount = paginationResult.pageCount;
  next.currentPage = Math.min(Math.max(1, next.currentPage), Math.max(1, paginationResult.pageCount));
  next.pages = clone(paginationResult.pages);
  next.diagnostics = clone(paginationResult.diagnostics || []);
  next.error = paginationResult.hasOverflow ? { code: 'LAYOUT_OVERFLOW', message: 'Preview contains unresolved layout overflow.' } : null;
  return next;
}

export function setPreviewPage(state, pageNumber) {
  const next = clone(state);
  const count = Math.max(1, Number(state.pageCount) || 1);
  next.currentPage = Math.min(Math.max(1, Number(pageNumber) || 1), count);
  return next;
}

export function setPreviewZoom(state, zoom) {
  const next = clone(state);
  next.zoom = Math.min(4, Math.max(0.25, Number(zoom) || 1));
  return next;
}

export function createPreviewResult(request, paginationResult, renderData = {}) {
  const state = applyPaginationToPreview(createPreviewState(), paginationResult);
  return {
    version: PREVIEW_ENGINE_VERSION,
    requestId: request.requestId,
    status: state.status,
    pageCount: state.pageCount,
    pages: state.pages,
    diagnostics: state.diagnostics,
    renderData: clone(renderData),
    source: {
      masterProfileId: request.documentSnapshot.masterProfileId,
      targetedCVId: request.documentSnapshot.targetedCVId,
      masterProfileRevision: request.documentSnapshot.targetedCVRevision,
      targetedCVRevision: request.documentSnapshot.targetedCVRevision,
      templateId: request.template.id,
      templateVersion: request.template.version
    }
  };
}
