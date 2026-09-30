import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WORD_TEMPLATE_ASSET_SOURCE_STATUS,
  getWordTemplateAssetAudit,
  listWordTemplateAssetAudit,
  summarizeWordTemplateAssetAudit,
  assertWordTemplateAssetReleaseReady
} from '../../src/templates/word-template-asset-readiness.js';

test('asset audit covers all seven planned Word templates', () => {
  const audit = listWordTemplateAssetAudit();
  assert.equal(audit.length, 7);
  assert.equal(new Set(audit.map(x => x.templateId)).size, 7);
});

test('current source audit records three available source documents requiring normalization', () => {
  const summary = summarizeWordTemplateAssetAudit();
  assert.equal(summary.total, 7);
  assert.equal(summary.normalizationRequired, 3);
  assert.equal(summary.sourceMissing, 4);
  assert.equal(summary.releaseReady, 0);
});

test('T03, T04 and T05 are explicitly normalization-required rather than falsely READY', () => {
  for (const id of [
    't03-professional-cv-design_modern',
    't04-modern-blue-corporate_modern',
    't05-simple-cv-graphic-web-designer_modern'
  ]) {
    assert.equal(getWordTemplateAssetAudit(id).status, WORD_TEMPLATE_ASSET_SOURCE_STATUS.NORMALIZATION_REQUIRED);
  }
});

test('missing source templates remain explicitly blocked from release', () => {
  for (const id of [
    't01-modern-minimalist-cv-design_modern',
    't02-professional-cv-design_modern',
    't06-professional-cv-graphic-designer_modern',
    't07-professional-cv-store-manager-incharge_modern'
  ]) {
    assert.equal(getWordTemplateAssetAudit(id).status, WORD_TEMPLATE_ASSET_SOURCE_STATUS.SOURCE_MISSING);
  }
});

test('release readiness cannot be self-authorized while assets are unresolved', () => {
  assert.throws(
    () => assertWordTemplateAssetReleaseReady(),
    /Word template asset release is blocked/
  );
});
