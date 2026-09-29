import {createEditorPaginationEvidence} from './editor-pagination-evidence.js';
export const EDITOR_PREVIEW_PAGINATION_FLOW_VERSION='1.0.0';
export function createEditorPreviewPaginationEvidence(input={}){const layoutPassed=input.layoutResult?.pages?.length>0;const navigationPassed=input.navigation==='passed';return createEditorPaginationEvidence({layout:layoutPassed?'passed':'failed',pages:input.layoutResult?.pages?.length||0,navigation:navigationPassed?'passed':'failed',currentPage:input.currentPage});}
