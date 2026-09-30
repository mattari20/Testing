import test from 'node:test';
import assert from 'node:assert/strict';
import {orderFragmentPages,validateFragmentGeometry} from '../../src/ui/editor-preview-fragment-ordering.js';
import {markRepeatedHeaderFragments} from '../../src/ui/editor-preview-repeated-headers.js';
import {applyExplicitPageBreaks} from '../../src/ui/editor-preview-page-breaks.js';
import {protectOrphansAndWidows} from '../../src/ui/editor-preview-orphan-widow.js';
import {enforceKeepWithNext} from '../../src/ui/editor-preview-keep-with-next.js';
import {validateFragmentSlices} from '../../src/ui/editor-preview-fragment-validation.js';

test('M138 orders fragments and validates geometry',()=>{
 const pages=orderFragmentPages([{fragments:[{order:2},{order:1}]}]);
 assert.equal(pages[0].fragments[0].order,1);
 assert.equal(validateFragmentGeometry(pages).valid,true);
});

test('M139 marks repeated header semantics',()=>{
 const pages=markRepeatedHeaderFragments([
  {fragments:[{blockId:'h',kind:'document-header',part:1}]},
  {fragments:[{blockId:'h',kind:'document-header',part:1}]}
 ]);
 assert.equal(pages[1].fragments[0].repeatedHeader,true);
});

test('M140 recognizes manual break metadata',()=>{
 const pages=applyExplicitPageBreaks([
  {fragments:[]},{fragments:[{order:2}]}
 ],[{kind:'page-break',order:2}]);
 assert.equal(pages[1].manualBreakBefore,true);
});

test('M141 protects a heading orphan',()=>{
 const r=protectOrphansAndWidows([
  {fragments:[{blockId:'h',kind:'section-heading'}]},
  {fragments:[{blockId:'x',kind:'experience-entry'}]}
 ]);
 assert.equal(r.moves.length,1);
});

test('M142 moves keep-with-next fragment forward',()=>{
 const r=enforceKeepWithNext([
  {fragments:[{blockId:'h',keepWithNext:true}]},
  {fragments:[{blockId:'x'}]}
 ]);
 assert.equal(r.moves.length,1);
 assert.equal(r.pages[1].fragments[0].blockId,'h');
});

test('M143 validates split slice offsets',()=>{
 const r=validateFragmentSlices([{fragments:[{blockId:'x',state:'split',offset:10,geometry:{height:50,sourceHeight:100}}]}]);
 assert.equal(r.valid,true);
});