import fs from 'node:fs';
import path from 'node:path';
import { listNativeV2Templates } from '../templates/v2-native-template-catalog.js';
import { createGenericV1TemplateAdapter, getV1Visibility } from '../templates/v1-browser-template-adapter.js';
import { compileV1TemplateSource } from '../templates/v1-template-normalizer.js';

export const M28_PAIRED_BROWSER_COMPARISON_VERSION='1.0.0';

function readSource(sourcePath){return fs.readFileSync(path.resolve(sourcePath),'utf8');}
function ratioDelta(a,b){const x=Number(a)||0; const y=Number(b)||0; if(x===0&&y===0)return 0; return Math.abs(x-y)/Math.max(Math.abs(x),Math.abs(y),1);}
function summarize(measurement){return {renderStatus:measurement?.renderStatus||'unknown',renderDiagnostics:Array.isArray(measurement?.renderDiagnostics)?measurement.renderDiagnostics:[],rootHeight:Number(measurement?.rootHeight||0),visibleTextLength:Number(measurement?.visibleTextLength||0),blockCount:Array.isArray(measurement?.blocks)?measurement.blocks.length:0,screenshotArtifact:measurement?.screenshotArtifact||null,blocks:Array.isArray(measurement?.blocks)?measurement.blocks:[]};}

export function createPairedComparisonPlan(input={}){
 const templates=Array.isArray(input.templates)?input.templates:listNativeV2Templates();
 return {version:M28_PAIRED_BROWSER_COMPARISON_VERSION,viewport:input.viewport||{width:794,height:1123,deviceScaleFactor:1},templates:templates.filter(t=>t?.v1BaselineId).map(t=>({templateId:String(t.id),baselineId:String(t.v1BaselineId),v1SourcePath:String(t.v1SourcePath||`src/templates/assets/v1/${t.v1BaselineId}.html`),v2SourcePath:String(t.v2SourcePath||t.sourcePath||`src/templates/assets/v2/${t.id}.html`),v2Version:String(t.version||'2.0.0')}))};
}

export async function runPairedBrowserComparison(input={}){
 if(typeof input.nativePageFactory!=='function'||typeof input.v1PageFactory!=='function') throw new Error('nativePageFactory and v1PageFactory are required.');
 const plan=createPairedComparisonPlan(input); const snapshot=input.snapshot||{}; const results=[];
 for(const template of plan.templates){
  let v1=null,v2=null;
  try{
   const v1Source=input.sourceLoader?await input.sourceLoader(template.v1SourcePath):readSource(template.v1SourcePath);
   const adapter=createGenericV1TemplateAdapter({id:template.baselineId,version:'v1-baseline'},v1Source);
   const compiled=compileV1TemplateSource(v1Source,snapshot,adapter,{visibility:getV1Visibility(adapter,snapshot)});
   const v1Page=await input.v1PageFactory(plan.viewport);
   try{v1=await v1Page.renderAndMeasure({template:{id:template.baselineId,version:'v1-baseline'},sourceHtml:compiled.html,snapshot,screenshotPath:input.artifactDir?path.join(input.artifactDir,'v1',`${template.templateId}.png`):null});}
   finally{if(typeof v1Page.close==='function')await v1Page.close();}
   const v2Source=input.sourceLoader?await input.sourceLoader(template.v2SourcePath):readSource(template.v2SourcePath);
   const v2Page=await input.nativePageFactory(plan.viewport);
   try{v2=await v2Page.renderAndMeasure({template:{id:template.templateId,version:template.v2Version},sourceHtml:v2Source,snapshot,screenshotPath:input.artifactDir?path.join(input.artifactDir,'v2',`${template.templateId}.png`):null});}
   finally{if(typeof v2Page.close==='function')await v2Page.close();}
   const a=summarize(v1),b=summarize(v2);
   results.push({templateId:template.templateId,baselineId:template.baselineId,viewport:plan.viewport,v1:a,v2:b,pairedEvidence:{rootHeightDelta:Math.abs(a.rootHeight-b.rootHeight),rootHeightDeltaRatio:ratioDelta(a.rootHeight,b.rootHeight),visibleTextLengthDelta:Math.abs(a.visibleTextLength-b.visibleTextLength),blockCountDelta:Math.abs(a.blockCount-b.blockCount),renderBothReady:a.renderStatus==='ready'&&b.renderStatus==='ready',visualEquivalenceStatus:'insufficient-evidence'}});
  }catch(error){results.push({templateId:template.templateId,baselineId:template.baselineId,viewport:plan.viewport,v1:summarize(v1),v2:summarize(v2),pairedEvidence:{renderBothReady:false,visualEquivalenceStatus:'insufficient-evidence'},error:String(error?.message||error)});}
 }
 return {version:M28_PAIRED_BROWSER_COMPARISON_VERSION,templateCount:results.length,results};
}

export function writePairedComparisonArtifact(result,outputPath){if(!outputPath)throw new Error('outputPath is required.');fs.mkdirSync(path.dirname(outputPath),{recursive:true});fs.writeFileSync(outputPath,JSON.stringify(result,null,2));return outputPath;}