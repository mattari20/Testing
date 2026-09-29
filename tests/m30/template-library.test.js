import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createTemplateLibraryPlan,
  getTemplateLibraryEntry,
  listTemplateLibraryEntries
} from '../../src/templates/template-library.js';

const templates = [
  {
    id: 'free-modern',
    name: 'Free Modern',
    version: '2.0.0',
    status: 'published',
    careerLevel: ['Student'],
    industry: ['IT / Software'],
    style: ['Modern'],
    supportedSections: ['summary', 'experience'],
    supportedVariants: [],
    outputs: { web: true, pdf: true, docx: true, blankDocx: true, onlineCV: true },
    photo: { supported: false },
    commercial: { access: 'free' },
    capabilities: {
      nativeContract: true,
      browserMeasurement: 'passed',
      paginationEvidence: 'passed'
    },
    sourcePath: 'future/free-modern.html',
    v1BaselineId: null
  },
  {
    id: 'premium-academic',
    name: 'Premium Academic',
    version: '2.0.0',
    status: 'published',
    careerLevel: ['Academic'],
    industry: ['Research'],
    style: ['Academic'],
    supportedSections: ['summary', 'research'],
    supportedVariants: [],
    outputs: { web: true, pdf: true, docx: false, blankDocx: false, onlineCV: true },
    photo: { supported: true },
    commercial: { access: 'premium' },
    capabilities: {
      nativeContract: true,
      browserMeasurement: 'passed',
      paginationEvidence: 'passed'
    },
    sourcePath: 'future/premium-academic.html',
    v1BaselineId: null
  }
];

test('library entry exposes product-facing capabilities without owning career data', () => {
  const entry = getTemplateLibraryEntry('free-modern', templates);
  assert.equal(entry.outputs.onlineCV, true);
  assert.equal(entry.outputs.blankDocx, true);
  assert.deepEqual(entry.supportedSections, ['summary', 'experience']);
  assert.equal(entry.commercial.access, 'free');
  assert.equal(Object.hasOwn(entry, 'masterProfile'), false);
});

test('library filters are metadata-driven', () => {
  assert.equal(listTemplateLibraryEntries(templates, { careerLevel: ['Student'] }).length, 1);
  assert.equal(listTemplateLibraryEntries(templates, { premium: true }).length, 1);
  assert.equal(listTemplateLibraryEntries(templates, { blankDocx: true }).length, 1);
  assert.equal(listTemplateLibraryEntries(templates, { photo: true }).length, 1);
});

test('library plan is registry-driven', () => {
  const plan = createTemplateLibraryPlan(templates);
  assert.equal(plan.templateCount, 2);
  assert.equal(plan.publishedCount, 2);
  assert.equal(plan.freeCount, 1);
  assert.equal(plan.premiumCount, 1);
});
