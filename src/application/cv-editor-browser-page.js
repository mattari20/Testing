import {createCVEditorDOMShell} from './cv-editor-dom-shell.js';
import {createCVEditorFormDOMRenderer} from './cv-editor-form-dom-renderer.js';
import {createCVEditorPreviewDOMRenderer} from './cv-editor-preview-dom-renderer.js';
import {createCVEditorToolbarController} from './cv-editor-toolbar-controller.js';
import {createCVEditorInteractionController} from './cv-editor-interaction-controller.js';
import {createCVEditorSectionControls} from './cv-editor-section-controls.js';
import {createCVEditorPreviewNavigation} from './cv-editor-preview-navigation.js';
import {createCVEditorTemplateDOMControl} from './cv-editor-template-dom-control.js';
import {createCVEditorProductSurface} from './cv-editor-product-surface.js';
export const CV_EDITOR_BROWSER_PAGE_VERSION='1.1.0';
export function createCVEditorBrowserPage(options={}) {
 const document=options.document,adapter=options.adapter;if(!document||!adapter)throw new Error('Browser page requires document and adapter.');
 const shell=createCVEditorDOMShell({document,root:options.root,title:options.title});
 const product=createCVEditorProductSurface({document,root:shell.root,label:options.title||'CV Builder editor'});
 const formRenderer=createCVEditorFormDOMRenderer({document});const previewRenderer=createCVEditorPreviewDOMRenderer({document});
 let destroyed=false;
 function render(){
  if(destroyed)return null;const state=adapter.getState();if(!state)return null;
  formRenderer.render(shell.form,state.form);
  if(adapter.renderPreview){try{previewRenderer.render(shell.preview,adapter.renderPreview());}catch(error){shell.setStatus(error.message,'error');return state;}}
  shell.setStatus('Ready','success');return state;
 }
 function onFormChange(event){if(destroyed)return;const target=event.target;if(!target?.getAttribute)return;const id=target.getAttribute('data-block-id');if(!id)return;adapter.edit(id,{value:target.value});render();}
 const toolbar=createCVEditorToolbarController({document,adapter,shell,onChange:render});
 const interaction=createCVEditorInteractionController({document,adapter,page:{shell,render}});
 const sectionControls=createCVEditorSectionControls({document,adapter,page:{shell,render}});
 const previewNavigation=createCVEditorPreviewNavigation({document,previewContainer:shell.preview});
 shell.toolbar.appendChild(previewNavigation.controls);
 const templateControl=createCVEditorTemplateDOMControl({document,adapter,page:{shell,render}});
 shell.form.addEventListener?.('change',onFormChange);
 function mount(){if(options.mount&&shell.root!==options.mount&&shell.root.parentNode!==options.mount)options.mount.appendChild(shell.root);return render();}
 function destroy(){if(destroyed)return;destroyed=true;toolbar.destroy();interaction.destroy();sectionControls.destroy();previewNavigation.destroy();templateControl.destroy();formRenderer.destroy();previewRenderer.destroy();product.destroy();adapter.destroy?.();}
 return Object.freeze({version:CV_EDITOR_BROWSER_PAGE_VERSION,shell,product,mount,render,destroy});
}