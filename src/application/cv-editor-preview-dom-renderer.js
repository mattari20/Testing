export const CV_EDITOR_PREVIEW_DOM_RENDERER_VERSION='1.0.0';
const make=(doc,tag,attrs={},text)=>{const n=doc.createElement(tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(text!=null)n.textContent=String(text);return n;};
export function createCVEditorPreviewDOMRenderer(options={}) {
 const document=options.document;if(!document)throw new Error('Preview renderer requires document.');let destroyed=false;
 function render(container,result){if(destroyed)return null;if(!container||!result)throw new Error('Preview renderer requires container and result.');while(container.firstChild)container.removeChild(container.firstChild);
  const root=make(document,'div',{'data-preview-root':'v2'});const pages=result.pages||result.layout?.pages||[];const count=pages.length||result.pageCount||0;
  for(let i=0;i<count;i++){const page=pages[i]||{};const p=make(document,'article',{'data-page-index':i+1,'data-page-number':i+1});const blocks=page.blocks||page.content||[];for(const block of blocks){const b=make(document,'div',{'data-preview-block-id':block.id||block.blockId||''},block.text||block.content||block.value||'');p.appendChild(b);}root.appendChild(p);}
  container.appendChild(root);return {pageCount:count,overflow:Boolean(result.hasOverflow||result.overflow)};
 }
 return Object.freeze({version:CV_EDITOR_PREVIEW_DOM_RENDERER_VERSION,render,destroy(){destroyed=true;}});
}