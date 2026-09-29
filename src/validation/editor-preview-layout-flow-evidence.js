import { createEditorPaginationEvidence } from './editor-pagination-evidence.js';
export const EDITOR_PREVIEW_LAYOUT_FLOW_EVIDENCE_VERSION='1.0.0';
export function createEditorPreviewLayoutFlowEvidence(input={}) {
  return createEditorPaginationEvidence({
    layout:input.layoutStatus==='passed'?'passed':'failed',
    pages:input.pageCount,
    navigation:input.navigationStatus==='passed'?'passed':'failed',
    currentPage:input.currentPage
  });
}
