export const CV_EDITOR_INTELLIGENCE_KEYWORDLIST_VERSION='1.0.0';
export function keywordList(value, options={}){
 return Array.isArray(value)?value.map(String).filter(Boolean):[];
}