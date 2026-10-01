import {CV_EDITOR_DESIGN_TOKENS} from './cv-editor-design-tokens.js';
export const CV_EDITOR_STYLE_SHEET_VERSION='2.0.0';
export function createCVEditorStyleSheet(options={}){const document=options.document;if(!document)throw new Error('Style sheet requires document.');const node=document.createElement('style');node.setAttribute('data-cv-editor-style','v2');const t=CV_EDITOR_DESIGN_TOKENS;node.textContent=`
[data-cv-editor="v2"]{--cv-page:${t.colors.page};--cv-surface:${t.colors.surface};--cv-surface-muted:${t.colors.surfaceMuted};--cv-border:${t.colors.border};--cv-border-strong:${t.colors.borderStrong};--cv-text:${t.colors.text};--cv-text-muted:${t.colors.textMuted};--cv-accent:${t.colors.accent};--cv-accent-strong:${t.colors.accentStrong};--cv-accent-soft:${t.colors.accentSoft};--cv-success:${t.colors.success};--cv-success-soft:${t.colors.successSoft};--cv-warning:${t.colors.warning};--cv-warning-soft:${t.colors.warningSoft};--cv-danger:${t.colors.danger};--cv-danger-soft:${t.colors.dangerSoft};--cv-focus:${t.colors.focus};--cv-preview:${t.colors.preview};font-family:${t.font.body};color:var(--cv-text);background:var(--cv-page);line-height:1.45;box-sizing:border-box;color-scheme:light}
[data-cv-editor="v2"] *{box-sizing:border-box}
[data-cv-editor="v2"] h1,[data-cv-editor="v2"] h2,[data-cv-editor="v2"] h3{font-family:${t.font.heading};color:var(--cv-text);margin:0 0 ${t.spacing.sm};line-height:1.2}
[data-cv-editor="v2"] h1{font-size:1.15rem;font-weight:700}[data-cv-editor="v2"] h2{font-size:1rem;font-weight:700}[data-cv-editor="v2"] h3{font-size:.94rem;font-weight:650}
[data-cv-editor-toolbar]{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:${t.spacing.sm};min-height:56px;padding:${t.spacing.sm} ${t.spacing.lg};border-bottom:1px solid var(--cv-border);background:rgba(255,255,255,.96);backdrop-filter:blur(10px)}
[data-cv-editor-toolbar] h1{flex:1;min-width:180px;margin:0}[data-toolbar-group]{display:flex;align-items:center;gap:${t.spacing.xs};padding-left:${t.spacing.sm};border-left:1px solid var(--cv-border)}[data-toolbar-group]:first-child{border-left:0;padding-left:0}
[data-cv-editor-main]{display:grid;grid-template-columns:minmax(300px,${t.layout.sidebar}) minmax(420px,1fr);gap:${t.spacing.lg};width:min(100%,${t.layout.contentMax});margin:0 auto;padding:${t.spacing.lg};align-items:start}
[data-cv-editor-form],[data-cv-editor-preview]{background:var(--cv-surface);border:1px solid var(--cv-border);border-radius:${t.radius.lg};box-shadow:${t.shadow.card};min-width:0}
[data-cv-editor-form]{padding:${t.spacing.lg}}[data-cv-editor-preview]{min-height:680px;padding:${t.spacing.lg};background:var(--cv-preview);overflow:auto}
[data-cv-editor-form] section,[data-editor-section]{padding:${t.spacing.md} 0;border-bottom:1px solid var(--cv-border)}[data-editor-entry]{padding:${t.spacing.md};margin-bottom:${t.spacing.sm};background:var(--cv-surface-muted);border:1px solid var(--cv-border);border-radius:${t.radius.md}}
[data-cv-editor-form] label{display:block;margin-bottom:${t.spacing.xxs};font-size:.82rem;font-weight:650;color:var(--cv-text)}
[data-cv-editor-form] input,[data-cv-editor-form] textarea,[data-cv-editor-form] select{width:100%;min-height:40px;padding:${t.spacing.sm} ${t.spacing.md};margin:0 0 ${t.spacing.sm};border:1px solid var(--cv-border-strong);border-radius:${t.radius.sm};background:var(--cv-surface);color:var(--cv-text);font:inherit;outline:none;transition:border-color ${t.motion.fast} ease,box-shadow ${t.motion.fast} ease}
[data-cv-editor-form] textarea{min-height:96px;resize:vertical}[data-cv-editor-form] input:focus,[data-cv-editor-form] textarea:focus,[data-cv-editor-form] select:focus{border-color:var(--cv-focus);box-shadow:0 0 0 3px rgba(36,87,214,.14)}
[data-cv-editor="v2"] button{min-height:38px;padding:${t.spacing.xs} ${t.spacing.md};border:1px solid var(--cv-border-strong);border-radius:${t.radius.sm};background:var(--cv-surface);color:var(--cv-text);font:600 .86rem/1.2 inherit;cursor:pointer;transition:transform ${t.motion.fast} ease,border-color ${t.motion.fast} ease,background ${t.motion.fast} ease}
[data-cv-editor="v2"] button:hover{border-color:#8793a5;background:var(--cv-surface-muted)}[data-cv-editor="v2"] button:active{transform:translateY(1px)}[data-cv-editor="v2"] button:focus-visible{outline:0;box-shadow:0 0 0 3px rgba(36,87,214,.18);border-color:var(--cv-focus)}
[data-cv-editor="v2"] button[data-primary="true"],[data-cv-editor="v2"] button.primary{background:var(--cv-accent);border-color:var(--cv-accent);color:#fff}[data-cv-editor="v2"] button[data-primary="true"]:hover{background:var(--cv-accent-strong)}
[data-cv-editor-status]{display:flex;align-items:center;min-height:40px;padding:${t.spacing.xs} ${t.spacing.lg};border-top:1px solid var(--cv-border);background:var(--cv-surface);font-size:.82rem;color:var(--cv-text-muted)}
[data-cv-editor-status][data-status-type="success"]{color:var(--cv-success);background:var(--cv-success-soft)}[data-cv-editor-status][data-status-type="error"]{color:var(--cv-danger);background:var(--cv-danger-soft)}[data-cv-editor-status][data-status-type="warning"]{color:var(--cv-warning);background:var(--cv-warning-soft)}
[data-editor-save-status]{display:inline-flex;padding:3px ${t.spacing.sm};border-radius:${t.radius.pill};font-size:.76rem;font-weight:650}[data-editor-save-status="saved"]{background:var(--cv-success-soft);color:var(--cv-success)}[data-editor-save-status="unsaved"],[data-editor-save-status="dirty"]{background:var(--cv-warning-soft);color:var(--cv-warning)}[data-editor-save-status="error"]{background:var(--cv-danger-soft);color:var(--cv-danger)}
[data-preview-empty]{display:grid;place-items:center;min-height:260px;padding:${t.spacing.xl};border:1px dashed var(--cv-border-strong);border-radius:${t.radius.md};color:var(--cv-text-muted);text-align:center;background:rgba(255,255,255,.55)}
[data-cv-editor-preview] article{width:${t.layout.pageWidth};min-height:${t.layout.pageMinHeight};margin:0 auto ${t.spacing.lg};padding:18mm;background:#fff;color:#172033;border:1px solid #d8dce3;box-shadow:${t.shadow.page};overflow:hidden}[data-cv-editor-preview] article:last-child{margin-bottom:0}
[data-preview-action]{min-width:38px}[data-document-switcher]{min-width:170px}[data-cv-editor="v2"] [hidden]{display:none!important}[data-cv-editor="v2"] :disabled{cursor:not-allowed;opacity:.58}[data-cv-editor="v2"] ::selection{background:var(--cv-accent-soft);color:var(--cv-text)}
@media(max-width:1100px){[data-cv-editor-main]{grid-template-columns:minmax(260px,340px) minmax(360px,1fr)}}
@media(max-width:900px){[data-cv-editor-main]{grid-template-columns:1fr;padding:${t.spacing.md}}[data-cv-editor-preview]{min-height:560px}}
@media(max-width:600px){[data-cv-editor-toolbar]{position:relative;flex-wrap:wrap;padding:${t.spacing.sm}}[data-cv-editor-toolbar] h1{width:100%;flex-basis:100%}[data-toolbar-group]{border-left:0;border-top:1px solid var(--cv-border);padding:6px 0 0}[data-cv-editor-main]{padding:${t.spacing.sm};gap:${t.spacing.sm}}[data-cv-editor-form],[data-cv-editor-preview]{padding:${t.spacing.md};border-radius:${t.radius.md}}[data-cv-editor-form] input,[data-cv-editor-form] textarea,[data-cv-editor-form] select{min-height:44px;font-size:16px}[data-cv-editor-preview]{padding:${t.spacing.sm}}[data-cv-editor-preview] article{width:100%;min-height:auto;padding:8mm}}
@media(prefers-reduced-motion:reduce){[data-cv-editor="v2"] *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
@media print{[data-cv-editor-toolbar],[data-cv-editor-form],[data-cv-editor-status]{display:none!important}[data-cv-editor-main]{display:block;width:auto;padding:0;margin:0}[data-cv-editor-preview]{padding:0;background:#fff;border:0;box-shadow:none;overflow:visible}[data-cv-editor-preview] article{width:210mm;min-height:297mm;margin:0;padding:18mm;border:0;box-shadow:none;page-break-after:always}[data-cv-editor-preview] article:last-child{page-break-after:auto}}
[data-cv-editor-form] [data-section-visible="false"],[data-cv-editor-form] [data-entry-visible="false"],[data-cv-editor-form] [data-field-visibility="hidden"]{display:none}
[data-cv-editor-form] [data-field-id]>span,[data-cv-editor-form] [data-entry-field]>span{display:block;margin-bottom:4px;color:var(--cv-text-muted);font-size:.78rem;font-weight:650}
[data-cv-editor-form] [data-entry-field]{display:block}
[data-cv-editor-form] [data-section-id]>h2{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:8px}
[data-preview-root]{display:flex;flex-direction:column;align-items:center}
[data-preview-block-id]{cursor:text;outline:none;border-radius:4px;transition:background ${t.motion.fast} ease,box-shadow ${t.motion.fast} ease}
[data-preview-block-id]:hover{background:rgba(36,87,214,.04)}
[data-preview-block-id]:focus-visible{box-shadow:0 0 0 3px rgba(36,87,214,.15)}
[data-template-card]{display:flex;flex-direction:column;align-items:flex-start;width:100%;min-height:86px;text-align:left;padding:12px;margin:0 0 8px;background:var(--cv-surface);border-color:var(--cv-border)}
[data-template-card][aria-selected="true"],[data-template-card][data-selected="true"]{border-color:var(--cv-accent);background:var(--cv-accent-soft);box-shadow:0 0 0 2px rgba(36,87,214,.1)}
[data-export-result="error"],[data-ats-result="error"],[data-job-match-result="error"]{border:1px solid var(--cv-danger);background:var(--cv-danger-soft);color:var(--cv-danger)}
[data-export-result="ready"],[data-ats-result="ready"],[data-job-match-result="ready"]{border:1px solid var(--cv-border);background:var(--cv-surface-muted)}
[data-cv-editor="v2"] button[data-action="danger"]{color:var(--cv-danger);border-color:#e5b4ae}
[data-cv-editor="v2"] button[data-action="success"]{color:var(--cv-success);border-color:#a9d8c2}
[data-cv-editor="v2"] button[data-action="ghost"]{border-color:transparent;background:transparent}
[data-cv-editor="v2"] button[data-action="ghost"]:hover{background:var(--cv-surface-muted);border-color:var(--cv-border)}
[data-cv-editor="v2"] input[aria-invalid="true"],[data-cv-editor="v2"] textarea[aria-invalid="true"],[data-cv-editor="v2"] select[aria-invalid="true"]{border-color:var(--cv-danger);box-shadow:0 0 0 3px rgba(180,35,24,.1)}
@media(max-width:900px){[data-preview-root]{align-items:stretch}[data-cv-editor-preview] article{align-self:center;max-width:100%;overflow:hidden}}
@media(max-width:600px){[data-cv-editor-form] [data-entry-field]{margin-bottom:4px}[data-template-card]{min-height:72px}}
[data-cv-editor-toolbar] select{height:38px;border:1px solid var(--cv-border-strong);border-radius:${t.radius.sm};padding:0 10px;background:var(--cv-surface);color:var(--cv-text);font:600 .84rem inherit}
[data-cv-editor-toolbar] button{white-space:nowrap}
[data-cv-editor-main]>*{min-width:0}
[data-cv-editor-form]{scroll-margin-top:72px}
[data-cv-editor-form] section:last-child{padding-bottom:0}
[data-cv-editor-form] label[data-field-id]{position:relative}
[data-cv-editor-form] label[data-field-id]>input,[data-cv-editor-form] label[data-field-id]>textarea,[data-cv-editor-form] label[data-field-id]>select{display:block}
[data-cv-editor-form] input::placeholder,[data-cv-editor-form] textarea::placeholder{color:#8a94a6}
[data-cv-editor-form] button+button{margin-left:6px}
[data-cv-editor-preview]{scroll-behavior:smooth}
[data-cv-editor-preview] article [data-preview-block-id]{min-height:1px}
[data-cv-editor-preview] article [data-preview-block-id]:empty{min-height:12px}
[data-cv-editor-preview] article:focus-within{box-shadow:${t.shadow.raised}}
[data-cv-editor-status]:empty{display:none}
[data-cv-editor="v2"] [aria-live]{outline:none}
[data-cv-editor="v2"] :focus-visible{outline:2px solid var(--cv-focus);outline-offset:2px}
[data-cv-editor="v2"] button:focus-visible,[data-cv-editor="v2"] input:focus-visible,[data-cv-editor="v2"] textarea:focus-visible,[data-cv-editor="v2"] select:focus-visible{outline:0}
@media(max-width:900px){[data-cv-editor-main]{width:100%}[data-cv-editor-form],[data-cv-editor-preview]{width:100%}}
@media(max-width:600px){[data-cv-editor-toolbar] button,[data-cv-editor-toolbar] select{min-height:42px}[data-cv-editor-status]{padding-left:${t.spacing.md};padding-right:${t.spacing.md}}}
`;document.head.appendChild(node);return Object.freeze({version:CV_EDITOR_STYLE_SHEET_VERSION,node,destroy(){node.remove?.();}});}