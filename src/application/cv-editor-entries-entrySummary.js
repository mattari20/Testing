export const CV_EDITOR_ENTRIES_ENTRYSUMMARY_VERSION='1.0.0';
export function entrySummary(value, options={}){
 return Object.freeze({id:value?.id||null,label:value?.title||value?.name||'Entry'});
}