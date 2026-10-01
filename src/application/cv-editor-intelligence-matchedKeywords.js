export const CV_EDITOR_INTELLIGENCE_MATCHEDKEYWORDS_VERSION='1.0.0';
export function matchedKeywords(value, options={}){
 return Array.isArray(value?.matched)?value.matched:[];
}