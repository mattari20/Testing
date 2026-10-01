import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceAdapter, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function surface(){return createEditorSurface({profileData:{careerData:{identity:{fullName:'Candidate'},sections:[]}},cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}});}
function storage(){const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

test('recovery controller exposes autosave state transitions',async()=>{
 const s=surface(); const a=createEditorPersistenceAdapter(storage(),'state'); const r=createEditorRecoveryController(s,a,{delayMs:10});
 const states=[]; const off=r.subscribe(x=>states.push(x.autosaveStatus));
 s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Autosaved'}});
 assert.equal(r.getState().autosaveStatus,'scheduled');
 await wait(25);
 assert.equal(r.getState().autosaveStatus,'saved');
 assert.ok(r.getState().lastAutosavedAt);
 assert.deepEqual(states,['idle','scheduled','saving','saved']);
 off(); r.destroy();
});

test('autosave failures are observable without marking the editor saved',()=>{
 const s=surface(); const r=createEditorRecoveryController(s,{load:()=>null,save(){throw new Error('Disk full');},clear(){}},{delayMs:0});
 const lifecycle=createEditorLifecycleController(s,r);
 s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'}});
 assert.throws(()=>r.flush(),/Disk full/);
 assert.equal(r.getState().autosaveStatus,'error');
 assert.equal(r.getState().lastAutosaveError,'Disk full');
 assert.equal(lifecycle.getState().dirty,true);
 lifecycle.destroy(); r.destroy();
});

test('clear resets autosave status and error metadata',()=>{
 const s=surface(); const r=createEditorRecoveryController(s,{load:()=>null,save(){throw new Error('Failure');},clear(){}},{delayMs:10});
 s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'}});
 assert.throws(()=>r.flush(),/Failure/);
 assert.equal(r.getState().autosaveStatus,'error');
 r.clear();
 assert.deepEqual(r.getState(),{autosaveStatus:'idle',lastAutosavedAt:null,lastAutosaveError:null});
 r.destroy();
});

test('lifecycle mirrors recovery autosave state',()=>{
 const s=surface(); const r=createEditorRecoveryController(s,createEditorPersistenceAdapter(storage(),'mirror'),{delayMs:50});
 const lifecycle=createEditorLifecycleController(s,r);
 s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Mirror'}});
 assert.equal(lifecycle.getState().autosaveStatus,'scheduled');
 r.flush();
 assert.equal(lifecycle.getState().autosaveStatus,'saved');
 assert.ok(lifecycle.getState().lastAutosavedAt);
 lifecycle.destroy(); r.destroy();
});