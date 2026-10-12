import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';

const projectRoot = resolve(process.cwd());
const mime = { '.js':'text/javascript; charset=utf-8', '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8' };

async function withBrowser(run) {
  const server = createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (pathname === '/') {
      response.writeHead(200, { 'content-type':'text/html; charset=utf-8' });
      response.end('<!doctype html><html><head></head><body><div id="test-root"></div></body></html>');
      return;
    }
    const file = resolve(projectRoot, '.' + pathname);
    if (file !== projectRoot && !file.startsWith(projectRoot + sep)) {
      response.writeHead(403); response.end('Forbidden'); return;
    }
    try {
      const data = await readFile(file);
      response.writeHead(200, { 'content-type':mime[extname(file)] || 'application/octet-stream' });
      response.end(data);
    } catch {
      response.writeHead(404); response.end('Not found');
    }
  });
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolveListen);
  });
  const address = server.address();
  const browser = await chromium.launch({ headless:true });
  try {
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:' + address.port + '/');
    await run(page, 'http://127.0.0.1:' + address.port);
  } finally {
    await browser.close();
    await new Promise(resolveClose => server.close(resolveClose));
  }
}

test('native template preview renders populated prepared sections with labels', async () => {
  await withBrowser(async (page, baseUrl) => {
    const result = await page.evaluate(async base => {
      const { createNativeRenderDefinition, renderNativeTemplateSource } = await import(base + '/src/render/native-v2-template-renderer.js?section-library-test=1');
      const definition = createNativeRenderDefinition({
        id:'test-template',
        sourceHtml:'<div data-v2-template-root data-v2-template-id="test-template"><main class="cv-main"></main></div>'
      });
      const fields = [
        {key:'title',label:'Award / Honor',type:'text'},
        {key:'issuer',label:'Issuing Organization',type:'text'},
        {key:'date',label:'Date',type:'date'},
        {key:'reason',label:'Reason / Description',type:'textarea'},
        {key:'url',label:'Evidence URL',type:'url'}
      ];
      const snapshot = {
        careerData:{identity:{},sections:[{
          id:'award-instance',type:'awards-honors',title:'Awards & Honors',visibility:true,fields:[],
          entries:[{id:'award-entry',visibility:true,values:{
            title:'Dean’s List',issuer:'Example University',date:'2025-06-01',
            reason:'Recognized for academic performance',url:'https://example.com/award'
          }}],
          metadata:{sectionLibrary:{presetId:'awards-honors',fields}}
        }]},
        configuration:{hiddenSections:[],hiddenEntries:[],hiddenFields:[],sectionOrder:[],presentation:{}}
      };
      const rendered = renderNativeTemplateSource(definition,snapshot,document);
      const section = rendered.root.querySelector('[data-v2-custom-section-id="award-instance"]');
      return {
        html:rendered.html,
        exists:Boolean(section),
        title:section?.querySelector('.v2-custom-preview-heading')?.textContent,
        text:section?.textContent,
        labels:[...(section?.querySelectorAll('.v2-custom-preview-field b')||[])].map(node=>node.textContent)
      };
    }, baseUrl);
    assert.equal(result.exists, true);
    assert.equal(result.title, 'Awards & Honors');
    assert.match(result.text, /Dean’s List/);
    assert.match(result.text, /Example University/);
    assert.match(result.text, /Recognized for academic performance/);
    assert.ok(result.labels.includes('Issuing Organization:'));
    assert.ok(result.labels.includes('Evidence URL:'));
  });
});

test('native template preview respects hidden prepared sections and entries', async () => {
  await withBrowser(async (page, baseUrl) => {
    const result = await page.evaluate(async base => {
      const { createNativeRenderDefinition, renderNativeTemplateSource } = await import(base + '/src/render/native-v2-template-renderer.js?section-library-test=2');
      const definition = createNativeRenderDefinition({
        id:'test-template',
        sourceHtml:'<div data-v2-template-root data-v2-template-id="test-template"><main class="cv-main"></main></div>'
      });
      const snapshot = {
        careerData:{identity:{},sections:[{
          id:'hidden-award-section',type:'awards-honors',title:'Awards & Honors',visibility:true,fields:[],
          entries:[{id:'hidden-entry',visibility:true,values:{title:'Must Not Appear',issuer:'Hidden Issuer'}}],
          metadata:{sectionLibrary:{fields:[{key:'title',label:'Award / Honor'},{key:'issuer',label:'Issuing Organization'}]}}
        }]},
        configuration:{hiddenSections:['hidden-award-section'],hiddenEntries:[],hiddenFields:[],sectionOrder:[],presentation:{}}
      };
      const rendered = renderNativeTemplateSource(definition,snapshot,document);
      return {count:rendered.root.querySelectorAll('[data-v2-custom-section-id]').length,html:rendered.html};
    }, baseUrl);
    assert.equal(result.count, 0);
    assert.doesNotMatch(result.html, /Must Not Appear/);
  });
});


test('production editor adds a prepared section without a viewport jump and updates preview', async () => {
  await withBrowser(async (page, baseUrl) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
    await page.goto(baseUrl + '/builder.html?template=t01-modern-minimalist-cv-design_modern');
    await page.waitForFunction(() => window.v2ProductionReady === true, { timeout:15000 });
    const library = page.locator('.editor-section-library');
    await library.scrollIntoViewIfNeeded();
    const beforeOpen = await page.evaluate(() => window.scrollY);
    await library.locator('summary').click();
    await library.locator('[data-section-library-search]').fill('awards');
    await page.getByRole('button', { name:'Add Award', exact:true }).click();
    const afterAdd = await page.evaluate(() => window.scrollY);
    assert.equal(afterAdd, beforeOpen, 'Adding a prepared section must preserve the viewport position');
    const section = page.locator('.editor-section-card').filter({ has: page.getByRole('heading', { name:'Awards & Honors' }) });
    await section.waitFor({ state:'visible' });
    await section.locator('[data-v2-entry-key="title"]').fill('Dean’s List');
    await section.locator('[data-v2-entry-key="issuer"]').fill('Example University');
    await page.waitForFunction(() => {
      const preview = document.querySelector('[data-v2-editor-preview-root]');
      return Boolean(preview && preview.textContent.includes('Dean’s List') && preview.textContent.includes('Example University'));
    }, { timeout:10000 });
    const previewText = await page.locator('[data-v2-editor-preview-root]').innerText();
    assert.match(previewText, /Dean’s List/);
    assert.match(previewText, /Example University/);
  });
});

test('production editor inserts the distinct Languages profile preset without colliding with core Languages', async () => {
  await withBrowser(async (page, baseUrl) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
    await page.goto(baseUrl + '/builder.html?template=t01-modern-minimalist-cv-design_modern');
    await page.waitForFunction(() => window.v2ProductionReady === true, { timeout:15000 });
    const library = page.locator('.editor-section-library');
    await library.scrollIntoViewIfNeeded();
    await library.locator('summary').click();
    await library.locator('[data-section-library-search]').fill('Languages');
    await page.getByRole('button', { name:'Add Language Profile', exact:true }).click();
    const section = page.locator('.editor-section-card').filter({ has: page.getByRole('heading', { name:'Languages', exact:true }) }).last();
    await section.waitFor({ state:'visible' });
    await section.locator('[data-v2-entry-key="language"]').fill('Urdu');
    await section.locator('[data-v2-entry-key="proficiency"]').fill('Native');
    await section.locator('[data-v2-entry-key="context"]').fill('Professional communication');
    await page.waitForFunction(() => {
      const preview = document.querySelector('[data-v2-editor-preview-root]');
      return Boolean(preview && preview.textContent.includes('Professional communication') && preview.textContent.includes('Urdu'));
    }, { timeout:10000 });
    const previewText = await page.locator('[data-v2-editor-preview-root]').innerText();
    assert.match(previewText, /Urdu/);
    assert.match(previewText, /Native/);
    assert.match(previewText, /Professional communication/);
  });
});

test('a prepared section renders and exports to PDF across every native template', async () => {
  const templates=listNativeV2Templates();
  assert.ok(templates.length>=9,'the native template catalogue should be covered');
  await withBrowser(async (_page,baseUrl,browser) => {
    for(const template of templates){
      const page=await browser.newPage({viewport:{width:1440,height:1000}});
      try{
        await page.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
        await page.goto(baseUrl+'/builder.html?template='+encodeURIComponent(template.id),{waitUntil:'networkidle'});
        await page.waitForFunction(()=>window.v2ProductionReady===true,{timeout:15000});
        const library=page.locator('.editor-section-library');
        await library.scrollIntoViewIfNeeded();
        await library.locator('summary').click();
        await library.locator('[data-section-library-search]').fill('Publications');
        await page.getByRole('button',{name:'Add Publication',exact:true}).click();
        const section=page.locator('.editor-section-card').filter({has:page.getByRole('heading',{name:'Publications',exact:true})}).last();
        await section.waitFor({state:'visible'});
        await section.locator('[data-v2-entry-key="title"]').fill('Release validation paper — '+template.id);
        await section.locator('[data-v2-entry-key="authors"]').fill('CV Builder Validation Team');
        await section.locator('[data-v2-entry-key="venue"]').fill('Release Readiness Journal');
        const previewSection=page.locator('.v2-custom-preview-section[data-v2-custom-section-type="publications"]');
        await previewSection.waitFor({state:'visible',timeout:10000});
        await page.waitForFunction(id=>document.querySelector('.v2-custom-preview-section[data-v2-custom-section-type="publications"]')?.textContent.includes('Release validation paper — '+id),template.id,{timeout:10000});
        await page.emulateMedia({media:'print'});
        assert.equal(await previewSection.isVisible(),true,template.id+' should keep the prepared section visible in print media');
        const pdf=await page.pdf({format:'A4',printBackground:true});
        assert.ok(pdf.length>1000,template.id+' should produce a non-empty A4 PDF');
      }finally{
        await page.close();
      }
    }
  });
});
