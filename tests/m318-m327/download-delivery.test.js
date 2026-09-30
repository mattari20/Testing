import test from 'node:test';
import assert from 'node:assert/strict';
import { DOWNLOAD_STATES, createDownloadRequest, transitionDownload, createDownloadUiModel } from '../../src/download/download-delivery.js';

test('Word download starts with preparation and is ad-independent', () => {
 const r=createDownloadRequest({templateId:'t01-modern-minimalist-cv-design_modern',fileName:'T01-Modern-Minimalist-CV-Template.docx',path:'/cv-builder/word-templates/T01-Modern-Minimalist-CV-Template.docx'});
 assert.equal(r.state,DOWNLOAD_STATES.REQUESTED); assert.equal(r.requiresAdView,false); assert.equal(r.artificialDelay,false);
});

test('download lifecycle reaches completion deterministically', () => {
 let r=createDownloadRequest({templateId:'t01',fileName:'template.docx',path:'/template.docx'});
 for(const s of [DOWNLOAD_STATES.PREPARING,DOWNLOAD_STATES.READY,DOWNLOAD_STATES.DOWNLOADING,DOWNLOAD_STATES.COMPLETED]) r=transitionDownload(r,s);
 assert.equal(r.state,DOWNLOAD_STATES.COMPLETED);
});

test('download cannot skip preparation', () => {
 const r=createDownloadRequest({templateId:'t01',fileName:'template.docx',path:'/template.docx'});
 assert.throws(()=>transitionDownload(r,DOWNLOAD_STATES.DOWNLOADING),/Invalid download state transition/);
});

test('ready UI enables download independently of ads', () => {
 let r=createDownloadRequest({templateId:'t01',fileName:'template.docx',path:'/template.docx'});
 r=transitionDownload(r,DOWNLOAD_STATES.PREPARING); r=transitionDownload(r,DOWNLOAD_STATES.READY);
 const ui=createDownloadUiModel(r); assert.equal(ui.downloadEnabled,true); assert.equal(ui.adIndependent,true);
});