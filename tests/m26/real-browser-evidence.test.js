import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';
import { runBrowserValidation, writeBrowserEvidenceArtifact } from '../../src/render/browser-validation-runner.js';
import { createPlaywrightPageFactory } from '../../src/render/playwright-page-adapter.js';

const snapshot={careerData:{identity:{fullName:'Alex Morgan',jobTitle:'Senior Software Engineer',email:'alex@example.com',phone:'+1 555 010 2027',address:'London, United Kingdom'},assets:[{key:'photo',url:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='}],sections:[
{id:'summary-1',type:'summary',title:'Summary',visibility:true,fields:[{id:'summary-text',metadata:{semanticKey:'text'},value:'Experienced software engineer delivering scalable products and leading teams.'}],entries:[]},
{id:'experience-1',type:'experience',title:'Experience',visibility:true,repeatable:true,fields:[],entries:[{id:'exp-1',visibility:true,values:{company:'Acme Technologies',title:'Senior Software Engineer',duration:'2023 – Present',location:'London',description:'Led platform engineering and delivered customer-facing features.'}}]},
{id:'education-1',type:'education',title:'Education',visibility:true,repeatable:true,fields:[],entries:[{id:'edu-1',visibility:true,values:{institution:'University of Example',degree:'BSc Computer Science',duration:'2016 – 2020',description:'Computer science and software engineering.'}}]},
{id:'skills-1',type:'skills',title:'Skills',visibility:true,repeatable:true,fields:[],entries:[{id:'s1',visibility:true,values:{value:'JavaScript'}},{id:'s2',visibility:true,values:{value:'Architecture'}}]},
{id:'languages-1',type:'languages',title:'Languages',visibility:true,repeatable:true,fields:[],entries:[{id:'l1',visibility:true,values:{value:'English'}},{id:'l2',visibility:true,values:{value:'Urdu'}}]},
{id:'contact-1',type:'contact',title:'Contact',visibility:true,fields:[],entries:[]}]},configuration:{hiddenSections:[],hiddenFields:[],hiddenEntries:[]}};

const templates=listNativeV2Templates();
const browser=await chromium.launch({headless:true});
try {
  const result=await runBrowserValidation({templates,snapshot,artifactDir:'artifacts/m26',pageFactory:createPlaywrightPageFactory(browser)});
  assert.equal(result.templateCount,templates.length);
  assert.ok(result.results.every(item=>item.render.status==='ready'));
  assert.ok(result.results.every(item=>item.geometry.status==='collected'));
  assert.ok(result.results.every(item=>item.pagination.status==='collected'));
  assert.ok(result.results.every(item=>item.screenshot.status==='collected'));
  assert.ok(result.results.every(item=>item.geometry.blocks.length>0));
  for(const item of result.results) assert.ok(fs.existsSync(item.screenshot.artifact),item.templateId);
  writeBrowserEvidenceArtifact(result,'artifacts/m26/native-v2-browser-evidence.json');
  console.log(JSON.stringify({templateCount:result.templateCount,results:result.results.map(x=>({templateId:x.templateId,blocks:x.geometry.blocks.length,pageCount:x.pagination.pageCount,screenshot:x.screenshot.status}))},null,2));
} finally { await browser.close(); }
console.log('M26 real browser evidence validation completed.');