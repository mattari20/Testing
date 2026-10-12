import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { renderEditorForm } from '../../src/ui/editor-form-renderer.js';
import {
  PRE_DESIGNED_SECTION_CATALOG,
  PRE_DESIGNED_SECTION_GROUPS,
  createPreDesignedSection
} from '../../src/ui/pre-designed-section-library.js';

test('the pre-designed section library contains all 26 approved section types', () => {
  assert.equal(PRE_DESIGNED_SECTION_CATALOG.length, 26);
  assert.equal(PRE_DESIGNED_SECTION_GROUPS.length, 5);
  assert.equal(new Set(PRE_DESIGNED_SECTION_CATALOG.map(section => section.type)).size, 26);
});

test('each catalog item creates an editable repeatable section with a starter entry', () => {
  for (const definition of PRE_DESIGNED_SECTION_CATALOG) {
    const section = createPreDesignedSection(definition.type);
    assert.equal(section.title, definition.title);
    assert.equal(section.type, definition.type);
    assert.equal(section.repeatable, true);
    assert.equal(section.entries.length, 1);
    assert.deepEqual(Object.keys(section.entries[0].values), definition.fields.map(field => field.key));
    assert.equal(section.metadata.source, 'pre-designed-section-library');
    assert.equal(section.metadata.fieldDefinitions.length, definition.fields.length);
  }
});

test('the Edit tab renders grouped insertion controls for all 26 sections', () => {
  const surface = createEditorSurface({ profileData: { careerData: { identity: { name: 'Student' }, sections: [] } } });
  const profile = surface.getState().session.application.masterProfile;
  const html = renderEditorForm(surface, profile).html;
  assert.match(html, /data-v2-pre-designed-section-library/);
  assert.match(html, /Achievements &amp; Qualifications/);
  for (const definition of PRE_DESIGNED_SECTION_CATALOG) {
    assert.ok(html.includes('data-v2-section-library-item="' + definition.type + '"'), 'Missing library button: ' + definition.type);
    assert.ok(html.includes(definition.title.replace(/&/g, '&amp;')), 'Missing section title: ' + definition.title);
  }
});

test('selecting a pre-designed section adds editable entry fields through the existing editor command', () => {
  const surface = createEditorSurface({ profileData: { careerData: { identity: {}, sections: [] } } });
  const payload = createPreDesignedSection('publications');
  surface.dispatch({ type: 'add-section', target: {}, payload });
  const section = surface.getState().session.application.masterProfile.careerData.sections[0];
  assert.equal(section.title, 'Publications');
  assert.equal(section.entries[0].values.title, '');
  assert.equal(section.entries[0].values.authors, '');
  const html = renderEditorForm(surface, surface.getState().session.application.masterProfile).html;
  assert.match(html, /Publication title/);
  assert.match(html, /Authors/);
  assert.match(html, /Add Publications/);
});
