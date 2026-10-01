export const CV_EDITOR_TEMPLATES_TEMPLATECAPABILITIES_VERSION='1.0.0';
export function templateCapabilities(value, options={}){
 return Object.freeze({...value?.capabilities});
}