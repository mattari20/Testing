import fs from 'node:fs';
import path from 'node:path';
import { compileV1TemplateSource } from './v1-template-normalizer.js';
import { createGenericV1TemplateAdapter, getV1Visibility } from './v1-browser-template-adapter.js';

export const M27_V1_BROWSER_RUNNER_VERSION='1.0.0';

export function createV1BrowserValidationPlan(input={}) {
 const templates=Array.isArray(input.templates)?input.templates:[];
 return {version:M27_V1_BROWSER_RUNNER_VERSION,viewport:input.viewport||{width:794,height:1123,deviceScaleFactor:1},templates:templates.map(t=>({id:String(t.id),version:String(t.version||'v1-baseline'),sourcePath:String(t.sourcePath||''),v1BaselineId:String(t.v1BaselineId||t.id)}))};
}

export async function runV1BrowserValidation(input={}) {
 if(typeof input.pageFactory!=='function') throw new Error('pageFactory is required.');
 const plan=createV1BrowserValidationPlan(input); const snapshot=input.snapshot||{}; const results=[];
 for(const template of plan.templates){
  const page=await input.pageFactory(plan.viewport);
  try{
   const sourceHtml=input.sourceLoader?await input.sourceLoader(template.sourcePath):fs.readFileSync(path.resolve(template.sourcePath),'utf8');
   const adapter=createGenericV1TemplateAdapter(template,sourceHtml);
   const visibility=getV1Visibility(adapter,snapshot);
   const compiled=compileV1TemplateSource(sourceHtml,snapshot,adapter,{visibility});
   const screenshotPath=input.artifactDir?path.join(input.artifactDir,`${template.id}.png`):null;
   const measurement=await page.renderAndMeasure({template,sourceHtml:compiled.html,snapshot,screenshotPath});
   results.push({templateId:template.id,v1BaselineId:template.v1BaselineId,compileDiagnostics:compiled.diagnostics,sourceAnalysis:compiled.analysis,renderStatus:measurement.renderStatus||'ready',renderDiagnostics:measurement.renderDiagnostics||[],blocks:measurement.blocks||[],rootHeight:measurement.rootHeight||0,visibleTextLength:measurement.visibleTextLength||0,screenshotArtifact:measurement.screenshotArtifact||null});
  }catch(error){results.push({templateId:template.id,v1BaselineId:template.v1BaselineId,renderStatus:'error',renderDiagnostics:[String(error?.message||error)],blocks:[],rootHeight:0,visibleTextLength:0,screenshotArtifact:null});}
  finally{if(typeof page.close==='function') await page.close();}
 }
 return {version:M27_V1_BROWSER_RUNNER_VERSION,templateCount:results.length,results};
}