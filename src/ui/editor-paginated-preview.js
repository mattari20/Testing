import {createEditorPaginationState,setEditorPaginationPage} from '../preview/editor-pagination-state.js';
export const EDITOR_PAGINATED_PREVIEW_VERSION='1.0.0';
export function createPaginatedPreview(layoutResult,options={}){
 const state=createEditorPaginationState(layoutResult);
 const requested=options.page||state.currentPage;
 return Object.freeze({version:EDITOR_PAGINATED_PREVIEW_VERSION,state:setEditorPaginationPage(state,requested),layoutResult});
}
