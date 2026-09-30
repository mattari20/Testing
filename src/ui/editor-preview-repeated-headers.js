export const EDITOR_PREVIEW_REPEATED_HEADERS_VERSION='1.0.0';

export function markRepeatedHeaderFragments(fragmentPages=[]){
  const pages=Array.isArray(fragmentPages)?fragmentPages:[];
  const headerIds=new Set();
  for(const page of pages) for(const f of page.fragments||[]) if(f.kind==='document-header'||f.kind==='section-heading') headerIds.add(f.blockId);
  return pages.map((page,index)=>({...page,fragments:(page.fragments||[]).map(f=>({
    ...f,
    repeatedHeader:index>0 && headerIds.has(f.blockId) && f.part===1,
    repeatPolicy:f.kind==='document-header'?'each-page':f.kind==='section-heading'?'continue-with-section':'none'
  }))}));
}