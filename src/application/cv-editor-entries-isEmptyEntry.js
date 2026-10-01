export const CV_EDITOR_ENTRIES_ISEMPTYENTRY_VERSION='1.0.0';
export function isEmptyEntry(value, options={}){
 return !value||Object.values(value).every(item=>String(item??'').trim()==='');
}