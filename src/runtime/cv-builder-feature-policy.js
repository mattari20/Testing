export const CV_BUILDER_FEATURE_POLICY_VERSION='1.0.0';
const defaults={localFirst:true,cloudSave:false,ai:false,jobMatching:true,ats:true,pdfPrint:true,docx:false};
export function createCVBuilderFeaturePolicy(overrides={}){
 const values={...defaults,...overrides};
 return Object.freeze({version:CV_BUILDER_FEATURE_POLICY_VERSION,isEnabled:name=>values[name]===true,values:Object.freeze(values)});
}