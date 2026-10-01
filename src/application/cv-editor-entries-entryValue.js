export const CV_EDITOR_ENTRIES_ENTRYVALUE_VERSION='1.0.0';
export function entryValue(value, options={}){
 return value?.[options.field]??'';
}