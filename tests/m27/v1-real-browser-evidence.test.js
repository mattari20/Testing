import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';
import { runV1BrowserValidation } from '../../src/render/v1-browser-validation-runner.js';
import { createPlaywrightRawPageFactory } from '../../src/render/playwright-page-adapter.js';

const snapshot={careerData:{identity:{fullName:'Alex Morgan',jobTitle:'Senior Software Engineer',email:'alex@example.com',phone:'+1 555 010 2027',whatsapp:'+1 555 010 2027',address:'London, United Kingdom',linkedin:'https://linkedin.com/in/alex-morgan',website:'https://example.com',dateOfBirth:'1992-04-15',cnic:'TEST-ONLY',religion:'Not specified'},assets:[{key:'photo',url:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='}],sections:[
{id:'summary-1',type:'summary',title:'Summary',visibility:true,fields:[{id:'summary-text',metadata:{semanticKey:'text'},value:'Experienced software engineer delivering scalable products and leading teams.'}],entries:[]},
{id:'experience-1',type:'experience',title:'Experience',visibility:true,repeatable:true,fields:[],entries:[{id:'exp-1',visibility:true,values:{company:'Acme Technologies',title:'Senior Software Engineer',duration:'2023 – Present',location:'London',description:'Led platform engineering and delivered customer-facing features.'}}]},
{id:'education-1',type:'education',title:'Education',visibility:true,repeatable:true,fields:[],entries:[{id:'edu-1',visibility:true,values:{institution:'University of Example',degree:'BSc Computer Science',duration:'2016 – 2020',description:'Computer science and software engineering.'}}]},
{id:'projects-1',type:'projects',title:'Projects',visibility:true,repeatable:true,fields:[],entries:[{id:'proj-1',visibility:true,values:{name:'Career Platform',duration:'2026',role:'Lead',description:'A scalable career platform.'}}]},
{id:'skills-1',type:'skills',title:'Skills',visibility:true,repeatable:true,fields:[],entries:[{id:'s1',visibility:true,values:{value:'JavaScript'}},{id:'s2',visibility:true,values:{value:'Architecture'}}]},
{id:'languages-1',type:'languages',title:'Languages',visibility:true,repeatable:true,fields:[],entries:[{id:'l1',visibility:true,values:{value:'English'}},{id:'l2',visibility:true,values:{value:'Urdu'}}]},
{id:'achievements-1',type:'achievements',title:'Achievements',visibility:true,repeatable:true,fields:[],entries:[{id:'a1',visibility:true,values:{title:'Award',description:'Engineering excellence award.'}}]},
{id:'contact-1',type:'contact',title:'Contact',visibility:true,fields:[],entries:[]}]},configuration:{hiddenSections:[],hiddenFields:[],hiddenEntries:[]}};

const templates=listNativeV2Templates().filter(t=>t.v1BaselineId).map(t=>({...t,sourcePath:`src/templates/assets/v1/${t.v1BaselineId}.html`}));
const browser=await chromium.launch({headless:true});
try {
 const result=await runV1BrowserValidation({templates,snapshot,artifactDir:'artifacts/m27/v1',pageFactory:createPlaywrightRawPageFactory(browser)});
 assert.equal(result.templateCount,templates.length);
 assert.ok(result.results.every(x=>x.renderStatus==='ready'));
 assert.ok(result.results.every(x=>x.blocks.length>0));
 assert.ok(result.results.every(x=>x.screenshotArtifact && fs.existsSync(x.screenshotArtifact)));
 fs.mkdirSync('artifacts/m27',{recursive:true});
 fs.writeFileSync('artifacts/m27/v1-browser-evidence.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result.results.map(x=>({templateId:x.templateId,blocks:x.blocks.length,text:x.visibleTextLength,compileDiagnostics:x.compileDiagnostics.length,screenshot:x.screenshotArtifact})),null,2);
} finally { await browser.close(); }
console.log('M27 V1 real browser evidence validation completed.');