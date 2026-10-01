export const CV_EDITOR_SECTIONS_MOVEINDEX_VERSION='1.0.0';
export function moveIndex(value, options={}){
 { const list=Array.isArray(value)?[...value]:[],from=Number(options.from),to=Number(options.to); if(from>=0&&from<list.length&&to>=0&&to<list.length)[list[from],list[to]]=[list[to],list[from]]; return list; }
}