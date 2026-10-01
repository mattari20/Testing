import test from 'node:test';
import assert from 'node:assert/strict';
import { bindEditorLifecycle } from '../../src/ui/editor-dom-controller.js';

function element(){
  const listeners=new Map();
  return {
    dataset:{},
    disabled:false,
    textContent:'',
    addEventListener:(type,fn)=>listeners.set(type,fn),
    removeEventListener:(type,fn)=>listeners.delete(type),
    click(){ listeners.get('click')?.({preventDefault(){}}); }
  };
}

function root(){
  const save=element(), recover=element(), clear=element(), status=element();
  return {
    save,recover,clear,status,
    querySelectorAll(selector){
      if(selector==='[data-v2-editor-save]') return [save];
      if(selector==='[data-v2-editor-recover]') return [recover];
      if(selector==='[data-v2-editor-clear-recovery]') return [clear];
      if(selector==='[data-v2-editor-save-status]') return [status];
      return [];
    }
  };
}

function lifecycle(){
  const listeners=new Set();
  let state={status:'dirty',dirty:true,savedAt:null,lastCommand:'set-field'};
  return {
    getState:()=>state,
    subscribe(fn){listeners.add(fn);fn(state);return()=>listeners.delete(fn);},
    save(){state={...state,status:'saved',dirty:false,lastCommand:'save'};listeners.forEach(fn=>fn(state));return state;},
    recover(){state={...state,status:'recovered',dirty:false,lastCommand:'restore'};listeners.forEach(fn=>fn(state));return state;},
    clearRecovery(){},
  };
}

test('lifecycle DOM binding wires save, recovery and status controls',()=>{
  const r=root(), l=lifecycle();
  const binding=bindEditorLifecycle(r,l);
  assert.equal(r.status.textContent,'dirty');
  assert.equal(r.save.disabled,false);
  r.save.click();
  assert.equal(r.status.textContent,'saved');
  assert.equal(r.save.disabled,true);
  r.recover.click();
  assert.equal(r.status.textContent,'recovered');
  binding.destroy();
});

test('lifecycle DOM binding can be safely used with a lightweight root',()=>{
  const binding=bindEditorLifecycle({},lifecycle());
  assert.equal(typeof binding.destroy,'function');
  binding.destroy();
});
