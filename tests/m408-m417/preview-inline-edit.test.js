import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const server=createServer(async(req,res)=>{
  try {
    const clean=decodeURIComponent((req.url||'/').split('?')[0]);
    const file=clean==='/'?'/tests/browser/m408-m417-preview-inline.html':clean;
    const body=await readFile(path.join(root,file));
    const ext=path.extname(file);
    res.writeHead(200,{'Content-Type':ext==='.js'?'text/javascript':ext==='.html'?'text/html':'text/plain'});
    res.end(body);
  } catch(e) { res.writeHead(404); res.end(String(e)); }
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=server.address();
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1200,height:1000}});
  await page.goto('http://127.0.0.1:'+address.port+'/tests/browser/m408-m417-preview-inline.html');
  await page.waitForFunction(()=>window.testReady===true);

  const ids=['t01-modern-minimalist-cv-design_modern','t02-professional-cv-design_modern','t03-professional-cv-design_modern','t04-modern-blue-corporate_modern','t05-simple-cv-graphic-web-designer_modern','t06-professional-cv-graphic-designer_modern','t07-professional-cv-store-manager-incharge_modern'];
  for (const id of ids) {
    await page.evaluate(async templateId=>{ await window.renderTemplate(templateId); }, id);
    const count=await page.locator('#preview [data-v2-preview-edit]').count();
    assert.ok(count>0, id+' should expose preview edit targets');
  }

  await page.evaluate(async()=>{ await window.renderTemplate('t01-modern-minimalist-cv-design_modern'); });
  const identityTargets=page.locator('#preview [data-v2-preview-edit="identity"]');
  const nameIndex=await identityTargets.evaluateAll(elements=>elements.findIndex(element=>{
    try { return JSON.parse(element.getAttribute('data-v2-preview-target') || '{}').key === 'fullName'; } catch { return false; }
  }));
  assert.ok(nameIndex >= 0, 'fullName preview target should exist');
  const name=identityTargets.nth(nameIndex);
  await name.click();
  await name.press('ControlOrMeta+A');
  await name.type('Updated Preview User');
  await name.blur();
  await page.waitForFunction(()=>window.editorRuntime.surface.getState().session.application.masterProfile.careerData.identity.fullName==='Updated Preview User');
  assert.equal(await name.textContent(),'Updated Preview User');

  const company=page.locator('#preview [data-v2-preview-edit="entry"]').first();
  await company.evaluate(element => {
    element.focus();
    element.textContent = 'Updated Company';
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  });
  await page.waitForFunction(()=>window.editorRuntime.surface.getState().session.application.masterProfile.careerData.sections.find(s=>s.type==='experience').entries[0].values.company==='Updated Company');

  console.log(JSON.stringify({templates:'passed',identityEdit:'passed',entryEdit:'passed'}));
} finally {
  await browser.close();
  server.close();
}
