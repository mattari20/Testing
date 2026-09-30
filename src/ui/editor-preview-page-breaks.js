export const EDITOR_PREVIEW_PAGE_BREAKS_VERSION='1.0.0';

export function applyExplicitPageBreaks(pages=[],blocks=[]){
  const breakOrders=new Set((Array.isArray(blocks)?blocks:[]).filter(b=>b.kind==='page-break').map(b=>b.order));
  if(!breakOrders.size) return pages;
  return pages.map((page,index)=>({...page,pageNumber:index+1,manualBreakBefore:index>0 && breakOrders.has((page.fragments||[])[0]?.order)}));
}