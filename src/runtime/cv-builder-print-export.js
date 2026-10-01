export const CV_BUILDER_PRINT_EXPORT_VERSION='1.0.0';
export function createCVBuilderPrintExport(options={}){
 const windowRef=options.windowRef||globalThis.window;
 function canPrint(){return Boolean(windowRef?.print);}
 function print(metadata={}){
  if(!canPrint())return {status:'unsupported',reason:'window.print unavailable',metadata};
  windowRef.print();return {status:'requested',format:'pdf-print',metadata};
 }
 return Object.freeze({version:CV_BUILDER_PRINT_EXPORT_VERSION,canPrint,print});
}