import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function surface(name='Candidate') {
  return createEditorSurface({
    profileData:{careerData:{identity:{fullName:name},sections:[]}},
    cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}
  });
}

function recordFor(s,name='Persisted') {
  const persisted=surface(name);
  return createEditorPersistenceRecord(persisted.getState().session,{savedAt:'2026-10-01T08:00:00.000Z',revision:2});
}

test('M748-M751: lifecycle exposes persistence reconciliation and write state',()=>{
  const current=surface('Current');
  const record=recordFor(current,'Current');
  const recovery=createEditorRecoveryController(current,{
    load:()=>record,
    save:()=>record,
    clear(){}
  });
  const lifecycle=createEditorLifecycleController(current,recovery);
  const state=lifecycle.getState();
  assert.equal(state.persistenceRelation,'current');
  assert.equal(state.persistenceSnapshotId,record.snapshotId);
  assert.equal(state.persistenceRevision,2);
  assert.equal(state.persistenceWriteStatus,'idle');
  lifecycle.destroy();
  recovery.destroy();
});

test('M752-M755: lifecycle save surfaces a persistence write failure and preserves dirty state',()=>{
  const current=surface('Current');
  const stored=recordFor(current,'Stored');
  const recovery=createEditorRecoveryController(current,{
    load:()=>stored,
    save:()=>{ throw new Error('write failed'); },
    clear(){}
  });
  const lifecycle=createEditorLifecycleController(current,recovery);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'},mutatesData:true});
  assert.throws(()=>lifecycle.save(),/write failed/);
  const state=lifecycle.getState();
  assert.equal(state.status,'dirty');
  assert.equal(state.dirty,true);
  assert.equal(state.persistenceWriteStatus,'error');
  assert.match(state.persistenceWriteError,/write failed/);
  assert.equal(state.persistenceSnapshotId,stored.snapshotId);
  lifecycle.destroy();
  recovery.destroy();
});

test('M756-M759: lifecycle save success exposes the replacement write identity',()=>{
  const current=surface('Current');
  const stored=recordFor(current,'Stored');
  let next=stored;
  const recovery=createEditorRecoveryController(current,{
    load:()=>next,
    save:session=>{
      next=createEditorPersistenceRecord(session,{revision:3});
      return next;
    },
    clear(){}
  });
  const lifecycle=createEditorLifecycleController(current,recovery);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Saved'},mutatesData:true});
  const result=lifecycle.save();
  const state=lifecycle.getState();
  assert.equal(result.snapshotId,next.snapshotId);
  assert.equal(state.status,'saved');
  assert.equal(state.dirty,false);
  assert.equal(state.persistenceWriteStatus,'saved');
  assert.equal(state.persistenceWriteRevision,3);
  assert.equal(state.persistenceWriteSnapshotId,next.snapshotId);
  lifecycle.destroy();
  recovery.destroy();
});

test('M760-M763: lifecycle recovery keeps persistence identity observable after verified restore',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const record=createEditorPersistenceRecord(persisted.getState().session,{savedAt:'2026-10-01T08:00:00.000Z',revision:5});
  const recovery=createEditorRecoveryController(current,{load:()=>record,save:()=>record,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  assert.ok(lifecycle.resolveRecovery('recover'));
  const state=lifecycle.getState();
  assert.equal(state.status,'recovered');
  assert.equal(state.recoveryVerification,'verified');
  assert.equal(state.persistenceSnapshotId,record.snapshotId);
  assert.equal(state.persistenceRelation,'current');
  lifecycle.destroy();
  recovery.destroy();
});

test('M764-M767: clear recovery resets lifecycle persistence state',()=>{
  const current=surface('Current');
  const record=recordFor(current,'Persisted');
  const recovery=createEditorRecoveryController(current,{load:()=>record,save:()=>record,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  assert.equal(lifecycle.getState().persistenceRelation,'current');
  lifecycle.clearRecovery();
  const state=lifecycle.getState();
  assert.equal(state.persistenceRelation,'missing');
  assert.equal(state.persistenceSnapshotId,null);
  assert.equal(state.persistenceWriteStatus,'idle');
  lifecycle.destroy();
  recovery.destroy();
});
