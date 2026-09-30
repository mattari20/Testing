import {applyFragmentSlice} from './editor-preview-fragment-style.js';
export const EDITOR_PREVIEW_FRAGMENT_DISTRIBUTOR_VERSION='1.0.0';
export function distributeFragments(pageElements,fragmentPages=[]){
 if(!Array.isArray(pageElements)) throw new Error('Page elements are required.');
 let count=0;
 fragmentPages.forEach((page,index)=>{
   const target=pageElements[index]; if(!target) return;
   target.replaceChildren();
   (page.fragments||[]).forEach(fragment=>{
     if(!fragment.element) return;
     const clone=fragment.element.cloneNode(true);
     if(fragment.state==='split') applyFragmentSlice(clone,fragment);
     clone.dataset.v2FragmentOf=fragment.blockId;
     target.appendChild(clone); count+=1;
   });
 });
 return Object.freeze({pageCount:pageElements.length,fragmentCount:count});
}
