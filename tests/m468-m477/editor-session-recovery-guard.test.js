import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSessionGuard } from '../../src/ui/editor-session-guard.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';
import { createEditorPersistenceAdapter, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';

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
function target(){
  const listeners=new Map();
  return {
    addEventListener:(type,fn)=>listeners.set(type,fn),
    removeEventListener:type=>listeners.delete(type),
    fire(type,event){return listeners.get(type)?.(event);}
  };
}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

test('session guard blocks leave only while editor is dirty',()=>{
  const s=surface(), lifecycle=createEditorLifecycleController(s), t=target();
  const guard=createEditorSessionGuard(lifecycle,t);
  assert.equal(guard.canLeave(),true);
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Changed'}});
  assert.equal(guard.hasUnsavedChanges(),true);
  assert.equal(guard.canLeave(),false);
  assert.equal(guard.requestLeave(()=>false),false);
  assert.equal(guard.requestLeave(()=>true),true);
  lifecycle.save();
  assert.equal(guard.canLeave(),true);
  guard.destroy(); lifecycle.destroy();
});

test('beforeunload protection is active for unsaved changes',()=>{
  const s=surface(), lifecycle=createEditorLifecycleController(s), t=target();
  const guard=createEditorSessionGuard(lifecycle,t,{message:'Unsaved CV'});
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Changed'}});
  let prevented=false;
  const event={preventDefault(){prevented=true;},returnValue:null};
  assert.equal(t.fire('beforeunload',event),'Unsaved CV');
  assert.equal(prevented,true);
  assert.equal(event.returnValue,'Unsaved CV');
  guard.destroy(); lifecycle.destroy();
});

test('lifecycle reports and clears recovery availability',()=>{
  const s=surface(), adapter=createEditorPersistenceAdapter(storage(),'recovery-availability');
  const recovery=createEditorRecoveryController(s,adapter);
  const lifecycle=createEditorLifecycleController(s,recovery);
  assert.equal(lifecycle.getState().recoveryAvailable,false);
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Recover Me'}});
  recovery.flush();
  assert.equal(lifecycle.getState().recoveryAvailable,true);
  lifecycle.clearRecovery();
  assert.equal(lifecycle.getState().recoveryAvailable,false);
  lifecycle.destroy(); recovery.destroy();
});

test('recovery cannot replace dirty edits without explicit confirmation',()=>{
  const s=surface(), adapter=createEditorPersistenceAdapter(storage(),'recovery-confirmation');
  const recovery=createEditorRecoveryController(s,adapter);
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Recovered Name'}});
  recovery.flush();
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Current Unsaved'}});
  const lifecycle=createEditorLifecycleController(s,recovery,{confirmRecovery:()=>false});
  assert.equal(lifecycle.recover(),null);
  assert.equal(s.getState().session.application.masterProfile.careerData.identity.fullName,'Current Unsaved');
  assert.equal(s.getState().session.dirty,true);
  lifecycle.destroy(); recovery.destroy();
});

test('confirmed recovery replaces dirty edits safely',()=>{
  const s=surface(), adapter=createEditorPersistenceAdapter(storage(),'recovery-confirmed');
  const recovery=createEditorRecoveryController(s,adapter);
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Recovered Name'}});
  recovery.flush();
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Current Unsaved'}});
  const lifecycle=createEditorLifecycleController(s,recovery,{confirmRecovery:()=>true});
  assert.ok(lifecycle.recover());
  assert.equal(s.getState().session.application.masterProfile.identity.fullName,'Recovered Name');
  assert.equal(s.getState().session.dirty,false);
  assert.equal(lifecycle.getState().status,'recovered');
  lifecycle.destroy(); recovery.destroy();
});

test('explicit save cancels a pending autosave timer',async()=>{
  const s=surface();
  let saves=0;
  const base=createEditorPersistenceAdapter(storage(),'timer-save');
  const adapter={load:base.load,clear:base.clear,save(session){saves+=1; return base.save(session);}};
  const recovery=createEditorRecoveryController(s,adapter,{delayMs:25});
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Saved Once'}});
  recovery.save();
  await wait(45);
  assert.equal(saves,1);
  recovery.destroy();
});

test('recovery cancels a pending autosave timer',async()=>{
  const s=surface();
  let saves=0;
  const base=createEditorPersistenceAdapter(storage(),'timer-recover');
  const adapter={load:base.load,clear:base.clear,save(session){saves+=1; return base.save(session);}};
  const recovery=createEditorRecoveryController(s,adapter,{delayMs:25});
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Recovery Snapshot'}});
  recovery.flush();
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Unsaved'}});
  recovery.recover();
  await wait(45);
  assert.equal(saves,1);
  recovery.destroy();
});

test('clear cancels a pending autosave timer',async()=>{
  const s=surface();
  let saves=0;
  const base=createEditorPersistenceAdapter(storage(),'timer-clear');
  const adapter={load:base.load,clear:base.clear,save(session){saves+=1; return base.save(session);}};
  const recovery=createEditorRecoveryController(s,adapter,{delayMs:25});
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Will Be Cleared'}});
  recovery.clear();
  await wait(45);
  assert.equal(saves,0);
  recovery.destroy();
});

test('failed explicit save keeps the editor dirty',()=>{
  const s=surface();
  const adapter={load:()=>null,save(){throw new Error('Storage unavailable');},clear(){}};
  const recovery=createEditorRecoveryController(s,adapter);
  const lifecycle=createEditorLifecycleController(s,recovery);
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Keep Dirty'}});
  assert.throws(()=>lifecycle.save(),/Storage unavailable/);
  assert.equal(s.getState().session.dirty,true);
  assert.notEqual(lifecycle.getState().status,'saved');
  lifecycle.destroy(); recovery.destroy();
});