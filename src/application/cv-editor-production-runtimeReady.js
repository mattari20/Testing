export const CV_EDITOR_PRODUCTION_RUNTIMEREADY_VERSION='1.0.0';
export function runtimeReady(value, options={}){
 return Boolean(value?.ready??value);
}