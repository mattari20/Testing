import {mountPreviewPages} from './editor-preview-page-dom.js';
import {extractRenderedContentBlocks} from './editor-preview-content-blocks.js';
import {paginateRenderedBlocks} from './editor-preview-block-pagination.js';
import {createContentFragments} from './editor-preview-content-fragments.js';
import {distributeRenderedBlocks} from './editor-preview-content-distributor.js';
export const EDITOR_PREVIEW_CONTENT_RUNTIME_V2_VERSION='1.0.0';

export function renderDistributedPreview(root,renderedRoot,pageModel={},currentPage=1){
 if(!root||!renderedRoot) throw new Error('Preview roots are required.');
 const blocks=extractRenderedContentBlocks(renderedRoot);
 const layoutResult=paginateRenderedBlocks(blocks,pageModel);
 const mounted=mountPreviewPages(root,layoutResult.pages,currentPage);
 const fragments=createContentFragments(blocks,layoutResult.pages);
 const distribution=distributeRenderedBlocks(mounted.elements,fragments);
 return Object.freeze({version:EDITOR_PREVIEW_CONTENT_RUNTIME_V2_VERSION,layoutResult,mounted,fragments,distribution});
}
