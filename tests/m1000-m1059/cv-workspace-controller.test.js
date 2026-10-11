import test from 'node:test';
import assert from 'node:assert/strict';
import { createCVWorkspaceController } from '../../src/ui/cv-workspace-controller.js';
import { createEditorSurface } from '../../src/application/editor-surface.js';

function surface() {
  return createEditorSurface({
    profileData:{careerData:{identity:{fullName:'Ali Akbar'},sections:[]}},
    cvData:{title:'My CV'}
  });
}

function storage() {
  const map = new Map();
  return {
    getItem:key=>map.has(key)?map.get(key):null,
    setItem:(key,value)=>map.set(key,String(value)),
    removeItem:key=>map.delete(key)
  };
}

test('workspace controller exposes one active CV',()=>{
  const s=surface(); const w=createCVWorkspaceController({surface:s,storage:storage()});
  assert.equal(w.getState().documents.length,1);
  assert.equal(w.getActiveDocument().id,w.getState().activeDocumentId);
});

test('new CV and duplicate become active',()=>{
  const s=surface(); const w=createCVWorkspaceController({surface:s,storage:storage()});
  const first=w.getActiveDocument().id;
  const second=w.createDocument('Second CV');
  assert.equal(w.getActiveDocument().title,'Second CV');
  const copy=w.duplicateDocument();
  assert.notEqual(copy.id,second.id);
  assert.equal(w.getActiveDocument().id,copy.id);
  assert.equal(w.getState().documents.length,3);
  assert.equal(w.getDocument(first).id,first);
});

test('rename and archive keep workspace coherent',()=>{
  const s=surface(); const w=createCVWorkspaceController({surface:s,storage:storage()});
  w.createDocument('Second CV');
  w.renameActive('Renamed CV');
  assert.equal(w.getActiveDocument().title,'Renamed CV');
  const first=w.getState().documents[0].id;
  w.archiveActive();
  assert.equal(w.getState().activeDocumentId,first);
});

test('save records version history',()=>{
  const s=surface(); const w=createCVWorkspaceController({surface:s,storage:storage()});
  w.save();
  const versions=w.getVersions(w.getActiveDocument().id);
  assert.equal(versions.length,1);
  assert.ok(versions[0].id);
});

test('workspace reload restores documents and history',()=>{
  const store=storage();
  const s1=surface(); const w1=createCVWorkspaceController({surface:s1,storage:store});
  w1.createDocument('Second CV'); w1.save();
  const s2=surface(); const w2=createCVWorkspaceController({surface:s2,storage:store});
  assert.equal(w2.getState().documents.length,2);
  assert.equal(w2.getActiveDocument().title,'Second CV');
  assert.equal(w2.getVersions(w2.getActiveDocument().id).length,1);
});


test('workspace reload migrates legacy Skills and Languages fields into visible entries',()=>{
  const store=storage();
  const s=surface();
  const app=s.getState().session.application;
  const profile=JSON.parse(JSON.stringify(app.masterProfile));
  profile.careerData.sections.push(
    {id:'skills',type:'skills',title:'Skills',visibility:true,fields:[{id:'skillsText',value:'JavaScript, HTML, CSS'}],entries:[],repeatable:false},
    {id:'languages',type:'languages',title:'Languages',visibility:true,fields:[{id:'languagesText',value:'English, Urdu'}],entries:[],repeatable:false}
  );
  store.setItem('estudent_cv_workspace_v2_2027',JSON.stringify({
    version:'1.0.0',
    workspace:{version:'1.0.0',masterProfile:profile,documents:[app.targetedCV],activeDocumentId:app.targetedCV.id,history:[]},
    versions:{}
  }));
  const restored=createCVWorkspaceController({surface:surface(),storage:store});
  const sections=restored.getState().masterProfile.careerData.sections;
  const skills=sections.find(section=>section.type==='skills');
  const languages=sections.find(section=>section.type==='languages');
  assert.deepEqual(skills.entries.map(entry=>entry.values.skill),['JavaScript','HTML','CSS']);
  assert.deepEqual(languages.entries.map(entry=>entry.values.language),['English','Urdu']);
  assert.equal(skills.repeatable,true);
  assert.equal(languages.repeatable,true);
});

test('restore previous version returns a stored snapshot',()=>{
  const store=storage(); const s=surface(); const w=createCVWorkspaceController({surface:s,storage:store});
  w.save();
  const id=w.getActiveDocument().id;
  const version=w.getVersions(id)[0];
  const restored=w.restoreVersion(id,version.id);
  assert.equal(restored.id,version.id);
  assert.equal(w.getState().activeDocumentId,id);
});


test('restore version actually rolls the editor content back',()=>{
  const store=storage(); const s=surface(); const w=createCVWorkspaceController({surface:s,storage:store});
  w.save();
  const id=w.getActiveDocument().id;
  const firstVersion=w.getVersions(id)[0];
  s.dispatch({type:'set-identity',target:{key:'fullName'},payload:{value:'Changed Name'}});
  w.save();
  assert.equal(s.getState().session.application.masterProfile.careerData.identity.fullName,'Changed Name');
  w.restoreVersion(id,firstVersion.id);
  assert.equal(s.getState().session.application.masterProfile.careerData.identity.fullName,'Ali Akbar');
});
