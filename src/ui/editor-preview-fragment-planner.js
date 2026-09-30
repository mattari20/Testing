import {createFragmentGeometry} from './editor-preview-fragment-geometry.js';
export const EDITOR_PREVIEW_FRAGMENT_PLANNER_VERSION='1.1.0';

export function planRenderedFragments(blocks=[],pages=[]){
 const byId=new Map((Array.isArray(blocks)?blocks:[]).map(b=>[b.id,b]));
 return (Array.isArray(pages)?pages:[]).map((page,index)=>({
   pageId:page.id??page.number??index+1,
   fragments:(page.blocks||[]).map(ref=>{
     const source=byId.get(ref.id);
     const offset=Number(ref.offset)||0;
     return Object.freeze({
       blockId:ref.id,
       element:source?.element||null,
       part:ref.part||1,
       state:ref.state||'fit',
       order:Number.isFinite(source?.order)?source.order:0,
       kind:source?.kind||'custom',
       keepWithNext:source?.keepWithNext===true,
       keepTogether:source?.keepTogether!==false,
       geometry:createFragmentGeometry({...ref,offset})
     });
   })
 }));
}