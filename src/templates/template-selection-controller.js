import { getTemplateLibraryEntry, listTemplateLibraryEntries } from './template-library.js';
import { createEditorCommand, COMMAND_TYPE } from '../application/editor-command-contract.js';

export const TEMPLATE_SELECTION_VERSION = '1.0.0';

export function listSelectableTemplates(options={}) {
  return listTemplateLibraryEntries(undefined,options).filter(t=>t.onboardingStatus==='ready');
}
export function createTemplateSelection(templateId, options={}) {
  const entry=getTemplateLibraryEntry(templateId,options.templates);
  if(!entry) throw new Error('Template not found: '+templateId);
  if(entry.onboardingStatus!=='ready') throw new Error('Template is not ready: '+templateId);
  return Object.freeze({templateId:entry.id,templateVersion:entry.version,name:entry.name,command:createEditorCommand({type:COMMAND_TYPE.SET_TEMPLATE,payload:{templateId:entry.id,version:entry.version}})});
}
