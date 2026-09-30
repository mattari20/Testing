export const EDITOR_PREVIEW_BROWSER_FRAGMENT_NAVIGATION_VERSION='1.0.0';

export function setPreviewPageVisibility(pageElements=[],currentPage=1){
 const pages=Array.isArray(pageElements)?pageElements:[];
 const selected=Math.min(Math.max(Number(currentPage)||1,1),Math.max(1,pages.length));
 pages.forEach((page,index)=>{ page.hidden=index+1!==selected; });
 return Object.freeze({currentPage:pages.length?selected:0,pageCount:pages.length});
}