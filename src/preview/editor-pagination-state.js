export const EDITOR_PAGINATION_STATE_VERSION='1.0.0';
export function createEditorPaginationState(layoutResult={}){
 const pages=Array.isArray(layoutResult.pages)?layoutResult.pages:[];
 const pageCount=pages.length;
 return Object.freeze({version:EDITOR_PAGINATION_STATE_VERSION,pageCount,currentPage:pageCount?1:0,hasOverflow:Boolean(layoutResult.hasOverflow),pages});
}
export function setEditorPaginationPage(state,page){
 if(!state)throw new Error('Pagination state is required.');
 const max=state.pageCount;
 const current=max?Math.min(Math.max(Number(page)||1,1),max):0;
 return Object.freeze({...state,currentPage:current});
}
