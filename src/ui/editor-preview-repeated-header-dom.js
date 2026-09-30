export const EDITOR_PREVIEW_REPEATED_HEADER_DOM_VERSION='1.0.0';

export function markRepeatedHeaderDom(element,isRepeated=false){
 if(!element) return element;
 element.dataset.v2RepeatedHeader=isRepeated?'true':'false';
 element.setAttribute('aria-hidden',isRepeated?'true':'false');
 return element;
}