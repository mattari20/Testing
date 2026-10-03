import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

async function freePort(){const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;s.close();await once(s,'close');return p;}

test('production builder exposes page navigation, zoom, variants and accessibility controls', async()=>{
  const {chromium}=await import('playwright');
  const port=await freePort();
  const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    await page.goto('http://127.0.0.1:'+port+'/?template=t01-modern-minimalist-cv-design_modern',{waitUntil:'networkidle'});
    await page.waitForSelector('#v2-editor');

    // Desktop must expose the secondary tools; they are intentionally collapsed only on mobile.
    for (const id of ['recover-btn','clear-recovery-btn','resume-intelligence-btn','career-tools-btn','print-btn']) {
      assert.equal(await page.locator('#'+id).isVisible(),true,'Desktop tool should be visible: '+id);
    }
    await page.locator('#resume-intelligence-btn').click();
    assert.equal(await page.locator('#resume-intelligence-modal').isVisible(),true);
    await page.locator('[data-close-tool-modal="resume-intelligence-modal"]').click();
    await page.locator('#career-tools-btn').click();
    assert.equal(await page.locator('#career-tools-modal').isVisible(),true);
    const careerTabs = ['AI Review','Career Mode','Cover Letter','Import / Migration','Online CV','Portfolio','Plans & Privacy'];
    await page.locator('#career-tools-btn').click();
    for (const tab of careerTabs) {
      await page.locator('.final-product-tabs button', { hasText: tab }).click();
      assert.equal(await page.locator('.final-product-body').isVisible(), true, 'Career tool tab should be accessible: '+tab);
    }
    await page.locator('[data-close-tool-modal="career-tools-modal"]').click();

    await page.locator('#resume-intelligence-btn').click();
    assert.equal(await page.locator('#cv-intelligence-root').isVisible(), true);
    await page.locator('#cv-intelligence-job').fill('JavaScript REST APIs Git Testing');
    await page.getByRole('button', {name:'Analyze CV'}).click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.cv-intelligence-results').isVisible(), true);
    await page.locator('[data-close-tool-modal="resume-intelligence-modal"]').click();

    // Every published native V2 template must render the canonical demo identity,
    // experience, and education data; template-specific legacy field names must not blank the CV.
    const templateIds = [
      't01-modern-minimalist-cv-design_ats',
      't01-modern-minimalist-cv-design_simple',
      't01-modern-minimalist-cv-design_modern',
      't02-professional-cv-design_modern',
      't03-professional-cv-design_modern',
      't04-modern-blue-corporate_modern',
      't05-simple-cv-graphic-web-designer_modern',
      't06-professional-cv-graphic-designer_modern',
      't07-professional-cv-store-manager-incharge_modern'
    ];
    for (const templateId of templateIds) {
      await page.locator('#template-select').selectOption(templateId);
      await page.waitForTimeout(150);
      const previewText = await page.locator('[data-v2-editor-preview-root]').innerText();
      assert.match(previewText,/Ali Khan/, 'Template should render the demo identity: '+templateId);
      assert.match(previewText,/Software Engineer/, 'Template should render the demo title: '+templateId);
      assert.match(previewText,/Tech Solutions Ltd\./, 'Template should render experience data: '+templateId);
      assert.match(previewText,/University of Lahore/, 'Template should render education data: '+templateId);
    }

    // T03 uses legacy visual field names; inline editing must still update the canonical V2 field.
    await page.locator('#template-select').selectOption('t03-professional-cv-design_modern');
    await page.waitForTimeout(150);
    const inlineRole = page.locator('[data-v2-entry-value="title"]').first();
    await inlineRole.fill('Lead Software Engineer');
    await inlineRole.blur();
    await page.waitForTimeout(100);
    assert.equal(
      await page.evaluate(() => window.eStudentCVBuilderV2.surface.getState().session.application.masterProfile.careerData.sections
        .find(section => section.type === 'experience')?.entries?.[0]?.values?.role),
      'Lead Software Engineer'
    );
    assert.equal(await page.locator('#preview-prev').count(),1);
    assert.equal(await page.locator('#preview-next').count(),1);
    assert.equal(await page.locator('#zoom-in').count(),1);
    assert.equal(await page.locator('#zoom-out').count(),1);
    assert.equal(await page.locator('#variant-select').count(),1);
    assert.equal(await page.locator('[data-editor-announcer]').count(),1);
    assert.equal(await page.locator('[data-v2-editor-photo]').count(),1);
    assert.equal(await page.locator('[data-v2-editor-photo-input]').count(),1);
    await page.locator('[data-v2-editor-photo-input]').setInputFiles({
      name:'profile.png',
      mimeType:'image/png',
      buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64')
    });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.editor-photo-preview').count(),1);
    assert.equal(await page.locator('[data-v2-editor-photo-remove="profile-photo"]').count(),1);

    // Verify real identity editing reaches the live application state.
    const fullName = page.locator('[data-v2-editor-identity-field="fullName"]');
    await fullName.fill('Ali Akbar');
    await fullName.blur();
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.careerData.identity.fullName
    ), 'Ali Akbar');

    assert.equal(await page.locator('[data-v2-editor-identity-field="fullName"]').count(),1);
    assert.match(await page.locator('[data-v2-editor-identity-wrapper="fullName"]').innerText(),/Full Name/);
    assert.doesNotMatch(await page.locator('[data-v2-editor-section="summary"]').innerText(),/fullName|jobTitle/);


    await page.locator('#zoom-in').click();
    assert.equal(await page.locator('[data-v2-editor-preview-root]').getAttribute('data-preview-zoom'),'1.1');
    await page.locator('#zoom-reset').click();
    await page.evaluate(() => localStorage.setItem('estudent_cv_builder_v2_2027','{broken-json'));
    await page.reload({waitUntil:'networkidle'});
    await page.waitForSelector('#v2-editor');
    assert.doesNotMatch(await page.locator('#app-status').innerText(),/startup error/i);
    assert.equal(await page.locator('[data-v2-editor-preview-root]').getAttribute('data-preview-zoom'),'1');

    // Verify section visibility controls persist through a real UI command.
    const summarySection = page.locator('[data-v2-editor-section="summary"]');
    await summarySection.locator('[data-v2-editor-command="set-visibility"]').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-v2-editor-section="summary"]').getAttribute('data-v2-editor-section-hidden'), 'true');

    await page.locator('[data-v2-editor-section="summary"] [data-v2-editor-command="set-visibility"]').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-v2-editor-section="summary"]').getAttribute('data-v2-editor-section-hidden'), 'false');

    // Duplicate an experience entry and verify the editor rerenders the new entry.
    const experienceEntriesBefore = await page.locator('[data-v2-editor-section="experience"] [data-v2-editor-entry]').count();
    await page.locator('[data-v2-editor-section="experience"] [data-v2-editor-command="duplicate-entry"]').first().click();
    await page.waitForTimeout(100);
    assert.equal(
      await page.locator('[data-v2-editor-section="experience"] [data-v2-editor-entry]').count(),
      experienceEntriesBefore + 1
    );

    // Add a field and a section through the actual editor controls.
    const summaryFieldsBefore = await page.locator('[data-v2-editor-section="summary"] [data-v2-editor-field-wrapper]').count();
    await page.locator('[data-v2-editor-section="summary"] [data-v2-editor-command="add-field"]').click();
    await page.waitForTimeout(100);
    assert.equal(
      await page.locator('[data-v2-editor-section="summary"] [data-v2-editor-field-wrapper]').count(),
      summaryFieldsBefore + 1
    );

    const sectionsBefore = await page.locator('[data-v2-editor-section]').count();
    await page.locator('[data-v2-editor-command="add-section"]').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-v2-editor-section]').count(), sectionsBefore + 1);

    // Verify uploaded photo can be removed from the same live editor state.
    await page.locator('[data-v2-editor-photo-remove="profile-photo"]').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.editor-photo-preview').count(),0);
    assert.equal(await page.locator('[data-v2-editor-photo-remove="profile-photo"]').count(),0);

    await page.locator('#variant-select').selectOption('academic');
    await page.waitForTimeout(100);
    const state=await page.evaluate(()=>window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.configuration.presentation?.variant);
    assert.equal(state,'academic');

    const pageCount=await page.locator('[data-page-number]').count();
    assert.ok(pageCount>=1);
    assert.equal(await page.locator('#preview-page-select option').count(),pageCount);
    assert.match(await page.locator('#preview-page-label').innerText(),new RegExp('Page 1 of ' + pageCount));

    // Validate the rendered page has A4-like geometry and the print control reaches the browser boundary.
    const desktopPageGeometry=await page.evaluate(()=>{
      const node=document.querySelector('[data-v2-template-root]');
      const rect=node?.getBoundingClientRect();
      return {width:rect?.width||0,height:rect?.height||0,ratio:rect?.width&&rect?.height?rect.height/rect.width:0};
    });
    assert.ok(desktopPageGeometry.width>0);
    assert.ok(desktopPageGeometry.height>0);
    assert.ok(desktopPageGeometry.ratio>1.2 && desktopPageGeometry.ratio<1.6);
    await page.evaluate(()=>{ window.__eStudentPrintCalled=false; window.print=()=>{window.__eStudentPrintCalled=true;}; });
    await page.locator('#print-btn').click();
    assert.equal(await page.evaluate(()=>window.__eStudentPrintCalled),true);

    // A one-page document must not navigate beyond its available page range.
    await page.locator('#preview-next').click();
    assert.equal(await page.locator('[data-page-number][data-page-active="true"]').getAttribute('data-page-number'),'1');

    // Real mobile editor/preview view switching and fit-to-width behavior.
    await page.setViewportSize({width:390,height:844});
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#mobile-edit-tab').isVisible(),true);
    assert.equal(await page.locator('#mobile-preview-tab').isVisible(),true);
    assert.equal(await page.locator('#v2-editor').getAttribute('data-mobile-view'),'edit');
    assert.notEqual(await page.locator('#v2-editor > section').nth(0).evaluate(el=>getComputedStyle(el).display),'none');
    assert.equal(await page.locator('#v2-editor > section').nth(1).evaluate(el=>getComputedStyle(el).display),'none');

    await page.locator('#mobile-preview-tab').click();
    await page.waitForTimeout(150);
    assert.equal(await page.locator('#v2-editor').getAttribute('data-mobile-view'),'preview');
    assert.equal(await page.locator('#v2-editor > section').nth(0).evaluate(el=>getComputedStyle(el).display),'none');
    assert.notEqual(await page.locator('#v2-editor > section').nth(1).evaluate(el=>getComputedStyle(el).display),'none');
    const mobilePreview = await page.evaluate(() => {
      const root=document.querySelector('[data-v2-editor-preview-root]');
      const page=document.querySelector('[data-v2-template-root]');
      return {rootWidth:root?.getBoundingClientRect().width || 0,pageWidth:page?.getBoundingClientRect().width || 0,overflow:root?.scrollWidth || 0};
    });
    assert.ok(mobilePreview.rootWidth>0);
    assert.ok(mobilePreview.pageWidth>0);
    assert.ok(mobilePreview.pageWidth <= mobilePreview.rootWidth + 2);

    await page.locator('#mobile-edit-tab').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#v2-editor').getAttribute('data-mobile-view'),'edit');
    const active=await page.locator('[data-page-number][data-page-active="true"]').count();
    assert.equal(active,1);
  }finally{await browser.close();server.kill();}
});
