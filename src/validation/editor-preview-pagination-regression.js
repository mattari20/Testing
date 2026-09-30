export const EDITOR_PREVIEW_PAGINATION_REGRESSION_VERSION='1.0.0';

export function buildPaginationRegressionMatrix(){
  return Object.freeze([
    {id:'short-fit',expected:'single-page-fit'},
    {id:'long-split',expected:'multi-page-fragmentation'},
    {id:'manual-break',expected:'explicit-break'},
    {id:'keep-next',expected:'adjacent-heading-entry'},
    {id:'orphan-heading',expected:'heading-retained-with-content'},
    {id:'overflow',expected:'diagnostic-not-silent'}
  ]);
}

export function validateRegressionResult(matrix=[],result={}){
  const failures=[];
  for(const row of matrix) if(row.expected==='multi-page-fragmentation' && Number(result.pageCount||0)<2) failures.push(row.id);
  return Object.freeze({valid:failures.length===0,failures});
}