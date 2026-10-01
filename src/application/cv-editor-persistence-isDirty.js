export const CV_EDITOR_PERSISTENCE_ISDIRTY_VERSION='1.0.0';
export function isDirty(value, options={}){
 return Boolean(value?.dirty);
}