/**
 * Liquid Glass — Optional JS behaviors for the lg-* component library.
 * Provides: ripple effects, snackbar management, dialog toggling, drawer toggling.
 */
(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // Ripple effect for buttons and interactive elements
  // -------------------------------------------------------------------------

  function createRipple(event) {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      transform: scale(0);
      animation: lg-ripple 0.5s ease-out forwards;
      pointer-events: none;
    `;

    el.style.position = el.style.position || 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  // Inject ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes lg-ripple {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Auto-attach ripple to buttons
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.lg-btn, .lg-fab, .lg-icon-btn');
    if (btn) createRipple(e);
  });

  // -------------------------------------------------------------------------
  // Snackbar
  // -------------------------------------------------------------------------

  const LG = window.LiquidGlass = window.LiquidGlass || {};

  /**
   * Show a snackbar message.
   * @param {string} message - Text to display
   * @param {Object} [opts] - Options
   * @param {string} [opts.action] - Action button text
   * @param {Function} [opts.onAction] - Action callback
   * @param {number} [opts.duration=4000] - Auto-dismiss in ms (0 = manual)
   */
  LG.snackbar = function (message, opts = {}) {
    const existing = document.querySelector('.lg-snackbar');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'lg-snackbar';
    el.textContent = message;

    if (opts.action) {
      const btn = document.createElement('button');
      btn.className = 'lg-snackbar__action';
      btn.textContent = opts.action;
      btn.addEventListener('click', () => {
        if (opts.onAction) opts.onAction();
        dismiss();
      });
      el.appendChild(btn);
    }

    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('lg-snackbar--visible'));

    function dismiss() {
      el.classList.remove('lg-snackbar--visible');
      el.addEventListener('transitionend', () => el.remove());
    }

    if (opts.duration !== 0) {
      setTimeout(dismiss, opts.duration || 4000);
    }

    return { dismiss };
  };

  // -------------------------------------------------------------------------
  // Dialog
  // -------------------------------------------------------------------------

  /**
   * Open a dialog by adding --open class to its backdrop.
   * @param {string|HTMLElement} selector - Backdrop element or CSS selector
   */
  LG.openDialog = function (selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.classList.add('lg-dialog-backdrop--open');
  };

  /**
   * Close a dialog by removing --open class from its backdrop.
   * @param {string|HTMLElement} selector - Backdrop element or CSS selector
   */
  LG.closeDialog = function (selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.classList.remove('lg-dialog-backdrop--open');
  };

  // Close dialog on backdrop click
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('lg-dialog-backdrop--open')) {
      LG.closeDialog(e.target);
    }
  });

  // -------------------------------------------------------------------------
  // Drawer
  // -------------------------------------------------------------------------

  /**
   * Toggle a drawer open/closed.
   * @param {string|HTMLElement} selector - Drawer element or CSS selector
   */
  LG.toggleDrawer = function (selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;

    const isOpen = el.classList.toggle('lg-drawer--open');
    const backdrop = el.previousElementSibling;

    if (backdrop && backdrop.classList.contains('lg-drawer__backdrop')) {
      backdrop.classList.toggle('lg-drawer__backdrop--open', isOpen);
    }
  };

  // Close drawer on backdrop click
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('lg-drawer__backdrop--open')) {
      const drawer = e.target.nextElementSibling;
      if (drawer) LG.toggleDrawer(drawer);
    }
  });

  // -------------------------------------------------------------------------
  // Tabs — auto-switching
  // -------------------------------------------------------------------------

  document.addEventListener('click', function (e) {
    const tab = e.target.closest('.lg-tabs__tab');
    if (!tab) return;

    const tabGroup = tab.closest('.lg-tabs');
    if (!tabGroup) return;

    tabGroup.querySelectorAll('.lg-tabs__tab').forEach(t => t.classList.remove('lg-tabs__tab--active'));
    tab.classList.add('lg-tabs__tab--active');

    // If data-tab-target is present, show/hide panels
    const target = tab.dataset.tabTarget;
    if (target) {
      const panel = document.querySelector(target);
      if (panel) {
        panel.parentElement.querySelectorAll(':scope > [data-tab-panel]').forEach(p => p.hidden = true);
        panel.hidden = false;
      }
    }
  });

})();
