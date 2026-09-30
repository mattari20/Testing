export const DOWNLOAD_DELIVERY_VERSION = '1.0.0';
export const DOWNLOAD_STATES = Object.freeze({ REQUESTED: 'requested', PREPARING: 'preparing', READY: 'ready', DOWNLOADING: 'downloading', COMPLETED: 'completed', BLOCKED: 'blocked' });

export function createDownloadRequest(input = {}) {
  const templateId = String(input.templateId || '');
  const fileName = String(input.fileName || '');
  const path = String(input.path || '');
  if (!templateId) throw new Error('templateId is required.');
  if (!fileName || !fileName.toLowerCase().endsWith('.docx')) throw new Error('A DOCX fileName is required.');
  if (!path) throw new Error('A download path is required.');
  return Object.freeze({ version: DOWNLOAD_DELIVERY_VERSION, state: DOWNLOAD_STATES.REQUESTED, templateId, fileName, path, requiresAdView: false, adPlacement: 'separate', artificialDelay: false, processingMessage: 'Preparing your Word template…' });
}

export function transitionDownload(request, nextState) {
  if (!request || !Object.values(DOWNLOAD_STATES).includes(nextState)) throw new Error('Invalid download transition.');
  const allowed = { requested: ['preparing','blocked'], preparing: ['ready','blocked'], ready: ['downloading','blocked'], downloading: ['completed','blocked'], completed: [], blocked: [] };
  if (!allowed[request.state].includes(nextState)) throw new Error('Invalid download state transition: ' + request.state + ' -> ' + nextState);
  return Object.freeze({ ...request, state: nextState });
}

export function createDownloadUiModel(request) {
  return Object.freeze({ state: request.state, message: request.state === DOWNLOAD_STATES.READY ? 'Your Word template is ready.' : request.processingMessage, downloadEnabled: request.state === DOWNLOAD_STATES.READY, adIndependent: true, adPlacement: request.adPlacement });
}