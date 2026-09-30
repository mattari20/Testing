import { measureAndPaginatePreview } from './editor-preview-layout-controller.js';
import { createPaginatedPreview } from './editor-paginated-preview.js';
import { renderBrowserFragmentedPreview } from './editor-preview-fragment-browser-adapter.js';
export const EDITOR_PREVIEW_LAYOUT_RUNTIME_VERSION='1.1.0';
export function createEditorPreviewLayoutRuntime(root,options={}){
 if(!root) throw new Error('Preview root is required.');
 const layoutResult=measureAndPaginatePreview(root,options);
 const paginatedPreview=createPaginatedPreview(layoutResult,{page:options.page});
 let fragmented=null;
 if(options.fragmented===true && options.renderedRoot){
  fragmented=renderBrowserFragmentedPreview(root,options.renderedRoot,options.pageModel||layoutResult.pageModel||{},options.page);
 }
 return Object.freeze({version:EDITOR_PREVIEW_LAYOUT_RUNTIME_VERSION,layoutResult,paginatedPreview,fragmented});
}
