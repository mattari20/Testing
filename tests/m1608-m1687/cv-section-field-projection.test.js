import test from 'node:test';
import assert from 'node:assert/strict';
import { createMasterProfile, createTargetedCV, addSection, addField, addEntry, setTargetedFieldVisibility, setSectionOrder, setFieldOrder } from '../../src/core/career-document-core.js';
import { projectCVContent, findProjectedField, projectionDiagnostics } from '../../src/application/cv-section-field-projection.js';

function fixture() {
  const profile = createMasterProfile({ id:'p1' });
  addSection(profile, { id:'personal', type:'personal', title:'Personal' });
  addField(profile, 'personal', { id:'name', label:'Name', value:'Ali' });
  addField(profile, 'personal', { id:'email', label:'Email', value:'a@example.com' });
  addSection(profile, { id:'experience', type:'experience', title:'Experience', repeatable:true });
  addEntry(profile, 'experience', { id:'job1', values:{ role:'Engineer' } });
  const cv = createTargetedCV({ id:'cv1', masterProfileId:profile.id });
  return { profile, cv };
}

test('M1608-M1623 projects visible sections and fields', () => {
  const { profile, cv } = fixture();
  const projection = projectCVContent(profile, cv);
  assert.equal(projection.sections.length, 2);
  assert.equal(findProjectedField(projection, 'personal', 'name').value, 'Ali');
});

test('M1624-M1639 honors targeted field visibility', () => {
  const { profile, cv } = fixture();
  setTargetedFieldVisibility(cv, 'personal', 'email', false);
  const projection = projectCVContent(profile, cv);
  assert.equal(findProjectedField(projection, 'personal', 'email'), null);
});

test('M1640-M1655 honors section ordering', () => {
  const { profile, cv } = fixture();
  setSectionOrder(cv, ['experience','personal']);
  assert.equal(projectCVContent(profile, cv).sections[0].id, 'experience');
});

test('M1656-M1671 honors field ordering', () => {
  const { profile, cv } = fixture();
  setFieldOrder(cv, 'personal', ['email','name']);
  assert.equal(projectCVContent(profile, cv).sections[0].fields[0].id, 'email');
});

test('M1672-M1687 exposes stable projection diagnostics', () => {
  const { profile, cv } = fixture();
  const projection = projectCVContent(profile, cv);
  const d = projectionDiagnostics(projection);
  assert.equal(d.sectionCount, 2);
  assert.equal(d.fieldCount, 2);
  assert.equal(d.entryCount, 1);
});
