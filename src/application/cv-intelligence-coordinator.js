import { analyzeCVForATS } from './cv-ats-analysis.js';
import { matchCVToJob } from './cv-job-matching.js';
export const CV_INTELLIGENCE_COORDINATOR_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVIntelligenceCoordinator(options={}) {
 const runtime=options.runtime; if(!runtime) throw new Error('Intelligence coordinator requires an editor runtime.');
 let destroyed=false;
 function getRuntimeState(){
   if(typeof runtime.getState==='function') return runtime.getState();
   if(runtime.surface && typeof runtime.surface.getState==='function') return runtime.surface.getState();
   throw new Error('Editor runtime state access is unavailable.');
 }
 function snapshot(){const state=getRuntimeState();return {targetedCVId:state.activeDocumentId || state.session?.application?.targetedCV?.id || null,projection:clone(state.projection || state.session?.application?.masterProfile || {})};}
 return Object.freeze({
  version:CV_INTELLIGENCE_COORDINATOR_VERSION,
  analyzeATS(input={}){if(destroyed)return null;return analyzeCVForATS(snapshot(),input);},
  matchJob(job={}){if(destroyed)return null;return matchCVToJob(snapshot(),job);},
  inspect(job={},atsInput={}){if(destroyed)return null;const ats=this.analyzeATS(atsInput);const match=this.matchJob(job);return Object.freeze({version:CV_INTELLIGENCE_COORDINATOR_VERSION,targetedCVId:getRuntimeState().activeDocumentId || getRuntimeState().session?.application?.targetedCV?.id || null,ats,jobMatch:match});},
  destroy(){destroyed=true;}
 });
}