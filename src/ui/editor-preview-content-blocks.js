export const EDITOR_PREVIEW_CONTENT_BLOCKS_VERSION='1.1.0';

export function extractRenderedContentBlocks(root,selector='[data-v2-layout-block]'){
  if(!root) throw new Error('Preview root is required.');
  const nodes=[...root.querySelectorAll(selector)];
  return nodes.map((element,index)=>{
    const rect=element.getBoundingClientRect();
    const declaredSplits=(element.getAttribute('data-v2-split-at')||'').split(',').map(Number).filter(Number.isFinite).filter(v=>v>0);
    return Object.freeze({
      id:element.getAttribute('data-v2-layout-block')||`block-${index+1}`,
      element,
      order:index,
      top:rect.top,
      left:rect.left,
      width:rect.width,
      height:rect.height,
      measuredHeight:Math.max(0,rect.height),
      kind:element.getAttribute('data-v2-block-kind')||'custom',
      splittable:element.getAttribute('data-v2-splittable')==='true',
      splitAt:declaredSplits,
      keepTogether:element.getAttribute('data-v2-keep-together')!=='false',
      keepWithNext:element.getAttribute('data-v2-keep-with-next')==='true'
    });
  });
}
