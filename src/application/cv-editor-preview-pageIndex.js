export const CV_EDITOR_PREVIEW_PAGEINDEX_VERSION='1.0.0';
export function pageIndex(value, options={}){
 return Math.max(0,(Number(value)||1)-1);
}