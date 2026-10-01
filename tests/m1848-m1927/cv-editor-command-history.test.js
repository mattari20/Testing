import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorCommandHistory } from '../../src/application/cv-editor-command-history.js';

function fixture() {
  let value = { title:'A', count:0 };
  const history = createEditorCommandHistory({
    getSnapshot:()=>value,
    restoreSnapshot:next=>{ value=next; },
    maxHistory:2
  });
  return { get value(){return value;}, history };
}

test('M1848-M1863 executes and records a command', () => {
  const f=fixture();
  f.history.execute({label:'Change title',do:()=>{f.value.title='B';}});
  assert.equal(f.value.title,'B');
  assert.equal(f.history.getState().pastCount,1);
});

test('M1864-M1879 undo restores the previous snapshot', () => {
  const f=fixture();
  f.history.execute({do:()=>{f.value.count=1;}});
  f.history.undo();
  assert.equal(f.value.count,0);
});

test('M1880-M1895 redo restores the edited snapshot', () => {
  const f=fixture();
  f.history.execute({do:()=>{f.value.count=1;}});
  f.history.undo();
  f.history.redo();
  assert.equal(f.value.count,1);
});

test('M1896-M1911 new command clears redo history', () => {
  const f=fixture();
  f.history.execute({do:()=>{f.value.count=1;}});
  f.history.undo();
  f.history.execute({do:()=>{f.value.count=2;}});
  assert.equal(f.history.getState().canRedo,false);
});

test('M1912-M1927 history is bounded and destroy is fenced', () => {
  const f=fixture();
  f.history.execute({do:()=>{f.value.count=1;}});
  f.history.execute({do:()=>{f.value.count=2;}});
  f.history.execute({do:()=>{f.value.count=3;}});
  assert.equal(f.history.getState().pastCount,2);
  f.history.destroy();
  assert.equal(f.history.execute({do:()=>{f.value.count=4;}}),null);
});
