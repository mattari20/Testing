export const EDITOR_PREVIEW_PAGE_DOM_VERSION='1.0.0';

export function createPreviewPageElement(documentRef,page,index){
  if(!documentRef?.createElement) throw new Error('A browser document is required.');
  const el=documentRef.createElement('div');
  el.dataset.v2PreviewPage='true';
  el.dataset.v2PageNumber=String(index+1);
  el.dataset.v2PageId=String(page?.id ?? index+1);
  el.className='v2-preview-page';
  return el;
}

export function mountPreviewPages(root,pages,currentPage=1){
  if(!root) throw new Error('Preview root is required.');
  const documentRef=root.ownerDocument;
  root.replaceChildren();
  const list=Array.isArray(pages)?pages:[];
  const elements=list.map((page,index)=>{
    const el=createPreviewPageElement(documentRef,page,index);
    el.hidden=index+1!==currentPage;
    root.appendChild(el);
    return el;
  });
  return Object.freeze({version:EDITOR_PREVIEW_PAGE_DOM_VERSION,pageCount:elements.length,currentPage:list.length?Math.min(Math.max(Number(currentPage)||1,1),list.length):0,elements});
}
