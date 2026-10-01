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

test('M608-M611: identical snapshot content is classified safe',()=>{
  const s=surface();
  const record=snapshot(s,'2026-10-01T05:00:00.000Z');
  const r=createEditorRecoveryController(s,adapter(record));
  assert.equal(r.getRecoveryState().recoveryDecision,'safe');
  r.destroy();
});

test('M612-M615: different content with newer persisted state requires confirmation',()=>{
  const current=surface('Current');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T06:00:00.000Z');
  current.markSaved('2026-10-01T05:00:00.000Z');
  const r=createEditorRecoveryController(current,adapter(record));
  assert.equal(r.getRecoveryState().recoveryContentRelation,'different');
  assert.equal(r.getRecoveryState().recoveryDecision,'confirm');
  r.destroy();
});

test('M616-M619: older conflicting snapshot is classified stale and blocked',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T06:00:00.000Z');
  const r=createEditorRecoveryController(current,adapter(record));
  assert.equal(r.getRecoveryState().recoveryDecision,'stale');
  assert.equal(r.recover(),null);
  r.destroy();
});

test('M620-M623: explicit stale recovery override is allowed',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T06:00:00.000Z');
  const r=createEditorRecoveryController(current,adapter(record));
  assert.ok(r.recover({allowStale:true}));
  assert.equal(current.getState().session.application.masterProfile.identity.fullName,'Persisted');
  r.destroy();
});

test('M624-M627: lifecycle confirmation is required before replacing dirty conflicting content',()=>{
  const current=surface('Current');
  const persisted=surface('Persisted');
  const record=snapshot(persisted,'2026-10-01T08:00:00.000Z');
  const r=createEditorRecoveryController(current,adapter(record));
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved Current'},mutatesData:true});
  const denied=createEditorLifecycleController(current,r,{confirmRecovery:()=>false});
  assert.equal(denied.recover(),null);
  assert.equal(current.getState().session.application.masterProfile.identity.fullName,'Unsaved Current');
  denied.destroy();
  const allowed=createEditorLifecycleController(current,r,{confirmRecovery:()=>true});
  assert.ok(allowed.recover());
  assert.equal(current.getState().session.application.masterProfile.identity.fullName,'Persisted');
  allowed.destroy();
  r.destroy();
});
