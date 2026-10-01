export const CV_EDITOR_INTELLIGENCE_KEYWORDSET_VERSION='1.0.0';
export function keywordSet(value, options={}){
 return new Set(Array.isArray(value)?value.map(String):[]);
}