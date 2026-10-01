export const CV_EDITOR_PERSISTENCE_MARKCLEAN_VERSION='1.0.0';
export function markClean(value, options={}){
 return Object.freeze({...value,dirty:false});
}