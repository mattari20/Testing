export const EDITOR_PREVIEW_ORPHAN_WIDOW_VERSION='1.0.0';

export function protectOrphansAndWidows(pages=[],options={}){
  const minHeadingFollowing=Math.max(1,Number(options.minHeadingFollowing)||1);
  const minEntryParts=Math.max(1,Number(options.minEntryParts)||1);
  const result=(Array.isArray(pages)?pages:[]).map(p=>({...p,fragments:[...(p.fragments||[])]}));
  const moves=[];
  for(let i=0;i<result.length;i++){
    const fs=result[i].fragments;
    const heading=fs[fs.length-1];
    if(heading?.kind==='section-heading' && (result[i+1]?.fragments?.length||0)<minHeadingFollowing && result[i+1]){
      result[i+1].fragments.unshift(fs.pop()); moves.push({blockId:heading.blockId,from:i+1,to:i+2,reason:'heading-orphan-protection'});
    }
    const tail=fs[fs.length-1];
    if(tail?.kind==='experience-entry' && tail.part>0 && tail.part<minEntryParts && result[i+1]){
      result[i+1].fragments.unshift(fs.pop()); moves.push({blockId:tail.blockId,from:i+1,to:i+2,reason:'entry-widow-protection'});
    }
  }
  return Object.freeze({pages:result,moves});
}