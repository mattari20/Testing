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

test('autosave retries transient failures with bounded retry count',async()=>{
  const s=surface();
  let attempts=0;
  const r=createEditorRecoveryController(s,{
    load:()=>null,
    save(session){
      attempts++;
      if(attempts<3) throw new Error('Temporary storage failure');
      return {version:'1.0.0',savedAt:new Date().toISOString(),session,application:{
        version:'1.0.0',
        masterProfile:{careerData:{identity:{fullName:'Candidate'},sections:[]}},
        targetedCV:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}
      }};
    },
    clear(){}
  },{delayMs:1,retryDelayMs:2,maxRetries:2});

  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Retry'}});
  await wait(15);
  assert.equal(attempts,3);
  assert.equal(r.getState().autosaveStatus,'saved');
  assert.equal(r.getState().retryCount,0);
  r.destroy();
});

test('autosave stops after configured retry limit',async()=>{
  const s=surface();
  let attempts=0;
  const r=createEditorRecoveryController(s,{
    load:()=>null,
    save(){ attempts++; throw new Error('Permanent failure'); },
    clear(){}
  },{delayMs:1,retryDelayMs:1,maxRetries:2});

  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Fail'}});
  await wait(15);
  assert.equal(attempts,3);
  assert.equal(r.getState().autosaveStatus,'error');
  assert.equal(r.getState().retryCount,2);
  assert.equal(r.getState().lastAutosaveError,'Permanent failure');
  assert.equal(s.getState().session.dirty,true);
  r.destroy();
});

test('explicit save cancels pending retry',async()=>{
  const s=surface();
  let attempts=0;
  const r=createEditorRecoveryController(s,{
    load:()=>null,
    save(session){
      attempts++;
      if(attempts===1) throw new Error('Temporary');
      return {version:'1.0.0',savedAt:new Date().toISOString(),session,application:{
        version:'1.0.0',
        masterProfile:{careerData:{identity:{fullName:'Candidate'},sections:[]}},
        targetedCV:{title:'CV',configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}}
      }};
    },
    clear(){}
  },{delayMs:1,retryDelayMs:20,maxRetries:2});

  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Cancel Retry'}});
  await wait(4);
  assert.equal(r.getState().retryCount,1);
  r.save();
  await wait(30);
  assert.equal(attempts,2);
  assert.equal(r.getState().autosaveStatus,'saved');
  r.destroy();
});
