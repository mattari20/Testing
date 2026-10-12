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
          { id: 'job1', values: { company: 'Example', role: 'Engineer' } }
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
  surface.dispatch({ type: 'add-entry', target: { sectionId: 'experience' }, payload: { values: { company: 'New Co' } } });
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
  surface.dispatch({ type: 'add-section', payload: { id: 'custom-skills', title: 'Skills', type: 'custom-skills' } });
  surface.dispatch({ type: 'set-section-title', target: { sectionId: 'custom-skills' }, payload: { title: 'Technical Skills' } });
  surface.dispatch({ type: 'add-field', target: { sectionId: 'custom-skills' }, payload: { id: 'python', label: 'Python', value: 'Advanced' } });
  surface.dispatch({ type: 'set-field-definition', target: { sectionId: 'custom-skills', fieldId: 'python' }, payload: { label: 'Python Level', type: 'text' } });
  const profile = surface.getState().session.application.masterProfile;
  assert.equal(profile.careerData.sections.at(-1).title, 'Technical Skills');
  assert.equal(profile.careerData.sections.at(-1).fields[0].label, 'Python Level');
  surface.dispatch({ type: 'remove-field', target: { sectionId: 'custom-skills', fieldId: 'python' }, payload: {} });
  surface.dispatch({ type: 'remove-section', target: { sectionId: 'custom-skills' }, payload: {} });
  assert.equal(profile.careerData.sections.some(s => s.id === 'custom-skills'), false);
  assert.equal(surface.canUndo(), true);
});

test('targeted ordering is rendered without mutating master data order', () => {
  const surface = createEditorSurface({ profileData: profileInput() });
  surface.dispatch({ type: 'add-section', payload: { id: 'work-details', title: 'Work Details', type: 'work-details', fields: [
    { id: 'company', label: 'Company', value: 'Example Ltd' },
    { id: 'role', label: 'Role', value: 'Engineer' }
  ], entries: [] } });
  surface.dispatch({ type: 'reorder', target: { kind: 'section' }, payload: { order: ['education','experience','work-details'] } });
  surface.dispatch({ type: 'reorder', target: { kind: 'field', sectionId: 'work-details' }, payload: { order: ['company','role'] } });
  surface.dispatch({ type: 'reorder', target: { kind: 'entry', sectionId: 'experience' }, payload: { order: ['job1'] } });
  const html = renderEditorForm(surface, surface.getState().session.application.masterProfile).html;
  const educationSectionIndex = html.indexOf('data-v2-editor-section="education"');
  const experienceSectionIndex = html.indexOf('data-v2-editor-section="experience"');
  assert.ok(educationSectionIndex >= 0 && experienceSectionIndex >= 0);
  assert.ok(educationSectionIndex < experienceSectionIndex, 'section ordering should be reflected in the rendered editor blocks');
  const companyFieldIndex = html.search(/data-v2-editor-field-label="work-details:company"/);
  const roleFieldIndex = html.search(/data-v2-editor-field-label="work-details:role"/);
  assert.ok(companyFieldIndex >= 0 && roleFieldIndex >= 0, 'both custom Work Details field controls should be rendered');
  assert.ok(companyFieldIndex < roleFieldIndex, 'field ordering should be reflected in the rendered custom field controls');
  assert.deepEqual(
    surface.getState().session.application.masterProfile.careerData.sections.map(s => s.id),
    ['experience','education','work-details']
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
