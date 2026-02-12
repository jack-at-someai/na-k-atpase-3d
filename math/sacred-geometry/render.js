(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Controls
  const layersInput = document.getElementById('layers');
  const scaleInput = document.getElementById('scale');
  const speedInput = document.getElementById('speed');
  const linewidthInput = document.getElementById('linewidth');
  const opacityInput = document.getElementById('opacity');
  const animateCheck = document.getElementById('animate');
  const glowCheck = document.getElementById('glow');
  const fillCheck = document.getElementById('fill-mode');
  const rainbowCheck = document.getElementById('rainbow');
  const saveBtn = document.getElementById('save-btn');
  const patternBtns = document.querySelectorAll('.pattern-btn');
  const swatches = document.querySelectorAll('.swatch');

  let currentPattern = 'flowerOfLife';
  let strokeColor = '#22d3ee';
  let angle = 0;
  let animFrameId;

  // Slider value displays
  const sliders = [
    { input: layersInput, display: document.getElementById('layers-val') },
    { input: scaleInput, display: document.getElementById('scale-val') },
    { input: speedInput, display: document.getElementById('speed-val') },
    { input: linewidthInput, display: document.getElementById('linewidth-val') },
    { input: opacityInput, display: document.getElementById('opacity-val') }
  ];
  sliders.forEach(({ input, display }) => {
    input.addEventListener('input', () => { display.textContent = input.value; });
  });

  // Pattern selection
  patternBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      patternBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPattern = btn.dataset.pattern;
    });
  });

  // Color swatches
  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      strokeColor = sw.dataset.color;
    });
  });

  // Save
  saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `sacred-geometry-${currentPattern}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });

  // Resize
  function resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
  }
  window.addEventListener('resize', resize);
  resize();

  // Helpers
  function getColor(alpha) {
    if (rainbowCheck.checked) {
      const hue = (angle * 50) % 360;
      return `hsla(${hue}, 80%, 60%, ${alpha})`;
    }
    const r = parseInt(strokeColor.slice(1, 3), 16);
    const g = parseInt(strokeColor.slice(3, 5), 16);
    const b = parseInt(strokeColor.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function setupCtx() {
    const alpha = parseInt(opacityInput.value) / 100;
    const lw = parseFloat(linewidthInput.value) * devicePixelRatio;
    ctx.strokeStyle = getColor(alpha);
    ctx.lineWidth = lw;
    ctx.fillStyle = getColor(alpha * 0.15);

    if (glowCheck.checked) {
      ctx.shadowColor = getColor(0.6);
      ctx.shadowBlur = 12 * devicePixelRatio;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }

  function drawCircle(cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    if (fillCheck.checked) ctx.fill();
    ctx.stroke();
  }

  function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // ---- PATTERNS ----

  function flowerOfLife(cx, cy, r, layers) {
    drawCircle(cx, cy, r);
    const drawn = new Set();
    drawn.add(`${cx.toFixed(1)},${cy.toFixed(1)}`);
    let centers = [{ x: cx, y: cy }];

    for (let layer = 0; layer < layers; layer++) {
      const next = [];
      for (const { x, y } of centers) {
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3 + angle;
          const nx = x + r * Math.cos(a);
          const ny = y + r * Math.sin(a);
          const key = `${nx.toFixed(1)},${ny.toFixed(1)}`;
          if (!drawn.has(key)) {
            drawn.add(key);
            drawCircle(nx, ny, r);
            next.push({ x: nx, y: ny });
          }
        }
      }
      centers = next;
    }
  }

  function seedOfLife(cx, cy, r) {
    drawCircle(cx, cy, r);
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + angle;
      drawCircle(cx + r * Math.cos(a), cy + r * Math.sin(a), r);
    }
  }

  function metatronsCube(cx, cy, r) {
    // 13 circles of Fruit of Life
    const points = [{ x: cx, y: cy }];
    // Inner ring
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + angle;
      points.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
    // Outer ring
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + angle;
      points.push({ x: cx + r * 2 * Math.cos(a), y: cy + r * 2 * Math.sin(a) });
    }

    // Draw circles
    const cr = r * 0.35;
    for (const p of points) drawCircle(p.x, p.y, cr);

    // Connect all points
    for (let i = 0; i < points.length; i++)
      for (let j = i + 1; j < points.length; j++)
        drawLine(points[i].x, points[i].y, points[j].x, points[j].y);
  }

  function sriYantra(cx, cy, r, layers) {
    const n = Math.max(4, Math.min(layers + 3, 12));
    // Draw nested triangles alternating up/down
    for (let i = 0; i < n; i++) {
      const ratio = (n - i) / n;
      const cr = r * ratio;
      const up = i % 2 === 0;
      const offset = up ? -Math.PI / 2 : Math.PI / 2;
      ctx.beginPath();
      for (let j = 0; j <= 3; j++) {
        const a = offset + (j * 2 * Math.PI) / 3 + angle * 0.3;
        const px = cx + cr * Math.cos(a);
        const py = cy + cr * Math.sin(a);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      if (fillCheck.checked) ctx.fill();
      ctx.stroke();
    }
    // Outer circle
    drawCircle(cx, cy, r * 1.05);
  }

  function fibonacciSpiral(cx, cy, baseR, layers) {
    const n = Math.max(2, layers + 4);
    let a = 1, b = 1;
    const seq = [a, b];
    for (let i = 2; i < n; i++) {
      [a, b] = [b, a + b];
      seq.push(b);
    }
    const maxVal = seq[seq.length - 1];
    const scaleFactor = baseR * 2 / maxVal;

    // Draw squares and quarter arcs
    let x = cx, y = cy;
    let dir = 0; // 0=right, 1=down, 2=left, 3=up
    for (let i = 0; i < seq.length; i++) {
      const s = seq[i] * scaleFactor;
      const rot = angle * 0.5;

      // Quarter arc
      ctx.beginPath();
      let arcCx, arcCy, startA, endA;
      switch (dir) {
        case 0: arcCx = x + s; arcCy = y + s; startA = Math.PI; endA = Math.PI * 1.5; break;
        case 1: arcCx = x;     arcCy = y + s; startA = Math.PI * 1.5; endA = Math.PI * 2; break;
        case 2: arcCx = x;     arcCy = y;     startA = 0; endA = Math.PI * 0.5; break;
        case 3: arcCx = x + s; arcCy = y;     startA = Math.PI * 0.5; endA = Math.PI; break;
      }
      ctx.arc(arcCx, arcCy, s, startA + rot, endA + rot);
      ctx.stroke();

      // Draw the square
      ctx.strokeRect(x, y, s, s);

      // Move to next square
      switch (dir) {
        case 0: x += s; break;
        case 1: y += s; break;
        case 2: x -= seq[i + 1] ? seq[i + 1] * scaleFactor : s; break;
        case 3: y -= seq[i + 1] ? seq[i + 1] * scaleFactor : s; break;
      }
      dir = (dir + 1) % 4;
    }
  }

  function torusKnot(cx, cy, R, layers) {
    const p = Math.max(2, Math.floor(layers / 2) + 2);
    const q = p + 1;
    const r = R * 0.3;
    const steps = 600;

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * p;
      const rr = R + r * Math.cos(q * t / p);
      const x = cx + rr * Math.cos(t + angle);
      const y = cy + rr * Math.sin(t + angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    if (fillCheck.checked) ctx.fill();
    ctx.stroke();
  }

  function vesicaPiscis(cx, cy, r, layers) {
    const n = Math.max(1, layers);
    const d = r * 0.5;
    for (let i = 0; i < n; i++) {
      const offset = i * d * 0.3;
      const rot = angle + (i * Math.PI) / n;
      const x1 = cx - (d + offset) * Math.cos(rot);
      const y1 = cy - (d + offset) * Math.sin(rot);
      const x2 = cx + (d + offset) * Math.cos(rot);
      const y2 = cy + (d + offset) * Math.sin(rot);
      const cr = r + i * 8;
      drawCircle(x1, y1, cr);
      drawCircle(x2, y2, cr);
    }
    // Central vesica intersection highlight
    drawCircle(cx, cy, r * 0.15);
  }

  function goldenSpiral(cx, cy, r) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const turns = 6;
    const steps = 500;

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * Math.PI * 2;
      const sr = (r * 0.02) * Math.pow(phi, t / (Math.PI * 2));
      if (sr > r * 2.5) break;
      const x = cx + sr * Math.cos(t + angle);
      const y = cy + sr * Math.sin(t + angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw golden rectangle guides
    const levels = 8;
    let w = r * 0.08, h = w / phi;
    let gx = cx, gy = cy;
    for (let i = 0; i < levels; i++) {
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(angle);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.restore();
      const temp = w;
      w = w + h;
      h = temp;
    }
  }

  // ---- RENDER LOOP ----

  const patterns = {
    flowerOfLife: (cx, cy, r, l) => flowerOfLife(cx, cy, r, l),
    seedOfLife: (cx, cy, r) => seedOfLife(cx, cy, r),
    metatronsCube: (cx, cy, r) => metatronsCube(cx, cy, r),
    sriYantra: (cx, cy, r, l) => sriYantra(cx, cy, r, l),
    fibonacciSpiral: (cx, cy, r, l) => fibonacciSpiral(cx, cy, r, l),
    torusKnot: (cx, cy, r, l) => torusKnot(cx, cy, r, l),
    vesicaPiscis: (cx, cy, r, l) => vesicaPiscis(cx, cy, r, l),
    goldenSpiral: (cx, cy, r) => goldenSpiral(cx, cy, r)
  };

  function draw() {
    resize();
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const layers = parseInt(layersInput.value);
    const scale = parseInt(scaleInput.value) * devicePixelRatio;
    const speed = parseInt(speedInput.value);

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Subtle radial gradient background
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
    grad.addColorStop(0, '#1a003a');
    grad.addColorStop(1, '#060910');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    setupCtx();

    const fn = patterns[currentPattern];
    if (fn) fn(cx, cy, scale, layers);

    if (animateCheck.checked) {
      angle += speed * 0.0002;
    }

    animFrameId = requestAnimationFrame(draw);
  }

  draw();
})();
