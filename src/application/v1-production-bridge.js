export const V1_PRODUCTION_BRIDGE_VERSION = '1.0.0';

export const V1_PRODUCTION_ENTRY_STATES = Object.freeze([
  'v1',
  'v2',
  'blocked'
]);

export const OBSERVED_V1_PRODUCTION_FLOW = Object.freeze([
  'template-gallery',
  'bridge.php',
  'template-selection',
  'build-online-or-word-export'
]);

export function createV1ProductionBridge(options = {}) {
  const state = String(options.state || 'v1');
  const templateId = options.templateId ? String(options.templateId) : null;
  const target = options.target ? String(options.target) : null;

  if (!V1_PRODUCTION_ENTRY_STATES.includes(state)) {
    throw new Error('Unsupported V1 production bridge state: ' + state);
  }

  return Object.freeze({
    version: V1_PRODUCTION_BRIDGE_VERSION,
    state,
    templateId,
    target,
    fallbackEnabled: state === 'v1',
    explicit: true
  });
}

export function resolveV2ProductionHandoff(options = {}) {
  const bridge = createV1ProductionBridge(options);

  if (bridge.state === 'v2') {
    return Object.freeze({
      route: 'v2',
      templateId: bridge.templateId,
      target: bridge.target
    });
  }

  if (bridge.state === 'v1') {
    return Object.freeze({
      route: 'v1',
      reason: 'V2 handoff is not enabled; preserve the existing production path.'
    });
  }

  return Object.freeze({
    route: 'blocked',
    reason: 'Production handoff is explicitly blocked until release evidence is complete.'
  });
}

export function validateV1ProductionBridge(bridge) {
  const errors = [];

  if (bridge?.version !== V1_PRODUCTION_BRIDGE_VERSION) {
    errors.push('Unsupported V1 production bridge version.');
  }

  if (!V1_PRODUCTION_ENTRY_STATES.includes(bridge?.state)) {
    errors.push('A valid explicit production bridge state is required.');
  }

  if (bridge?.state === 'v2' && !bridge.templateId) {
    errors.push('A V2 handoff requires a templateId.');
  }

  if (bridge?.state === 'blocked' && bridge?.fallbackEnabled === true) {
    errors.push('A blocked production bridge cannot enable fallback.');
  }

  if (bridge?.explicit !== true) {
    errors.push('Production bridge state must be explicit.');
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors
  });
}
