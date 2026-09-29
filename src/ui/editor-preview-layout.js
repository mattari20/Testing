import { createBrowserLayoutMeasurer } from './browser-layout-measurer.js';
import { createLayoutBlock, paginateBlocks, createLayoutResult } from '../layout/layout-pagination-engine.js';
export const EDITOR_PREVIEW_LAYOUT_VERSION='1.0.0';
export function buildPreviewLayout(root,options={}){if(!root)throw new Error('Preview root is required.');const measurer=createBrowserLayoutMeasurer(root.ownerDocument);const blocks=measurer.measureBlocks(root,options.blockSelector||'[data-v2-layout-block]');const normalized=blocks.map((b,i)=>createLayoutBlock({id:b.id||String(i),kind:'custom',measuredHeight:b.measuredHeight,splittable:false}));const pagination=paginateBlocks(normalized,options.pageModel||{});return createLayoutResult(pagination,{source:'browser-measurement'});}
