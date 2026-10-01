export const CV_EDITOR_EDITING_ISBLANK_VERSION='1.0.0';
export function isBlank(value, options={}){
 return String(value??'').trim().length===0;
}