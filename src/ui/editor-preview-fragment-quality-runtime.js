import {orderFragmentPages,validateFragmentGeometry} from './editor-preview-fragment-ordering.js';
import {markRepeatedHeaderFragments} from './editor-preview-repeated-headers.js';
import {applyExplicitPageBreaks} from './editor-preview-page-breaks.js';
import {protectOrphansAndWidows} from './editor-preview-orphan-widow.js';
import {enforceKeepWithNext} from './editor-preview-keep-with-next.js';
import {validateFragmentSlices} from './editor-preview-fragment-validation.js';

export const EDITOR_PREVIEW_FRAGMENT_QUALITY_RUNTIME_VERSION='1.0.0';

export function applyFragmentQualityRules(fragmentPages=[],blocks=[]){
  let pages=orderFragmentPages(fragmentPages);
  pages=markRepeatedHeaderFragments(pages);
  pages=applyExplicitPageBreaks(pages,blocks);
  const orphan=protectOrphansAndWidows(pages);
  pages=orphan.pages;
  const keep=enforceKeepWithNext(pages);
  pages=keep.pages;
  return Object.freeze({
    version:EDITOR_PREVIEW_FRAGMENT_QUALITY_RUNTIME_VERSION,
    pages,
    moves:[...orphan.moves,...keep.moves],
    geometry:validateFragmentGeometry(pages),
    slices:validateFragmentSlices(pages)
  });
}