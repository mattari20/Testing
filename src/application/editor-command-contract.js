export const EDITOR_COMMAND_VERSION = '1.0.0';

export const COMMAND_TYPE = Object.freeze({
  SET_FIELD: 'set-field',
  SET_VISIBILITY: 'set-visibility',
  ADD_ENTRY: 'add-entry',
  UPDATE_ENTRY: 'update-entry',
  REMOVE_ENTRY: 'remove-entry',
  REORDER: 'reorder',
  SET_TEMPLATE: 'set-template',
  SET_VARIANT: 'set-variant',
  UPLOAD_ASSET: 'upload-asset',
  REMOVE_ASSET: 'remove-asset',
  UNDO: 'undo',
  REDO: 'redo'
});

export function createEditorCommand(input = {}) {
  if (!Object.values(COMMAND_TYPE).includes(input.type)) throw new Error('Unsupported editor command.');
  return Object.freeze({
    version: EDITOR_COMMAND_VERSION,
    type: input.type,
    target: input.target || null,
    payload: input.payload ?? null,
    mutatesData: !['undo','redo'].includes(input.type),
    createdAt: input.createdAt || new Date().toISOString()
  });
}

export function validateEditorCommand(command) {
  const errors = [];
  if (!command?.type || !Object.values(COMMAND_TYPE).includes(command.type)) errors.push('COMMAND_TYPE_REQUIRED');
  if (!command?.version) errors.push('COMMAND_VERSION_REQUIRED');
  return { valid: errors.length === 0, errors };
}
