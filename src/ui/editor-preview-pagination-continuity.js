export const EDITOR_PREVIEW_PAGINATION_CONTINUITY_VERSION='1.0.0';
export function validateFragmentContinuity(fragmentPages=[]){
 const seen=new Map(); const issues=[];
 (Array.isArray(fragmentPages)?fragmentPages:[]).forEach((page,pageIndex)=>(page.fragments||[]).forEach(fragment=>{
   const previous=seen.get(fragment.blockId);
   if(previous && fragment.part!==previous.part+1) issues.push({blockId:fragment.blockId,message:'Fragment parts are not sequential.',page:pageIndex+1});
   seen.set(fragment.blockId,fragment);
 }));
 return Object.freeze({valid:issues.length===0,issues});
}
