export const EDITOR_PREVIEW_CONTENT_SLICER_VERSION='1.0.0';
export function sliceRenderedContent(contentHtml,pages=[]){
  const list=Array.isArray(pages)?pages:[];
  if(!list.length)return [];
  return list.map((page,index)=>Object.freeze({pageId:page?.id??index+1,contentHtml:index===0?String(contentHtml):''}));
}
