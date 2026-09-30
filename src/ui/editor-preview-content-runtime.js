import {mountPreviewPages} from './editor-preview-page-dom.js';
import {mountPreviewPageContent} from './editor-preview-page-content.js';
import {sliceRenderedContent} from './editor-preview-content-slicer.js';
export const EDITOR_PREVIEW_CONTENT_RUNTIME_VERSION='1.0.0';
export function renderPreviewContent(root,layoutResult,contentHtml,currentPage=1){
  if(!root)throw new Error('Preview root is required.');
  const pages=Array.isArray(layoutResult?.pages)?layoutResult.pages:[];
  const descriptors=sliceRenderedContent(contentHtml,pages);
  const mounted=mountPreviewPages(root,pages,currentPage);
  mounted.elements.forEach((pageElement,index)=>mountPreviewPageContent(pageElement,descriptors[index]?.contentHtml||''));
  return Object.freeze({version:EDITOR_PREVIEW_CONTENT_RUNTIME_VERSION,...mounted});
}
