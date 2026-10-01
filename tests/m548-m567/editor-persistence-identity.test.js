import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorPersistenceRecord, deserializeEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

function session(savedAt=null){ return {dirty:false,savedAt,lastCommand:'save',application:{version:'1.0.0',masterProfile:{careerData:{identity:{fullName:'Candidate'},sections:[]}},targetedCV:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}}}; }
function surface(){ return createEditorSurface({profileData:{careerData:{identity:{fullName:'Candidate'},sections:[]}},cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}}); }

test('persistence snapshot identity is deterministic and survives serialization',()=>{
  const record=createEditorPersistenceRecord(session(),{revision:3,savedAt:'2026-10-01T01:00:00.000Z'});
  assert.match(record.snapshotId,/^s-[0-9a-f]{8}$/);
  assert.equal(deserializeEditorPersistenceRecord(JSON.stringify(record)).snapshotId,record.snapshotId);
});
test('tampered snapshot identity is rejected',()=>{
  const record=createEditorPersistenceRecord(session(),{revision:3,savedAt:'2026-10-01T01:00:00.000Z'});
  const tampered={...record,session:{...record.session,lastCommand:'tampered'}};
  assert.throws(()=>deserializeEditorPersistenceRecord(JSON.stringify(tampered)),/snapshot identity is invalid/);
});
test('legacy snapshot without identity remains readable',()=>{
  const record=createEditorPersistenceRecord(session(),{revision:3});
  const {snapshotId,...legacy}=record;
  assert.equal(deserializeEditorPersistenceRecord(JSON.stringify(legacy)).revision,3);
});
test('recovery diagnostics expose snapshot identity and newer comparison',()=>{
  const s=surface();
  const adapter={load:()=>createEditorPersistenceRecord(session('2026-10-01T02:00:00.000Z'),{revision:5,savedAt:'2026-10-01T02:00:00.000Z'}),save:state=>createEditorPersistenceRecord(state,{revision:6}),clear(){}};
  const r=createEditorRecoveryController(s,adapter);
  const state=r.getState();
  assert.match(state.recoverySnapshotId,/^s-[0-9a-f]{8}$/);
  assert.equal(state.recoveryIsNewer,true);
  r.destroy();
});
test('clear resets snapshot identity and freshness comparison',()=>{
  const s=surface();
  const adapter={load:()=>createEditorPersistenceRecord(session('2026-10-01T02:00:00.000Z'),{revision:5}),save:state=>createEditorPersistenceRecord(state,{revision:6}),clear(){}};
  const r=createEditorRecoveryController(s,adapter);
  r.clear();
  const state=r.getState();
  assert.equal(state.recoverySnapshotId,null);
  assert.equal(state.recoveryIsNewer,false);
  r.destroy();
});
