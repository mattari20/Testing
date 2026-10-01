import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorPersistenceAdapter, createEditorPersistenceRecord, deserializeEditorPersistenceRecord, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

function session(){ return {dirty:true,lastCommand:'set-identity',application:{version:'1.0.0',masterProfile:{careerData:{identity:{fullName:'Candidate'},sections:[]}},targetedCV:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}}}; }
function surface(){ return createEditorSurface({profileData:{careerData:{identity:{fullName:'Candidate'},sections:[]}},cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}}); }
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

test('persistence records carry a positive revision and preserve it through serialization',()=>{
  const record=createEditorPersistenceRecord(session(),{revision:7,savedAt:'2026-10-01T00:00:00.000Z'});
  assert.equal(record.revision,7);
  assert.equal(deserializeEditorPersistenceRecord(JSON.stringify(record)).revision,7);
});
test('persistence adapter increments revision from the stored snapshot',()=>{
  const store=new Map();
  const storage={getItem:key=>store.get(key) ?? null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)};
  const adapter=createEditorPersistenceAdapter(storage,'test');
  const first=adapter.save(session()); const second=adapter.save(session());
  assert.equal(first.revision,1); assert.equal(second.revision,2); assert.equal(adapter.load().revision,2);
});
test('recovery diagnostics expose snapshot savedAt and revision',()=>{
  const s=surface();
  const adapter={load:()=>createEditorPersistenceRecord(session(),{revision:4,savedAt:'2026-10-01T01:02:03.000Z'}),save:state=>createEditorPersistenceRecord(state,{revision:5,savedAt:'2026-10-01T02:03:04.000Z'}),clear(){}};
  const r=createEditorRecoveryController(s,adapter); const state=r.getState();
  assert.equal(state.recoveryStatus,'available'); assert.equal(state.recoverySavedAt,'2026-10-01T01:02:03.000Z'); assert.equal(state.recoveryRevision,4); r.destroy();
});
test('successful autosave advances recovery revision diagnostics',async()=>{
  const s=surface(); let revision=8;
  const r=createEditorRecoveryController(s,{load:()=>createEditorPersistenceRecord(session(),{revision:revision,savedAt:'2026-10-01T01:00:00.000Z'}),save:state=>createEditorPersistenceRecord(state,{revision:++revision,savedAt:'2026-10-01T02:00:00.000Z'}),clear(){}},{delayMs:1});
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Revisioned'}}); await wait(5);
  assert.equal(r.getState().autosaveStatus,'saved'); assert.equal(r.getState().recoveryRevision,9); assert.equal(r.getState().recoverySavedAt,'2026-10-01T02:00:00.000Z'); r.destroy();
});
