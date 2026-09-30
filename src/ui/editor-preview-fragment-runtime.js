import {mountPreviewPages} from './editor-preview-page-dom.js';
import {extractRenderedContentBlocks} from './editor-preview-content-blocks.js';
import {paginateRenderedBlocks} from './editor-preview-block-pagination.js';
import {planRenderedFragments} from './editor-preview-fragment-planner.js';
import {distributeFragments} from './editor-preview-fragment-distributor.js';
import {validateFragmentContinuity} from './editor-preview-pagination-continuity.js';
import {applyFragmentQualityRules} from './editor-preview-fragment-quality-runtime.js';
export const EDITOR_PREVIEW_FRAGMENT_RUNTIME_VERSION='1.1.0';

export function renderFragmentedPreview(root,renderedRoot,pageModel={},currentPage=1){
 if(!root||!renderedRoot) throw new Error('Preview roots are required.');
 const blocks=extractRenderedContentBlocks(renderedRoot);
 const layoutResult=paginateRenderedBlocks(blocks,pageModel);
 const mounted=mountPreviewPages(root,layoutResult.pages,currentPage);
 const planned=planRenderedFragments(blocks,layoutResult.pages);
 const quality=applyFragmentQualityRules(planned,blocks);
 const distribution=distributeFragments(mounted.elements,quality.pages);
 const continuity=validateFragmentContinuity(quality.pages);
 return Object.freeze({version:EDITOR_PREVIEW_FRAGMENT_RUNTIME_VERSION,layoutResult,mounted,fragments:quality.pages,distribution,continuity,quality});
}