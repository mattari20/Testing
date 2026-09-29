# M70 — Native V2 Preview Mounting

M70 connects the browser-facing preview surface to the Native V2 Template Renderer.

The mounter owns only DOM placement. Rendering remains the V2 template engine's responsibility, while pagination and export remain downstream contracts.

The original V1 template files remain untouched.