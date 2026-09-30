export const EDITOR_PREVIEW_KEEP_WITH_NEXT_VERSION='1.0.0';

export function enforceKeepWithNext(pages=[]){
  const result=(Array.isArray(pages)?pages:[]).map(p=>({...p,fragments:[...(p.fragments||[])]}));
  const moves=[];
  for(let i=0;i<result.length-1;i++){
    const current=result[i], next=result[i+1], tail=current.fragments[current.fragments.length-1];
    if(tail?.keepWithNext && next.fragments.length){
      current.fragments.pop(); next.fragments.unshift(tail);
      moves.push({blockId:tail.blockId,from:i+1,to:i+2});
    }
  }
  return Object.freeze({pages:result,moves});
}