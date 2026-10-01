import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceAdapter, createEditorPersistenceRecord, serializeEditorPersistenceRecord } from '../../src/storage/editor-persistence.js';

function surface(name='Candidate'){return createEditorSurface({profileData:{careerData:{identity:{fullName:name},sections:[]}},cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}});}
function record(name='Stored'){return createEditorPersistenceRecord(surface(name).getState().session,{savedAt:'2026-10-01T08:00:00.000Z',revision:2});}
function storage(initial=null){
  let value=initial;
  return {getItem(){return value;},setItem(_key,next){value=next;},removeItem(){value=null;}};
}

test('M848-M851: adapter verifies a successful write by reading the stored snapshot back',()=>{
  const s=storage(); const adapter=createEditorPersistenceAdapter(s); const current=surface('Current');
  const saved=adapter.save(current.getState().session,{expectedRevision:0,expectedSnapshotId:null});
  assert.equal(adapter.load().snapshotId,saved.snapshotId);
});
test('M852-M855: adapter rolls back when post-write verification detects a changed snapshot',()=>{
  const previous=record('Previous'); const serialized=serializeEditorPersistenceRecord(previous); let writes=0;
  const s={getItem(){return writes===1?'corrupted':serialized;},setItem(){writes+=1;},removeItem(){}};
  const adapter=createEditorPersistenceAdapter(s);
  assert.throws(()=>adapter.save(surface('Current').getState().session,{expectedRevision:2,expectedSnapshotId:previous.snapshotId}),/verification failed/);
  assert.equal(writes,2);
});
test('M856-M859: adapter preserves the previous serialized snapshot when setItem fails',()=>{
  const previous=record('Previous'); const serialized=serializeEditorPersistenceRecord(previous);
  let value=serialized; let attempts=0;
  const s={getItem(){return value;},setItem(_key,next){attempts+=1;if(attempts===1)throw new Error('quota exceeded');value=next;},removeItem(){value=null;}};
  const adapter=createEditorPersistenceAdapter(s);
  assert.throws(()=>adapter.save(surface('Current').getState().session,{expectedRevision:2,expectedSnapshotId:previous.snapshotId}),/quota exceeded/);
  assert.equal(adapter.load().snapshotId,previous.snapshotId);
});
test('M860-M863: successful replacement advances revision after verification',()=>{
  const previous=record('Previous'); const s=storage(serializeEditorPersistenceRecord(previous)); const adapter=createEditorPersistenceAdapter(s);
  const next=adapter.save(surface('Next').getState().session,{expectedRevision:2,expectedSnapshotId:previous.snapshotId});
  assert.equal(next.revision,3); assert.equal(adapter.load().snapshotId,next.snapshotId);
});
test('M864-M867: verification failure does not silently return an unverified record',()=>{
  const previous=record('Previous'); const serialized=serializeEditorPersistenceRecord(previous);
  const s={getItem(){return serialized;},setItem(){},removeItem(){}};
  const adapter=createEditorPersistenceAdapter(s);
  assert.throws(()=>adapter.save(surface('Next').getState().session,{expectedRevision:2,expectedSnapshotId:previous.snapshotId}),/verification failed/);
});