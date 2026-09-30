export const EDITOR_PREVIEW_BROWSER_FRAGMENT_PROBE_VERSION='1.0.0';

export function probeFragmentedPages(documentRef){
 if(!documentRef?.querySelectorAll) throw new Error('A browser document is required.');
 const pages=[...documentRef.querySelectorAll('[data-v2-preview-page]')];
 return Object.freeze({
  pageCount:pages.length,
  pages:pages.map((page,index)=>{
   const rect=page.getBoundingClientRect();
   return {
    page:index+1,
    width:Math.max(0,rect.width),
    height:Math.max(0,rect.height),
    scrollHeight:Math.max(0,page.scrollHeight||0),
    fragmentCount:page.querySelectorAll('[data-v2-fragment-of]').length
   };
  })
 });
}