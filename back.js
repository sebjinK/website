document.addEventListener('DOMContentLoaded', () => {
  const details = document.getElementById('about-details');
  const trigger = document.getElementById('aboutTrigger');
  const panel   = document.getElementById('about-content');
  if (!details || !trigger || !panel) return;

  let animating = false;

  function openAnim() {
    animating = true;
    details.setAttribute('open', '');
    panel.style.transition = 'none';
    panel.style.maxHeight = '0px';
    panel.style.opacity   = '0';
    panel.style.transform = 'translateY(-6px)';
    panel.offsetHeight;

    panel.style.transition = '';
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.style.opacity   = '1';
    panel.style.transform = 'translateY(0)';

    const onOpenEnd = (e) => {
      if (e.propertyName !== 'max-height') return;
      panel.style.maxHeight = 'none';
      panel.removeEventListener('transitionend', onOpenEnd);
      animating = false;
      trigger.setAttribute('aria-expanded', 'true');
    };
    panel.addEventListener('transitionend', onOpenEnd);
  }

  function closeAnim() {
    animating = true;
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.style.opacity   = '1';
    panel.style.transform = 'translateY(0)';
    panel.offsetHeight;

    panel.style.maxHeight = '0px';
    panel.style.opacity   = '0';
    panel.style.transform = 'translateY(-6px)';

    const onCloseEnd = (e) => {
      if (e.propertyName !== 'max-height') return;
      details.removeAttribute('open');
      panel.style.maxHeight = '';
      panel.style.opacity   = '';
      panel.style.transform = '';
      panel.removeEventListener('transitionend', onCloseEnd);
      animating = false;
      trigger.setAttribute('aria-expanded', 'false');
    };
    panel.addEventListener('transitionend', onCloseEnd);
  }

  function toggle() {
    if (animating) return;
    details.hasAttribute('open') ? closeAnim() : openAnim();
  }

  trigger.addEventListener('click', toggle);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  // keep height correct on resize while open
  window.addEventListener('resize', () => {
    if (details.hasAttribute('open') && panel.style.maxHeight) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});
