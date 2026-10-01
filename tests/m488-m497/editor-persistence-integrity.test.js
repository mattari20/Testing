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
function storage(initial=null){
  const data=new Map();
  if (initial !== null) data.set('state', initial);
  return {
    getItem:k=>data.get(k)||null,
    setItem:(k,v)=>data.set(k,String(v)),
    removeItem:k=>data.delete(k)
  };
}

test('corrupt persisted JSON is reported without breaking recovery controller',()=>{
  const s=surface();
  const a=createEditorPersistenceAdapter(storage('{not-json'),'state');
  const r=createEditorRecoveryController(s,a);
  assert.equal(r.hasRecovery(),false);
  assert.equal(r.getRecoveryState().recoveryStatus,'invalid');
  assert.match(r.getRecoveryState().recoveryError,/Unexpected token|JSON/);
  assert.equal(r.recover(),null);
  assert.equal(s.getState().session.dirty,false);
  r.destroy();
});

test('invalid persisted document cannot replace a dirty editor session',()=>{
  const s=surface();
  const a=createEditorPersistenceAdapter(storage(JSON.stringify({
    version:'1.0.0',
    savedAt:new Date().toISOString(),
    session:{dirty:false},
    application:{version:'1.0.0',masterProfile:{},targetedCV:{}}
  })),'state');
  const r=createEditorRecoveryController(s,a);
  const lifecycle=createEditorLifecycleController(s,r);
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Keep Me'}});
  assert.equal(lifecycle.getState().dirty,true);
  assert.equal(lifecycle.getState().recoveryAvailable,false);
  assert.equal(lifecycle.getState().recoveryStatus,'invalid');
  assert.equal(lifecycle.recover({force:true}),null);
  assert.equal(s.getState().application.masterProfile.careerData.identity.fullName,'Keep Me');
  lifecycle.destroy();
  r.destroy();
});

test('missing recovery is distinct from invalid recovery',()=>{
  const s=surface();
  const a=createEditorPersistenceAdapter(storage(null),'state');
  const r=createEditorRecoveryController(s,a);
  assert.equal(r.hasRecovery(),false);
  assert.deepEqual(r.getRecoveryState(),{recoveryStatus:'missing',recoveryError:null});
  r.destroy();
});

test('clear removes an invalid recovery snapshot and diagnostics',()=>{
  const s=surface();
  const backing=storage('{broken');
  const a=createEditorPersistenceAdapter(backing,'state');
  const r=createEditorRecoveryController(s,a);
  assert.equal(r.getRecoveryState().recoveryStatus,'invalid');
  r.clear();
  assert.deepEqual(r.getRecoveryState(),{recoveryStatus:'missing',recoveryError:null});
  assert.equal(backing.getItem('state'),null);
  r.destroy();
});

test('successful save and autosave expose available recovery state',()=>{
  const s=surface();
  const a=createEditorPersistenceAdapter(storage(null),'state');
  const r=createEditorRecoveryController(s,a,{delayMs:50});
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Saved'}});
  r.flush();
  assert.equal(r.getRecoveryState().recoveryStatus,'available');
  assert.equal(r.getState().recoveryError,null);
  r.destroy();
});
