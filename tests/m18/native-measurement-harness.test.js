import assert from 'node:assert/strict';
import { classifyMeasuredElement } from '../../src/render/native-measurement-harness.js';

const fake = attrs => ({ getAttribute: key => attrs[key] ?? null, tagName: 'SECTION' });
assert.equal(classifyMeasuredElement(fake({'data-v2-layout-kind':'experience-entry'})), 'experience-entry');
assert.equal(classifyMeasuredElement(fake({})), 'custom');

console.log('Native measurement classification tests passed.');
