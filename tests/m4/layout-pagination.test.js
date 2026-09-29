import assert from 'node:assert/strict';
import {
  BLOCK_KIND,
  FLOW_STATE,
  createPageModel,
  createLayoutBlock,
  paginateBlocks,
  measureBlocks
} from '../../src/layout/layout-pagination-engine.js';

const page = createPageModel({
  format: 'A4', width: 100, height: 100,
  margins: { top: 10, right: 5, bottom: 10, left: 5 },
  headerHeight: 5, footerHeight: 5
});
assert.equal(page.usableWidth, 90);
assert.equal(page.usableHeight, 70);

const blocks = [
  createLayoutBlock({ id: 'heading', kind: BLOCK_KIND.SECTION_HEADING, order: 1, measuredHeight: 15, keepWithNext: true }),
  createLayoutBlock({ id: 'entry', kind: BLOCK_KIND.EXPERIENCE_ENTRY, order: 2, measuredHeight: 40 }),
  createLayoutBlock({ id: 'summary', kind: BLOCK_KIND.CONTENT, order: 3, measuredHeight: 50, splittable: true, splitAt: [20, 30, 40] })
];
const result = paginateBlocks(blocks, { width: 100, height: 100, margins: { top: 10, right: 5, bottom: 10, left: 5 }, headerHeight: 5, footerHeight: 5 });
assert.equal(result.pageCount, 2);
assert.equal(result.pages[0].blocks[0].id, 'heading');
assert.equal(result.pages[0].blocks[0].state, FLOW_STATE.FIT);
assert.equal(result.pages[1].blocks.some(block => block.id === 'summary'), true);
assert.equal(result.hasOverflow, false);

const moved = paginateBlocks([
  { id: 'a', order: 1, measuredHeight: 60 },
  { id: 'b', order: 2, measuredHeight: 30 }
], { width: 100, height: 100, margins: { top: 10, right: 0, bottom: 10, left: 0 } });
assert.equal(moved.pageCount, 2);
assert.equal(moved.pages[1].blocks[0].id, 'b');
assert.equal(moved.pages[1].blocks[0].state, FLOW_STATE.MOVED);

const overflowing = paginateBlocks([
  { id: 'huge', order: 1, measuredHeight: 120, splittable: false }
], { width: 100, height: 100, margins: { top: 10, right: 0, bottom: 10, left: 0 } });
assert.equal(overflowing.hasOverflow, true);
assert.equal(overflowing.pages[0].blocks[0].state, FLOW_STATE.OVERFLOW);

const measured = measureBlocks(
  [{ id: 'x', measuredHeight: 10, minHeight: 5 }],
  block => block.measuredHeight + 7
);
assert.equal(measured[0].measuredHeight, 17);

console.log('M4 layout and pagination tests passed.');
