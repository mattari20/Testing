import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CV_SECTION_LIBRARY,
  CV_SECTION_LIBRARY_VERSION,
  createSectionFromPreset,
  getSectionPreset,
  listSectionPresets,
  validateSectionLibrary
} from '../../src/application/cv-section-library.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { renderEditorForm } from '../../src/ui/editor-form-renderer.js';

test('section library has valid, unique, versioned presets and typed fields', () => {
  const report = validateSectionLibrary();
  assert.equal(report.valid, true, report.errors.join('; '));
  assert.equal(report.count, 26);
  assert.equal(CV_SECTION_LIBRARY_VERSION, '1.1.0');
  assert.equal(new Set(CV_SECTION_LIBRARY.map(item => item.id)).size, 26);
  assert.equal(new Set(CV_SECTION_LIBRARY.map(item => item.category)).size, 5);
  assert.ok(CV_SECTION_LIBRARY.some(item => item.id === 'language-profiles' && item.title === 'Languages'));
  assert.ok(CV_SECTION_LIBRARY.every(item => item.version === '1.0.0' && item.fields.length > 0));
  assert.ok(CV_SECTION_LIBRARY.some(item => item.id === 'awards-honors' && item.priority === 'P1'));
  assert.ok(CV_SECTION_LIBRARY.some(item => item.id === 'references' && item.priority === 'P3'));
});

test('section catalogue supports search and category/priority filters', () => {
  assert.ok(listSectionPresets({ query: 'doi' }).some(item => item.id === 'publications'));
  assert.ok(listSectionPresets({ category: 'Academic & Research' }).every(item => item.category === 'Academic & Research'));
  assert.ok(listSectionPresets({ priority: 'P1' }).every(item => item.priority === 'P1'));
  assert.equal(getSectionPreset('not-a-preset'), null);
});

test('preset creates a repeatable section with prepared entry fields and metadata', () => {
  const section = createSectionFromPreset('awards-honors');
  assert.equal(section.type, 'awards-honors');
  assert.equal(section.title, 'Awards & Honors');
  assert.equal(section.repeatable, true);
  assert.equal(section.entries.length, 1);
  assert.deepEqual(Object.keys(section.entries[0].values), ['title','issuer','date','level','reason','url']);
  assert.ok(section.metadata.sectionLibrary.fields.some(item => item.key === 'issuer' && item.label === 'Issuing Organization'));
  assert.throws(() => createSectionFromPreset('unknown-preset'), /Unknown section preset/);
});

test('prepared sections can be inserted and entries extended through existing editor commands', () => {
  const surface = createEditorSurface();
  const section = createSectionFromPreset('research-experience');
  surface.dispatch({ type: 'add-section', payload: section });
  let profile = surface.getState().session.application.masterProfile;
  let stored = profile.careerData.sections.find(item => item.type === 'research-experience');
  assert.ok(stored);
  assert.equal(stored.entries.length, 1);
  assert.equal(stored.entries[0].values.title, '');
  const values = Object.fromEntries(stored.metadata.sectionLibrary.fields.map(item => [item.key, '']));
  values.title = 'Student Research Project';
  surface.dispatch({ type: 'add-entry', target: { sectionId: stored.id }, payload: { values } });
  profile = surface.getState().session.application.masterProfile;
  stored = profile.careerData.sections.find(item => item.type === 'research-experience');
  assert.equal(stored.entries.length, 2);
  assert.notEqual(stored.entries[0].id, stored.entries[1].id);
  assert.equal(stored.entries[1].values.title, 'Student Research Project');
  surface.dispatch({ type: 'add-field', target: { sectionId: stored.id }, payload: { id: 'field_evidence', label: 'Evidence Note', type: 'textarea', value: '' } });
  profile = surface.getState().session.application.masterProfile;
  stored = profile.careerData.sections.find(item => item.type === 'research-experience');
  assert.equal(stored.entries[0].values.field_evidence, '');
  assert.equal(stored.entries[1].values.field_evidence, '');
  stored.entries[1].values.field_evidence = 'Verified field content';
  const html = renderEditorForm(surface, profile).html;
  assert.match(html, /Evidence Note/);
  assert.match(html, /Verified field content/);
});

test('editor exposes searchable catalogue, categories, and prepared field entry controls', () => {
  const surface = createEditorSurface({ profileData: { careerData: { sections: [
    createSectionFromPreset('awards-honors')
  ] } } });
  const profile = surface.getState().session.application.masterProfile;
  const html = renderEditorForm(surface, profile).html;
  assert.match(html, /data-section-library-search/);
  assert.match(html, /data-section-library-category/);
  assert.match(html, /Awards &amp; Honors/);
  assert.match(html, /add-section-preset/);
  assert.match(html, /Issuing Organization/);
  assert.match(html, /data-v2-editor-entry-field/);
});
