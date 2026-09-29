import { createEditorCommand } from '../application/editor-command-contract.js';

export const SECTION_EDITOR_VERSION = '1.0.0';

export function addEntryThroughEditor(surface, sectionId, values = {}) {
  return surface.dispatch(createEditorCommand({
    type:'add-entry',
    target:{sectionId},
    payload:{values,visibility:true}
  }));
}

export function setSectionVisibilityThroughEditor(surface, sectionId, visible) {
  return surface.dispatch(createEditorCommand({
    type:'set-visibility',
    target:{kind:'section',sectionId},
    payload:{visible}
  }));
}

export function setFieldVisibilityThroughEditor(surface, sectionId, fieldId, visible) {
  return surface.dispatch(createEditorCommand({
    type:'set-visibility',
    target:{kind:'field',sectionId,fieldId},
    payload:{visible}
  }));
}
