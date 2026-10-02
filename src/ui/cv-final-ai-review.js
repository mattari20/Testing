import { createAIResult, AI_TASK } from '../application/cv-ai-intelligence.js';

export const CV_FINAL_AI_REVIEW_VERSION='1.0.0';
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));

export function createCVFinalAIReview(options={}){
  const runtime=options.runtime;
  if(!runtime) throw new Error('AI review requires an editor runtime.');
  let pending=null, sequence=0, destroyed=false;
  const state=()=>Object.freeze({version:CV_FINAL_AI_REVIEW_VERSION,pending:clone(pending)});
  return Object.freeze({
    version:CV_FINAL_AI_REVIEW_VERSION,
    getState:state,
    review(input={}){
      if(destroyed)return null;
      const snapshot=runtime.getState();
      const request={task:input.task||AI_TASK.IMPROVE,documentSnapshot:clone(snapshot.projection||snapshot),jobContext:clone(input.jobContext||null)};
      const result=createAIResult(request,{status:'ready',suggestions:Array.isArray(input.suggestions)?input.suggestions:[],explanation:String(input.explanation||'Review suggestions require user approval before any CV change.'),requiresReview:true});
      pending={id:'ai_review_'+(++sequence),documentId:snapshot.activeDocumentId,result,accepted:[],rejected:[]};
      return state();
    },
    accept(index){
      if(!pending)throw new Error('No AI review is pending.');
      if(pending.documentId!==runtime.getState().activeDocumentId)throw new Error('AI review belongs to a different CV.');
      const suggestion=pending.result.suggestions[Number(index)];
      if(!suggestion)throw new Error('AI suggestion not found.');
      if(!suggestion.blockId||!suggestion.patch||typeof suggestion.patch!=='object')throw new Error('AI suggestion must contain an explicit blockId and patch.');
      runtime.surface?.dispatch?.({type:'update-layout-block',target:{id:suggestion.blockId},payload:{patch:suggestion.patch}});
      pending.accepted=[...pending.accepted,Number(index)];
      return state();
    },
    reject(index){
      if(!pending)throw new Error('No AI review is pending.');
      pending.rejected=[...pending.rejected,Number(index)];
      return state();
    },
    clear(){pending=null;return state();},
    destroy(){destroyed=true;pending=null;}
  });
}
