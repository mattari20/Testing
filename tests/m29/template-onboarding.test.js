import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ONBOARDING_STATUS,
  assertTemplateCanBePublished,
  buildTemplateOnboardingRecord,
  createNativeTemplateOnboardingPlan,
  validateTemplateDefinition
} from '../../src/templates/template-onboarding.js';

const baseTemplate = {
  id: 'future-template',
  name: 'Future Template',
  version: '2.1.0',
  status: 'testing',
  compatibility: 'v2-compatible',
  sourcePath: 'src/templates/assets/v2/future-template.html',
  supportedSections: ['summary', 'experience'],
  capabilities: {
    nativeContract: true,
    browserMeasurement: 'passed',
    paginationEvidence: 'passed',
    exportEvidence: 'pending'
  },
  v1BaselineId: null
};

test('validates the minimum V2 template onboarding contract', () => {
  const result = validateTemplateDefinition(baseTemplate);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('keeps V2-native templates valid without a V1 baseline', () => {
  const record = buildTemplateOnboardingRecord(baseTemplate);
  assert.equal(record.v1BaselineId, null);
  assert.equal(record.status, ONBOARDING_STATUS.READY);
});

test('blocks publication when required evidence is missing', () => {
  const candidate = {
    ...baseTemplate,
    capabilities: {
      ...baseTemplate.capabilities,
      browserMeasurement: 'pending'
    }
  };

  const record = buildTemplateOnboardingRecord(candidate);
  assert.equal(record.status, ONBOARDING_STATUS.BLOCKED);
  assert.throws(() => assertTemplateCanBePublished(candidate), /cannot be published/i);
});

test('requires published templates to declare V2 compatibility', () => {
  const result = validateTemplateDefinition({
    ...baseTemplate,
    status: 'published',
    compatibility: 'pending-browser-validation'
  });

  assert.equal(result.valid, false);
  assert.match(result.errors[0], /Published templates/);
});

test('onboarding plan is registry-driven', () => {
  const plan = createNativeTemplateOnboardingPlan([
    baseTemplate,
    { ...baseTemplate, id: 'second-template', version: '2.2.0' }
  ]);

  assert.equal(plan.templateCount, 2);
  assert.equal(plan.readyCount, 2);
  assert.equal(plan.blockedCount, 0);
});
