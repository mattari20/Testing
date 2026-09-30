import {
  addSection, removeSection, setSectionTitle, addField, removeField, setFieldDefinition, addEntry, duplicateEntry,
  setSectionOrder, setFieldOrder, setEntryOrder, configureTargetedCV, createDocumentSnapshot,
  setTargetedSectionVisibility, setTargetedFieldVisibility, setTargetedEntryVisibility
} from '../core/career-document-core.js';
import { COMMAND_TYPE } from './editor-command-contract.js';

export const EDITOR_EXECUTOR_VERSION = '1.2.0';

const findSection = (profile,id) => profile.careerData.sections.find(s=>s.id===id);
const touch = o => { o.revision += 1; o.updatedAt = new Date().toISOString(); };
const removeFromList = (list, id) => list.filter(value => value !== id);

function cleanupTargetedConfiguration(targetedCV, sectionId, fieldId = null) {
  const sid = String(sectionId);
  targetedCV.configuration.hiddenSections = removeFromList(targetedCV.configuration.hiddenSections || [], sid);
  targetedCV.configuration.sectionOrder = removeFromList(targetedCV.configuration.sectionOrder || [], sid);
  delete targetedCV.configuration.fieldOrder[sid];
  delete targetedCV.configuration.entryOrder[sid];
  targetedCV.configuration.hiddenFields = (targetedCV.configuration.hiddenFields || []).filter(key => !key.startsWith(sid + ':'));
  targetedCV.configuration.hiddenEntries = (targetedCV.configuration.hiddenEntries || []).filter(key => !key.startsWith(sid + ':'));
  if (fieldId != null) {
    const key = sid + ':' + String(fieldId);
    targetedCV.configuration.hiddenFields = removeFromList(targetedCV.configuration.hiddenFields, key);
    const order = targetedCV.configuration.fieldOrder[sid] || [];
    targetedCV.configuration.fieldOrder[sid] = removeFromList(order, String(fieldId));
  }
}

export function executeEditorCommand(editorSession, command) {
  if (!editorSession?.application) throw new Error('Editor session is required.');
  const { masterProfile, targetedCV } = editorSession.application;
  const target = command.target || {};
  const p = command.payload || {};

  switch (command.type) {
    case COMMAND_TYPE.SET_IDENTITY: {
      const key = String(target.key || p.key || '');
      if (!key) throw new Error('Identity key is required.');
      masterProfile.careerData.identity[key] = p.value == null ? '' : p.value;
      touch(masterProfile); break;
    }
    case COMMAND_TYPE.SET_FIELD: {
      const section = findSection(masterProfile,target.sectionId);
      if (!section) throw new Error('Section not found: '+target.sectionId);
      const field = section.fields.find(f=>f.id===target.fieldId);
      if (!field) throw new Error('Field not found: '+target.fieldId);
      field.value = p.value == null ? '' : p.value; touch(masterProfile); break;
    }
    case COMMAND_TYPE.SET_VISIBILITY:
      if (target.kind==='section') setTargetedSectionVisibility(targetedCV,target.sectionId,p.visible);
      else if (target.kind==='field') setTargetedFieldVisibility(targetedCV,target.sectionId,target.fieldId,p.visible);
      else if (target.kind==='entry') setTargetedEntryVisibility(targetedCV,target.sectionId,target.entryId,p.visible);
      else throw new Error('Visibility target kind is required.');
      break;
    case COMMAND_TYPE.ADD_SECTION:
      addSection(masterProfile,p);
      break;
    case COMMAND_TYPE.REMOVE_SECTION: {
      removeSection(masterProfile,target.sectionId);
      cleanupTargetedConfiguration(targetedCV,target.sectionId);
      targetedCV.revision += 1; targetedCV.state.revision += 1; targetedCV.updatedAt = new Date().toISOString();
      break;
    }
    case COMMAND_TYPE.SET_SECTION_TITLE:
      setSectionTitle(masterProfile,target.sectionId,p.title);
      break;
    case COMMAND_TYPE.ADD_FIELD:
      addField(masterProfile,target.sectionId,p);
      break;
    case COMMAND_TYPE.REMOVE_FIELD:
      removeField(masterProfile,target.sectionId,target.fieldId);
      cleanupTargetedConfiguration(targetedCV,target.sectionId,target.fieldId);
      targetedCV.revision += 1; targetedCV.state.revision += 1; targetedCV.updatedAt = new Date().toISOString();
      break;
    case COMMAND_TYPE.SET_FIELD_DEFINITION:
      setFieldDefinition(masterProfile,target.sectionId,target.fieldId,p);
      break;
    case COMMAND_TYPE.ADD_ENTRY: addEntry(masterProfile,target.sectionId,p); break;
    case COMMAND_TYPE.UPDATE_ENTRY: {
      const section=findSection(masterProfile,target.sectionId);
      const entry=section?.entries?.find(e=>e.id===target.entryId);
      if(!entry) throw new Error('Entry not found: '+target.entryId);
      entry.values={...entry.values,...(p.values||{})};
      if(p.visibility!==undefined) entry.visibility=p.visibility;
      touch(masterProfile);
      break;
    }
    case COMMAND_TYPE.REMOVE_ENTRY: {
      const section=findSection(masterProfile,target.sectionId);
      if(!section) throw new Error('Section not found: '+target.sectionId);
      const before=section.entries.length;
      section.entries=section.entries.filter(e=>e.id!==target.entryId);
      if(section.entries.length===before) throw new Error('Entry not found: '+target.entryId);
      section.entries.forEach((entry,index)=>{entry.order=index;});
      targetedCV.configuration.hiddenEntries=(targetedCV.configuration.hiddenEntries||[]).filter(key=>key!==String(target.sectionId)+':'+String(target.entryId));
      targetedCV.configuration.entryOrder[target.sectionId]=(targetedCV.configuration.entryOrder[target.sectionId]||[]).filter(id=>id!==String(target.entryId));
      touch(masterProfile);
      break;
    }
    case COMMAND_TYPE.DUPLICATE_ENTRY:
      duplicateEntry(masterProfile,target.sectionId,target.entryId);
      break;
    case COMMAND_TYPE.REORDER:
      if(target.kind==='section') setSectionOrder(targetedCV,p.order);
      else if(target.kind==='field') setFieldOrder(targetedCV,target.sectionId,p.order);
      else if(target.kind==='entry') setEntryOrder(targetedCV,target.sectionId,p.order);
      else throw new Error('Reorder target kind is required.');
      break;
    case COMMAND_TYPE.SET_TEMPLATE:
      configureTargetedCV(targetedCV,{template:{id:String(p.templateId),version:p.version||null}});
      break;
    case COMMAND_TYPE.SET_VARIANT:
      configureTargetedCV(targetedCV,{presentation:{variant:p.variant||null}});
      break;
    case COMMAND_TYPE.UPLOAD_ASSET:
      masterProfile.careerData.assets.push({...p}); touch(masterProfile); break;
    case COMMAND_TYPE.REMOVE_ASSET:
      masterProfile.careerData.assets = masterProfile.careerData.assets.filter(a=>a.id!==target.assetId); touch(masterProfile); break;
    default:
      throw new Error('Command requires higher-level handling: '+command.type);
  }
  return Object.freeze({
    ...editorSession,
    snapshot: createDocumentSnapshot(masterProfile, targetedCV),
    lastCommand:command.type,
    dirty:true
  });
}
