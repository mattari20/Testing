import { measureAndPaginatePreview } from './editor-preview-layout-controller.js';
import { createPaginatedPreview } from './editor-paginated-preview.js';
export const EDITOR_PREVIEW_LAYOUT_RUNTIME_VERSION='1.0.0';
export function createEditorPreviewLayoutRuntime(root,options={}) {
  if(!root) throw new Error('Preview root is required.');
  const layoutResult=measureAndPaginatePreview(root,options);
  const paginatedPreview=createPaginatedPreview(layoutResult,{page:options.page});
  return Object.freeze({version:EDITOR_PREVIEW_LAYOUT_RUNTIME_VERSION,layoutResult,paginatedPreview});
}
