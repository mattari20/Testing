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
    save:(state, options={})=>{
      const currentRevision=Number(current?.revision)||0;
      if(options.expectedRevision !== undefined && options.expectedRevision !== currentRevision) {
        throw new Error('Persistence revision conflict: stored snapshot changed before write.');
      }
      if(options.expectedSnapshotId !== undefined && options.expectedSnapshotId !== (current?.snapshotId || null)) {
        throw new Error('Persistence snapshot conflict: stored snapshot changed before write.');
      }
      current=createEditorPersistenceRecord(state,{revision:currentRevision+1});
      return current;
    },
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
  const conflictingRecord={...record,snapshotContentId:'c-deadbeef'};
  const recovery=createEditorRecoveryController(current,adapter(conflictingRecord));
  assert.equal(recovery.resolveRecovery('recover'),null);
  const state=recovery.getRecoveryState();
  assert.equal(state.recoveryVerification,'failed');
  assert.equal(state.recoveryAction,'pending');
  assert.match(state.recoveryVerificationError,/does not match/);
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


test('M688-M691: editing after recovery invalidates the resolved state',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  assert.ok(recovery.resolveRecovery('recover'));
  assert.equal(recovery.getRecoveryState().recoveryAction,'resolved');
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Edited After Recovery'},mutatesData:true});
  const state=recovery.getRecoveryState();
  assert.equal(state.recoveryDecision,'confirm');
  assert.equal(state.recoveryAction,'pending');
  assert.equal(state.recoveryVerification,'unknown');
  recovery.destroy();
});

test('M692-M695: a normal save clears resolved recovery state for the newly saved snapshot',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  assert.ok(recovery.resolveRecovery('recover'));
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'New Saved Version'},mutatesData:true});
  recovery.save();
  const state=recovery.getRecoveryState();
  assert.equal(state.recoveryDecision,'safe');
  assert.equal(state.recoveryAction,'none');
  assert.equal(state.recoveryVerification,'unknown');
  assert.equal(state.recoveryResolvedContentId,null);
  recovery.destroy();
});

test('M696-M699: repeated recovery inspection preserves resolved state only while content identity matches',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  assert.ok(recovery.resolveRecovery('recover'));
  assert.equal(recovery.getRecoveryState().recoveryAction,'resolved');
  assert.equal(recovery.getRecoveryState().recoveryVerification,'verified');
  recovery.destroy();
});

test('M700-M703: undo/redo after recovery also invalidates the resolved state',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  assert.ok(recovery.resolveRecovery('recover'));
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Changed'},mutatesData:true});
  current.dispatch({type:'undo'});
  const state=recovery.getRecoveryState();
  assert.equal(state.recoveryAction,'pending');
  assert.equal(state.recoveryDecision,'confirm');
  recovery.destroy();
});

test('M704-M707: lifecycle reflects recovery invalidation after post-recovery editing',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  const lifecycle=createEditorLifecycleController(current,recovery);
  assert.ok(lifecycle.resolveRecovery('recover'));
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Lifecycle Edit'},mutatesData:true});
  const state=lifecycle.getState();
  assert.equal(state.dirty,true);
  assert.equal(state.recoveryAction,'pending');
  assert.equal(state.recoveryDecision,'confirm');
  lifecycle.destroy();
  recovery.destroy();
});


test('M708-M711: persistence reconciliation exposes the current persisted snapshot identity',()=>{
  const current=surface('Current');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T08:00:00.000Z');
  const recovery=createEditorRecoveryController(current,adapter(record));
  const state=recovery.getState();
  assert.equal(state.persistenceRelation,'stale');
  assert.equal(state.persistenceSnapshotId,record.snapshotId);
  assert.equal(state.persistenceSnapshotContentId,record.snapshotContentId);
  assert.equal(state.persistenceRevision,record.revision);
  assert.ok(state.persistenceReconciledAt);
  recovery.destroy();
});

test('M712-M715: autosave reconciles persistence to current editor content',()=>{
  const current=surface('Current');
  const storage=adapter(null);
  const recovery=createEditorRecoveryController(current,storage);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Autosaved'},mutatesData:true});
  const record=recovery.flush();
  const state=recovery.getState();
  assert.ok(record);
  assert.equal(state.persistenceRelation,'current');
  assert.equal(state.persistenceSnapshotId,record.snapshotId);
  assert.equal(state.persistenceSnapshotContentId,record.snapshotContentId);
  recovery.destroy();
});

test('M716-M719: post-recovery editing marks persisted snapshot stale without losing its identity',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T08:00:00.000Z');
  const recovery=createEditorRecoveryController(current,adapter(record));
  assert.ok(recovery.resolveRecovery('recover'));
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Changed'},mutatesData:true});
  const state=recovery.getState();
  assert.equal(state.persistenceRelation,'stale');
  assert.equal(state.persistenceSnapshotId,record.snapshotId);
  assert.equal(state.recoveryAction,'pending');
  recovery.destroy();
});

test('M720-M723: explicit save replaces the reconciled persistence identity',()=>{
  const current=surface('Current');
  const storage=adapter(null);
  const recovery=createEditorRecoveryController(current,storage);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Saved'},mutatesData:true});
  const first=recovery.save();
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Saved Again'},mutatesData:true});
  const second=recovery.save();
  const state=recovery.getState();
  assert.ok(second);
  assert.notEqual(second.snapshotId,first.snapshotId);
  assert.equal(state.persistenceSnapshotId,second.snapshotId);
  assert.equal(state.persistenceRevision,second.revision);
  assert.equal(state.persistenceRelation,'current');
  recovery.destroy();
});

test('M724-M727: dismiss clears the persisted reconciliation marker',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const recovery=createEditorRecoveryController(current,adapter(snapshot(persisted,'2026-10-01T08:00:00.000Z')));
  assert.equal(recovery.resolveRecovery('dismiss'),true);
  const state=recovery.getState();
  assert.equal(state.persistenceRelation,'missing');
  assert.equal(state.persistenceSnapshotId,null);
  assert.equal(state.persistenceSnapshotContentId,null);
  assert.equal(state.persistenceRevision,null);
  recovery.destroy();
});
