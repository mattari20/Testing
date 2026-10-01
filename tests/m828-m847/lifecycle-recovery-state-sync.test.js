import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function surface(name='Candidate'){return createEditorSurface({profileData:{careerData:{identity:{fullName:name},sections:[]}},cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}});}
function record(name='Persisted'){return createEditorPersistenceRecord(surface(name).getState().session,{savedAt:'2026-10-01T08:00:00.000Z',revision:2});}

test('M828-M831: lifecycle initialize emits synchronized recovery state',()=>{
  const current=surface('Current'); const persisted=record('Current');
  const recovery=createEditorRecoveryController(current,{load:()=>persisted,save:()=>persisted,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery); const states=[];
  const unsubscribe=lifecycle.subscribe(state=>states.push(state));
  lifecycle.initializeRecovery();
  assert.ok(states.length>=2);
  assert.equal(states.at(-1).persistenceSnapshotId,persisted.snapshotId);
  assert.equal(states.at(-1).recoveryInspectionStatus,'ready');
  unsubscribe(); lifecycle.destroy(); recovery.destroy();
});
test('M832-M835: lifecycle refresh emits externally replaced persistence state',()=>{
  const current=surface('Current'); const first=record('First'); const second=record('Second'); let stored=first;
  const recovery=createEditorRecoveryController(current,{load:()=>stored,save:()=>stored,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery); const states=[];
  lifecycle.subscribe(state=>states.push(state));
  stored=second; lifecycle.refreshRecovery();
  assert.equal(states.at(-1).persistenceSnapshotId,second.snapshotId);
  assert.equal(states.at(-1).recoveryInspectionSequence,2);
  lifecycle.destroy(); recovery.destroy();
});
test('M836-M839: lifecycle recovery audit is read-only and preserved',()=>{
  const current=surface('Current'); const persisted=record('Current');
  const recovery=createEditorRecoveryController(current,{load:()=>persisted,save:()=>persisted,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  lifecycle.initializeRecovery();
  const audit=lifecycle.getRecoveryAudit();
  assert.ok(Array.isArray(audit));
  assert.equal(audit.length,0);
  audit.push({type:'tampered'});
  assert.equal(lifecycle.getRecoveryAudit().length,0);
  lifecycle.destroy(); recovery.destroy();
});
test('M840-M843: lifecycle refresh returns current record without changing editor dirty state',()=>{
  const current=surface('Current'); const persisted=record('Current');
  const recovery=createEditorRecoveryController(current,{load:()=>persisted,save:()=>persisted,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'},mutatesData:true});
  assert.equal(lifecycle.getState().dirty,true);
  const refreshed=lifecycle.refreshRecovery();
  assert.equal(refreshed.snapshotId,persisted.snapshotId);
  assert.equal(lifecycle.getState().dirty,true);
  lifecycle.destroy(); recovery.destroy();
});
test('M844-M847: destroyed lifecycle does not emit or refresh recovery',()=>{
  const current=surface('Current'); const persisted=record('Current'); let loads=0;
  const recovery=createEditorRecoveryController(current,{load:()=>{loads+=1;return persisted;},save:()=>persisted,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery); let events=0;
  lifecycle.subscribe(()=>events++);
  lifecycle.destroy();
  assert.equal(lifecycle.refreshRecovery(),null);
  assert.equal(lifecycle.initializeRecovery(),null);
  assert.equal(events,1);
  recovery.destroy();
});