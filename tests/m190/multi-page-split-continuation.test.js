import test from 'node:test';
import assert from 'node:assert/strict';
import {paginateBlocks} from '../../src/layout/layout-pagination-engine.js';

test('M190 continues a split block across multiple pages without overflow',()=>{
 const result=paginateBlocks([{
  id:'long',
  kind:'content',
  measuredHeight:1800,
  splittable:true,
  splitAt:[800,1400]
 }],{width:794,height:1123});
 assert.equal(result.hasOverflow,false);
 assert.ok(result.pageCount>=2);
 const refs=result.pages.flatMap(page=>page.blocks).filter(block=>block.id==='long');
 assert.ok(refs.length>=2);
 assert.deepEqual(refs.map(x=>x.part),[1,2,3]);
});
