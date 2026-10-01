export const CV_EDITOR_PRODUCTION_PRODUCTIONSUMMARY_VERSION='1.0.0';
export function productionSummary(value, options={}){
 return Object.freeze({ready:Boolean(value?.ready),version:value?.version||null,errors:Number(value?.errors)||0});
}