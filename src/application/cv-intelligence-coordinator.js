import { analyzeCVForATS } from './cv-ats-analysis.js';
import { matchCVToJob } from './cv-job-matching.js';
export const CV_INTELLIGENCE_COORDINATOR_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVIntelligenceCoordinator(options={}) {
 const runtime=options.runtime; if(!runtime) throw new Error('Intelligence coordinator requires an editor runtime.');
 let destroyed=false;
 function snapshot(){const state=runtime.getState();return {targetedCVId:state.activeDocumentId,projection:clone(state.projection)};}
 return Object.freeze({
  version:CV_INTELLIGENCE_COORDINATOR_VERSION,
  analyzeATS(input={}){if(destroyed)return null;return analyzeCVForATS(snapshot(),input);},
  matchJob(job={}){if(destroyed)return null;return matchCVToJob(snapshot(),job);},
  inspect(job={},atsInput={}){if(destroyed)return null;const ats=this.analyzeATS(atsInput);const match=this.matchJob(job);return Object.freeze({version:CV_INTELLIGENCE_COORDINATOR_VERSION,targetedCVId:runtime.getState().activeDocumentId,ats,jobMatch:match});},
  destroy(){destroyed=true;}
 });
}