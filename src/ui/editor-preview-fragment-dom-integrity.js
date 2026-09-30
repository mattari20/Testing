export const EDITOR_PREVIEW_FRAGMENT_DOM_INTEGRITY_VERSION='1.0.0';

export function validateDistributedFragments(pageElements=[]){
 const issues=[]; let count=0;
 (Array.isArray(pageElements)?pageElements:[]).forEach((page,index)=>{
  const nodes=page?.querySelectorAll?.('[data-v2-fragment-of]')||[];
  count+=nodes.length;
  nodes.forEach(node=>{
   if(!node.getAttribute('data-v2-fragment-of')) issues.push({page:index+1,message:'Distributed fragment has no source identity.'});
  });
 });
 return Object.freeze({valid:issues.length===0,fragmentCount:count,issues});
}