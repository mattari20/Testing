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
  return { load:()=>record, save:state=>state, clear(){} };
}
function snapshot(s, savedAt, revision=1) {
  return createEditorPersistenceRecord(s.getState().session,{savedAt,revision});
}

test('M628-M631: recovery action is required for conflicting content',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T08:00:00.000Z');
  const r=createEditorRecoveryController(current,adapter(record));
  const state=r.getRecoveryState();
  assert.equal(state.recoveryDecision,'confirm');
  assert.equal(state.recoveryActionRequired,true);
  r.destroy();
});

test('M632-M635: blocked stale recovery is audited',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T06:00:00.000Z');
  const r=createEditorRecoveryController(current,adapter(record));
  assert.equal(r.recover(),null);
  const event=r.getRecoveryState().recoveryLastAction;
  assert.equal(event.type,'recover');
  assert.equal(event.outcome,'blocked');
  assert.equal(event.reason,'Persisted CV snapshot is older than the current editor content.');
  r.destroy();
});

test('M636-M639: successful recovery records a recovered outcome',()=>{
  const current=surface('Current');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T08:00:00.000Z');
  const r=createEditorRecoveryController(current,adapter(record));
  assert.ok(r.recover({allowStale:true}));
  const event=r.getRecoveryState().recoveryLastAction;
  assert.equal(event.type,'recover');
  assert.equal(event.outcome,'recovered');
  assert.equal(event.snapshotId,record.snapshotId);
  assert.equal(r.getRecoveryState().recoveryActionRequired,false);
  r.destroy();
});

test('M640-M642: missing recovery attempts are audited without throwing',()=>{
  const r=createEditorRecoveryController(surface(),adapter(null));
  assert.equal(r.recover(),null);
  const event=r.getRecoveryState().recoveryLastAction;
  assert.equal(event.type,'recover');
  assert.equal(event.outcome,'missing');
  r.destroy();
});

test('M643-M644: audit history is bounded',()=>{
  const current=surface();
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T08:00:00.000Z');
  const r=createEditorRecoveryController(current,adapter(record));
  for(let i=0;i<20;i+=1) r.recover({allowStale:true});
  const audit=r.getRecoveryAudit();
  assert.ok(audit.length <= 12);
  assert.equal(audit[audit.length-1].outcome,'recovered');
  r.destroy();
});

test('M645-M646: clear is itself auditable and leaves a clean action state',()=>{
  const s=surface();
  const record=snapshot(s,'2026-10-01T08:00:00.000Z');
  const r=createEditorRecoveryController(s,adapter(record));
  r.clear();
  const state=r.getRecoveryState();
  assert.equal(state.recoveryDecision,'none');
  assert.equal(state.recoveryActionRequired,false);
  assert.equal(state.recoveryLastAction.type,'clear');
  assert.equal(state.recoveryLastAction.outcome,'cleared');
  r.destroy();
});

test('M647: lifecycle surfaces recovery audit state',()=>{
  const current=surface('Current');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T08:00:00.000Z');
  const recovery=createEditorRecoveryController(current,adapter(record));
  const lifecycle=createEditorLifecycleController(current,recovery);
  assert.equal(lifecycle.getState().recoveryDecision,'confirm');
  assert.equal(lifecycle.getState().recoveryActionRequired,true);
  assert.ok(Array.isArray(lifecycle.getState().recoveryAudit));
  lifecycle.destroy();
  recovery.destroy();
});
