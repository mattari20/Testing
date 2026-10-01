export const CV_BUILDER_RELEASE_CONFIG_VERSION='1.0.0';
export function createCVBuilderReleaseConfig(options={}){
 const config={version:options.version||'2.0.0',environment:options.environment||'development',v1Path:options.v1Path||null,v2Path:options.v2Path||'/cv-builder-v2/',features:Object.freeze({...options.features})};
 if(config.v1Path&&config.v1Path===config.v2Path)throw new Error('V1 and V2 paths must remain isolated.');
 return Object.freeze(config);
}