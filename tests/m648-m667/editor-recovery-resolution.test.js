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

test('M648-M651: pending recovery exposes an explicit pending action',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  assert.equal(recovery.getRecoveryState().recoveryAction,'pending');
  recovery.destroy();
});

test('M652-M655: resolve recover applies the persisted document and resolves the action',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  assert.ok(recovery.resolveRecovery('recover'));
  const state=recovery.getRecoveryState();
  assert.equal(current.getState().session.application.masterProfile.identity.fullName,'Persisted');
  assert.equal(state.recoveryAction,'resolved');
  assert.equal(state.recoveryActionRequired,false);
  assert.equal(state.recoveryLastAction.outcome,'recovered');
  recovery.destroy();
});

test('M656-M659: dismiss removes the persisted recovery snapshot without replacing current content',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const storage=adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z'));
  const recovery=createEditorRecoveryController(current,storage);
  assert.equal(recovery.resolveRecovery('dismiss'),true);
  const state=recovery.getRecoveryState();
  assert.equal(current.getState().session.application.masterProfile.identity.fullName,'Current');
  assert.equal(state.recoveryStatus,'missing');
  assert.equal(state.recoveryAction,'dismissed');
  assert.equal(state.recoveryActionRequired,false);
  assert.equal(state.recoveryLastAction.outcome,'dismissed');
  recovery.destroy();
});

test('M660-M662: invalid resolution action is rejected',()=>{
  const recovery=createEditorRecoveryController(surface(),adapter(null));
  assert.throws(()=>recovery.resolveRecovery('invalid'),/recover or dismiss/);
  recovery.destroy();
});

test('M663-M665: resolving recovery is safe when no action is pending',()=>{
  const recovery=createEditorRecoveryController(surface(),adapter(null));
  assert.equal(recovery.resolveRecovery('recover'),null);
  assert.equal(recovery.resolveRecovery('dismiss'),null);
  recovery.destroy();
});

test('M666-M667: lifecycle delegates explicit recovery resolution',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  const lifecycle=createEditorLifecycleController(current,recovery);
  assert.ok(lifecycle.resolveRecovery('recover'));
  assert.equal(lifecycle.getState().status,'recovered');
  assert.equal(lifecycle.getState().recoveryActionRequired,false);
  lifecycle.destroy();
  recovery.destroy();
});
