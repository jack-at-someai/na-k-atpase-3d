/**
 * MapleStory Fish Market Bazaar — Core Engine
 */
(() => {
  /* ── DOM refs ─────────────────────────────────────────── */
  const canvas  = document.getElementById('game');
  const ctx     = canvas.getContext('2d');
  const channelBar   = document.getElementById('channel-bar');
  const vendorCount  = document.getElementById('vendor-count');
  const channelLabel = document.getElementById('channel-label');
  const shopOverlay  = document.getElementById('shop-overlay');
  const shopTitle    = document.getElementById('shop-title');
  const shopGreeting = document.getElementById('shop-greeting');
  const shopGrid     = document.getElementById('shop-grid');
  const shopClose    = document.getElementById('shop-close');

  /* ── Constants ────────────────────────────────────────── */
  const W = 868, H = 500;
  canvas.width = W;
  canvas.height = H;

  const GROUND_Y   = H - 60;
  const STALL_Y    = GROUND_Y - 10;
  const STALL_GAP  = 200;
  const DRAG_THRESHOLD = 5;

  const DATA   = window.MARKET_DATA;
  const STYLES = DATA.stallStyles;
  const RARITY = DATA.rarityColors;

  /* ── State ────────────────────────────────────────────── */
  let currentChannel = 0;
  let vendors = [];
  let camera = { x: 0, target: 0 };
  let worldWidth = 0;

  let hoveredStall = -1;
  let shopOpen = false;
  let shopVendorIdx = -1;

  // Drag state
  let dragging = false;
  let dragStartX = 0;
  let dragCameraStart = 0;
  let dragDist = 0;

  // Keyboard scroll
  let keysDown = {};

  // Ambient objects (regenerated per channel)
  let lanterns = [];
  let particles = [];
  let buildings = [];

  /* ── Channel bar setup ────────────────────────────────── */
  DATA.channels.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'channel-btn' + (i === 0 ? ' active' : '');
    btn.textContent = ch.name;
    btn.addEventListener('click', () => switchChannel(i));
    channelBar.appendChild(btn);
  });

  function switchChannel(idx) {
    currentChannel = idx;
    const ch = DATA.channels[idx];
    vendors = ch.vendors;
    worldWidth = Math.max(W, vendors.length * STALL_GAP + 200);
    camera.x = 0;
    camera.target = 0;
    hoveredStall = -1;
    closeShop();

    // Update UI
    channelBar.querySelectorAll('.channel-btn').forEach((b, i) => {
      b.classList.toggle('active', i === idx);
    });
    vendorCount.textContent = vendors.length + ' vendors';
    channelLabel.textContent = ch.name;

    generateAmbient();
  }

  /* ── Ambient generation ───────────────────────────────── */
  function generateAmbient() {
    // Background buildings
    buildings = [];
    const numB = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numB; i++) {
      buildings.push({
        x: Math.random() * (worldWidth + 400) - 200,
        w: 30 + Math.random() * 60,
        h: 60 + Math.random() * 100,
        shade: 0.03 + Math.random() * 0.04
      });
    }

    // Lanterns between stalls
    lanterns = [];
    for (let i = 0; i < vendors.length - 1; i++) {
      const sx = 120 + i * STALL_GAP + STALL_GAP / 2;
      lanterns.push({
        x: sx + (Math.random() - 0.5) * 20,
        y: STALL_Y - 120 - Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
        size: 8 + Math.random() * 4
      });
    }
    // Extra lanterns
    for (let i = 0; i < 4; i++) {
      lanterns.push({
        x: Math.random() * worldWidth,
        y: 80 + Math.random() * 60,
        phase: Math.random() * Math.PI * 2,
        size: 6 + Math.random() * 3
      });
    }

    // Particles
    particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push(makeParticle());
    }
  }

  function makeParticle() {
    return {
      x: Math.random() * (worldWidth + 200) - 100,
      y: GROUND_Y - 20 - Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.1 - Math.random() * 0.4,
      life: Math.random(),
      maxLife: 0.6 + Math.random() * 0.4,
      size: 1 + Math.random() * 2,
      type: Math.random() < 0.6 ? 'steam' : 'sparkle'
    };
  }

  /* ── Drawing helpers ──────────────────────────────────── */
  function drawSky() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a0e17');
    grad.addColorStop(0.4, '#111827');
    grad.addColorStop(0.8, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function drawBuildings() {
    const parallax = 0.3;
    buildings.forEach(b => {
      const sx = b.x - camera.x * parallax;
      if (sx + b.w < -50 || sx > W + 50) return;
      ctx.fillStyle = `rgba(226, 232, 240, ${b.shade})`;
      ctx.fillRect(sx, GROUND_Y - b.h, b.w, b.h);
      // Windows
      ctx.fillStyle = `rgba(99, 102, 241, ${b.shade * 0.8})`;
      for (let wy = GROUND_Y - b.h + 10; wy < GROUND_Y - 10; wy += 18) {
        for (let wx = sx + 6; wx < sx + b.w - 6; wx += 14) {
          ctx.fillRect(wx, wy, 5, 7);
        }
      }
    });
  }

  function drawCanopy() {
    const parallax = 0.6;
    const canopyY = 30;
    // Banner / canopy strips
    for (let i = 0; i < Math.ceil(worldWidth / 120) + 2; i++) {
      const sx = i * 120 - (camera.x * parallax) % 120;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(99, 102, 241, 0.08)' : 'rgba(34, 211, 238, 0.05)';
      ctx.beginPath();
      ctx.moveTo(sx, canopyY);
      ctx.lineTo(sx + 120, canopyY);
      ctx.lineTo(sx + 110, canopyY + 25);
      ctx.lineTo(sx + 10, canopyY + 25);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawGround() {
    // Main ground
    ctx.fillStyle = '#1a1510';
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

    // Plank lines
    ctx.strokeStyle = 'rgba(139, 105, 20, 0.15)';
    ctx.lineWidth = 1;
    for (let py = GROUND_Y + 8; py < H; py += 12) {
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(W, py);
      ctx.stroke();
    }
    // Vertical plank gaps
    for (let px = 0; px < W; px += 40) {
      const offset = (px / 40 % 2) * 6;
      ctx.beginPath();
      ctx.moveTo(px, GROUND_Y + offset);
      ctx.lineTo(px, GROUND_Y + 12 + offset);
      ctx.stroke();
    }
  }

  function drawStall(vendor, sx, idx) {
    const style = STYLES[vendor.stallType] || STYLES.wooden;
    const sw = style.width;
    const sh = style.height;
    const baseX = sx - sw / 2;
    const baseY = STALL_Y - sh;

    const isHover = (idx === hoveredStall && !shopOpen);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(baseX + 4, STALL_Y - 4, sw, 8);

    // Counter / base
    ctx.fillStyle = style.counterColor;
    ctx.fillRect(baseX, STALL_Y - 30, sw, 30);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(baseX, STALL_Y - 30, sw, 2);

    // Side posts
    ctx.fillStyle = style.frameColor;
    ctx.fillRect(baseX + 4, baseY + 15, 6, sh - 15);
    ctx.fillRect(baseX + sw - 10, baseY + 15, 6, sh - 15);

    // Roof
    ctx.fillStyle = style.roofColor;
    ctx.beginPath();
    ctx.moveTo(baseX - 10, baseY + 20);
    ctx.lineTo(baseX + sw / 2, baseY);
    ctx.lineTo(baseX + sw + 10, baseY + 20);
    ctx.closePath();
    ctx.fill();

    // Roof outline
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(baseX - 10, baseY + 20);
    ctx.lineTo(baseX + sw / 2, baseY);
    ctx.lineTo(baseX + sw + 10, baseY + 20);
    ctx.stroke();

    // Items on counter (show first 3 item icons)
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    const items = vendor.items.slice(0, 3);
    items.forEach((item, ii) => {
      const ix = baseX + 20 + ii * (sw - 40) / Math.max(items.length - 1, 1);
      ctx.fillText(item.icon, ix, STALL_Y - 10);
    });

    // Vendor name plate
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    const nameW = Math.min(sw - 8, ctx.measureText(vendor.name).width + 12);
    ctx.fillRect(baseX + (sw - nameW) / 2, baseY + 22, nameW, 16);
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText(vendor.name, baseX + sw / 2, baseY + 34);

    // Hover highlight
    if (isHover) {
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(baseX - 2, baseY - 2, sw + 4, sh + 14);
      // Glow
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 12;
      ctx.strokeRect(baseX - 2, baseY - 2, sw + 4, sh + 14);
      ctx.shadowBlur = 0;
    }

    // Return hit-box
    return { x: baseX, y: baseY, w: sw, h: sh + 10 };
  }

  function drawNPC(sx, baseY, time) {
    // Simple pixel-art NPC behind stall
    const bobY = Math.sin(time * 2 + sx) * 2;
    const ny = baseY - 8 + bobY;
    const nx = sx;

    // Body
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(nx - 6, ny, 12, 14);
    // Head
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(nx - 5, ny - 10, 10, 10);
    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(nx - 3, ny - 6, 2, 2);
    ctx.fillRect(nx + 1, ny - 6, 2, 2);
    // Hat
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(nx - 6, ny - 13, 12, 4);
  }

  function drawLanterns(time) {
    lanterns.forEach(l => {
      const sx = l.x - camera.x;
      if (sx < -30 || sx > W + 30) return;
      const swing = Math.sin(time * 1.5 + l.phase) * 3;
      const lx = sx + swing;
      const ly = l.y;

      // String
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lx, ly - l.size);
      ctx.lineTo(lx, ly - l.size - 15);
      ctx.stroke();

      // Lantern body
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(lx, ly, l.size * 0.7, l.size, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, l.size * 2.5);
      glow.addColorStop(0, 'rgba(244, 63, 94, 0.15)');
      glow.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(lx - l.size * 3, ly - l.size * 3, l.size * 6, l.size * 6);

      // Ribs
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(lx, ly - l.size);
      ctx.lineTo(lx, ly + l.size);
      ctx.stroke();
    });
  }

  function updateParticles(dt) {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += dt * 0.5;
      if (p.life >= p.maxLife) {
        Object.assign(p, makeParticle());
        p.life = 0;
      }
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      const sx = p.x - camera.x;
      if (sx < -10 || sx > W + 10) return;
      const alpha = (1 - p.life / p.maxLife) * 0.4;
      if (p.type === 'steam') {
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        const s = p.size * 0.8;
        ctx.fillRect(sx - s / 2, p.y - s / 2, s, s);
      }
    });
  }

  /* ── Stall hit-boxes (updated each frame) ─────────────── */
  let stallBoxes = [];

  /* ── Render loop ──────────────────────────────────────── */
  let lastTime = 0;

  function frame(ts) {
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;

    update(dt, ts / 1000);
    draw(ts / 1000);

    requestAnimationFrame(frame);
  }

  function update(dt, time) {
    // Keyboard scroll
    const scrollSpeed = 400;
    if (keysDown['ArrowLeft'] || keysDown['a']) camera.target -= scrollSpeed * dt;
    if (keysDown['ArrowRight'] || keysDown['d']) camera.target += scrollSpeed * dt;

    // Clamp
    const maxScroll = Math.max(0, worldWidth - W);
    camera.target = Math.max(0, Math.min(maxScroll, camera.target));

    // Smooth lerp
    camera.x += (camera.target - camera.x) * Math.min(1, dt * 8);

    // Particles
    updateParticles(dt);
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    drawSky();
    drawBuildings();
    drawCanopy();
    drawGround();

    // Draw stalls
    stallBoxes = [];
    vendors.forEach((v, i) => {
      const sx = 120 + i * STALL_GAP - camera.x;
      // Cull off-screen
      if (sx < -200 || sx > W + 200) {
        stallBoxes.push(null);
        return;
      }
      const style = STYLES[v.stallType] || STYLES.wooden;
      const box = drawStall(v, sx, i);
      stallBoxes.push(box);

      // NPC behind stall
      drawNPC(sx, box.y + 5, time);
    });

    drawLanterns(time);
    drawParticles();

    // Hint text when no shop open
    if (!shopOpen && hoveredStall >= 0) {
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('Click to browse', W / 2, H - 15);
    }
  }

  /* ── Shop overlay ─────────────────────────────────────── */
  function openShop(idx) {
    const vendor = vendors[idx];
    if (!vendor) return;
    shopVendorIdx = idx;
    shopOpen = true;

    shopTitle.textContent = vendor.name;
    shopGreeting.textContent = '"' + vendor.greeting + '"';

    shopGrid.innerHTML = '';
    // Fill up to 8 slots
    const slots = vendor.items.slice(0, 8);
    for (let i = 0; i < 8; i++) {
      const item = slots[i];
      const cell = document.createElement('div');
      cell.className = 'shop-item';
      if (item) {
        cell.innerHTML =
          '<div class="shop-item-top">' +
            '<span class="shop-item-icon">' + item.icon + '</span>' +
            '<span class="shop-item-name rarity-' + item.rarity + '">' + escapeHtml(item.name) + '</span>' +
          '</div>' +
          '<div class="shop-item-bottom">' +
            '<span class="shop-item-price">' + item.price.toLocaleString() + ' z</span>' +
            '<span class="shop-item-qty">x' + item.qty + '</span>' +
          '</div>';
      } else {
        cell.innerHTML = '<div class="shop-item-top"><span class="shop-item-icon" style="opacity:0.15">—</span></div>';
      }
      shopGrid.appendChild(cell);
    }

    shopOverlay.classList.remove('hidden');
  }

  function closeShop() {
    shopOpen = false;
    shopVendorIdx = -1;
    shopOverlay.classList.add('hidden');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  shopClose.addEventListener('click', closeShop);
  shopOverlay.addEventListener('click', (e) => {
    if (e.target === shopOverlay) closeShop();
  });

  /* ── Mouse interaction ────────────────────────────────── */
  function canvasMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function hitTestStall(mx, my) {
    for (let i = stallBoxes.length - 1; i >= 0; i--) {
      const b = stallBoxes[i];
      if (!b) continue;
      if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return i;
    }
    return -1;
  }

  canvas.addEventListener('mousedown', (e) => {
    if (shopOpen) return;
    const pos = canvasMousePos(e);
    dragging = true;
    dragStartX = e.clientX;
    dragCameraStart = camera.target;
    dragDist = 0;
  });

  window.addEventListener('mousemove', (e) => {
    const pos = canvasMousePos(e);

    if (dragging) {
      const dx = e.clientX - dragStartX;
      dragDist = Math.abs(dx);
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      camera.target = dragCameraStart - dx * scaleX;
    } else if (!shopOpen) {
      // Hover detection
      hoveredStall = hitTestStall(pos.x, pos.y);
      canvas.style.cursor = hoveredStall >= 0 ? 'pointer' : 'grab';
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (dragging) {
      dragging = false;
      if (dragDist < DRAG_THRESHOLD && !shopOpen) {
        const pos = canvasMousePos(e);
        const hit = hitTestStall(pos.x, pos.y);
        if (hit >= 0) openShop(hit);
      }
    }
  });

  /* ── Touch interaction ────────────────────────────────── */
  let touchId = null;
  let touchStartX = 0;
  let touchCameraStart = 0;
  let touchDist = 0;

  canvas.addEventListener('touchstart', (e) => {
    if (shopOpen || touchId !== null) return;
    const t = e.changedTouches[0];
    touchId = t.identifier;
    touchStartX = t.clientX;
    touchCameraStart = camera.target;
    touchDist = 0;
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        const dx = t.clientX - touchStartX;
        touchDist = Math.abs(dx);
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width;
        camera.target = touchCameraStart - dx * scaleX;
        e.preventDefault();
        break;
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        touchId = null;
        if (touchDist < DRAG_THRESHOLD && !shopOpen) {
          const rect = canvas.getBoundingClientRect();
          const scaleX = W / rect.width;
          const scaleY = H / rect.height;
          const mx = (t.clientX - rect.left) * scaleX;
          const my = (t.clientY - rect.top) * scaleY;
          const hit = hitTestStall(mx, my);
          if (hit >= 0) openShop(hit);
        }
        break;
      }
    }
  });

  /* ── Keyboard ─────────────────────────────────────────── */
  window.addEventListener('keydown', (e) => {
    keysDown[e.key] = true;
    if (e.key === 'Escape' && shopOpen) closeShop();
  });

  window.addEventListener('keyup', (e) => {
    keysDown[e.key] = false;
  });

  /* ── Mobile controls ──────────────────────────────────── */
  let mobileInterval = null;
  document.querySelectorAll('.ctrl-btn').forEach(btn => {
    const action = btn.dataset.action;

    const start = () => {
      if (action === 'shop') {
        // Find nearest stall to center
        const center = camera.x + W / 2;
        let nearest = -1, nearestDist = Infinity;
        vendors.forEach((v, i) => {
          const sx = 120 + i * STALL_GAP;
          const d = Math.abs(sx - center);
          if (d < nearestDist) { nearestDist = d; nearest = i; }
        });
        if (nearest >= 0 && nearestDist < STALL_GAP) {
          if (shopOpen) closeShop(); else openShop(nearest);
        }
        return;
      }
      const dir = action === 'left' ? -1 : 1;
      mobileInterval = setInterval(() => {
        camera.target += dir * 12;
      }, 16);
    };

    const stop = () => {
      if (mobileInterval) { clearInterval(mobileInterval); mobileInterval = null; }
    };

    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', stop);
    btn.addEventListener('mouseleave', stop);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); start(); }, { passive: false });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); stop(); });
    btn.addEventListener('touchcancel', stop);
  });

  /* ── Init ─────────────────────────────────────────────── */
  switchChannel(0);
  requestAnimationFrame(frame);
})();
