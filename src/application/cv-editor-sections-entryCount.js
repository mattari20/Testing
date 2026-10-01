export const CV_EDITOR_SECTIONS_ENTRYCOUNT_VERSION='1.0.0';
export function entryCount(value, options={}){
 return Array.isArray(value?.entries)?value.entries.length:0;
}