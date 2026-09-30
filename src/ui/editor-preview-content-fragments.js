export const EDITOR_PREVIEW_CONTENT_FRAGMENTS_VERSION='1.0.0';

export function createContentFragments(blocks=[],assignments=[]){
 const byId=new Map((Array.isArray(blocks)?blocks:[]).map(block=>[block.id,block]));
 return (Array.isArray(assignments)?assignments:[]).map((page,index)=>({
   pageId:page.id??index+1,
   fragments:page.blocks.map(ref=>{
     const source=byId.get(ref.id);
     return Object.freeze({blockId:ref.id,element:source?.element||null,part:ref.part||1,state:ref.state,height:ref.height});
   })
 }));
}
