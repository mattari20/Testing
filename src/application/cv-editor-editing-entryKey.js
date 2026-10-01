export const CV_EDITOR_EDITING_ENTRYKEY_VERSION='1.0.0';
export function entryKey(value, options={}){
 return String(options.sectionId||'section')+'::'+String(value||'entry');
}