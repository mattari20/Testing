import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';
import { paginateBlocks } from '../../src/layout/layout-pagination-engine.js';

const snapshot = {
  careerData: {
    identity: {
      fullName: 'Alex Morgan',
      jobTitle: 'Senior Software Engineer',
      email: 'alex@example.com',
      phone: '+1 555 010 2027',
      whatsapp: '+1 555 010 2027',
      address: 'London, United Kingdom',
      linkedin: 'https://linkedin.com/in/alex-morgan',
      website: 'https://example.com',
      dateOfBirth: '1992-04-15',
      cnic: 'TEST-ONLY',
      religion: 'Not specified'
    },
    assets: [{
      key: 'photo',
      url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
    }],
    sections: [
      { id:'summary-1', type:'summary', title:'Summary', visibility:true,
        fields:[{id:'summary-text', metadata:{semanticKey:'text'}, value:'Experienced software engineer with a strong record of delivering scalable products, leading teams, and improving engineering quality.'}], entries:[] },
      { id:'experience-1', type:'experience', title:'Experience', visibility:true, repeatable:true,
        fields:[], entries:[
          {id:'exp-1', visibility:true, values:{company:'Acme Technologies', title:'Senior Software Engineer', duration:'2023 – Present', location:'London', description:'Led platform engineering, improved reliability, and delivered customer-facing features across distributed teams.'}},
          {id:'exp-2', visibility:true, values:{company:'Northstar Labs', title:'Software Engineer', duration:'2020 – 2023', location:'Manchester', description:'Built web applications, APIs, automated tests, and deployment workflows.'}}
        ] },
      { id:'education-1', type:'education', title:'Education', visibility:true, repeatable:true,
        fields:[], entries:[{id:'edu-1',visibility:true,values:{institution:'University of Example',degree:'BSc Computer Science',duration:'2016 – 2020',description:'Software engineering, databases, algorithms and systems.'}}] },
      { id:'projects-1', type:'projects', title:'Projects', visibility:true, repeatable:true,
        fields:[], entries:[{id:'proj-1',visibility:true,values:{name:'Career Platform',description:'A scalable career platform for international users.',url:'https://example.com'}}] },
      { id:'skills-1', type:'skills', title:'Skills', visibility:true, repeatable:true,
        fields:[], entries:[{id:'skill-1',visibility:true,values:{value:'JavaScript'}},{id:'skill-2',visibility:true,values:{value:'Architecture'}},{id:'skill-3',visibility:true,values:{value:'Product Engineering'}}] },
      { id:'languages-1', type:'languages', title:'Languages', visibility:true, repeatable:true,
        fields:[], entries:[{id:'lang-1',visibility:true,values:{value:'English'}},{id:'lang-2',visibility:true,values:{value:'Urdu'}}] },
      { id:'achievements-1', type:'achievements', title:'Achievements', visibility:true, repeatable:true,
        fields:[], entries:[{id:'ach-1',visibility:true,values:{title:'Engineering Excellence Award',description:'Recognized for improving engineering delivery and reliability.'}}] },
      { id:'contact-1', type:'contact', title:'Contact', visibility:true, fields:[], entries:[] }
    ]
  },
  configuration: { hiddenSections:[], hiddenFields:[], hiddenEntries:[] }
};

function rendererForBrowser() {
  const source = fs.readFileSync(path.resolve('src/render/native-v2-template-renderer.js'), 'utf8');
  return source
    .replaceAll('export ', '')
    + '\nwindow.__nativeRender = renderNativeTemplateSource;';
}

const browserRenderer = rendererForBrowser();

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const template of listNativeV2Templates()) {
    const source = fs.readFileSync(path.resolve(template.sourcePath), 'utf8');
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>', { waitUntil: 'domcontentloaded' });
    await page.addScriptTag({ content: browserRenderer });
    const result = await page.evaluate(async ({ sourceHtml, templateId, snapshot }) => {
      const definition = {
        id: templateId,
        templateVersion: '2.0.0',
        sourceHtml
      };
      const rendered = window.__nativeRender(definition, snapshot, document);
      document.body.innerHTML = '';
      document.body.appendChild(rendered.root);
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const blocks = [...document.querySelectorAll('[data-v2-layout-block]')].map((element, index) => {
        const rect = element.getBoundingClientRect();
        return {
          id: element.getAttribute('data-v2-layout-block-id') || 'block-' + index,
          kind: element.getAttribute('data-v2-layout-kind') || 'custom',
          measuredHeight: rect.height,
          measuredWidth: rect.width,
          top: rect.top,
          left: rect.left
        };
      });
      return {
        htmlLength: document.body.innerHTML.length,
        title: document.title,
        blocks,
        rootHeight: document.body.scrollHeight,
        visibleText: document.body.innerText.length
      };
    }, { sourceHtml: source, templateId: template.id, snapshot });

    const layoutBlocks = result.blocks.map((block, index) => ({
      ...block,
      order: index,
      minHeight: block.measuredHeight,
      preferredHeight: block.measuredHeight,
      keepTogether: true
    }));
    const pagination = paginateBlocks(layoutBlocks, { format:'A4', width:794, height:1123, margins:{top:0,right:0,bottom:0,left:0}, columns:1 });
    const zeroHeight = result.blocks.filter(block => block.measuredHeight <= 0.01);
    results.push({
      templateId: template.id,
      htmlLength: result.htmlLength,
      visibleTextLength: result.visibleText,
      blockCount: result.blocks.length,
      rootHeight: result.rootHeight,
      zeroHeightBlocks: zeroHeight.map(block => block.id),
      pageCount: pagination.pageCount,
      hasOverflow: pagination.hasOverflow,
      diagnostics: pagination.diagnostics,
      status: zeroHeight.length === 0 && result.blocks.length > 0 ? 'measured' : 'measurement-insufficient'
    });
    await page.close();
  }
} finally {
  await browser.close();
}

assert.equal(results.length, 7);
assert.ok(results.every(result => result.blockCount > 0));
assert.ok(results.every(result => result.status === 'measured'));
assert.ok(results.every(result => result.zeroHeightBlocks.length === 0));

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync(
  'artifacts/m20-native-browser-validation.json',
  JSON.stringify({ version:'1.0.0', generatedAt:new Date().toISOString(), templateCount:7, results }, null, 2)
);

console.log(JSON.stringify(results, null, 2));
console.log('M20 native browser validation passed.');
