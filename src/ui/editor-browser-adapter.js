export const EDITOR_BROWSER_ADAPTER_VERSION = '1.0.0';

export function createEditorBrowserAdapter(page) {
  if (!page || typeof page.evaluate !== 'function') throw new Error('A browser page with evaluate() is required.');
  return Object.freeze({
    async mount(selector, input = {}) {
      return page.evaluate(({ selector, input }) => {
        const root = document.querySelector(selector);
        if (!root) throw new Error('Editor root not found: ' + selector);
        return {
          mounted: true,
          selector,
          hasInput: Boolean(input)
        };
      }, { selector, input });
    },
    async readState(selector) {
      return page.evaluate(sel => {
        const root = document.querySelector(sel);
        return root ? {
          exists: true,
          textLength: root.textContent?.length || 0,
          fieldCount: root.querySelectorAll('[data-v2-editor-field]').length
        } : { exists: false, textLength: 0, fieldCount: 0 };
      }, selector);
    },
    async setField(selector, fieldSelector, value) {
      return page.evaluate(({ selector, fieldSelector, value }) => {
        const root = document.querySelector(selector);
        const input = root?.querySelector(fieldSelector);
        if (!input) throw new Error('Editor field not found.');
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return { updated: true, value: input.value };
      }, { selector, fieldSelector, value });
    }
  });
}
