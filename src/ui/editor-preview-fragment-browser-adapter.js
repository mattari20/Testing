import {renderFragmentedPreview} from './editor-preview-fragment-runtime.js';
import {probeFragmentedPages} from './editor-preview-browser-fragment-probe.js';
import {validateBrowserFragmentPages} from './editor-preview-browser-fragment-integrity.js';
import {setPreviewPageVisibility} from './editor-preview-browser-fragment-navigation.js';
export const EDITOR_PREVIEW_FRAGMENT_BROWSER_ADAPTER_VERSION='1.0.0';
export function renderBrowserFragmentedPreview(root,renderedRoot,pageModel={},currentPage=1){
 const runtime=renderFragmentedPreview(root,renderedRoot,pageModel,currentPage);
 const probe=probeFragmentedPages(root.ownerDocument);
 const integrity=validateBrowserFragmentPages(probe,pageModel);
 const navigation=setPreviewPageVisibility([...root.querySelectorAll('[data-v2-preview-page]')],currentPage);
 return Object.freeze({version:EDITOR_PREVIEW_FRAGMENT_BROWSER_ADAPTER_VERSION,runtime,probe,integrity,navigation});
}
