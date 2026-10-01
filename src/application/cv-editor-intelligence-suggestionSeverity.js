export const CV_EDITOR_INTELLIGENCE_SUGGESTIONSEVERITY_VERSION='1.0.0';
export function suggestionSeverity(value, options={}){
 return String(value?.severity||'info');
}