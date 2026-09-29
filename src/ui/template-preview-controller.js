import { createEditorCommand } from '../application/editor-command-contract.js';
import { createEditorPreview } from '../application/editor-preview-controller.js';
export const TEMPLATE_PREVIEW_CONTROLLER_VERSION = '1.1.0';
export function switchTemplate(surface,templateId,options={}) { return surface.dispatch(createEditorCommand({type:'set-template',payload:{templateId,version:options.templateVersion||null}})); }
export function switchTemplateAndPreview(surface,templateId,options={}) { switchTemplate(surface,templateId,options); return createEditorPreview(surface.getState().session,{templateId,templates:options.templates}); }
