import { listSelectableTemplates } from '../templates/template-selection-controller.js';
import { switchTemplateAndPreview } from './template-preview-controller.js';

export const EDITOR_TEMPLATE_CONTROLLER_VERSION = '1.0.0';

export function createEditorTemplateController(surface, options = {}) {
  const templates = listSelectableTemplates(options);
  return Object.freeze({
    list: () => templates,
    select(templateId) {
      return switchTemplateAndPreview(surface, templateId, { ...options, templates: options.templates });
    }
  });
}
