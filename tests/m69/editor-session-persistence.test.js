import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSession } from '../../src/application/editor-session.js';
import { serializeEditorSession, createEditorPersistence } from '../../src/storage/editor-session-persistence.js';

test('editor session serializes canonical application state',()=>{
  const s=createEditorSession({});
  const parsed=JSON.parse(serializeEditorSession(s));
  assert.equal(parsed.version,'1.0.0');
  assert.equal(parsed.masterProfile.id,s.application.masterProfile.id);
  assert.equal(parsed.targetedCV.id,s.application.targetedCV.id);
});

test('persistence adapter delegates storage operations',()=>{
  const bag=new Map();
  const p=createEditorPersistence({get:k=>bag.get(k),set:(k,v)=>bag.set(k,v),remove:k=>bag.delete(k)});
  p.save('x','y'); assert.equal(p.load('x'),'y'); p.remove('x'); assert.equal(p.load('x'),null);
});
