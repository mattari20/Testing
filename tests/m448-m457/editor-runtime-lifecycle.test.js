import test from 'node:test';
import assert from 'node:assert/strict';
import { mountV2EditorRuntime } from '../../src/ui/editor-runtime.js';

function storage(){
  const data = new Map();
  return {
    getItem:key => data.has(key) ? data.get(key) : null,
    setItem:(key,value) => data.set(key,String(value)),
    removeItem:key => data.delete(key)
  };
}

function root(){
  const form = { replaceChildren() {}, querySelectorAll() { return []; } };
  return {
    querySelector:selector => selector === '[data-v2-editor-form]' ? form : null,
    querySelectorAll:() => [],
    ownerDocument:{
      createElement(){
        return { childNodes:[], set innerHTML(value){ this.childNodes=[]; } };
      }
    }
  };
}

test('runtime exposes lifecycle convenience operations without persistence',()=>{
  const runtime=mountV2EditorRuntime(root());
  runtime.surface.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Runtime Save'}});
  assert.equal(runtime.lifecycle.getState().status,'dirty');
  runtime.save();
  assert.equal(runtime.lifecycle.getState().status,'saved');
  assert.equal(runtime.surface.getState().session.dirty,false);
  runtime.destroy();
});

test('runtime lifecycle saves through configured persistence',()=>{
  const runtime=mountV2EditorRuntime(root(),{
    persistence:{storage:storage(),key:'runtime-lifecycle-key'}
  });
  runtime.surface.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Persisted Runtime'}});
  const record=runtime.save();
  assert.equal(record.application.masterProfile.careerData.identity.fullName,'Persisted Runtime');
  assert.equal(runtime.lifecycle.getState().status,'saved');
  runtime.destroy();
});
