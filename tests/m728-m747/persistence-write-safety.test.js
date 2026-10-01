import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorPersistenceAdapter, createEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

function surface(name='Candidate') {
  return createEditorSurface({
    profileData:{careerData:{identity:{fullName:name},sections:[]}},
    cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}
  });
}

function memoryStorage(initial=null) {
  let value=initial;
  return {
    getItem:()=>value,
    setItem:(_key,next)=>{ value=next; },
    removeItem:()=>{ value=null; },
    value:()=>value
  };
}

function snapshot(s, savedAt, revision=1) {
  return createEditorPersistenceRecord(s.getState().session,{savedAt,revision});
}

test('M728-M731: guarded adapter rejects a stale expected revision without replacing the current snapshot',()=>{
  const source=surface('Stored');
  const record=snapshot(source,'2026-10-01T08:00:00.000Z',4);
  const storage=memoryStorage(JSON.stringify(record));
  const adapter=createEditorPersistenceAdapter(storage);
  const candidate=surface('Candidate');
  assert.throws(
    ()=>adapter.save(candidate.getState().session,{expectedRevision:3,expectedSnapshotId:record.snapshotId}),
    /revision conflict/
  );
  assert.equal(adapter.load().snapshotId,record.snapshotId);
  assert.equal(adapter.load().revision,4);
});

test('M732-M735: guarded adapter rejects a snapshot identity change even when revision matches',()=>{
  const source=surface('Stored');
  const record=snapshot(source,'2026-10-01T08:00:00.000Z',4);
  const storage=memoryStorage(JSON.stringify(record));
  const adapter=createEditorPersistenceAdapter(storage);
  const candidate=surface('Candidate');
  assert.throws(
    ()=>adapter.save(candidate.getState().session,{expectedRevision:4,expectedSnapshotId:'s-other'}),
    /snapshot conflict/
  );
  assert.equal(adapter.load().snapshotId,record.snapshotId);
});

test('M736-M739: successful guarded replacement advances revision and replaces both identities',()=>{
  const source=surface('Stored');
  const record=snapshot(source,'2026-10-01T08:00:00.000Z',4);
  const storage=memoryStorage(JSON.stringify(record));
  const adapter=createEditorPersistenceAdapter(storage);
  const candidate=surface('Replacement');
  const next=adapter.save(candidate.getState().session,{expectedRevision:4,expectedSnapshotId:record.snapshotId});
  assert.equal(next.revision,5);
  assert.notEqual(next.snapshotId,record.snapshotId);
  assert.notEqual(next.snapshotContentId,record.snapshotContentId);
  assert.equal(adapter.load().snapshotId,next.snapshotId);
});

test('M740-M743: failed explicit persistence write exposes error state without replacing reconciliation',()=>{
  const current=surface('Current');
  current.markSaved('2026-10-01T07:00:00.000Z');
  const stored=surface('Stored');
  const record=snapshot(stored,'2026-10-01T08:00:00.000Z',2);
  const adapter={
    load:()=>record,
    save:()=>{ throw new Error('simulated write failure'); },
    clear(){}
  };
  const recovery=createEditorRecoveryController(current,adapter);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'},mutatesData:true});
  assert.throws(()=>recovery.save(),/simulated write failure/);
  const state=recovery.getState();
  assert.equal(state.persistenceSnapshotId,record.snapshotId);
  assert.equal(state.persistenceRevision,2);
  assert.equal(state.persistenceRelation,'stale');
  assert.equal(state.persistenceWriteStatus,'error');
  assert.match(state.persistenceWriteError,/simulated write failure/);
  recovery.destroy();
});

test('M744-M747: successful replacement clears prior write error and records the new write identity',()=>{
  const current=surface('Current');
  const stored=surface('Stored');
  const first=snapshot(stored,'2026-10-01T08:00:00.000Z',2);
  let currentRecord=first;
  const adapter={
    load:()=>currentRecord,
    save:(session,options={})=>{
      assert.equal(options.expectedRevision,2);
      assert.equal(options.expectedSnapshotId,first.snapshotId);
      currentRecord=createEditorPersistenceRecord(session,{revision:3});
      return currentRecord;
    },
    clear(){}
  };
  const recovery=createEditorRecoveryController(current,adapter);
  current.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'New'},mutatesData:true});
  assert.ok(recovery.save());
  const state=recovery.getState();
  assert.equal(state.persistenceWriteStatus,'saved');
  assert.equal(state.persistenceWriteError,null);
  assert.equal(state.persistenceWriteRevision,3);
  assert.equal(state.persistenceWriteSnapshotId,currentRecord.snapshotId);
  assert.equal(state.persistenceWriteSnapshotContentId,currentRecord.snapshotContentId);
  assert.equal(state.persistenceRelation,'current');
  recovery.destroy();
});
