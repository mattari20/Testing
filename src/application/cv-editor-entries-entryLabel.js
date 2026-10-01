export const CV_EDITOR_ENTRIES_ENTRYLABEL_VERSION='1.0.0';
export function entryLabel(value, options={}){
 return String(value?.title||value?.name||'Entry');
}