import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOURCE_TYPE,
  REVIEW_STATE,
  LOSS_CLASS,
  detectSource,
  normalizeV1Source,
  migrateV1ToV2,
  createImportCandidate,
  acceptImportCandidate,
  partiallyAcceptImportCandidate,
  classifyLoss,
  isAlreadyMigrated
} from '../../src/import/import-migration-engine.js';

const v1 = {
  legacyKey: 'cv_estudent_v2_final',
  schemaVersion: '2.0.0',
  cv: {
    personal: { name: 'Ali', job: 'Engineer', email: 'ali@example.com' },
    summary: 'Experienced engineer.',
    education: [{ institution: 'University', degree: 'BS', start: '2020', end: '2024' }],
    experience: [{ employer: 'Example Ltd', role: 'Engineer', start: '2024', end: '' }],
    projects: [{ name: 'Project A', description: 'Builds things.' }],
    skills: ['JavaScript', 'Python'],
    languages: [{ name: 'English', proficiency: 'Professional' }],
    achievements: ['Award'],
    photo: 'photo-data'
  },
  cvVisibility: { email: false, summary: true },
  themeColor: '#1e3a68',
  templateId: 't01-modern-minimalist-cv-design_modern'
};

test('detects V1 native sources', () => {
  const result = detectSource(v1);
  assert.equal(result.sourceType, SOURCE_TYPE.V1_NATIVE);
  assert.equal(result.confidence, 'high');
});

test('normalizes V1 source without changing its semantic payload', () => {
  const source = normalizeV1Source(v1);
  assert.equal(source.sourceType, SOURCE_TYPE.V1_NATIVE);
  assert.equal(source.cv.personal.name, 'Ali');
  assert.equal(source.visibility.email, false);
});

test('migrates V1 career data into V2 profile and targeted CV', () => {
  const result = migrateV1ToV2(v1);
  assert.equal(result.report.completed, true);
  assert.equal(result.profile.careerData.sections.length, 8);
  assert.equal(result.targetedCV.masterProfileId, result.profile.id);
  assert.equal(result.snapshot.masterProfileId, result.profile.id);
});

test('preserves V1 hidden field semantics as configuration, not deletion', () => {
  const result = migrateV1ToV2(v1);
  const emailSection = result.profile.careerData.sections.find(s => s.id === 'personal');
  const email = emailSection.fields.find(f => f.id === 'email');
  assert.equal(email.value, 'ali@example.com');
  assert.ok(result.targetedCV.configuration.hiddenFields.includes('email'));
});

test('preserves source template as pending compatibility reference', () => {
  const result = migrateV1ToV2(v1);
  assert.equal(result.targetedCV.configuration.template.id, v1.templateId);
  assert.equal(result.targetedCV.configuration.template.compatibilityPending, true);
});

test('supports external import review and partial acceptance', () => {
  const candidate = createImportCandidate({
    sourceName: 'resume.pdf',
    format: 'pdf',
    data: { name: 'Ali', email: 'ali@example.com' }
  });
  assert.equal(candidate.sourceType, SOURCE_TYPE.PDF);
  assert.equal(candidate.reviewState, REVIEW_STATE.NEEDS_REVIEW);
  const accepted = acceptImportCandidate(candidate, { name: 'Ali' });
  assert.equal(accepted.reviewState, REVIEW_STATE.ACCEPTED);
  const partial = partiallyAcceptImportCandidate(candidate, { email: 'ali@example.com' }, ['phone']);
  assert.equal(partial.reviewState, REVIEW_STATE.PARTIALLY_ACCEPTED);
});

test('classifies migration/import outcomes without hiding loss', () => {
  assert.equal(classifyLoss({}), LOSS_CLASS.NONE);
  assert.equal(classifyLoss({representationalChange: true}), LOSS_CLASS.REPRESENTATIONAL);
  assert.equal(classifyLoss({unsupportedPreserved: true}), LOSS_CLASS.PRESERVED);
  assert.equal(classifyLoss({unresolved: true}), LOSS_CLASS.UNRESOLVED);
  assert.equal(classifyLoss({error: true}), LOSS_CLASS.ERROR);
});

test('migration fingerprint supports idempotency checks', () => {
  const first = migrateV1ToV2(v1);
  assert.equal(isAlreadyMigrated(v1, [{ report: first.report }]), true);
});
