import { createCVEditorSurface } from './cv-editor-surface.js';
import { createCVEditorFormModel } from './cv-editor-form.js';
import { createCVEditorPreviewPipeline } from './cv-editor-preview-pipeline.js';
import { createCVEditorTemplateController } from './cv-editor-template-controller.js';
export const CV_EDITOR_BROWSER_ADAPTER_VERSION='1.0.0';
export function createCVEditorBrowserAdapter(options={}) {
 const runtime=options.runtime;if(!runtime)throw new Error('Browser adapter requires runtime.');
 const surface=createCVEditorSurface({runtime});
 const form=createCVEditorFormModel({runtime});
 const preview=options.templateProvider?createCVEditorPreviewPipeline({runtime,templateProvider:options.templateProvider}):null;
 const templates=options.registry?createCVEditorTemplateController({runtime,registry:options.registry}):null;
 let destroyed=false;
 return Object.freeze({
  version:CV_EDITOR_BROWSER_ADAPTER_VERSION,
  getState(){if(destroyed)return null;return Object.freeze({version:CV_EDITOR_BROWSER_ADAPTER_VERSION,editor:surface.getState(),form:form.getState(),template:templates?.getState()||null});},
  edit(blockId,patch){if(destroyed)return null;return form.edit(blockId,patch);},
  undo(){return destroyed?null:surface.undo();},
  redo(){return destroyed?null:surface.redo();},
  selectTemplate(id){return destroyed||!templates?null:templates.select(id);},
  renderPreview(){return destroyed||!preview?null:preview.render();},
  destroy(){if(destroyed)return;destroyed=true;surface.destroy();form.destroy();preview?.destroy();templates?.destroy();}
 });
}