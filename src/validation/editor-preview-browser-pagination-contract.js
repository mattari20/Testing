export const EDITOR_PREVIEW_BROWSER_PAGINATION_CONTRACT_VERSION='1.0.0';
export function validateBrowserPaginationGeometry(geometry=[],pageModel={}){
 const issues=[];
 const expectedWidth=Number(pageModel.width)||0, expectedHeight=Number(pageModel.height)||0;
 for(const page of Array.isArray(geometry)?geometry:[]){
  if(expectedWidth && Math.abs(page.width-expectedWidth)>2) issues.push({page:page.page,message:'Page width differs from model.'});
  if(expectedHeight && page.height>expectedHeight+2) issues.push({page:page.page,message:'Page exceeds model height.'});
  if(page.scrollHeight>page.height+2) issues.push({page:page.page,message:'Page has uncontrolled vertical overflow.'});
 }
 return Object.freeze({valid:issues.length===0,issues});
}