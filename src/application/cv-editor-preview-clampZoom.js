export const CV_EDITOR_PREVIEW_CLAMPZOOM_VERSION='1.0.0';
export function clampZoom(value, options={}){
 const min=Number(options.min??0.5),max=Number(options.max??2); return Math.min(max,Math.max(min,Number(value)||1));
}