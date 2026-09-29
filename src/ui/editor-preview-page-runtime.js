import {mountPreviewPages} from './editor-preview-page-dom.js';
export const EDITOR_PREVIEW_PAGE_RUNTIME_VERSION='1.0.0';

export function renderPaginatedPreview(root,layoutResult,currentPage=1){
  if(!root) throw new Error('Preview root is required.');
  const pages=Array.isArray(layoutResult?.pages)?layoutResult.pages:[];
  return mountPreviewPages(root,pages,currentPage);
}
