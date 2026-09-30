export const EDITOR_PREVIEW_FRAGMENT_VALIDATION_VERSION='1.0.0';

export function validateFragmentSlices(fragmentPages=[]){
  const issues=[];
  for(const page of Array.isArray(fragmentPages)?fragmentPages:[]){
    for(const f of page.fragments||[]){
      const g=f.geometry||{}, h=Number(g.height), sh=Number(g.sourceHeight);
      if(!Number.isFinite(h)||h<0) issues.push({blockId:f.blockId,message:'Fragment height is invalid.'});
      if(Number.isFinite(sh)&&h>sh+0.5) issues.push({blockId:f.blockId,message:'Fragment exceeds source height.'});
      if(f.state==='split' && !Number.isFinite(Number(f.offset))) issues.push({blockId:f.blockId,message:'Split fragment is missing offset.'});
    }
  }
  return Object.freeze({valid:issues.length===0,issues});
}