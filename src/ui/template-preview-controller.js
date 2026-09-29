import { createEditorCommand } from '../application/editor-command-contract.js';
import { createEditorPreview } from '../application/editor-preview-controller.js';

export const TEMPLATE_PREVIEW_CONTROLLER_VERSION = '1.0.0';

export function switchTemplateAndPreview(surface, templateId, options = {}) {
  surface.dispatch(createEditorCommand({
    type:'set-template',
    payload:{templateId,version:options.templateVersion || null}
  }));
  return createEditorPreview(surface.getState().session,{
    templateId,
    templates:options.templates
  });
}
