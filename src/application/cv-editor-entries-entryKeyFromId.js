export const CV_EDITOR_ENTRIES_ENTRYKEYFROMID_VERSION='1.0.0';
export function entryKeyFromId(value, options={}){
 return 'entry:'+String(value||'');
}