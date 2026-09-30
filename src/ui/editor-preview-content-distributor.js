export const EDITOR_PREVIEW_CONTENT_DISTRIBUTOR_VERSION='1.0.0';

export function distributeRenderedBlocks(pageElements,fragmentPages=[]){
 if(!Array.isArray(pageElements)) throw new Error('Page elements are required.');
 fragmentPages.forEach((page,index)=>{
   const target=pageElements[index];
   if(!target) return;
   target.replaceChildren();
   page.fragments.forEach(fragment=>{
     if(fragment.element) target.appendChild(fragment.element.cloneNode(true));
   });
 });
 return Object.freeze({pageCount:pageElements.length,distributedPages:fragmentPages.length});
}
