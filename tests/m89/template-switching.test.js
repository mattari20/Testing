import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorSurface } from '../../src/application/editor-surface.js';
import { switchTemplate } from '../../src/ui/template-preview-controller.js';
test('template switching updates targeted CV configuration',()=>{ const surface=createEditorSurface({profileData:{sections:[]}}); switchTemplate(surface,'t01-modern-minimalist-cv-design_modern',{templateVersion:'2.0.0'}); assert.equal(surface.getState().session.application.targetedCV.configuration.template.id,'t01-modern-minimalist-cv-design_modern'); });
