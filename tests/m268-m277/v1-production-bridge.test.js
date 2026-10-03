import test from 'node:test';
import assert from 'node:assert/strict';

import {
  OBSERVED_V1_PRODUCTION_FLOW,
  createV1ProductionBridge,
  resolveV2ProductionHandoff,
  validateV1ProductionBridge
} from '../../src/application/v1-production-bridge.js';

test('records the observed production source flow without inventing an implementation', () => {
  assert.deepEqual(OBSERVED_V1_PRODUCTION_FLOW, [
    'template-gallery',
    'bridge.php',
    'template-selection',
    'build-online-or-word-export'
  ]);
});

test('V1 remains the explicit default until production evidence enables V2', () => {
  const bridge = createV1ProductionBridge({templateId: 't01-modern-minimalist-cv-design'});
  assert.equal(bridge.state, 'v1');
  assert.equal(bridge.fallbackEnabled, true);
  assert.deepEqual(resolveV2ProductionHandoff(bridge), {
    route: 'v1',
    reason: 'V2 handoff is not enabled; preserve the existing production path.'
  });
  assert.equal(validateV1ProductionBridge(bridge).valid, true);
});

test('V2 handoff is explicit and never inferred from a missing V1 route', () => {
  const bridge = createV1ProductionBridge({
    state: 'v2',
    templateId: 't01-modern-minimalist-cv-design',
    target: 'v2-editor'
  });

  assert.deepEqual(resolveV2ProductionHandoff(bridge), {
    route: 'v2',
    templateId: 't01-modern-minimalist-cv-design',
    target: 'v2-editor'
  });
  assert.equal(validateV1ProductionBridge(bridge).valid, true);
});

test('blocked state cannot silently fall back to V1', () => {
  const bridge = createV1ProductionBridge({state: 'blocked'});
  assert.deepEqual(resolveV2ProductionHandoff(bridge), {
    route: 'blocked',
    reason: 'Production handoff is explicitly blocked until release evidence is complete.'
  });
  assert.equal(validateV1ProductionBridge({
    ...bridge,
    fallbackEnabled: true
  }).valid, false);
});

test('V2 state disables fallback', () => { const bridge = createV1ProductionBridge({state:'v2',templateId:'t01-modern-minimalist-cv-design',target:'v2-editor'}); assert.equal(bridge.fallbackEnabled,false); assert.equal(bridge.explicit,true); assert.equal(validateV1ProductionBridge(bridge).valid,true); });

test('blocked state stays blocked even when fallback is requested', () => { const bridge = createV1ProductionBridge({state:'blocked'}); assert.equal(validateV1ProductionBridge({...bridge,fallbackEnabled:true}).valid,false); assert.equal(resolveV2ProductionHandoff({...bridge,fallbackEnabled:true}).route,'blocked'); });

test('invalid state is rejected', () => {
  assert.throws(
    () => createV1ProductionBridge({state: 'unknown'}),
    /Unsupported V1 production bridge state/
  );
});
