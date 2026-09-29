export const EDITOR_PAGE_NAVIGATOR_VERSION='1.0.0';
export function createEditorPageNavigator(state,onChange=()=>{}){
 if(!state)throw new Error('Pagination state is required.');
 const emit=page=>{const next={...state,currentPage:page};onChange(next);return next;};
 return Object.freeze({
  next(){return emit(Math.min(state.currentPage+1,state.pageCount));},
  previous(){return emit(Math.max(state.currentPage-1,state.pageCount?1:0));},
  goTo(page){return emit(Math.min(Math.max(Number(page)||1,1),state.pageCount));}
 });
}
