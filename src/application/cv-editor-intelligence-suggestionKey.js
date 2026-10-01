export const CV_EDITOR_INTELLIGENCE_SUGGESTIONKEY_VERSION='1.0.0';
export function suggestionKey(value, options={}){
 return String(value?.id||value?.key||'suggestion');
}