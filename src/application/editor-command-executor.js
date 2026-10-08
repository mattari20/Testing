import { addSection, removeSection, setSectionTitle, addField, removeField, setFieldDefinition, addEntry, duplicateEntry,
  setSectionOrder, setFieldOrder, setEntryOrder, configureTargetedCV, createDocumentSnapshot,
  setTargetedSectionVisibility, setTargetedFieldVisibility, setTargetedEntryVisibility, setTargetedAssetVisibility
} from '../core/career-document-core.js';
import { COMMAND_TYPE } from './editor-command-contract.js';

export const EDITOR_EXECUTOR_VERSION='1.10.0';
const findSection=(profile,id)=>profile.careerData.sections.find(s=>s.id===id);
const touch=o=>{o.revision+=1;o.updatedAt=new Date().toISOString();};
const removeFromList=(list,id)=>list.filter(value=>value!==id);
const CORE_SECTION_TYPES=new Set(['summary','experience','education','skills','languages','projects','achievements','contact','photo']);

function cleanupTargetedConfiguration(targetedCV,sectionId,fieldId=null){
  const sid=String(sectionId);
  targetedCV.configuration.hiddenSections=removeFromList(targetedCV.configuration.hiddenSections||[],sid);
  targetedCV.configuration.sectionOrder=removeFromList(targetedCV.configuration.sectionOrder||[],sid);
  delete targetedCV.configuration.fieldOrder[sid]; delete targetedCV.configuration.entryOrder[sid];
  targetedCV.configuration.hiddenFields=(targetedCV.configuration.hiddenFields||[]).filter(key=>!key.startsWith(sid+':'));
  targetedCV.configuration.hiddenEntries=(targetedCV.configuration.hiddenEntries||[]).filter(key=>!key.startsWith(sid+':'));
  if(fieldId!=null){
    const key=sid+':'+String(fieldId);
    targetedCV.configuration.hiddenFields=removeFromList(targetedCV.configuration.hiddenFields,key);
    const order=targetedCV.configuration.fieldOrder[sid]||[];
    targetedCV.configuration.fieldOrder[sid]=removeFromList(order,String(fieldId));
  }
}

export function executeEditorCommand(editorSession,command){
  if(!editorSession?.application)throw new Error('Editor session is required.');
  const {masterProfile,targetedCV}=editorSession.application; const target=command.target||{}; const p=command.payload||{};
  switch(command.type){
    case COMMAND_TYPE.SET_RATING_STYLE:{const type=String(target.sectionType||p.sectionType||'');if(!['skills','languages'].includes(type))throw new Error('Ratings are supported for skills and languages only.');const style=['off','text','stars','bars','dots'].includes(String(p.style))?String(p.style):'off';targetedCV.configuration.presentation=targetedCV.configuration.presentation||{};targetedCV.configuration.presentation.ratings=targetedCV.configuration.presentation.ratings||{};targetedCV.configuration.presentation.ratings[type]=targetedCV.configuration.presentation.ratings[type]||{style:'off',values:{}};targetedCV.configuration.presentation.ratings[type].style=style;touch(targetedCV);break;}
    case COMMAND_TYPE.SET_ITEM_RATING:{const type=String(target.sectionType||p.sectionType||'');if(!['skills','languages'].includes(type))throw new Error('Ratings are supported for skills and languages only.');const item=String(p.item||'').trim();if(!item)throw new Error('Rating item is required.');const rating=Math.max(0,Math.min(5,Number(p.rating)||0));targetedCV.configuration.presentation=targetedCV.configuration.presentation||{};targetedCV.configuration.presentation.ratings=targetedCV.configuration.presentation.ratings||{};targetedCV.configuration.presentation.ratings[type]=targetedCV.configuration.presentation.ratings[type]||{style:'off',values:{}};targetedCV.configuration.presentation.ratings[type].values=targetedCV.configuration.presentation.ratings[type].values||{};targetedCV.configuration.presentation.ratings[type].values[item]=rating;touch(targetedCV);break;}
    case COMMAND_TYPE.SET_SECTION_PLACEMENT:{const section=findSection(masterProfile,target.sectionId);if(!section||CORE_SECTION_TYPES.has(String(section.type)))throw new Error('Custom section placement only.');const placement=['left','right'].includes(String(p.placement))?String(p.placement):'left';targetedCV.configuration.presentation=targetedCV.configuration.presentation||{};targetedCV.configuration.presentation.sectionPlacement=targetedCV.configuration.presentation.sectionPlacement||{};targetedCV.configuration.presentation.sectionPlacement[String(section.id)]=placement;touch(targetedCV);break;}
    case COMMAND_TYPE.SET_IDENTITY:{const key=String(target.key||p.key||'');if(!key)throw new Error('Identity key is required.');masterProfile.careerData.identity[key]=p.value==null?'':p.value;touch(masterProfile);break;}
    case COMMAND_TYPE.ADD_IDENTITY_FIELD:{const key=String(p.key||'').trim();if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(key))throw new Error('Identity field key is invalid.');if(masterProfile.careerData.identity[key]===undefined)masterProfile.careerData.identity[key]='';const active=Array.isArray(targetedCV.configuration.identityFields)?targetedCV.configuration.identityFields:[];targetedCV.configuration.identityFields=Array.from(new Set([...active,key]));touch(masterProfile);touch(targetedCV);break;}
    case COMMAND_TYPE.REMOVE_IDENTITY_FIELD:{const key=String(target.key||p.key||'');if(!key)throw new Error('Identity key is required.');const core=new Set(['fullName','jobTitle','email','phone','location']);if(core.has(key))throw new Error('Core identity fields cannot be removed.');delete masterProfile.careerData.identity[key];const active=Array.isArray(targetedCV.configuration.identityFields)?targetedCV.configuration.identityFields:[];targetedCV.configuration.identityFields=active.filter(value=>String(value)!==key);targetedCV.configuration.hiddenIdentityFields=(targetedCV.configuration.hiddenIdentityFields||[]).filter(value=>String(value)!==key);touch(masterProfile);touch(targetedCV);break;}
    case COMMAND_TYPE.SET_FIELD:{const section=findSection(masterProfile,target.sectionId);if(!section)throw new Error('Section not found: '+target.sectionId);const field=section.fields.find(f=>f.id===target.fieldId);if(!field)throw new Error('Field not found: '+target.fieldId);field.value=p.value==null?'':p.value;touch(masterProfile);break;}
    case COMMAND_TYPE.UPDATE_ENTRY:{const section=findSection(masterProfile,target.sectionId);const entry=section?.entries?.find(e=>e.id===target.entryId);if(!entry)throw new Error('Entry not found: '+target.entryId);entry.values={...entry.values,...(p.values||{})};if(p.visibility!==undefined)entry.visibility=p.visibility;touch(masterProfile);break;}
    case COMMAND_TYPE.SET_VISIBILITY:
      if(target.kind==='section')setTargetedSectionVisibility(targetedCV,target.sectionId,p.visible);
      else if(target.kind==='field')setTargetedFieldVisibility(targetedCV,target.sectionId,target.fieldId,p.visible);
      else if(target.kind==='entry')setTargetedEntryVisibility(targetedCV,target.sectionId,target.entryId,p.visible);
      else if(target.kind==='asset')setTargetedAssetVisibility(targetedCV,target.assetId,p.visible);
      else if(target.kind==='identity'){const key=String(target.key||'');if(!key)throw new Error('Identity key is required.');const list=Array.isArray(targetedCV.configuration.hiddenIdentityFields)?targetedCV.configuration.hiddenIdentityFields:[];targetedCV.configuration.hiddenIdentityFields=p.visible?removeFromList(list,key):Array.from(new Set([...list,key]));touch(targetedCV);}
      else throw new Error('Visibility target kind is required.'); break;
    case COMMAND_TYPE.ADD_SECTION:addSection(masterProfile,p);break;
    case COMMAND_TYPE.REMOVE_SECTION:{const section=findSection(masterProfile,target.sectionId);if(section&&CORE_SECTION_TYPES.has(String(section.type)))throw new Error('Core CV sections cannot be removed.');removeSection(masterProfile,target.sectionId);cleanupTargetedConfiguration(targetedCV,target.sectionId);touch(targetedCV);break;}
    case COMMAND_TYPE.SET_SECTION_TITLE:{const section=findSection(masterProfile,target.sectionId);if(section&&CORE_SECTION_TYPES.has(String(section.type)))throw new Error('Core CV section headings are fixed.');setSectionTitle(masterProfile,target.sectionId,p.title);break;}
    case COMMAND_TYPE.ADD_FIELD:addField(masterProfile,target.sectionId,p);break;
    case COMMAND_TYPE.REMOVE_FIELD:{const section=findSection(masterProfile,target.sectionId);if(section&&String(section.type)==='summary'&&Array.isArray(section.fields)&&section.fields.length<=1)throw new Error('Professional Summary must keep one field. Use Hide instead.');removeField(masterProfile,target.sectionId,target.fieldId);cleanupTargetedConfiguration(targetedCV,target.sectionId,target.fieldId);touch(targetedCV);break;}
    case COMMAND_TYPE.SET_FIELD_DEFINITION:setFieldDefinition(masterProfile,target.sectionId,target.fieldId,p);break;
    case COMMAND_TYPE.ADD_ENTRY:addEntry(masterProfile,target.sectionId,p);break;
    case COMMAND_TYPE.REMOVE_ENTRY:{const section=findSection(masterProfile,target.sectionId);if(!section)throw new Error('Section not found: '+target.sectionId);const before=section.entries.length;section.entries=section.entries.filter(e=>e.id!==target.entryId);if(section.entries.length===before)throw new Error('Entry not found: '+target.entryId);section.entries.forEach((entry,index)=>entry.order=index);targetedCV.configuration.hiddenEntries=(targetedCV.configuration.hiddenEntries||[]).filter(key=>key!==String(target.sectionId)+':'+String(target.entryId));targetedCV.configuration.entryOrder[target.sectionId]=(targetedCV.configuration.entryOrder[target.sectionId]||[]).filter(id=>id!==String(target.entryId));touch(masterProfile);break;}
    case COMMAND_TYPE.DUPLICATE_ENTRY:duplicateEntry(masterProfile,target.sectionId,target.entryId);break;
    case COMMAND_TYPE.REORDER:
      if(target.kind==='section')setSectionOrder(targetedCV,p.order);
      else if(target.kind==='field')setFieldOrder(targetedCV,target.sectionId,p.order);
      else if(target.kind==='entry')setEntryOrder(targetedCV,target.sectionId,p.order);
      else throw new Error('Reorder target kind is required.'); break;
    case COMMAND_TYPE.SET_THEME_COLOR:{
      const theme=String(p.themeColor||'navy');
      const allowed=new Set(['navy','blue','teal','green','burgundy','charcoal','purple','orange']);
      if(!allowed.has(theme))throw new Error('Unsupported CV theme color.');
      configureTargetedCV(targetedCV,{presentation:{themeColor:theme}});break;
    }
    case COMMAND_TYPE.SET_ENTRY_SORT:{
      const section=String(p.sectionType||target.sectionType||'');
      const direction=String(p.direction||'desc');
      if(!new Set(['experience','education']).has(section))throw new Error('Unsupported sortable section.');
      if(!new Set(['asc','desc']).has(direction))throw new Error('Unsupported sort direction.');
      configureTargetedCV(targetedCV,{presentation:{...targetedCV.configuration.presentation,entrySort:{...(targetedCV.configuration.presentation?.entrySort||{}),[section]:direction}}});break;
    }
    case COMMAND_TYPE.SET_LIST_STYLE:{
      const section=String(p.sectionType||target.sectionType||'');
      const style=String(p.style||'');
      const allowed={
        skills:new Set(['tags','inline','bullets','compact']),
        languages:new Set(['stacked','inline','pills','compact'])
      };
      if(!allowed[section]?.has(style))throw new Error('Unsupported list style.');
      configureTargetedCV(targetedCV,{presentation:{...targetedCV.configuration.presentation,listStyles:{...(targetedCV.configuration.presentation?.listStyles||{}),[section]:style}}});break;
    }
    case COMMAND_TYPE.SET_TEMPLATE:configureTargetedCV(targetedCV,{template:{id:String(p.templateId),version:p.version||null}});break;
    case COMMAND_TYPE.SET_VARIANT:configureTargetedCV(targetedCV,{presentation:{variant:p.variant||null}});break;
    case COMMAND_TYPE.UPLOAD_ASSET:{const asset={...p};const assetId=String(asset.id||target.assetId||'');masterProfile.careerData.assets=(masterProfile.careerData.assets||[]).filter(item=>String(item?.id||item?.key||'')!==assetId&&String(item?.key||'')!==String(asset.key||''));masterProfile.careerData.assets.push(asset);touch(masterProfile);break;}
    case COMMAND_TYPE.REMOVE_ASSET:masterProfile.careerData.assets=(masterProfile.careerData.assets||[]).filter(a=>String(a?.id||a?.key||'')!==String(target.assetId));touch(masterProfile);break;
    default:throw new Error('Command requires higher-level handling: '+command.type);
  }
  return Object.freeze({...editorSession,snapshot:createDocumentSnapshot(masterProfile,targetedCV),lastCommand:command.type,dirty:true});
}
