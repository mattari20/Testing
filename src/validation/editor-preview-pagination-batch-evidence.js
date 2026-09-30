import {buildPaginationRegressionMatrix,validateRegressionResult} from './editor-preview-pagination-regression.js';
import {createLongCvBrowserScenario} from './editor-preview-long-cv-browser-scenario.js';

export const EDITOR_PREVIEW_PAGINATION_BATCH_EVIDENCE_VERSION='1.0.0';

export function createPaginationBatchEvidence(result={}){
  const matrix=buildPaginationRegressionMatrix();
  const regression=validateRegressionResult(matrix,result);
  const scenario=createLongCvBrowserScenario();
  return Object.freeze({
    version:EDITOR_PREVIEW_PAGINATION_BATCH_EVIDENCE_VERSION,
    pageCount:Number(result.pageCount)||0,
    hasOverflow:Boolean(result.hasOverflow),
    regression,
    browserScenario:scenario,
    productionBrowserRequired:true
  });
}