import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function surface(name='Candidate') {
  return createEditorSurface({
    profileData:{careerData:{identity:{fullName:name},sections:[]}},
    cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}
  });
}
function adapter(record) {
  let current=record;
  return {
    load:()=>current,
    save:state=>state,
    clear(){current=null;}
  };
}
function snapshot(s, savedAt, revision=1) {
  return createEditorPersistenceRecord(s.getState().session,{savedAt,revision});
}

test('M668-M671: successful recovery is integrity verified before resolution',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  const record=recovery.resolveRecovery('recover');
  assert.ok(record);
  const state=recovery.getRecoveryState();
  assert.equal(state.recoveryVerification,'verified');
  assert.equal(state.recoveryVerificationError,null);
  assert.ok(state.recoveryVerificationAt);
  assert.equal(state.recoveryAction,'resolved');
  recovery.destroy();
});

test('M672-M675: verification failure cannot silently resolve recovery',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T08:00:00.000Z');
  const originalRestore=current.restorePersistedState;
  current.restorePersistedState = undefined;
  const recovery=createEditorRecoveryController(current,adapter(record));
  assert.throws(()=>recovery.resolveRecovery('recover'),/persisted-state recovery/);
  assert.equal(recovery.getRecoveryState().recoveryAction,'pending');
  current.restorePersistedState = originalRestore;
  recovery.destroy();
});

test('M676-M679: dismissal clears verification state without changing current document',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  assert.equal(recovery.resolveRecovery('dismiss'),true);
  const state=recovery.getRecoveryState();
  assert.equal(state.recoveryVerification,'unknown');
  assert.equal(state.recoveryVerificationError,null);
  assert.equal(current.getState().session.application.masterProfile.identity.fullName,'Current');
  recovery.destroy();
});

test('M680-M683: recovery action remains fenced from a queued autosave operation',async()=>{
  const current=surface('Current');
  const persisted=surface('Persisted');
  const storage=adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z'));
  const recovery=createEditorRecoveryController(current,storage,{delayMs:20,retryDelayMs:20});
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'},mutatesData:true});
  recovery.resolveRecovery('dismiss');
  await new Promise(resolve=>setTimeout(resolve,50));
  assert.equal(storage.load(),null);
  assert.equal(current.getState().session.application.masterProfile.identity.fullName,'Unsaved');
  recovery.destroy();
});

test('M684-M687: lifecycle exposes verified recovery state after explicit resolution',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  const lifecycle=createEditorLifecycleController(current,recovery);
  assert.ok(lifecycle.resolveRecovery('recover'));
  const state=lifecycle.getState();
  assert.equal(state.status,'recovered');
  assert.equal(state.recoveryVerification,'verified');
  assert.equal(state.recoveryAction,'resolved');
  lifecycle.destroy();
  recovery.destroy();
});
