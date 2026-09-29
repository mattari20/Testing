import { createReleaseReadiness } from './release-readiness.js';

export const E2E_CONTRACT_VERSION = '1.0.0';

export const E2E_STAGES = Object.freeze([
  'profile',
  'targeted-cv',
  'template',
  'assembly',
  'pagination',
  'preview',
  'export',
  'import',
  'intelligence',
  'security',
  'publication'
]);

export function createEndToEndContract(input = {}) {
  const stages = E2E_STAGES.map(name => ({
    name,
    status: input.stages?.[name] || 'pending',
    evidence: input.evidence?.[name] || null
  }));
  const blockers = stages.filter(stage => stage.status !== 'passed');
  return Object.freeze({
    version: E2E_CONTRACT_VERSION,
    status: blockers.length ? 'blocked' : 'ready',
    stages,
    blockers: blockers.map(stage => stage.name),
    releaseReadiness: createReleaseReadiness(input.release || {})
  });
}

export function assertEndToEndReady(contract) {
  if (contract?.status !== 'ready' || contract?.releaseReadiness?.status !== 'ready') {
    throw new Error('End-to-end release contract is not ready.');
  }
  return true;
}
