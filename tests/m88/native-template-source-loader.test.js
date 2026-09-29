import test from 'node:test';
import assert from 'node:assert/strict';
import { getNativeTemplateSourceDescriptor } from '../../src/templates/native-template-source-loader.js';
test('source descriptor comes from native registry',()=>{ const d=getNativeTemplateSourceDescriptor('t01-modern-minimalist-cv-design_modern'); assert.equal(d.version,'2.0.0'); assert.match(d.sourcePath,/src\\/templates\\/assets\\/v2\\/t01-modern-minimalist-cv-design_modern\\.html$/); });
