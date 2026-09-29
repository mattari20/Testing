import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSession } from '../../src/application/editor-session.js';
import { createEditorCommand, COMMAND_TYPE } from '../../src/application/editor-command-contract.js';
import { executeEditorCommand } from '../../src/application/editor-command-executor.js';

test('editor executor mutates canonical field through a command',()=>{
  const s=createEditorSession({profileData:{careerData:{identity:{fullName:'A'},sections:[{id:'contact',type:'custom',fields:[{id:'email',label:'Email',value:'old'}]}]}}});
  const c=createEditorCommand({type:COMMAND_TYPE.SET_FIELD,target:{sectionId:'contact',fieldId:'email'},payload:{value:'new'}});
  const out=executeEditorCommand(s,c);
  assert.equal(out.application.masterProfile.careerData.sections[0].fields[0].value,'new');
  assert.equal(out.dirty,true);
});
