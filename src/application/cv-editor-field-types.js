export const CV_EDITOR_FIELD_TYPES_VERSION='1.0.0';
const TYPES=Object.freeze(['text','textarea','email','url','date','select','checkbox','richtext']);
export function createCVEditorFieldTypes(){return Object.freeze({version:CV_EDITOR_FIELD_TYPES_VERSION,list:()=>[...TYPES],supports:type=>TYPES.includes(type)});}