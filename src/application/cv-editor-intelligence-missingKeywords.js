export const CV_EDITOR_INTELLIGENCE_MISSINGKEYWORDS_VERSION='1.0.0';
export function missingKeywords(value, options={}){
 return Array.isArray(value?.missing)?value.missing:[];
}