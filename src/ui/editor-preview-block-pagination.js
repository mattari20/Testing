import {createSemanticLayoutBlocks} from './editor-preview-semantic-blocks.js';
import {paginateBlocks,createLayoutResult} from '../layout/layout-pagination-engine.js';
export const EDITOR_PREVIEW_BLOCK_PAGINATION_VERSION='1.0.0';

export function paginateRenderedBlocks(blocks,pageModel={}){
 const semantic=createSemanticLayoutBlocks(blocks);
 const pagination=paginateBlocks(semantic,pageModel);
 const assignments=pagination.pages.map(page=>({...page,blocks:page.blocks.map(ref=>({...ref}))}));
 return createLayoutResult({...pagination,pages:assignments},{source:'rendered-content-blocks',blockCount:semantic.length});
}
