import { createEditorCommand } from '../application/editor-command-contract.js';

export const SECTION_EDITOR_VERSION = '1.2.0';

const dispatch = (surface, type, target = {}, payload = {}) =>
  surface.dispatch(createEditorCommand({ type, target, payload }));

export function addSectionThroughEditor(surface, input = {}) {
  return dispatch(surface, 'add-section', {}, { title: 'New Section', type: 'custom', ...input });
}
export function removeSectionThroughEditor(surface, sectionId) {
  return dispatch(surface, 'remove-section', { sectionId });
}
export function setSectionTitleThroughEditor(surface, sectionId, title) {
  return dispatch(surface, 'set-section-title', { sectionId }, { title });
}
export function addFieldThroughEditor(surface, sectionId, input = {}) {
  return dispatch(surface, 'add-field', { sectionId }, { type: 'text', label: 'New Field', value: '', ...input });
}
export function removeFieldThroughEditor(surface, sectionId, fieldId) {
  return dispatch(surface, 'remove-field', { sectionId, fieldId });
}
export function setFieldDefinitionThroughEditor(surface, sectionId, fieldId, patch = {}) {
  return dispatch(surface, 'set-field-definition', { sectionId, fieldId }, patch);
}
export function addEntryThroughEditor(surface, sectionId, values = {}) {
  return dispatch(surface, 'add-entry', { sectionId }, { values, visibility:true });
}
export function updateEntryThroughEditor(surface, sectionId, entryId, values = {}) {
  return dispatch(surface, 'update-entry', { sectionId, entryId }, { values });
}
export function removeEntryThroughEditor(surface, sectionId, entryId) {
  return dispatch(surface, 'remove-entry', { sectionId, entryId });
}
export function duplicateEntryThroughEditor(surface, sectionId, entryId) {
  return dispatch(surface, 'duplicate-entry', { sectionId, entryId });
}
export function setSectionVisibilityThroughEditor(surface, sectionId, visible) {
  return dispatch(surface, 'set-visibility', {kind:'section',sectionId}, {visible});
}
export function setFieldVisibilityThroughEditor(surface, sectionId, fieldId, visible) {
  return dispatch(surface, 'set-visibility', {kind:'field',sectionId,fieldId}, {visible});
}
export function reorderSectionThroughEditor(surface, order) {
  return dispatch(surface, 'reorder', {kind:'section'}, {order});
}
export function reorderFieldsThroughEditor(surface, sectionId, order) {
  return dispatch(surface, 'reorder', {kind:'field',sectionId}, {order});
}
export function reorderEntriesThroughEditor(surface, sectionId, order) {
  return dispatch(surface, 'reorder', {kind:'entry',sectionId}, {order});
}
