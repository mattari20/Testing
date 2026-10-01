import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createEditorPersistenceAdapter, createEditorRecoveryController } from '../../src/storage/editor-persistence.js';
import { createEditorLifecycleController } from '../../src/application/editor-lifecycle-controller.js';

function storage(){
  const data = new Map();
  return {
    getItem:key => data.has(key) ? data.get(key) : null,
    setItem:(key,value) => data.set(key,String(value)),
    removeItem:key => data.delete(key)
  };
}

function surface(){
  return createEditorSurface({
    profileData:{
      careerData:{
        identity:{fullName:'Ali Akbar',jobTitle:'Engineer'},
        sections:[{
          id:'experience',
          type:'experience',
          title:'Experience',
          fields:[{id:'role',label:'Role',value:'Engineer'}],
          entries:[{id:'job1',values:{company:'Example Ltd'}}],
          repeatable:true
        }]
      }
    },
    cvData:{
      title:'Engineer CV',
      configuration:{template:{id:'t01-modern-minimalist-cv-design_modern'}}
    }
  });
}

test('lifecycle exposes explicit save and reports saved state',()=>{
  const s=surface();
  const adapter=createEditorPersistenceAdapter(storage(),'lifecycle-save');
  const recovery=createEditorRecoveryController(s,adapter);
  const lifecycle=createEditorLifecycleController(s,recovery);
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Lifecycle Candidate'}});
  assert.equal(lifecycle.getState().status,'dirty');
  const record=lifecycle.save();
  assert.equal(record.application.masterProfile.careerData.identity.fullName,'Lifecycle Candidate');
  assert.equal(lifecycle.getState().status,'saved');
  assert.equal(lifecycle.getState().dirty,false);
  lifecycle.destroy();
  recovery.destroy();
});

test('lifecycle reports recovered state after restoring persisted CV',()=>{
  const source=surface();
  const adapter=createEditorPersistenceAdapter(storage(),'lifecycle-recovery');
  const writer=createEditorRecoveryController(source,adapter);
  source.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Recovered Candidate'}});
  writer.save();
  writer.destroy();

  const target=surface();
  const recovery=createEditorRecoveryController(target,adapter);
  const lifecycle=createEditorLifecycleController(target,recovery);
  const record=lifecycle.recover();
  assert.equal(record.application.masterProfile.careerData.identity.fullName,'Recovered Candidate');
  assert.equal(lifecycle.getState().status,'recovered');
  assert.equal(lifecycle.getState().dirty,false);
  lifecycle.destroy();
  recovery.destroy();
});

test('lifecycle subscribers receive lifecycle transitions',()=>{
  const s=surface();
  const adapter=createEditorPersistenceAdapter(storage(),'lifecycle-events');
  const recovery=createEditorRecoveryController(s,adapter);
  const lifecycle=createEditorLifecycleController(s,recovery);
  const statuses=[];
  const unsubscribe=lifecycle.subscribe(state=>statuses.push(state.status));
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Status Candidate'}});
  lifecycle.save();
  assert.deepEqual(statuses,['saved','dirty','saved']);
  unsubscribe();
  lifecycle.destroy();
  recovery.destroy();
});
