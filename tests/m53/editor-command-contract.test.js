import test from 'node:test';
import assert from 'node:assert/strict';
import { COMMAND_TYPE, createEditorCommand, validateEditorCommand } from '../../src/application/editor-command-contract.js';
test('creates field command',()=>{const c=createEditorCommand({type:COMMAND_TYPE.SET_FIELD,target:'identity.name',payload:'Ali'});assert.equal(c.mutatesData,true);assert.equal(validateEditorCommand(c).valid,true);});
test('undo does not mark data mutation',()=>{const c=createEditorCommand({type:COMMAND_TYPE.UNDO});assert.equal(c.mutatesData,false);});
test('rejects unsupported command',()=>assert.throws(()=>createEditorCommand({type:'unknown'}),/Unsupported editor command/));
