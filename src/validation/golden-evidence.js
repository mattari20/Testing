import { COMPARISON_DIMENSION, COMPARISON_STATUS } from './golden-baseline-comparison.js';

export const M22_EVIDENCE_VERSION = '1.0.0';

const ALLOWED_STATUSES = new Set(Object.values(COMPARISON_STATUS));
const ALLOWED_DIMENSIONS = new Set(Object.values(COMPARISON_DIMENSION));

export function createEvidenceRecord(input = {}) {
  const dimension = String(input.dimension || '');
  if (!ALLOWED_DIMENSIONS.has(dimension)) throw new Error('Unsupported comparison dimension: ' + dimension);

  const status = String(input.status || COMPARISON_STATUS.INSUFFICIENT_EVIDENCE);
  if (!ALLOWED_STATUSES.has(status)) throw new Error('Unsupported comparison status: ' + status);

  return Object.freeze({
    version: M22_EVIDENCE_VERSION,
    templateId: String(input.templateId || ''),
    baselineId: String(input.baselineId || ''),
    dimension,
    status,
    source: String(input.source || 'unknown'),
    referenceArtifact: input.referenceArtifact == null ? null : String(input.referenceArtifact),
    v1Metrics: input.v1Metrics || null,
    v2Metrics: input.v2Metrics || null,
    tolerance: input.tolerance || null,
    note: String(input.note || ''),
    recordedAt: String(input.recordedAt || new Date().toISOString())
  });
}

export function validateEvidenceRecord(record) {
  const errors = [];
  if (!record?.templateId) errors.push('TEMPLATE_ID_REQUIRED');
  if (!record?.baselineId) errors.push('BASELINE_ID_REQUIRED');
  if (!ALLOWED_DIMENSIONS.has(record?.dimension)) errors.push('DIMENSION_INVALID');
  if (!ALLOWED_STATUSES.has(record?.status)) errors.push('STATUS_INVALID');

  if (record?.status !== COMPARISON_STATUS.INSUFFICIENT_EVIDENCE && !record?.referenceArtifact) {
    errors.push('REFERENCE_ARTIFACT_REQUIRED_FOR_CERTIFICATION');
  }

  return { valid: errors.length === 0, errors };
}
