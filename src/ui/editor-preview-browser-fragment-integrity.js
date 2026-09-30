export const EDITOR_PREVIEW_BROWSER_FRAGMENT_INTEGRITY_VERSION='1.0.0';

export function validateBrowserFragmentPages(probe={},pageModel={}){
 const issues=[];
 const width=Number(pageModel.width)||0;
 const height=Number(pageModel.height)||0;
 for(const page of probe.pages||[]){
  if(width && Math.abs(page.width-width)>2) issues.push({page:page.page,message:'Browser page width differs from expected width.'});
  if(height && page.height>height+2) issues.push({page:page.page,message:'Browser page exceeds expected height.'});
  if(page.scrollHeight>page.height+2) issues.push({page:page.page,message:'Browser page has uncontrolled overflow.'});
  if(page.fragmentCount===0) issues.push({page:page.page,message:'Browser page contains no distributed fragments.'});
 }
 return Object.freeze({valid:issues.length===0,issues});
}