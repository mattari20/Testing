export const EDITOR_PREVIEW_PAGE_CONTROLLER_VERSION='1.1.0';

export function createEditorPreviewPageController(layoutResult,onChange=()=>{}){
  if(!layoutResult) throw new Error('Layout result is required.');
  let pages=Array.isArray(layoutResult.pages)?layoutResult.pages:[];
  let currentPage=pages.length?1:0;
  const emit=()=>{const state=Object.freeze({pageCount:pages.length,currentPage,pages});onChange(state);return state;};
  return Object.freeze({
    getState:()=>Object.freeze({pageCount:pages.length,currentPage,pages}),
    next(){currentPage=pages.length?Math.min(currentPage+1,pages.length):0;return emit();},
    previous(){currentPage=pages.length?Math.max(currentPage-1,1):0;return emit();},
    goTo(page){currentPage=pages.length?Math.min(Math.max(Number(page)||1,1),pages.length):0;return emit();},
    setPages(nextPages){pages=Array.isArray(nextPages)?nextPages:[];currentPage=pages.length?Math.min(Math.max(currentPage,1),pages.length):0;return emit();}
  });
}
