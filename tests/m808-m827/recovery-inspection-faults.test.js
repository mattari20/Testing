import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function surface(){return createEditorSurface({profileData:{careerData:{identity:{fullName:'Candidate'},sections:[]}},cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}});}
function record(){return createEditorPersistenceRecord(surface().getState().session,{savedAt:'2026-10-01T08:00:00.000Z',revision:2});}

test('M808-M811: transient load errors are retryable and cached until refresh',()=>{
  const current=surface(); const stored=record(); let attempts=0;
  const recovery=createEditorRecoveryController(current,{load:()=>{attempts+=1;if(attempts===1)throw new Error('temporary storage failure');return stored;},save:()=>stored,clear(){}});
  const failed=recovery.getState(); const cached=recovery.getState();
  assert.equal(failed.recoveryStatus,'error'); assert.equal(failed.recoveryInspectionRetryable,true);
  assert.equal(cached.recoveryInspectionSequence,1); assert.equal(attempts,1);
  recovery.refreshRecovery();
  assert.equal(recovery.getState().recoveryStatus,'available'); assert.equal(recovery.getState().recoveryInspectionRetryable,false); assert.equal(attempts,2);
  recovery.destroy();
});
test('M812-M815: invalid persistence is not marked retryable',()=>{
  const current=surface();
  const recovery=createEditorRecoveryController(current,{load:()=>{throw new Error('Persisted CV snapshot identity is invalid.');},save:()=>null,clear(){}});
  const state=recovery.getState();
  assert.equal(state.recoveryStatus,'invalid'); assert.equal(state.recoveryInspectionRetryable,false);
  recovery.destroy();
});
test('M816-M819: lifecycle exposes retryability for recoverable inspection errors',()=>{
  const current=surface();
  const recovery=createEditorRecoveryController(current,{load:()=>{throw new Error('temporary storage failure');},save:()=>null,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  const state=lifecycle.getState();
  assert.equal(state.recoveryStatus,'error'); assert.equal(state.recoveryInspectionRetryable,true);
  lifecycle.destroy(); recovery.destroy();
});
test('M820-M823: refresh can recover from an initially unavailable persistence source',()=>{
  const current=surface(); const stored=record(); let available=false;
  const recovery=createEditorRecoveryController(current,{load:()=>{if(!available)throw new Error('storage unavailable');return stored;},save:()=>stored,clear(){}});
  assert.equal(recovery.getState().recoveryStatus,'error');
  available=true; recovery.refreshRecovery();
  assert.equal(recovery.getState().recoveryStatus,'available');
  assert.equal(recovery.getState().persistenceSnapshotId,stored.snapshotId);
  recovery.destroy();
});
test('M824-M827: clear resets inspection retryability after an error',()=>{
  const current=surface();
  const recovery=createEditorRecoveryController(current,{load:()=>{throw new Error('storage unavailable');},save:()=>null,clear(){}});
  assert.equal(recovery.getState().recoveryInspectionRetryable,true);
  recovery.clear();
  assert.equal(recovery.getState().recoveryInspectionRetryable,false);
  assert.equal(recovery.getState().recoveryInspectionStatus,'ready');
  recovery.destroy();
});