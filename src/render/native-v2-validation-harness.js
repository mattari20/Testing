import { renderNativeTemplateSource } from './native-v2-template-renderer.js';
import { createNativeMeasurementResult } from './native-measurement-harness.js';

export const NATIVE_V2_VALIDATION_HARNESS_VERSION = '1.0.0';

export function validateNativeTemplateSet(input = {}) {
  const templates = Array.isArray(input.templates) ? input.templates : [];
  if (!templates.length) throw new Error('At least one native V2 template is required.');
  if (typeof input.documentFactory !== 'function') throw new Error('A documentFactory is required for browser validation.');

  const snapshot = input.snapshot || {};
  const pageModel = input.pageModel || { width: 794, height: 1123, margins: { top: 0, right: 0, bottom: 0, left: 0 } };
  const results = [];

  for (const template of templates) {
    const documentRef = input.documentFactory();
    const rendered = renderNativeTemplateSource(template, snapshot, documentRef);
    const measurement = createNativeMeasurementResult(rendered.root, pageModel);
    const zeroHeightBlocks = measurement.blocks.filter(block => block.measuredHeight === 0 && block.kind !== 'page-break');

    results.push({
      templateId: template.id,
      templateVersion: template.templateVersion,
      renderState: rendered.state,
      renderDiagnostics: rendered.diagnostics,
      blockCount: measurement.blockCount,
      pageCount: measurement.pagination.pageCount,
      hasOverflow: measurement.pagination.hasOverflow,
      zeroHeightBlocks: zeroHeightBlocks.map(block => block.id),
      browserMeasurementEvidence: zeroHeightBlocks.length === 0 && measurement.blockCount > 0 ? 'collected' : 'insufficient',
      compatibility: 'pending-golden-baseline'
    });
  }

  return {
    version: NATIVE_V2_VALIDATION_HARNESS_VERSION,
    templateCount: results.length,
    results,
    allRendered: results.every(result => result.renderState === 'ready'),
    allMeasured: results.every(result => result.browserMeasurementEvidence === 'collected'),
    allOverflowFree: results.every(result => !result.hasOverflow),
    compatibility: 'pending-golden-baseline'
  };
}
