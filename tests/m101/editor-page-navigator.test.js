import test from 'node:test';import assert from 'node:assert/strict';import {createEditorPageNavigator} from '../../src/preview/editor-page-navigator.js';
test('navigator emits bounded page transitions',()=>{const seen=[];const n=createEditorPageNavigator({currentPage:1,pageCount:2},s=>seen.push(s.currentPage));n.next();n.next();n.previous();assert.deepEqual(seen,[2,2,1]);});
