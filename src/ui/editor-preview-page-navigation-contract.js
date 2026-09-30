export const EDITOR_PREVIEW_PAGE_NAVIGATION_CONTRACT_VERSION='1.0.0';

export function normalizePageSelection(pageCount,currentPage=1){
 const count=Math.max(0,Number(pageCount)||0);
 if(!count) return 0;
 return Math.min(Math.max(Number(currentPage)||1,1),count);
}

export function createPageNavigationState(pageCount,currentPage=1){
 const page=normalizePageSelection(pageCount,currentPage);
 return Object.freeze({pageCount:Math.max(0,Number(pageCount)||0),currentPage:page,canPrevious:page>1,canNext:page>0&&page<pageCount});
}