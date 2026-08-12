import $ from 'jquery';

/**
 * Generic dialog utilities replacing browser alert() and confirm().
 * Uses a single shared Bootstrap modal: #dh-dialog-modal
 *
 * Usage:
 *   import { dhAlert, dhConfirm } from './utils/dialog';
 *
 *   await dhAlert('Something went wrong.');
 *   await dhAlert('<b>Error:</b> bad value', { html: true, title: 'Error' });
 *
 *   const ok = await dhConfirm('Delete this record?');
 *   const ok = await dhConfirm('Really delete?', { dangerous: true, okLabel: 'Delete' });
 */

/**
 * Internal: render and show #dh-dialog-modal, resolve when dismissed.
 */
function _showDialog(content, options) {
  const {
    title = '',
    okLabel = 'OK',
    cancelLabel = 'Cancel',
    showCancel = false,
    dangerous = false,
    html = false,
  } = options;

  return new Promise((resolve) => {
    const modal = document.getElementById('dh-dialog-modal');
    const headerEl = modal.querySelector('#dh-dialog-header');
    const titleEl  = modal.querySelector('#dh-dialog-title');
    const bodyEl   = modal.querySelector('#dh-dialog-body');
    const okBtn    = modal.querySelector('#dh-dialog-ok');
    const cancelBtn = modal.querySelector('#dh-dialog-cancel');

    // Title / header visibility
    if (title) {
      titleEl.textContent = title;
      headerEl.style.display = '';
    } else {
      headerEl.style.display = 'none';
    }

    // Body content
    if (html) {
      bodyEl.innerHTML = content;
      bodyEl.style.whiteSpace = '';
    } else {
      bodyEl.textContent = content;
      bodyEl.style.whiteSpace = 'pre-wrap';
    }

    // Buttons
    okBtn.textContent = okLabel;
    okBtn.className = `btn ${dangerous ? 'btn-danger' : 'btn-primary'}`;
    cancelBtn.textContent = cancelLabel;
    cancelBtn.style.display = showCancel ? '' : 'none';

    // Namespaced events — clean up any stale handlers first
    const ns = '.dhDialog';
    $(modal).off(ns);

    const cleanup = (result) => {
      $(modal).off(ns);
      $(modal).modal('hide');
      resolve(result);
    };

    $(modal).on(`click${ns}`, '#dh-dialog-ok', () => cleanup(true));
    if (showCancel) {
      $(modal).on(`click${ns}`, '#dh-dialog-cancel', () => cleanup(false));
    }
    // Escape key or backdrop click: resolve false (confirm) or true (alert)
    $(modal).on(`hidden.bs.modal${ns}`, () => cleanup(showCancel ? false : true));

    $(modal).modal('show');
  });
}

/**
 * Show an informational/error dialog with only an OK button.
 * @param {string} content - plain text (default) or HTML when html:true
 * @param {Object} [options]
 * @param {string}  [options.title]      - header title (default: 'Attention')
 * @param {string}  [options.okLabel]    - button label (default: 'OK')
 * @param {boolean} [options.html]       - treat content as HTML (default: false)
 * @returns {Promise<void>}
 */
export function dhAlert(content, options = {}) {
  return _showDialog(content, { title: 'Attention', ...options, showCancel: false });
}

/**
 * Show a confirm dialog with OK and Cancel buttons.
 * @param {string} content - plain text (default) or HTML when html:true
 * @param {Object} [options]
 * @param {string}  [options.title]        - header title (default: 'Confirm')
 * @param {string}  [options.okLabel]      - OK button label (default: 'OK')
 * @param {string}  [options.cancelLabel]  - Cancel button label (default: 'Cancel')
 * @param {boolean} [options.dangerous]    - use btn-danger style for OK (default: false)
 * @param {boolean} [options.html]         - treat content as HTML (default: false)
 * @returns {Promise<boolean>} true if OK clicked, false if cancelled
 */
export function dhConfirm(content, options = {}) {
  return _showDialog(content, { title: 'Confirm', ...options, showCancel: true });
}

/**
 * Show a dialog with multiple named choice buttons.
 * Resolves to the 0-based index of the clicked button, or -1 if dismissed
 * (Cancel button, Escape key, or backdrop click).
 *
 * @param {string}   content      - plain text or HTML (when html:true)
 * @param {string[]} buttonLabels - labels for the choice buttons (left → right order)
 * @param {Object}  [options]
 * @param {string}   [options.title]          - header title
 * @param {boolean}  [options.html]           - treat content as HTML (default: false)
 * @param {string}   [options.cancelLabel]    - label for the dismiss button (default: 'Cancel')
 * @param {number[]} [options.disabledIndices] - indices of buttons to render disabled (default: [])
 * @returns {Promise<number>} index of clicked button (0-based), or -1 if dismissed
 */
export function dhChoose(content, buttonLabels, options = {}) {
  const { title = '', html = false, cancelLabel = 'Cancel', disabledIndices = [] } = options;
  const disabledSet = new Set(disabledIndices);
  return new Promise((resolve) => {
    const modal     = document.getElementById('dh-dialog-modal');
    const headerEl  = modal.querySelector('#dh-dialog-header');
    const titleEl   = modal.querySelector('#dh-dialog-title');
    const bodyEl    = modal.querySelector('#dh-dialog-body');
    const okBtn     = modal.querySelector('#dh-dialog-ok');
    const cancelBtn = modal.querySelector('#dh-dialog-cancel');
    const footer    = modal.querySelector('.modal-footer');

    if (title) { titleEl.textContent = title; headerEl.style.display = ''; }
    else        { headerEl.style.display = 'none'; }

    if (html) { bodyEl.innerHTML = content; bodyEl.style.whiteSpace = ''; }
    else      { bodyEl.textContent = content; bodyEl.style.whiteSpace = 'pre-wrap'; }

    okBtn.style.display = 'none';
    cancelBtn.textContent = cancelLabel;
    cancelBtn.style.display = '';

    // Insert choice buttons to the left of the Cancel button.
    const choiceButtons = buttonLabels.map((label, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const disabled = disabledSet.has(idx);
      btn.className = disabled ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm';
      btn.disabled = disabled;
      btn.textContent = label;
      footer.insertBefore(btn, cancelBtn);
      return btn;
    });

    const ns = '.dhChoose';
    $(modal).off(ns);

    const cleanup = (result) => {
      $(modal).off(ns);
      choiceButtons.forEach((btn) => btn.remove());
      okBtn.style.display = '';
      $(modal).modal('hide');
      resolve(result);
    };

    choiceButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => cleanup(idx));
    });
    $(modal).on(`click${ns}`, '#dh-dialog-cancel', () => cleanup(-1));
    $(modal).on(`hidden.bs.modal${ns}`,             () => cleanup(-1));

    $(modal).modal('show');
  });
}
