import manifest from '../../docs/03-implementation/FINAL_WORD_TEMPLATE_ASSET_MANIFEST.json' with { type: 'json' };

export const WORD_TEMPLATE_PRODUCTION_GATE_VERSION = '1.0.0';
export const WORD_TEMPLATE_PRODUCTION_GATE_STATUS = Object.freeze({
  PASS: 'PASS',
  BLOCKED: 'BLOCKED'
});

const REQUIRED_ASSETS = Object.freeze(manifest.assets.map(asset => Object.freeze({ ...asset })));

function normalizeObservation(observation = {}) {
  return Object.freeze({
    templateId: String(observation.templateId || ''),
    fileName: String(observation.fileName || ''),
    url: String(observation.url || ''),
    httpStatus: Number(observation.httpStatus || 0),
    sha256: String(observation.sha256 || '').toLowerCase(),
    sizeBytes: Number(observation.sizeBytes || 0),
    observedAt: observation.observedAt ? String(observation.observedAt) : null
  });
}

export function listRequiredWordTemplateProductionAssets() {
  return REQUIRED_ASSETS.map(asset => Object.freeze({ ...asset }));
}

export function evaluateWordTemplateProductionGate(observations = []) {
  const normalized = Array.isArray(observations)
    ? observations.map(normalizeObservation)
    : [];

  const byTemplate = new Map();
  const duplicateTemplateIds = [];

  for (const observation of normalized) {
    if (byTemplate.has(observation.templateId)) duplicateTemplateIds.push(observation.templateId);
    byTemplate.set(observation.templateId, observation);
  }

  const failures = [];

  for (const expected of REQUIRED_ASSETS) {
    const actual = byTemplate.get(expected.templateId);

    if (!actual) {
      failures.push({ templateId: expected.templateId, reason: 'missing-observation' });
      continue;
    }

    if (actual.fileName !== expected.fileName) {
      failures.push({ templateId: expected.templateId, reason: 'filename-mismatch' });
    }

    const expectedUrl = manifest.productionBasePath + expected.fileName;
    if (actual.url !== expectedUrl) {
      failures.push({ templateId: expected.templateId, reason: 'url-mismatch' });
    }

    if (actual.httpStatus !== 200) {
      failures.push({ templateId: expected.templateId, reason: 'http-status-not-200', actual: actual.httpStatus });
    }

    if (actual.sha256 !== expected.sha256) {
      failures.push({ templateId: expected.templateId, reason: 'sha256-mismatch' });
    }

    if (actual.sizeBytes !== expected.sizeBytes) {
      failures.push({ templateId: expected.templateId, reason: 'size-mismatch' });
    }

    if (!actual.observedAt) {
      failures.push({ templateId: expected.templateId, reason: 'missing-observed-at' });
    }
  }

  for (const templateId of duplicateTemplateIds) {
    failures.push({ templateId, reason: 'duplicate-observation' });
  }

  return Object.freeze({
    version: WORD_TEMPLATE_PRODUCTION_GATE_VERSION,
    status: failures.length === 0 && normalized.length === REQUIRED_ASSETS.length
      ? WORD_TEMPLATE_PRODUCTION_GATE_STATUS.PASS
      : WORD_TEMPLATE_PRODUCTION_GATE_STATUS.BLOCKED,
    requiredCount: REQUIRED_ASSETS.length,
    observedCount: normalized.length,
    failures: Object.freeze(failures)
  });
}

export function assertWordTemplateProductionReady(result) {
  if (result?.status !== WORD_TEMPLATE_PRODUCTION_GATE_STATUS.PASS) {
    const reasons = (result?.failures || []).map(item => item.templateId + ':' + item.reason);
    throw new Error('Static Word-template production gate is blocked by: ' + reasons.join(', '));
  }
  return true;
}
