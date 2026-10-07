export const EDITOR_COMMAND_VERSION = '1.4.0';

export const COMMAND_TYPE = Object.freeze({
  SET_FIELD:'set-field', SET_IDENTITY:'set-identity', SET_VISIBILITY:'set-visibility',
  ADD_SECTION:'add-section', REMOVE_SECTION:'remove-section', SET_SECTION_TITLE:'set-section-title',
  ADD_FIELD:'add-field', REMOVE_FIELD:'remove-field', SET_FIELD_DEFINITION:'set-field-definition', ADD_IDENTITY_FIELD:'add-identity-field', REMOVE_IDENTITY_FIELD:'remove-identity-field',
  ADD_ENTRY:'add-entry', UPDATE_ENTRY:'update-entry', REMOVE_ENTRY:'remove-entry', DUPLICATE_ENTRY:'duplicate-entry',
  REORDER:'reorder', SET_TEMPLATE:'set-template', SET_VARIANT:'set-variant',
  SET_THEME_COLOR:'set-theme-color', SET_ENTRY_SORT:'set-entry-sort', SET_LIST_STYLE:'set-list-style', SET_RATING_STYLE:'set-rating-style', SET_ITEM_RATING:'set-item-rating', SET_SECTION_PLACEMENT:'set-section-placement', UPLOAD_ASSET:'upload-asset', REMOVE_ASSET:'remove-asset',
  UNDO:'undo', REDO:'redo'
});

export function createEditorCommand(input={}){
  if(!Object.values(COMMAND_TYPE).includes(input.type))throw new Error('Unsupported editor command.');
  return Object.freeze({version:EDITOR_COMMAND_VERSION,type:input.type,target:input.target||null,payload:input.payload??null,mutatesData:!['undo','redo'].includes(input.type),createdAt:input.createdAt||new Date().toISOString()});
}
export function validateEditorCommand(command){
  const errors=[];
  if(!command?.type||!Object.values(COMMAND_TYPE).includes(command.type))errors.push('COMMAND_TYPE_REQUIRED');
  if(!command?.version)errors.push('COMMAND_VERSION_REQUIRED');
  return {valid:errors.length===0,errors};
}
