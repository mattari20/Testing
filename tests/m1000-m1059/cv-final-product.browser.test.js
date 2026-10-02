import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

test('final product closure surface exposes remaining product workflows', async () => {
 const server=spawn('python3',['-m','http.server','4177'],{stdio:'ignore'});
 try{
  await delay(500);
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:4177/index.html',{waitUntil:'networkidle'});
  const tabs=await page.locator('.final-product-tabs button').allTextContents();
  assert.equal(tabs.length,7);
  for(const name of ['AI Review','Career Mode','Cover Letter','Import / Migration','Online CV','Portfolio','Plans & Privacy']) assert.ok(tabs.includes(name));
  await page.locator('.final-product-tabs button').filter({hasText:'Cover Letter'}).click();
  assert.match(await page.locator('.final-product-body').innerText(),/Cover Letter Builder/);
  await page.locator('.final-product-tabs button').filter({hasText:'Online CV'}).click();
  assert.match(await page.locator('.final-product-body').innerText(),/Online CV Publication/);
  await browser.close();
 }finally{server.kill();}
});
