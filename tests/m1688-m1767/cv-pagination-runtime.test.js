import test from 'node:test';
import assert from 'node:assert/strict';
import { createPaginationRuntime } from '../../src/application/cv-pagination-runtime.js';

const projection = {
  version:'1.0.0',
  masterProfileId:'p1',
  targetedCVId:'cv1',
  sections:[
    {id:'s1',fields:[{id:'f1'}],entries:[]},
    {id:'s2',fields:[],entries:[{id:'e1'}]}
  ]
};

test('M1688-M1703 builds render blocks from projection', () => {
  const runtime = createPaginationRuntime();
  assert.equal(runtime.createBlocks(projection).length, 4);
});

test('M1704-M1719 paginates projection blocks', () => {
  const runtime = createPaginationRuntime();
  const result = runtime.paginate(projection, { pageModel:{width:300,height:120,margins:{top:0,right:0,bottom:0,left:0}} });
  assert.ok(result.pageCount >= 1);
  assert.equal(result.pageCount, result.pages.length);
});

test('M1720-M1735 supports measured heights', () => {
  const runtime = createPaginationRuntime();
  const result = runtime.paginate(projection, {
    measuredHeights:{'section:s1':10,'field:s1:f1':10,'section:s2':10,'entry:s2:e1':10}
  });
  assert.equal(result.pages[0].usedHeight, 40);
});

test('M1736-M1751 validates pagination evidence', () => {
  const runtime = createPaginationRuntime();
  const result = runtime.paginate(projection);
  assert.equal(runtime.validate(result).valid, true);
});

test('M1752-M1767 destroyed runtime fences further work', () => {
  const runtime = createPaginationRuntime();
  runtime.destroy();
  assert.equal(runtime.paginate(projection), null);
  assert.deepEqual(runtime.createBlocks(projection), []);
});
