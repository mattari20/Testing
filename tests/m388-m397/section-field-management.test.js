import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { createMasterProfile, createTargetedCV, addSection, addField, duplicateEntry } from '../../src/core/career-document-core.js';
import { renderEditorForm } from '../../src/ui/editor-form-renderer.js';

function profileInput() {
  return {
    careerData: {
      identity: { name: 'Student' },
      sections: [
        { id: 'experience', title: 'Experience', type: 'experience', fields: [
          { id: 'role', label: 'Role', value: 'Engineer' },
          { id: 'company', label: 'Company', value: 'Example Ltd' }
        ], entries: [
          { id: 'job1', values: { employer: 'Example', role: 'Engineer' } }
        ], repeatable: true },
        { id: 'education', title: 'Education', fields: [
          { id: 'degree', label: 'Degree', value: 'BS' }
        ] }
      ]
    }
  };
}

test('core section and field lifecycle works', () => {
  const profile = createMasterProfile({ id: 'p1' });
  const section = addSection(profile, { id: 'custom', title: 'Custom' });
  const field = addField(profile, section.id, { id: 'skill', label: 'Skill', value: 'JS' });
  assert.equal(profile.careerData.sections.length, 1);
  assert.equal(field.label, 'Skill');
  assert.throws(() => addField(profile, 'missing', {}), /Section not found/);
});

test('editor can add, edit, remove and duplicate entries', () => {
  const surface = createEditorSurface({ profileData: profileInput() });
  surface.dispatch({ type: 'add-entry', target: { sectionId: 'experience' }, payload: { values: { employer: 'New Co' } } });
  let section = surface.getState().session.application.masterProfile.careerData.sections[0];
  assert.equal(section.entries.length, 2);
  const id = section.entries[0].id;
  surface.dispatch({ type: 'duplicate-entry', target: { sectionId: 'experience', entryId: id }, payload: {} });
  section = surface.getState().session.application.masterProfile.careerData.sections[0];
  assert.equal(section.entries.length, 3);
  assert.notEqual(section.entries[1].id, id);
  surface.dispatch({ type: 'remove-entry', target: { sectionId: 'experience', entryId: section.entries[1].id }, payload: {} });
  assert.equal(section.entries.length, 2);
});

test('section and field commands mutate the master profile and remain undoable', () => {
  const surface = createEditorSurface({ profileData: profileInput() });
  surface.dispatch({ type: 'add-section', payload: { id: 'skills', title: 'Skills', type: 'skills' } });
  surface.dispatch({ type: 'set-section-title', target: { sectionId: 'skills' }, payload: { title: 'Technical Skills' } });
  surface.dispatch({ type: 'add-field', target: { sectionId: 'skills' }, payload: { id: 'python', label: 'Python', value: 'Advanced' } });
  surface.dispatch({ type: 'set-field-definition', target: { sectionId: 'skills', fieldId: 'python' }, payload: { label: 'Python Level', type: 'text' } });
  const profile = surface.getState().session.application.masterProfile;
  assert.equal(profile.careerData.sections.at(-1).title, 'Technical Skills');
  assert.equal(profile.careerData.sections.at(-1).fields[0].label, 'Python Level');
  surface.dispatch({ type: 'remove-field', target: { sectionId: 'skills', fieldId: 'python' }, payload: {} });
  surface.dispatch({ type: 'remove-section', target: { sectionId: 'skills' }, payload: {} });
  assert.equal(profile.careerData.sections.some(s => s.id === 'skills'), false);
  assert.equal(surface.canUndo(), true);
});

test('targeted ordering is rendered without mutating master data order', () => {
  const surface = createEditorSurface({ profileData: profileInput() });
  surface.dispatch({ type: 'reorder', target: { kind: 'section' }, payload: { order: ['education','experience'] } });
  surface.dispatch({ type: 'reorder', target: { kind: 'field', sectionId: 'experience' }, payload: { order: ['company','role'] } });
  surface.dispatch({ type: 'reorder', target: { kind: 'entry', sectionId: 'experience' }, payload: { order: ['job1'] } });
  const html = renderEditorForm(surface, surface.getState().session.application.masterProfile).html;
  assert.ok(html.indexOf('Education') < html.indexOf('Experience'));
  assert.ok(html.indexOf('Company') < html.indexOf('Role'));
  assert.deepEqual(
    surface.getState().session.application.masterProfile.careerData.sections.map(s => s.id),
    ['experience','education']
  );
});

test('renderer exposes section, field and entry controls', () => {
  const surface = createEditorSurface({ profileData: profileInput() });
  const html = renderEditorForm(surface, surface.getState().session.application.masterProfile).html;
  assert.match(html, /data-v2-editor-command="add-section"/);
  assert.match(html, /data-v2-editor-command="add-field"/);
  assert.match(html, /data-v2-editor-command="duplicate-entry"/);
  assert.match(html, /data-v2-editor-section-title/);
  assert.match(html, /data-v2-editor-field-label/);
});
