import { listNativeV2Templates } from '../templates/v2-native-template-catalog.js';
import { COMPARISON_STATUS } from './golden-baseline-comparison.js';

export const M23_BROWSER_EVIDENCE_VERSION = '1.0.0';

export function createBrowserEvidenceCapture(input = {}) {
  const templates = Array.isArray(input.templates) ? input.templates : listNativeV2Templates();
  const viewport = input.viewport || { width: 794, height: 1123, deviceScaleFactor: 1 };
  const results = templates.map(template => ({
    templateId: String(template.id),
    templateVersion: String(template.version || template.templateVersion || 'unknown'),
    v1BaselineId: template.v1BaselineId ? String(template.v1BaselineId) : null,
    viewport: { ...viewport },
    render: { status: 'pending', diagnostics: [] },
    geometry: { status: 'pending', blocks: [] },
    screenshot: { status: 'pending', artifact: null },
    pagination: { status: 'pending', pageCount: null, hasOverflow: null },
    comparison: { status: COMPARISON_STATUS.INSUFFICIENT_EVIDENCE, reason: 'Browser evidence has not yet been captured.' }
  }));
  return { version: M23_BROWSER_EVIDENCE_VERSION, templateCount: results.length, results };
}

export function recordBrowserMeasurement(capture, templateId, measurement = {}) {
  const result = capture?.results?.find(item => item.templateId === String(templateId));
  if (!result) throw new Error('Template is not present in evidence capture: ' + templateId);
  result.render = { status: measurement.renderStatus || 'ready', diagnostics: Array.isArray(measurement.renderDiagnostics) ? measurement.renderDiagnostics : [] };
  result.geometry = { status: Array.isArray(measurement.blocks) && measurement.blocks.length > 0 ? 'collected' : 'insufficient', blocks: Array.isArray(measurement.blocks) ? measurement.blocks.map(block => ({ ...block })) : [] };
  result.pagination = { status: measurement.pagination ? 'collected' : 'insufficient', pageCount: measurement.pagination?.pageCount ?? null, hasOverflow: measurement.pagination?.hasOverflow ?? null };
  result.screenshot = { status: measurement.screenshotArtifact ? 'collected' : 'pending', artifact: measurement.screenshotArtifact || null };
  return result;
}

export function finalizeBrowserEvidence(capture) {
  const results = Array.isArray(capture?.results) ? capture.results : [];
  for (const result of results) {
    const ready = result.render.status === 'ready' && result.geometry.status === 'collected' && result.pagination.status === 'collected' && result.screenshot.status === 'collected';
    result.comparison = ready
      ? { status: COMPARISON_STATUS.INSUFFICIENT_EVIDENCE, reason: 'V2 evidence collected; V1 comparison evidence is still required.' }
      : { status: COMPARISON_STATUS.INSUFFICIENT_EVIDENCE, reason: 'Browser evidence is incomplete.' };
  }
  return capture;
}