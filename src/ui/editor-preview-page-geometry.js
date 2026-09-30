export const EDITOR_PREVIEW_PAGE_GEOMETRY_VERSION='1.0.0';

export function measurePreviewPages(pageElements=[]){
 return (Array.isArray(pageElements)?pageElements:[]).map((element,index)=>{
  const rect=element?.getBoundingClientRect?.()||{width:0,height:0,top:0,left:0};
  return Object.freeze({page:index+1,width:Math.max(0,rect.width),height:Math.max(0,rect.height),top:rect.top||0,left:rect.left||0,scrollHeight:Math.max(0,element?.scrollHeight||0),scrollWidth:Math.max(0,element?.scrollWidth||0)});
 });
}