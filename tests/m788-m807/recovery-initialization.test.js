import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function surface(name='Candidate'){return createEditorSurface({profileData:{careerData:{identity:{fullName:name},sections:[]}},cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}});}
function recordFor(name='Persisted'){return createEditorPersistenceRecord(surface(name).getState().session,{savedAt:'2026-10-01T08:00:00.000Z',revision:2});}

test('M788-M791: explicit initialize is idempotent after readiness',()=>{
  const current=surface('Current'); const record=recordFor('Current'); let loads=0;
  const recovery=createEditorRecoveryController(current,{load:()=>{loads+=1;return record;},save:()=>record,clear(){}});
  const first=recovery.initialize(); const second=recovery.initialize();
  assert.equal(first.snapshotId,record.snapshotId); assert.equal(second.snapshotId,record.snapshotId); assert.equal(loads,1);
  recovery.destroy();
});
test('M792-M795: lifecycle initializeRecovery exposes the same initialized snapshot',()=>{
  const current=surface('Current'); const record=recordFor('Current');
  const recovery=createEditorRecoveryController(current,{load:()=>record,save:()=>record,clear(){}});
  const lifecycle=createEditorLifecycleController(current,recovery);
  const result=lifecycle.initializeRecovery();
  assert.equal(result.snapshotId,record.snapshotId);
  assert.equal(lifecycle.getState().recoveryInspectionStatus,'ready');
  lifecycle.destroy(); recovery.destroy();
});
test('M796-M799: explicit initialize does not override an already inspected external snapshot',()=>{
  const current=surface('Current'); const first=recordFor('First'); const second=recordFor('Second'); let stored=first;
  const recovery=createEditorRecoveryController(current,{load:()=>stored,save:()=>stored,clear(){}});
  assert.equal(recovery.initialize().snapshotId,first.snapshotId);
  stored=second;
  assert.equal(recovery.initialize().snapshotId,first.snapshotId);
  assert.equal(recovery.refreshRecovery().snapshotId,second.snapshotId);
  recovery.destroy();
});
test('M800-M803: initialize after editor mutation re-inspects persistence',()=>{
  const current=surface('Current'); const record=recordFor('Current'); let loads=0;
  const recovery=createEditorRecoveryController(current,{load:()=>{loads+=1;return record;},save:()=>record,clear(){}});
  recovery.initialize();
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Changed'},mutatesData:true});
  recovery.initialize();
  assert.equal(loads,2);
  recovery.destroy();
});
test('M804-M807: destroyed controllers reject initialization without touching persistence',()=>{
  const current=surface('Current'); const record=recordFor('Current'); let loads=0;
  const recovery=createEditorRecoveryController(current,{load:()=>{loads+=1;return record;},save:()=>record,clear(){}});
  recovery.destroy();
  assert.equal(recovery.initialize(),null); assert.equal(loads,0);
});