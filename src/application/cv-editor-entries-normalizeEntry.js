export const CV_EDITOR_ENTRIES_NORMALIZEENTRY_VERSION='1.0.0';
export function normalizeEntry(value, options={}){
 return Object.freeze({...value});
}