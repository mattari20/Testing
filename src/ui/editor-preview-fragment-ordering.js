export const EDITOR_PREVIEW_FRAGMENT_ORDERING_VERSION='1.0.0';

export function orderFragmentPages(fragmentPages=[]){
  return (Array.isArray(fragmentPages)?fragmentPages:[]).map((page,index)=>({
    ...page,
    pageNumber:index+1,
    fragments:[...(page.fragments||[])].sort((a,b)=>{
      const ao=Number.isFinite(a.order)?a.order:0, bo=Number.isFinite(b.order)?b.order:0;
      return ao-bo;
    })
  }));
}

export function validateFragmentGeometry(fragmentPages=[]){
  const issues=[];
  for(const [pi,page] of (Array.isArray(fragmentPages)?fragmentPages:[]).entries()){
    let lastBottom=-Infinity;
    for(const fragment of page.fragments||[]){
      const g=fragment.geometry||{};
      const top=Number(g.top)||0, height=Math.max(0,Number(g.height)||0), bottom=Number.isFinite(g.bottom)?g.bottom:top+height;
      if(top<lastBottom-0.5) issues.push({page:pi+1,blockId:fragment.blockId,message:'Fragment geometry overlaps previous fragment.'});
      if(height<0||bottom<top) issues.push({page:pi+1,blockId:fragment.blockId,message:'Invalid fragment geometry.'});
      lastBottom=Math.max(lastBottom,bottom);
    }
  }
  return Object.freeze({valid:issues.length===0,issues});
}