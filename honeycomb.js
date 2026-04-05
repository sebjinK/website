(function () {
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const modalCanvas = document.getElementById('modal-canvas');
  const mctx = modalCanvas ? modalCanvas.getContext('2d') : null;

  const RADIUS   = 110;
  const SPACING  = 24;
  const MAX_SIZE = 30;

  let mx = -9999, my = -9999;
  let lx = -9999, ly = -9999;

  document.addEventListener('mousemove',  e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function hexPath(c, x, y, r) {
    c.beginPath();
    for (let i = 0; i < 6; i++) {
      const a  = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + r * Math.cos(a);
      const py = y + r * Math.sin(a);
      i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
    }
    c.closePath();
  }

  function drawHoney(c, w, h, cx, cy) {
    c.clearRect(0, 0, w, h);
    if (cx < -500) return;

    const hexW     = SPACING * Math.sqrt(3);
    const hexH     = SPACING * 1.5;
    const startCol = Math.floor((cx - RADIUS) / hexW) - 1;
    const endCol   = Math.ceil ((cx + RADIUS) / hexW) + 1;
    const startRow = Math.floor((cy - RADIUS) / hexH) - 1;
    const endRow   = Math.ceil ((cy + RADIUS) / hexH) + 1;

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const offset = (row % 2 !== 0) ? hexW / 2 : 0;
        const hx   = col * hexW + offset;
        const hy   = row * hexH;
        const dist = Math.hypot(hx - cx, hy - cy);
        if (dist >= RADIUS) continue;
        const t = 1 - dist / RADIUS;
        c.strokeStyle = `rgba(180, 140, 255, ${t * 0.3})`;
        c.lineWidth   = 1;
        hexPath(c, hx, hy, MAX_SIZE * t);
        c.stroke();
      }
    }
  }

  const modal = document.getElementById('project-modal');

  function render() {
    requestAnimationFrame(render);
    lx += (mx - lx) * 0.12;
    ly += (my - ly) * 0.12;

    drawHoney(ctx, canvas.width, canvas.height, lx, ly);

    if (mctx && modal && modal.open) {
      const rect = modalCanvas.getBoundingClientRect();
      const rw   = Math.round(rect.width);
      const rh   = Math.round(rect.height);
      if (modalCanvas.width !== rw || modalCanvas.height !== rh) {
        modalCanvas.width  = rw;
        modalCanvas.height = rh;
      }
      drawHoney(mctx, rw, rh, lx - rect.left, ly - rect.top);
    } else if (mctx) {
      mctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
    }
  }

  render();
})();
