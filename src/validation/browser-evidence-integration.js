export const BROWSER_EVIDENCE_INTEGRATION_VERSION = '1.0.0';

export function createBrowserEvidenceRecord(input = {}) {
  return Object.freeze({
    version: BROWSER_EVIDENCE_INTEGRATION_VERSION,
    templateId: input.templateId || null,
    templateVersion: input.templateVersion || null,
    baselineId: input.baselineId || null,
    viewport: input.viewport || null,
    renderStatus: input.renderStatus || 'pending',
    geometryStatus: input.geometryStatus || 'pending',
    paginationStatus: input.paginationStatus || 'pending',
    screenshotArtifact: input.screenshotArtifact || null,
    comparisonStatus: input.comparisonStatus || 'insufficient-evidence',
    capturedAt: input.capturedAt || new Date().toISOString()
  });
}

export function validateBrowserEvidenceRecord(record) {
  const errors = [];
  if (!record?.templateId) errors.push('TEMPLATE_ID_REQUIRED');
  if (!record?.templateVersion) errors.push('TEMPLATE_VERSION_REQUIRED');
  if (record?.renderStatus !== 'passed') errors.push('RENDER_NOT_PASSED');
  if (record?.geometryStatus !== 'passed') errors.push('GEOMETRY_NOT_PASSED');
  if (record?.paginationStatus !== 'passed') errors.push('PAGINATION_NOT_PASSED');
  if (!record?.screenshotArtifact) errors.push('SCREENSHOT_REQUIRED');
  return { valid: errors.length === 0, errors };
}

export function aggregateBrowserEvidence(records = []) {
  const normalized = records.map(createBrowserEvidenceRecord);
  const invalid = normalized.map(validateBrowserEvidenceRecord).map((v,i)=>({ ...v,index:i })).filter(v=>!v.valid);
  return Object.freeze({
    version: BROWSER_EVIDENCE_INTEGRATION_VERSION,
    status: invalid.length ? 'incomplete' : 'complete',
    records: normalized,
    invalidRecords: invalid
  });
}
