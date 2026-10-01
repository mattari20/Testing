import test from 'node:test';
import assert from 'node:assert/strict';
import { createMasterProfile, addSection, addField, addEntry } from '../../src/core/career-document-core.js';
import { createPreviewEditSession, resolvePreviewEditTarget } from '../../src/application/cv-preview-editing.js';

function fixture() {
  const profile = createMasterProfile({ id:'p1' });
  addSection(profile,{id:'s1',title:'Experience',repeatable:true});
  addField(profile,'s1',{id:'title',label:'Title',value:'Old'});
  addEntry(profile,'s1',{id:'e1',values:{role:'Old role'}});
  return profile;
}

test('M1768-M1783 resolves preview block to section source', () => {
  assert.deepEqual(resolvePreviewEditTarget('section:s1'),{kind:'section',sectionId:'s1'});
});

test('M1784-M1799 edits a section through preview target', () => {
  const profile=fixture(); const session=createPreviewEditSession();
  session.apply(profile,'section:s1',{title:'Work'});
  assert.equal(profile.careerData.sections[0].title,'Work');
});

test('M1800-M1815 edits a field through preview target', () => {
  const profile=fixture(); const session=createPreviewEditSession();
  session.apply(profile,'field:s1:title',{value:'New'});
  assert.equal(profile.careerData.sections[0].fields[0].value,'New');
});

test('M1816-M1831 edits entry values through preview target', () => {
  const profile=fixture(); const session=createPreviewEditSession();
  session.apply(profile,'entry:s1:e1',{values:{role:'New role'}});
  assert.equal(profile.careerData.sections[0].entries[0].values.role,'New role');
});

test('M1832-M1847 rejects unknown preview targets and fences destroy', () => {
  const profile=fixture(); const session=createPreviewEditSession();
  assert.throws(()=>session.apply(profile,'x:s1',{value:'x'}));
  session.destroy();
  assert.equal(session.resolve('field:s1:title'),null);
});
