import test from 'node:test';
import assert from 'node:assert/strict';
import { createMasterProfile, createTargetedCV } from '../../src/core/career-document-core.js';
import { createCVApplication } from '../../src/application/cv-application.js';
import { executeEditorCommand } from '../../src/application/editor-command-executor.js';
import { createEditorCommand } from '../../src/application/editor-command-contract.js';
import { getSkillsLanguagesPresentationContract, getAllowedProficiencyForListStyle, resolveSkillsLanguagesPresentation } from '../../src/templates/skills-languages-presentation-contract.js';

const oldProfileData = {
  id: 'profile-r7',
  careerData: {
    identity: { fullName: 'Test User' },
    sections: [
      { id:'skills', type:'skills', title:'Skills', fields:[{id:'skillsText', value:'JavaScript, HTML, CSS'}], entries:[], repeatable:false },
      { id:'languages', type:'languages', title:'Languages', fields:[{id:'languagesText', value:'English, Urdu'}], entries:[], repeatable:false }
    ]
  }
};

test('legacy Skills/Languages fields migrate to stable entries', () => {
  const profile=createMasterProfile(oldProfileData);
  const skills=profile.careerData.sections.find(s=>s.type==='skills');
  const languages=profile.careerData.sections.find(s=>s.type==='languages');
  assert.equal(skills.repeatable,true);
  assert.deepEqual(skills.fields,[]);
  assert.deepEqual(skills.entries.map(e=>e.values.skill),['JavaScript','HTML','CSS']);
  assert.equal(new Set(skills.entries.map(e=>e.id)).size,3);
  assert.equal(languages.repeatable,true);
  assert.deepEqual(languages.entries.map(e=>e.values.language),['English','Urdu']);
});

test('entry proficiency is independent and survives duplicate names', () => {
  const profile=createMasterProfile({
    careerData:{sections:[
      {id:'skills',type:'skills',fields:[],entries:[
        {id:'s1',values:{skill:'JavaScript',proficiency:5}},
        {id:'s2',values:{skill:'JavaScript',proficiency:2}}
      ],repeatable:true},
      {id:'languages',type:'languages',fields:[],entries:[],repeatable:true}
    ]}
  });
  const skills=profile.careerData.sections.find(s=>s.type==='skills');
  assert.deepEqual(skills.entries.map(e=>e.values.proficiency),[5,2]);
});

test('targeted CV migration moves legacy ratings into entry data and clears name-keyed ratings', () => {
  const app=createCVApplication({
    profileData:oldProfileData,
    cvData:{
      title:'R7 Test',
      configuration:{
        template:{id:'t03-professional-cv-design_modern',version:'2.0.0'},
        presentation:{ratings:{skills:{style:'text',values:{JavaScript:5,HTML:4}},languages:{style:'text',values:{English:5}}}}
      }
    }
  });
  const skills=app.masterProfile.careerData.sections.find(s=>s.type==='skills');
  const languages=app.masterProfile.careerData.sections.find(s=>s.type==='languages');
  assert.deepEqual(skills.entries.map(e=>e.values.proficiency),[5,4,0]);
  assert.deepEqual(languages.entries.map(e=>e.values.proficiency),[5,0]);
  assert.deepEqual(app.targetedCV.configuration.presentation.ratings.skills.values,{});
});

test('SET_ITEM_RATING writes proficiency to one entry, not a name-keyed map', () => {
  const app=createCVApplication({
    profileData:{careerData:{sections:[
      {id:'skills',type:'skills',fields:[],entries:[{id:'s1',values:{skill:'JavaScript',proficiency:2}}],repeatable:true},
      {id:'languages',type:'languages',fields:[],entries:[],repeatable:true}
    ]}},
    cvData:{configuration:{template:{id:'t03-professional-cv-design_modern',version:'2.0.0'}}}
  });
  executeEditorCommand(app && {
    application:{masterProfile:app.masterProfile,targetedCV:app.targetedCV}
  }, createEditorCommand({
    type:'set-item-rating',
    target:{sectionType:'skills',entryId:'s1'},
    payload:{sectionType:'skills',entryId:'s1',rating:5}
  }));
  const entry=app.masterProfile.careerData.sections.find(s=>s.type==='skills').entries[0];
  assert.equal(entry.values.proficiency,5);
  assert.equal(app.targetedCV.configuration.presentation.ratings.skills.values.s1,undefined);
});

test('template contracts define independent defaults and supported presentation variants', () => {
  const t01=getSkillsLanguagesPresentationContract('t01-modern-minimalist-cv-design_modern');
  const t04=getSkillsLanguagesPresentationContract('t04-modern-blue-corporate_modern');
  assert.equal(t01.skills.default,'tags');
  assert.equal(t04.languages.default,'stacked');
  assert.equal(t04.languages.proficiencyDefault,'bars');
  assert.ok(t04.languages.proficiency.includes('bars'));
  assert.notEqual(t01.languages.default,t04.languages.proficiencyDefault);
});


test('Skills and Languages share display-style rating compatibility', () => {
  const contract=getSkillsLanguagesPresentationContract('t01-modern-minimalist-cv-design_modern');
  assert.deepEqual(getAllowedProficiencyForListStyle(contract.skills,'tags'),['off']);
  assert.deepEqual(getAllowedProficiencyForListStyle(contract.skills,'compact'),['off']);
  assert.deepEqual(getAllowedProficiencyForListStyle(contract.skills,'bullets'),['off','text','stars','bars','dots']);
  assert.deepEqual(getAllowedProficiencyForListStyle(contract.languages,'pills'),['off']);
  assert.deepEqual(getAllowedProficiencyForListStyle(contract.languages,'compact'),['off']);
  assert.deepEqual(getAllowedProficiencyForListStyle(contract.languages,'stacked'),['off','text','stars','bars','dots']);

  const resolved=resolveSkillsLanguagesPresentation('t01-modern-minimalist-cv-design_modern',{
    listStyles:{skills:'compact',languages:'pills'},
    ratings:{skills:{style:'dots'},languages:{style:'stars'}}
  });
  assert.equal(resolved.ratings.skills.style,'off');
  assert.equal(resolved.ratings.languages.style,'off');
});

test('changing a non-rating style clamps existing Skills and Languages ratings to Off', () => {
  const app=createCVApplication({
    profileData:{careerData:{sections:[
      {id:'skills',type:'skills',fields:[],entries:[{id:'s1',values:{skill:'JavaScript',proficiency:5}}],repeatable:true},
      {id:'languages',type:'languages',fields:[],entries:[{id:'l1',values:{language:'English',proficiency:4}}],repeatable:true}
    ]}},
    cvData:{configuration:{
      template:{id:'t01-modern-minimalist-cv-design_modern',version:'2.0.0'},
      presentation:{listStyles:{skills:'bullets',languages:'stacked'},ratings:{skills:{style:'dots'},languages:{style:'stars'}}}
    }}
  });
  executeEditorCommand({application:{masterProfile:app.masterProfile,targetedCV:app.targetedCV}},createEditorCommand({
    type:'set-list-style',target:{sectionType:'skills'},payload:{sectionType:'skills',style:'compact'}
  }));
  assert.equal(app.targetedCV.configuration.presentation.ratings.skills.style,'off');

  executeEditorCommand({application:{masterProfile:app.masterProfile,targetedCV:app.targetedCV}},createEditorCommand({
    type:'set-list-style',target:{sectionType:'languages'},payload:{sectionType:'languages',style:'pills'}
  }));
  assert.equal(app.targetedCV.configuration.presentation.ratings.languages.style,'off');
});
