export const CV_EDITOR_EDITING_MERGEVALUES_VERSION='1.0.0';
export function mergeValues(value, options={}){
 return Object.assign({},value||{},options||{});
}