export const LAYOUT_ENGINE_VERSION = '1.0.0';

export const BLOCK_KIND = Object.freeze({
  DOCUMENT_HEADER: 'document-header',
  SECTION_HEADING: 'section-heading',
  CONTENT: 'content',
  EXPERIENCE_ENTRY: 'experience-entry',
  EDUCATION_ENTRY: 'education-entry',
  PROJECT_ENTRY: 'project-entry',
  SKILL_GROUP: 'skill-group',
  IMAGE: 'image',
  SPACER: 'spacer',
  PAGE_BREAK: 'page-break',
  CUSTOM: 'custom'
});

export const FLOW_STATE = Object.freeze({
  FIT: 'fit',
  SPLIT: 'split',
  MOVED: 'moved',
  OVERFLOW: 'overflow',
  BREAK: 'break',
  UNSUPPORTED: 'unsupported'
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const num = (value, fallback = 0) => Number.isFinite(value) ? Number(value) : fallback;

export function createPageModel(input = {}) {
  const width = num(input.width, 794);
  const height = num(input.height, 1123);
  const margins = {
    top: num(input.margins?.top, 0),
    right: num(input.margins?.right, 0),
    bottom: num(input.margins?.bottom, 0),
    left: num(input.margins?.left, 0)
  };
  const header = num(input.headerHeight, 0);
  const footer = num(input.footerHeight, 0);
  return {
    format: String(input.format || 'A4'),
    width, height, margins,
    headerHeight: header, footerHeight: footer,
    usableWidth: Math.max(0, width - margins.left - margins.right),
    usableHeight: Math.max(0, height - margins.top - margins.bottom - header - footer),
    columns: Math.max(1, Math.floor(num(input.columns, 1)))
  };
}

export function createLayoutBlock(input = {}) {
  const measured = Math.max(0, num(input.measuredHeight, 0));
  const block = {
    id: String(input.id || ''),
    kind: String(input.kind || BLOCK_KIND.CUSTOM),
    parentId: input.parentId == null ? null : String(input.parentId),
    order: num(input.order, 0),
    measuredHeight: measured,
    minHeight: Math.max(0, num(input.minHeight, measured)),
    preferredHeight: Math.max(0, num(input.preferredHeight, measured)),
    splittable: input.splittable === true,
    splitAt: Array.isArray(input.splitAt) ? input.splitAt.map(v => Math.max(0, num(v))).sort((a,b)=>a-b) : [],
    keepWithNext: input.keepWithNext === true,
    keepTogether: input.keepTogether !== false,
    mayStartPage: input.mayStartPage !== false,
    mayEndPage: input.mayEndPage !== false,
    priority: num(input.priority, 0),
    metadata: isObject(input.metadata) ? clone(input.metadata) : {}
  };
  if (!block.id) throw new Error('Layout block id is required.');
  if (block.kind === BLOCK_KIND.PAGE_BREAK) block.measuredHeight = 0;
  return Object.freeze(block);
}

function canFit(block, remaining) {
  return block.measuredHeight <= remaining && block.minHeight <= remaining;
}

function findSplit(block, remaining) {
  if (!block.splittable) return null;
  const candidates = block.splitAt.filter(point => point > 0 && point < block.measuredHeight && point <= remaining);
  return candidates.length ? Math.max(...candidates) : null;
}

export function paginateBlocks(blockInputs, pageInput = {}) {
  const pageModel = createPageModel(pageInput);
  const blocks = (Array.isArray(blockInputs) ? blockInputs : []).map(createLayoutBlock).sort((a,b) => a.order - b.order);
  const pages = [];
  const diagnostics = [];
  let page = { number: 1, blocks: [], usedHeight: 0, remainingHeight: pageModel.usableHeight };

  const flush = () => {
    pages.push(page);
    page = { number: pages.length + 1, blocks: [], usedHeight: 0, remainingHeight: pageModel.usableHeight };
  };

  for (const block of blocks) {
    if (block.kind === BLOCK_KIND.PAGE_BREAK) {
      if (page.blocks.length) flush();
      else diagnostics.push({ blockId: block.id, state: FLOW_STATE.BREAK, message: 'Manual page break at page boundary.' });
      continue;
    }

    if (block.keepWithNext) {
      const next = blocks.find(candidate => candidate.order > block.order);
      if (next && next.kind !== BLOCK_KIND.PAGE_BREAK && block.measuredHeight + next.measuredHeight > page.remainingHeight && page.blocks.length) flush();
    }

    if (canFit(block, page.remainingHeight)) {
      page.blocks.push({ id: block.id, height: block.measuredHeight, state: FLOW_STATE.FIT });
      page.usedHeight += block.measuredHeight;
      page.remainingHeight -= block.measuredHeight;
      continue;
    }

    let split = findSplit(block, page.remainingHeight);
    if (split !== null && page.remainingHeight > 0) {
      page.blocks.push({ id: block.id, height: split, state: FLOW_STATE.SPLIT, part: 1, sourceHeight: block.measuredHeight });
      page.usedHeight += split; page.remainingHeight -= split; flush();
      const remainder = block.measuredHeight - split;
      page.blocks.push({ id: block.id, height: remainder, state: FLOW_STATE.SPLIT, part: 2, sourceHeight: block.measuredHeight });
      page.usedHeight += remainder; page.remainingHeight -= remainder;
      continue;
    }

    if (page.blocks.length) {
      flush();
      if (canFit(block, page.remainingHeight)) {
        page.blocks.push({ id: block.id, height: block.measuredHeight, state: FLOW_STATE.MOVED });
        page.usedHeight += block.measuredHeight; page.remainingHeight -= block.measuredHeight;
        continue;
      }
    }

    split = findSplit(block, page.remainingHeight);
    if (split !== null) {
      page.blocks.push({ id: block.id, height: split, state: FLOW_STATE.SPLIT, part: 1, sourceHeight: block.measuredHeight });
      page.usedHeight += split; page.remainingHeight -= split; flush();
      const remainder = block.measuredHeight - split;
      page.blocks.push({ id: block.id, height: remainder, state: FLOW_STATE.SPLIT, part: 2, sourceHeight: block.measuredHeight });
      page.usedHeight += remainder; page.remainingHeight -= remainder;
      continue;
    }

    page.blocks.push({ id: block.id, height: block.measuredHeight, state: FLOW_STATE.OVERFLOW });
    page.usedHeight += block.measuredHeight;
    page.remainingHeight = Math.max(0, page.remainingHeight - block.measuredHeight);
    diagnostics.push({ blockId: block.id, state: FLOW_STATE.OVERFLOW, message: 'Block exceeds the available page area under current constraints.' });
  }

  if (page.blocks.length || pages.length === 0) pages.push(page);
  return {
    version: LAYOUT_ENGINE_VERSION,
    pageModel, pageCount: pages.length, pages, diagnostics,
    hasOverflow: diagnostics.some(d => d.state === FLOW_STATE.OVERFLOW)
  };
}

export function measureBlocks(blocks, measureFn) {
  if (typeof measureFn !== 'function') throw new Error('measureFn is required.');
  return (Array.isArray(blocks) ? blocks : []).map(block => {
    const source = clone(block);
    const measured = Math.max(0, num(measureFn(source), num(source.measuredHeight, 0)));
    return { ...source, measuredHeight: measured, preferredHeight: Math.max(0, num(source.preferredHeight, measured)), minHeight: Math.max(0, num(source.minHeight, measured)) };
  });
}

export function createLayoutResult(pagination, metadata = {}) {
  return {
    version: LAYOUT_ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    pageCount: pagination.pageCount,
    hasOverflow: pagination.hasOverflow,
    pageModel: clone(pagination.pageModel),
    pages: clone(pagination.pages),
    diagnostics: clone(pagination.diagnostics),
    metadata: isObject(metadata) ? clone(metadata) : {}
  };
}
