import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorRecoveryController } from '../../src/storage/editor-persistence.js';

function surface(){
  return createEditorSurface({
    profileData:{careerData:{identity:{fullName:'Candidate'},sections:[]}},
    cvData:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}
  });
}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function record(session){
  return {version:'1.0.0',savedAt:new Date().toISOString(),session,application:{
    version:'1.0.0',
    masterProfile:{careerData:{identity:{fullName:'Candidate'},sections:[]}},
    targetedCV:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}
  }};
}

test('stale retry callback cannot persist after a newer edit replaces the retry generation',async()=>{
  const s=surface();
  let attempts=0;
  const r=createEditorRecoveryController(s,{
    load:()=>null,
    save(session){ attempts++; if(attempts===1) throw new Error('Temporary'); return record(session); },
    clear(){}
  },{delayMs:1,retryDelayMs:25,maxRetries:2});

  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'First'}});
  await wait(4);
  assert.equal(r.getState().retryCount,1);

  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Second'}});
  await wait(35);

  assert.equal(attempts,2);
  assert.equal(r.getState().autosaveStatus,'saved');
  assert.equal(r.getState().retryCount,0);
  r.destroy();
});

test('destroy invalidates queued retry callbacks',async()=>{
  const s=surface();
  let attempts=0;
  const r=createEditorRecoveryController(s,{
    load:()=>null,
    save(){ attempts++; throw new Error('Temporary'); },
    clear(){}
  },{delayMs:1,retryDelayMs:20,maxRetries:2});

  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Destroy'}});
  await wait(4);
  assert.equal(r.getState().retryCount,1);
  r.destroy();
  await wait(30);
  assert.equal(attempts,1);
});

test('recover invalidates a queued retry before restoring the stored snapshot',async()=>{
  const s=surface();
  let attempts=0;
  const r=createEditorRecoveryController(s,{
    load:()=>record({
      dirty:false,savedAt:'2026-10-01T00:00:00.000Z',lastCommand:'save'
    }),
    save(){ attempts++; throw new Error('Temporary'); },
    clear(){}
  },{delayMs:1,retryDelayMs:20,maxRetries:2});

  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'}});
  await wait(4);
  assert.equal(r.getState().retryCount,1);
  const restored=r.recover();
  assert.equal(restored.savedAt,'2026-10-01T00:00:00.000Z');
  await wait(30);
  assert.equal(attempts,1);
  assert.equal(s.getState().session.dirty,false);
  r.destroy();
});
