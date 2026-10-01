import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController, EDITOR_LIFECYCLE_VERSION } from '../../src/application/editor-lifecycle-controller.js';

function surface(name='Candidate'){return createEditorSurface({profileData:{careerData:{identity:{fullName:name},sections:[]}},cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}});}
function record(name='Persisted'){return createEditorPersistenceRecord(surface(name).getState().session,{savedAt:'2026-10-01T08:00:00.000Z',revision:4});}

test('M868-M871: lifecycle exposes a stable persistence diagnostics projection',()=>{
  const current=surface('Current'); const persisted=record('Current');
  const recovery=createEditorRecoveryController(current,{load:()=>persisted,save:()=>persisted,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  const state=lifecycle.getPersistenceState();
  assert.equal(EDITOR_LIFECYCLE_VERSION,'1.6.0');
  assert.equal(state.persistenceRelation,'current');
  assert.equal(state.persistenceSnapshotId,persisted.snapshotId);
  assert.equal(state.persistenceRevision,4);
  assert.equal(state.persistenceWriteStatus,'idle');
  lifecycle.destroy(); recovery.destroy();
});
test('M872-M875: persistence diagnostics remain read-only snapshots',()=>{
  const current=surface('Current'); const persisted=record('Current');
  const recovery=createEditorRecoveryController(current,{load:()=>persisted,save:()=>persisted,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  const first=lifecycle.getPersistenceState(); const second=lifecycle.getPersistenceState();
  assert.notEqual(first,second);
  assert.deepEqual(first,second);
  lifecycle.destroy(); recovery.destroy();
});
test('M876-M879: diagnostics expose successful guarded write identity',()=>{
  const current=surface('Current'); const persisted=record('Current'); let next=persisted;
  const recovery=createEditorRecoveryController(current,{
    load:()=>next,
    save:session=>{next=createEditorPersistenceRecord(session,{revision:5});return next;},
    clear(){}
  });
  const lifecycle=createEditorLifecycleController(current,recovery);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Saved'},mutatesData:true});
  lifecycle.save();
  const state=lifecycle.getPersistenceState();
  assert.equal(state.persistenceWriteStatus,'saved');
  assert.equal(state.persistenceWriteRevision,5);
  assert.equal(state.persistenceWriteSnapshotId,next.snapshotId);
  lifecycle.destroy(); recovery.destroy();
});
test('M880-M883: diagnostics expose guarded write failure without losing baseline',()=>{
  const current=surface('Current'); const persisted=record('Current');
  const recovery=createEditorRecoveryController(current,{load:()=>persisted,save:()=>{throw new Error('write failed');},clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'},mutatesData:true});
  assert.throws(()=>lifecycle.save(),/write failed/);
  const state=lifecycle.getPersistenceState();
  assert.equal(state.persistenceWriteStatus,'error');
  assert.equal(state.persistenceSnapshotId,persisted.snapshotId);
  assert.match(state.persistenceWriteError,/write failed/);
  lifecycle.destroy(); recovery.destroy();
});
test('M884-M887: diagnostics remain consistent after clear',()=>{
  const current=surface('Current'); const persisted=record('Current');
  const recovery=createEditorRecoveryController(current,{load:()=>persisted,save:()=>persisted,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  assert.equal(lifecycle.getPersistenceState().persistenceRelation,'current');
  lifecycle.clearRecovery();
  const state=lifecycle.getPersistenceState();
  assert.equal(state.persistenceRelation,'missing');
  assert.equal(state.persistenceSnapshotId,null);
  assert.equal(state.persistenceRevision,null);
  assert.equal(state.persistenceWriteStatus,'idle');
  lifecycle.destroy(); recovery.destroy();
});