import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceAdapter, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function surface(){
  return createEditorSurface({
    profileData:{careerData:{identity:{fullName:'Candidate'},sections:[]}},
    cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}
  });
}
function storage(){
  const data=new Map();
  return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
}

test('manual save clears scheduled autosave state and records saved metadata',()=>{
  const s=surface();
  const r=createEditorRecoveryController(s,createEditorPersistenceAdapter(storage(),'state'),{delayMs:100});
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Manual Save'}});
  assert.equal(r.getState().autosaveStatus,'scheduled');
  const record=r.save();
  assert.equal(r.getState().autosaveStatus,'saved');
  assert.equal(r.getState().lastAutosavedAt,record.savedAt);
  assert.equal(s.getState().session.dirty,false);
  r.destroy();
});

test('manual save failure is observable and does not mark editor clean',()=>{
  const s=surface();
  const r=createEditorRecoveryController(s,{
    load:()=>null,
    save(){throw new Error('Storage unavailable');},
    clear(){}
  });
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Keep Dirty'}});
  assert.throws(()=>r.save(),/Storage unavailable/);
  assert.equal(r.getState().autosaveStatus,'error');
  assert.equal(r.getState().lastAutosaveError,'Storage unavailable');
  assert.equal(s.getState().session.dirty,true);
  r.destroy();
});

test('lifecycle reflects manual save state after recovery controller save',()=>{
  const s=surface();
  const r=createEditorRecoveryController(s,createEditorPersistenceAdapter(storage(),'state'),{delayMs:100});
  const lifecycle=createEditorLifecycleController(s,r);
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Lifecycle Save'}});
  lifecycle.save();
  const state=lifecycle.getState();
  assert.equal(state.status,'saved');
  assert.equal(state.dirty,false);
  assert.equal(state.autosaveStatus,'saved');
  assert.ok(state.lastAutosavedAt);
  lifecycle.destroy();
  r.destroy();
});

test('pending autosave does not run after explicit save',async()=>{
  const s=surface();
  const r=createEditorRecoveryController(s,createEditorPersistenceAdapter(storage(),'state'),{delayMs:20});
  let saves=0;
  const adapter={
    load:()=>null,
    save(session){ saves++; return {version:'1.0.0',savedAt:new Date().toISOString(),session,application:{version:'1.0.0',masterProfile:{careerData:{identity:{fullName:'x'},sections:[]}},targetedCV:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}}}; },
    clear(){}
  };
  r.destroy();
  const r2=createEditorRecoveryController(s,adapter,{delayMs:20});
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Once'}});
  r2.save();
  await new Promise(resolve=>setTimeout(resolve,35));
  assert.equal(saves,1);
  r2.destroy();
});
