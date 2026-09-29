import { buildV1AdapterFromTemplate } from './template-compatibility-adapter.js';

const IDENTITY_BINDINGS={
 NAME:'identity.fullName', JOB:'identity.jobTitle', EMAIL:'identity.email', PHONE:'identity.phone', WHATSAPP:'identity.whatsapp',
 ADDRESS:'identity.address', DOB:'identity.dateOfBirth', CNIC:'identity.cnic', RELIGION:'identity.religion', LINKEDIN:'identity.linkedin', WEBSITE:'identity.website',
 PHOTO:'asset:photo', SUMMARY:'section:summary:text'
};

const SECTION_BY_LOOP={EXPERIENCE_LIST:'experience',EDUCATION_LIST:'education',PROJECTS_LIST:'projects',SKILLS_LIST:'skills',LANGUAGES_LIST:'languages',ACHIEVEMENTS_LIST:'achievements'};
const FIELD_MAP={
 EXPERIENCE_LIST:{company:'company',duration:'duration',title:'title',desc:'description'},
 EDUCATION_LIST:{institute:'institution',year:'duration',degree:'degree',grade:'description'},
 PROJECTS_LIST:{name:'name',year:'duration',role:'role',desc:'description'},
 SKILLS_LIST:{skill:'value'},
 LANGUAGES_LIST:{language:'value'},
 ACHIEVEMENTS_LIST:{achievement:'description'}
};
const VISIBILITY_BY_SECTION={pho:'photo',sum:'summary',exp:'experience',edu:'education',ski:'skills',lan:'languages',ach:'achievements',pro:'projects'};

function composeAchievement(entry){
 const v=entry?.values || {};
 return [v.title,v.description].filter(Boolean).join(' — ');
}

export function createGenericV1TemplateAdapter(template, sourceHtml){
 if(!template?.id) throw new Error('Template definition is required.');
 const loops={};
 for(const match of String(sourceHtml||'').matchAll(/{{([A-Z][A-Z0-9_]*)_LIST}}/g)){
   const name=match[1]+'_LIST';
   if(!SECTION_BY_LOOP[name]) continue;
   loops[name]={sectionType:SECTION_BY_LOOP[name],fields:FIELD_MAP[name]};
 }
 const visibility={};
 for(const match of String(sourceHtml||'').matchAll(/{{#(toggle_[A-Za-z0-9_]+)}}/g)){
   const token=match[1]; const suffix=token.replace(/^toggle_/,'').replace(/_visible$/,'');
   const section=VISIBILITY_BY_SECTION[suffix];
   if(section) visibility[token]=section;
 }
 return buildV1AdapterFromTemplate(template,{
   bindings:IDENTITY_BINDINGS,
   objectLoops:loops,
   visibility,
   metadata:{source:'actual-recovered-v1-source',generatedFromSource:true},
   diagnostics:[]
 });
}

export function getV1Visibility(adapter, snapshot){
 const hiddenSections=new Set((snapshot?.configuration?.hiddenSections||[]).map(String));
 const result={};
 for(const [token,section] of Object.entries(adapter.visibility||{})) result[token]=!hiddenSections.has(section);
 return result;
}

export function createV1LoopValueOverrides(){
 return { composeAchievement };
}