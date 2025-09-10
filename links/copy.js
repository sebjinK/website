// copy-to-clipboard.js
(() => {
  async function copyText(text) {
    // Modern API (requires HTTPS or localhost)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function deriveValue(el) {
    const explicit = (el.dataset.copy || '').trim();
    if (explicit) return explicit;

    const href = (el.getAttribute('href') || '').trim();
    if (href.startsWith('mailto:')) return href.slice(7);
    if (href.startsWith('tel:')) return href.slice(4);

    // Last resort: strip leading labels like "email:" / "phone:"
    return el.textContent.replace(/^(email|phone)\s*:\s*/i, '').trim();
  }

  function announce(el, ok) {
    // Temporary inline feedback
    const original = el.getAttribute('data-copy-label') || el.textContent;
    if (!el.hasAttribute('data-copy-label')) {
      el.setAttribute('data-copy-label', original);
    }
    el.textContent = ok ? 'Copied!' : 'Copy failed';

    // Screen reader live region (optional)
    const sel = el.dataset.copyFeedback;
    const live = sel ? document.querySelector(sel) : null;
    if (live) live.textContent = ok ? 'Copied to clipboard' : 'Copy failed';

    setTimeout(() => {
      el.textContent = el.getAttribute('data-copy-label');
      if (live) live.textContent = '';
    }, 1200);
  }

  // Event delegation: works for multiple links, now or later in the DOM
  document.addEventListener('click', async (e) => {
    const el = e.target.closest('[data-copy]');
    if (!el) return;

    const value = deriveValue(el);
    const preventOnSuccess = el.dataset.copyPrevent !== 'false'; // default: true

    try {
      const ok = await copyText(value);
      if (ok && preventOnSuccess) e.preventDefault(); // block mail/tel only on success
      announce(el, ok);
    } catch {
      // If anything throws, let the default <a> action proceed
    }
  });
})();
