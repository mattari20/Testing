export const CV_EDITOR_ENTRIES_ENTRYFIELDCOUNT_VERSION='1.0.0';
export function entryFieldCount(value, options={}){
 return value&&typeof value==='object'?Object.keys(value).length:0;
}