import { validateAIResult } from './cv-ai-intelligence.js';
export const CV_AI_REVIEW_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function createCVAIReviewController(options={}) {
 const runtime=options.runtime; if(!runtime)throw new Error('AI review requires an editor runtime.');
 let pending=null,destroyed=false,sequence=0;
 function state(){return Object.freeze({version:CV_AI_REVIEW_VERSION,pending:pending?clone(pending):null});}
 return Object.freeze({
  version:CV_AI_REVIEW_VERSION,
  getState:state,
  submit(result){if(destroyed)return null;const validation=validateAIResult(result);if(!validation.valid)throw new Error(validation.errors.join(' '));if(result.requiresReview===false)throw new Error('AI results must remain reviewable at the editor boundary.');pending={id:'ai_review_'+(++sequence),documentId:runtime.getState().activeDocumentId,result:clone(result),accepted:[],rejected:[]};return state();},
  accept(index){if(destroyed||!pending)return null;if(pending.documentId!==runtime.getState().activeDocumentId)throw new Error('AI review belongs to a different CV document.');const i=Number(index);const suggestion=pending.result.suggestions[i];if(!suggestion)throw new Error('AI suggestion not found: '+index);if(!suggestion.blockId||!suggestion.patch||typeof suggestion.patch!=='object')throw new Error('AI suggestion requires blockId and patch.');runtime.edit(suggestion.blockId,suggestion.patch);pending.accepted=[...pending.accepted,i];return state();},
  reject(index){if(destroyed||!pending)return null;const i=Number(index);if(!pending.result.suggestions[i])throw new Error('AI suggestion not found: '+index);pending.rejected=[...pending.rejected,i];return state();},
  clear(){pending=null;return state();},
  destroy(){destroyed=true;pending=null;}
 });
}