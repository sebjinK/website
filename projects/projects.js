// projects.js
(() => {
  // Guard against double-binding
  if (window.__projectsBound) return;
  window.__projectsBound = true;

  const modal = document.getElementById('project-modal');
  if (!modal) return;
  const shell = modal.querySelector('.modal-shell');
  const content = modal.querySelector('.modal-content');
  const closeBtn = modal.querySelector('.modal-close');

  let lastFocused = null;
  let openedTemplateId = null;

  function lockScroll(on) {
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }

  function focusablesInDialog() {
    return [
      ...modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ),
    ];
  }

  function openFromTemplateId(id) {
    const tpl = document.getElementById(id);
    if (!tpl || !(tpl instanceof HTMLTemplateElement)) return;

    content.innerHTML = '';
    content.appendChild(tpl.content.cloneNode(true));
    openedTemplateId = id;

    lockScroll(true);
    modal.showModal();

    // Focus first focusable (fallback to close button)
    const first = focusablesInDialog()[0] || closeBtn;
    first?.focus();
  }

  function closeModal() {
    if (modal.open) modal.close(); // triggers 'close'
  }

  // Click handler for project triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.project-open');
    if (!trigger) return;

    e.preventDefault();
    lastFocused = document.activeElement;

    const id =
      trigger.dataset.target ||
      (trigger.getAttribute('href') || '').replace('#', '');

    if (id) {
      // Keep the hash for shareable deep-links
      if (location.hash.replace('#', '') !== id) {
        history.pushState(null, '', '#' + id);
      }
      openFromTemplateId(id);
    }
  });

  // Backdrop click (outside the shell)
  modal.addEventListener('click', (e) => {
    if (!shell.contains(e.target)) closeModal();
  });

  // Close button
  closeBtn.addEventListener('click', closeModal);

  // Cleanup on close (also runs when pressing Esc)
  modal.addEventListener('close', () => {
    lockScroll(false);
    content.innerHTML = '';
    if (lastFocused && document.body.contains(lastFocused)) {
      lastFocused.focus();
    }
    // Remove the hash if we added it for this modal
    if (openedTemplateId && location.hash.replace('#', '') === openedTemplateId) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    openedTemplateId = null;
  });

  // Trap Tab focus within the dialog
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = focusablesInDialog();
    if (f.length === 0) return;

    const first = f[0];
    const last = f[f.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Deep-link support: open a modal if URL has a matching #tmpl-...
  function maybeOpenFromHash() {
    const id = location.hash.replace('#', '');
    if (!id) return;
    if (modal.open && openedTemplateId === id) return;

    const tpl = document.getElementById(id);
    if (tpl instanceof HTMLTemplateElement) openFromTemplateId(id);
  }

  window.addEventListener('hashchange', maybeOpenFromHash);

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    maybeOpenFromHash();
  } else {
    document.addEventListener('DOMContentLoaded', maybeOpenFromHash);
  }
})();
