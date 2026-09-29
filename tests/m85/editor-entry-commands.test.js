import test from 'node:test';
import assert from 'node:assert/strict';
import { createMasterProfile, createTargetedCV } from '../../src/core/career-document-core.js';
import { executeEditorCommand } from '../../src/application/editor-command-executor.js';

function session(){
 const masterProfile=createMasterProfile({sections:[{id:'exp',type:'experience',title:'Experience',repeatable:true,entries:[{id:'e1',values:{company:'Old'}}]}]});
 const targetedCV=createTargetedCV({masterProfileId:masterProfile.id});
 return {application:{masterProfile,targetedCV}};
}
test('update entry changes canonical values',()=>{
 const s=session();
 executeEditorCommand(s,{type:'update-entry',target:{sectionId:'exp',entryId:'e1'},payload:{values:{company:'New',title:'Engineer'}}});
 assert.equal(s.application.masterProfile.careerData.sections[0].entries[0].values.company,'New');
 assert.equal(s.application.masterProfile.careerData.sections[0].entries[0].values.title,'Engineer');
});
test('remove entry removes canonical entry',()=>{
 const s=session();
 executeEditorCommand(s,{type:'remove-entry',target:{sectionId:'exp',entryId:'e1'},payload:{}});
 assert.equal(s.application.masterProfile.careerData.sections[0].entries.length,0);
});
