import { measureBlocks, paginateBlocks, createLayoutResult, BLOCK_KIND } from '../layout/layout-pagination-engine.js';

export const CV_PAGINATION_RUNTIME_VERSION = '1.0.0';
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

function createBlocks(projection, measuredHeights = {}) {
  const blocks = [];
  for (const section of projection?.sections || []) {
    blocks.push({ id: 'section:' + section.id, kind: BLOCK_KIND.SECTION_HEADING, order: blocks.length, measuredHeight: Number(measuredHeights['section:' + section.id] ?? 32), keepWithNext: true, metadata:{ sectionId:section.id } });
    for (const field of section.fields || []) {
      const id = 'field:' + section.id + ':' + field.id;
      blocks.push({ id, kind: BLOCK_KIND.CONTENT, order: blocks.length, measuredHeight: Number(measuredHeights[id] ?? 24), splittable: false, metadata:{ sectionId:section.id, fieldId:field.id } });
    }
    for (const entry of section.entries || []) {
      const id = 'entry:' + section.id + ':' + entry.id;
      blocks.push({ id, kind: BLOCK_KIND.EXPERIENCE_ENTRY, order: blocks.length, measuredHeight: Number(measuredHeights[id] ?? 56), metadata:{ sectionId:section.id, entryId:entry.id } });
    }
  }
  return blocks;
}

export function createPaginationRuntime(input = {}) {
  let lastResult = null;
  let destroyed = false;
  return Object.freeze({
    version: CV_PAGINATION_RUNTIME_VERSION,
    createBlocks(projection, measuredHeights) {
      if (destroyed) return [];
      return createBlocks(projection, measuredHeights);
    },
    paginate(projection, options = {}) {
      if (destroyed) return null;
      const rawBlocks = createBlocks(projection, options.measuredHeights);
      const blocks = typeof options.measureFn === 'function' ? measureBlocks(rawBlocks, options.measureFn) : rawBlocks;
      const pagination = paginateBlocks(blocks, options.pageModel || {});
      lastResult = createLayoutResult(pagination, {
        projectionVersion: projection?.version || null,
        masterProfileId: projection?.masterProfileId || null,
        targetedCVId: projection?.targetedCVId || null,
        runtimeVersion: CV_PAGINATION_RUNTIME_VERSION
      });
      return clone(lastResult);
    },
    getLastResult() { return clone(lastResult); },
    validate(result = lastResult) {
      const errors = [];
      if (!result || result.version !== '1.0.0') errors.push('Layout result is missing or invalid.');
      if (!Number.isInteger(result?.pageCount) || result.pageCount < 1) errors.push('Page count must be a positive integer.');
      if (!Array.isArray(result?.pages)) errors.push('Pages must be an array.');
      if (result?.pageCount !== result?.pages?.length) errors.push('Page count must match pages length.');
      return Object.freeze({ valid: errors.length === 0, errors });
    },
    destroy() { destroyed = true; lastResult = null; }
  });
}
