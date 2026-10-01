export const CV_EDITOR_EDITING_HASVALUE_VERSION='1.0.0';
export function hasValue(value, options={}){
 return value!==undefined&&value!==null&&String(value).trim()!=='';
}