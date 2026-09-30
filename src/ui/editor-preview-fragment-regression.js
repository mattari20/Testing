export const EDITOR_PREVIEW_FRAGMENT_REGRESSION_VERSION='1.0.0';

export function compareFragmentSequences(before=[],after=[]){
 const flatten=pages=>pages.flatMap(page=>(page.fragments||[]).map(f=>`${page.pageId}:${f.blockId}:${f.part}`));
 const a=flatten(Array.isArray(before)?before:[]), b=flatten(Array.isArray(after)?after:[]);
 return Object.freeze({same:a.join('|')===b.join('|'),before:a,after:b});
}

export function validateNoSilentFragmentLoss(before=[],after=[]){
 const count=pages=>pages.reduce((n,p)=>n+(p.fragments||[]).length,0);
 return Object.freeze({valid:count(after)>=count(before),beforeCount:count(before),afterCount:count(after)});
}