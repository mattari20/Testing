import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSession, applyEditorCommand, markEditorSaved } from '../../src/application/editor-session.js';
test('creates editor session from V2 application state',()=>{const s=createEditorSession({profileData:{careerData:{identity:{name:'Ali'}}}});assert.ok(s.application.masterProfile.id);assert.ok(s.snapshot);assert.equal(s.dirty,false);});
test('tracks mutating editor commands',()=>{const s=createEditorSession({profileData:{careerData:{identity:{name:'Ali'}}}});const n=applyEditorCommand(s,{type:'update-field',mutatesData:true});assert.equal(n.dirty,true);assert.equal(n.lastCommand,'update-field');});
test('save clears dirty state',()=>{const s=createEditorSession({profileData:{careerData:{identity:{name:'Ali'}}}});const n=markEditorSaved({...s,dirty:true});assert.equal(n.dirty,false);});
