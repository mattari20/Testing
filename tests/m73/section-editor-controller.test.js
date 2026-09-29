import test from 'node:test';
import assert from 'node:assert/strict';
import { COMMAND_TYPE } from '../../src/application/editor-command-contract.js';
import { addEntryThroughEditor } from '../../src/ui/section-editor-controller.js';
test('section controller emits add-entry command',()=>{
  const fake={dispatch:c=>c};
  const c=addEntryThroughEditor(fake,'experience',{role:'Engineer'});
  assert.equal(c.type,COMMAND_TYPE.ADD_ENTRY);
  assert.equal(c.target.sectionId,'experience');
});
