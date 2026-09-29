import { BLOCK_KIND, createLayoutBlock, createPageModel, paginateBlocks } from '../layout/layout-pagination-engine.js';

export const NATIVE_MEASUREMENT_HARNESS_VERSION = '1.0.0';

const clone = value => JSON.parse(JSON.stringify(value));

function numeric(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

export function classifyMeasuredElement(element) {
  const kind = element.getAttribute('data-v2-layout-kind');
  const map = {
    'document-header': BLOCK_KIND.DOCUMENT_HEADER,
    'section-heading': BLOCK_KIND.SECTION_HEADING,
    content: BLOCK_KIND.CONTENT,
    'experience-entry': BLOCK_KIND.EXPERIENCE_ENTRY,
    'education-entry': BLOCK_KIND.EDUCATION_ENTRY,
    'project-entry': BLOCK_KIND.PROJECT_ENTRY,
    'skill-group': BLOCK_KIND.SKILL_GROUP,
    image: BLOCK_KIND.IMAGE,
    spacer: BLOCK_KIND.SPACER,
    'page-break': BLOCK_KIND.PAGE_BREAK
  };
  return map[kind] || BLOCK_KIND.CUSTOM;
}

export function measureNativeLayoutElements(root) {
  if (!root?.querySelectorAll) throw new Error('A rendered template root is required.');
  const elements = [...root.querySelectorAll('[data-v2-layout-block]')];
  return elements.map((element, index) => {
    const rect = typeof element.getBoundingClientRect === 'function'
      ? element.getBoundingClientRect()
      : { height: numeric(element.offsetHeight, 0), width: numeric(element.offsetWidth, 0) };

    const height = Math.max(0, numeric(rect.height, numeric(element.offsetHeight, 0)));
    const id = element.getAttribute('data-v2-layout-block-id') || element.id || `native-block-${index + 1}`;
    return createLayoutBlock({
      id,
      kind: classifyMeasuredElement(element),
      order: index,
      measuredHeight: height,
      minHeight: height,
      preferredHeight: height,
      splittable: element.getAttribute('data-v2-splittable') === 'true',
      keepWithNext: element.getAttribute('data-v2-keep-with-next') === 'true',
      keepTogether: element.getAttribute('data-v2-keep-together') !== 'false',
      metadata: {
        templateElement: element.tagName.toLowerCase(),
        semanticSection: element.getAttribute('data-v2-section'),
        sourceSelector: element.getAttribute('data-v2-layout-selector') || null
      }
    });
  });
}

export function createNativeMeasurementResult(root, pageInput = {}) {
  const blocks = measureNativeLayoutElements(root);
  const pageModel = createPageModel(pageInput);
  const pagination = paginateBlocks(blocks, pageModel);
  return {
    version: NATIVE_MEASUREMENT_HARNESS_VERSION,
    blockCount: blocks.length,
    blocks: clone(blocks),
    pageModel,
    pagination
  };
}
