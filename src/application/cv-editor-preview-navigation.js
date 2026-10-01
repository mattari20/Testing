export const CV_EDITOR_PREVIEW_NAVIGATION_VERSION='1.0.0';
export function createCVEditorPreviewNavigation(options={}) {
 const document=options.document,preview=options.previewContainer;if(!document||!preview)throw new Error('Preview navigation requires document and preview container.');
 let page=1,destroyed=false;
 function pages(){return preview.querySelectorAll?.('[data-page-number]')||[];}
 function show(n){const list=pages();page=Math.max(1,Math.min(n,list.length||1));for(const p of list)p.setAttribute('data-page-active',String(Number(p.getAttribute('data-page-number'))===page));return page;}
 const prev=document.createElement('button');prev.textContent='Previous page';prev.setAttribute('data-preview-action','previous');prev.addEventListener('click',()=>!destroyed&&show(page-1));
 const next=document.createElement('button');next.textContent='Next page';next.setAttribute('data-preview-action','next');next.addEventListener('click',()=>!destroyed&&show(page+1));
 const controls=document.createElement('nav');controls.setAttribute('data-preview-navigation','');controls.appendChild(prev);controls.appendChild(next);
 return Object.freeze({version:CV_EDITOR_PREVIEW_NAVIGATION_VERSION,controls,show,getCurrentPage:()=>page,destroy(){destroyed=true;}});
}