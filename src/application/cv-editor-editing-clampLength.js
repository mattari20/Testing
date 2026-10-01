export const CV_EDITOR_EDITING_CLAMPLENGTH_VERSION='1.0.0';
export function clampLength(value, options={}){
 const max=Math.max(0,Number(options.max)||0); return String(value??'').slice(0,max);
}