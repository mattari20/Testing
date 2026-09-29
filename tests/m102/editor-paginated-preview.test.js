import test from 'node:test';import assert from 'node:assert/strict';import {createPaginatedPreview} from '../../src/ui/editor-paginated-preview.js';
test('paginated preview exposes bounded page state',()=>{const p=createPaginatedPreview({pages:[{id:1},{id:2}]},{page:2});assert.equal(p.state.currentPage,2);assert.equal(p.state.pageCount,2);});
