export const CV_EDITOR_PRODUCTION_FEATUREGATE_VERSION='1.0.0';
export function featureGate(value, options={}){
 return value!==false;
}