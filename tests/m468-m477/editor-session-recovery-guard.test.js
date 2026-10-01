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
