export const CV_EDITOR_FEATURE_POLICY_VERSION='1.0.0';
const DEFAULTS=Object.freeze({editor:true,preview:true,templates:true,persistence:true,export:true,ats:true,jobMatching:true,aiReview:true,accounts:false,cloud:false});
export function createCVEditorFeaturePolicy(overrides={}){
 const flags={...DEFAULTS,...overrides};
 return Object.freeze({version:CV_EDITOR_FEATURE_POLICY_VERSION,flags:Object.freeze(flags),enabled(name){return flags[name]===true;},disabled(name){return flags[name]!==true;}});
}
