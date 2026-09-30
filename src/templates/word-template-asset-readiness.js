export const WORD_TEMPLATE_ASSET_READINESS_VERSION = '1.0.0';

export const WORD_TEMPLATE_ASSET_SOURCE_STATUS = Object.freeze({
  SOURCE_AVAILABLE: 'source-available',
  SOURCE_MISSING: 'source-missing',
  NORMALIZATION_REQUIRED: 'normalization-required'
});

const ASSET_AUDIT = Object.freeze([
  ['t01-modern-minimalist-cv-design_modern','T01','source-missing'],
  ['t02-professional-cv-design_modern','T02','source-missing'],
  ['t03-professional-cv-design_modern','T03','normalization-required'],
  ['t04-modern-blue-corporate_modern','T04','normalization-required'],
  ['t05-simple-cv-graphic-web-designer_modern','T05','normalization-required'],
  ['t06-professional-cv-graphic-designer_modern','T06','source-missing'],
  ['t07-professional-cv-store-manager-incharge_modern','T07','source-missing']
].map(([templateId, code, status]) => Object.freeze({ templateId, code, status })));

export function listWordTemplateAssetAudit() {
  return ASSET_AUDIT.map(item => Object.freeze({ ...item }));
}

export function getWordTemplateAssetAudit(templateId) {
  const found = ASSET_AUDIT.find(item => item.templateId === String(templateId));
  return found ? Object.freeze({ ...found }) : null;
}

export function summarizeWordTemplateAssetAudit() {
  const summary = {
    total: ASSET_AUDIT.length,
    sourceAvailable: ASSET_AUDIT.filter(x => x.status === 'source-available').length,
    normalizationRequired: ASSET_AUDIT.filter(x => x.status === 'normalization-required').length,
    sourceMissing: ASSET_AUDIT.filter(x => x.status === 'source-missing').length,
    releaseReady: 0
  };
  return Object.freeze(summary);
}

export function assertWordTemplateAssetReleaseReady(audit = summarizeWordTemplateAssetAudit()) {
  if (audit.releaseReady !== audit.total) {
    throw new Error('Word template asset release is blocked until every asset is individually reviewed and marked READY.');
  }
  return true;
}
