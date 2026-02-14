// ============================================================
// SomeLocks — 2048 Level Lock Picking Game
// ============================================================

const TAU = Math.PI * 2;
const DEG = TAU / 360;
const TOTAL_LEVELS = 2048;
const FREE_LEVELS = 64;
const STORAGE_KEY = 'somelocks_save';

// ---- Level Generation ----

function levelConfig(n) {
    // n is 1-indexed level number (1..2048)
    // Progressive scaling of bits, rings, keys
    const t = (n - 1) / (TOTAL_LEVELS - 1); // 0..1

    // Bits: 6 → 32 (pin positions on each ring)
    const bits = Math.round(6 + t * 26);

    // Rings: 1 → 6
    const rings = Math.min(6, 1 + Math.floor(t * 6));

    // Keys per ring: 1 → 4
    const keysPerRing = Math.min(4, 1 + Math.floor(t * 4));

    // Seed based on level for reproducibility
    return { level: n, bits, rings, keysPerRing };
}

// Seeded PRNG (mulberry32)
function mulberry32(seed) {
    return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function generateRing(bits, rng) {
    const minHoles = 2;
    const maxHoles = Math.max(minHoles, Math.floor(bits * 0.6));
    const holeCount = minHoles + Math.floor(rng() * (maxHoles - minHoles + 1));
    const ring = new Array(bits).fill(1);
    const indices = Array.from({ length: bits }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    for (let i = 0; i < holeCount; i++) ring[indices[i]] = 0;
    return ring;
}

function generateKeysForRing(ring, keyCount, rng) {
    const bits = ring.length;
    const holes = [];
    for (let i = 0; i < bits; i++) if (ring[i] === 0) holes.push(i);
    for (let i = holes.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [holes[i], holes[j]] = [holes[j], holes[i]];
    }
    const keys = [];
    const perKey = Math.max(1, Math.floor(holes.length / keyCount));
    let idx = 0;
    for (let k = 0; k < keyCount; k++) {
        const key = new Array(bits).fill(0);
        const end = k === keyCount - 1 ? holes.length : Math.min(idx + perKey, holes.length);
        for (let i = idx; i < end; i++) key[holes[i]] = 1;
        if (key.some(v => v === 1)) keys.push(key);
        idx = end;
        if (idx >= holes.length) break;
    }
    return keys.map(key => {
        const rot = Math.floor(rng() * bits);
        return rotateBits(key, -rot);
    });
}

function generatePuzzle(config) {
    const rng = mulberry32(config.level * 7919);
    const rings = [];
    const allKeys = [];
    for (let r = 0; r < config.rings; r++) {
        const ring = generateRing(config.bits, rng);
        rings.push(ring);
        const keys = generateKeysForRing(ring, config.keysPerRing, rng);
        allKeys.push(...keys);
    }
    for (let i = allKeys.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [allKeys[i], allKeys[j]] = [allKeys[j], allKeys[i]];
    }
    return { rings, keys: allKeys };
}

// ---- Binary Helpers ----

function rotateBits(arr, n) {
    const len = arr.length;
    const r = ((n % len) + len) % len;
    return arr.map((_, i) => arr[(i + r) % len]);
}

function keyFitsRing(key, ring) {
    if (key.every(v => v === 0)) return false;
    return key.every((v, i) => !(v === 1 && ring[i] === 1));
}

function applyKey(key, ring) {
    return ring.map((v, i) => v | key[i]);
}

function ringComplete(ring) {
    return ring.every(v => v === 1);
}

// ---- Rendering Helpers ----

function drawArcSegment(ctx, cx, cy, radius, startAngle, endAngle, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.stroke();
}

function drawRing(ctx, cx, cy, radius, ring, lineWidth, opts) {
    const bits = ring.length;
    const sweep = TAU / bits;
    const gap = 1.5 * DEG;
    const { filledColor, emptyColor, highlightIndices, highlightColor, invalidIndices, invalidColor } = opts;

    for (let i = 0; i < bits; i++) {
        const start = -Math.PI / 2 + sweep * i + gap;
        const end = start + sweep - gap * 2;
        let color;
        if (highlightIndices && highlightIndices.has(i)) {
            color = highlightColor || 'rgba(92, 228, 200, 0.6)';
        } else if (invalidIndices && invalidIndices.has(i)) {
            color = invalidColor || 'rgba(255, 107, 107, 0.5)';
        } else if (ring[i] === 1) {
            color = filledColor || 'rgba(126, 184, 255, 0.85)';
        } else {
            color = emptyColor || 'rgba(126, 184, 255, 0.08)';
        }
        drawArcSegment(ctx, cx, cy, radius, start, end, color, lineWidth);
    }
}

function drawKeyPreview(ctx, cx, cy, radius, key, lineWidth) {
    const bits = key.length;
    const sweep = TAU / bits;
    const gap = 1.5 * DEG;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    for (let i = 0; i < bits; i++) {
        const start = -Math.PI / 2 + sweep * i + gap;
        const end = start + sweep - gap * 2;
        ctx.strokeStyle = 'rgba(126, 184, 255, 0.12)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, start, end);
        ctx.stroke();
    }
    const dotAngle = Math.min(6 * DEG, sweep * 0.4);
    ctx.lineWidth = lineWidth * 1.8;
    ctx.strokeStyle = '#5ce4c8';
    ctx.lineCap = 'round';
    for (let i = 0; i < bits; i++) {
        if (key[i] === 1) {
            const mid = -Math.PI / 2 + sweep * i + sweep / 2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, mid - dotAngle / 2, mid + dotAngle / 2);
            ctx.stroke();
        }
    }
}

function drawKeyThumbnail(canvas, key) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || 48;
    const h = canvas.clientHeight || 48;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.35;
    drawKeyPreview(ctx, cx, cy, r, key, 2);
}

// ---- Save/Load ----

function loadSave() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { completed: {}, purchased: false, highestUnlocked: 1 };
}

function writeSave(save) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); } catch (e) {}
}

// ---- Hex Grid ----

const HEX_COLS = 8;

function hexLayout(index, hexW, hexH) {
    const col = index % HEX_COLS;
    const row = Math.floor(index / HEX_COLS);
    const offsetX = (row % 2) * (hexW * 0.5);
    const x = col * hexW + offsetX + hexW / 2;
    const y = row * (hexH * 0.75) + hexH / 2;
    return { x: x + 16, y: y + 16 };
}

function drawHex(ctx, cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = TAU / 6 * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
}

function hexGridTotalHeight(hexH) {
    const rows = Math.ceil(TOTAL_LEVELS / HEX_COLS);
    return rows * (hexH * 0.75) + hexH * 0.25 + 32;
}

// ---- Game State ----

class Game {
    constructor() {
        this.screen = 'splash';
        this.currentLevel = 1;
        this.bits = 6;
        this.rings = [];
        this.keys = [];
        this.keyUsed = [];
        this.selectedKey = 0;
        this.rotation = 0;
        this.smoothRotation = 0;
        this.score = 0;
        this.moves = 0;
        this.seconds = 0;
        this.timerStart = null;
        this.history = [];
        this.flashMsg = '';
        this.flashTimer = 0;
        this.config = null;
    }

    startLevel(levelNum) {
        this.currentLevel = levelNum;
        this.config = levelConfig(levelNum);
        const puzzle = generatePuzzle(this.config);
        this.bits = this.config.bits;
        this.rings = puzzle.rings;
        this.keys = puzzle.keys;
        this.keyUsed = new Array(this.keys.length).fill(false);
        this.selectedKey = 0;
        this.rotation = 0;
        this.smoothRotation = 0;
        this.score = 0;
        this.moves = 0;
        this.seconds = 0;
        this.timerStart = performance.now();
        this.history = [];
        this.flashMsg = '';
        this.flashTimer = 0;
        this.screen = 'game';
    }

    get activeRingIdx() {
        for (let i = this.rings.length - 1; i >= 0; i--) {
            if (!ringComplete(this.rings[i])) return i;
        }
        return -1;
    }

    get activeRing() {
        const idx = this.activeRingIdx;
        return idx >= 0 ? this.rings[idx] : null;
    }

    get currentKey() {
        if (this.selectedKey < 0 || this.selectedKey >= this.keys.length) return null;
        if (this.keyUsed[this.selectedKey]) return null;
        return this.keys[this.selectedKey];
    }

    get rotatedKey() {
        const k = this.currentKey;
        return k ? rotateBits(k, this.rotation) : null;
    }

    get canSlot() {
        const rk = this.rotatedKey;
        const ring = this.activeRing;
        if (!rk || !ring) return false;
        return keyFitsRing(rk, ring);
    }

    get isInvalid() {
        const rk = this.rotatedKey;
        const ring = this.activeRing;
        if (!rk || !ring) return false;
        return rk.some((v, i) => v === 1 && ring[i] === 1);
    }

    selectKey(idx) {
        if (idx < 0 || idx >= this.keys.length || this.keyUsed[idx]) return;
        this.selectedKey = idx;
        this.rotation = 0;
        this.smoothRotation = 0;
    }

    nextKey() {
        let start = this.selectedKey;
        for (let i = 1; i <= this.keys.length; i++) {
            const idx = (start + i) % this.keys.length;
            if (!this.keyUsed[idx]) { this.selectKey(idx); return; }
        }
    }

    rotateLeft() { this.rotation--; }
    rotateRight() { this.rotation++; }

    slot() {
        if (!this.canSlot) return;
        const ringIdx = this.activeRingIdx;
        const ring = this.rings[ringIdx];
        const rk = this.rotatedKey;

        this.history.push({
            ringIdx,
            ringSnapshot: [...ring],
            keyIdx: this.selectedKey,
        });

        this.rings[ringIdx] = applyKey(rk, ring);
        this.keyUsed[this.selectedKey] = true;
        this.moves++;

        const pinCount = rk.reduce((a, v) => a + v, 0);
        let scoreAdd = 100 + pinCount * pinCount * 10;
        if (ringComplete(this.rings[ringIdx])) {
            scoreAdd += Math.max(1000 - Math.floor(this.seconds) * 5, 0);
            this.flash('Ring cleared!');
        }
        this.score += scoreAdd;

        if (this.rings.every(r => ringComplete(r))) {
            this.screen = 'win';
            return;
        }

        this.nextKey();
        this.rotation = 0;
        this.smoothRotation = 0;
    }

    undo() {
        if (this.history.length === 0) return;
        const entry = this.history.pop();
        this.rings[entry.ringIdx] = entry.ringSnapshot;
        this.keyUsed[entry.keyIdx] = false;
        this.selectedKey = entry.keyIdx;
        this.rotation = 0;
        this.smoothRotation = 0;
        this.moves++;
        this.flash('Undo');
    }

    flash(msg) {
        this.flashMsg = msg;
        this.flashTimer = 90;
    }

    tick() {
        if (this.screen === 'game' && this.timerStart) {
            this.seconds = (performance.now() - this.timerStart) / 1000;
        }
        const target = this.rotation;
        const diff = target - this.smoothRotation;
        if (Math.abs(diff) > 0.01) {
            this.smoothRotation += diff * 0.3;
        } else {
            this.smoothRotation = target;
        }
        if (this.flashTimer > 0) this.flashTimer--;
    }

    getStars() {
        // 3 stars: fast, few moves. 2 stars: decent. 1 star: completed.
        const config = this.config;
        const idealMoves = config.rings * config.keysPerRing;
        const moveRatio = this.moves / idealMoves;
        if (moveRatio <= 1.2 && this.seconds < 30 + config.rings * 10) return 3;
        if (moveRatio <= 2.0 && this.seconds < 60 + config.rings * 20) return 2;
        return 1;
    }
}

// ---- App ----

class App {
    constructor() {
        this.game = new Game();
        this.save = loadSave();
        this.hexCanvas = null;
        this.hexCtx = null;
        this.hexW = 0;
        this.hexH = 0;
        this.hexR = 0;
        this.splashData = [];
        this.swipeStartX = null;
        this.swipeCumul = 0;
        this.init();
    }

    init() {
        this.$splash = document.getElementById('splash-screen');
        this.$level = document.getElementById('level-screen');
        this.$game = document.getElementById('game-screen');
        this.$win = document.getElementById('win-screen');

        this.splashCanvas = document.getElementById('splash-canvas');
        this.splashCtx = this.splashCanvas.getContext('2d');
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.hexCanvas = document.getElementById('hex-canvas');
        this.hexCtx = this.hexCanvas.getContext('2d');

        this.splashData = this.makeSplashData();

        // Splash
        document.getElementById('btn-play').onclick = () => {
            this.game.screen = 'level';
            this.show();
            this.renderHexGrid();
        };

        document.getElementById('btn-back-splash').onclick = () => {
            this.game.screen = 'splash';
            this.show();
        };

        // Level select click
        this.hexCanvas.addEventListener('click', (e) => this.onHexClick(e));
        this.hexCanvas.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const rect = this.hexCanvas.getBoundingClientRect();
                const touch = e.changedTouches[0];
                this.handleHexTap(touch.clientX - rect.left, touch.clientY - rect.top);
            }
        });

        // Purchase
        document.getElementById('btn-purchase').onclick = () => {
            this.save.purchased = true;
            writeSave(this.save);
            this.renderHexGrid();
            document.getElementById('purchase-banner').classList.add('hidden');
        };

        // Game controls
        document.getElementById('btn-left').onclick = () => this.game.rotateLeft();
        document.getElementById('btn-right').onclick = () => this.game.rotateRight();
        document.getElementById('btn-slot').onclick = () => { this.game.slot(); this.buildKeyTray(); if (this.game.screen === 'win') this.show(); };
        document.getElementById('btn-undo').onclick = () => { this.game.undo(); this.buildKeyTray(); };
        document.getElementById('btn-back-levels').onclick = () => {
            this.game.screen = 'level';
            this.show();
            this.renderHexGrid();
        };

        // Win screen
        document.getElementById('btn-next').onclick = () => {
            const next = this.game.currentLevel + 1;
            if (next > TOTAL_LEVELS) return;
            if (!this.isUnlocked(next)) return;
            this.game.startLevel(next);
            this.show();
            this.buildKeyTray();
        };
        document.getElementById('btn-replay').onclick = () => {
            this.game.startLevel(this.game.currentLevel);
            this.show();
            this.buildKeyTray();
        };
        document.getElementById('btn-levels').onclick = () => {
            this.game.screen = 'level';
            this.show();
            this.renderHexGrid();
        };

        // Game canvas touch/mouse
        this.canvas.addEventListener('touchstart', e => { e.preventDefault(); this.swipeStartX = e.touches[0].clientX; this.swipeCumul = 0; }, { passive: false });
        this.canvas.addEventListener('touchmove', e => { e.preventDefault(); if (this.swipeStartX !== null) this.swipeCumul = e.touches[0].clientX - this.swipeStartX; }, { passive: false });
        this.canvas.addEventListener('touchend', () => this.endSwipe());
        this.canvas.addEventListener('mousedown', e => { this.swipeStartX = e.clientX; this.swipeCumul = 0; });
        this.canvas.addEventListener('mousemove', e => { if (this.swipeStartX !== null) this.swipeCumul = e.clientX - this.swipeStartX; });
        this.canvas.addEventListener('mouseup', () => this.endSwipe());

        // Keyboard
        document.addEventListener('keydown', e => this.onKey(e));

        // Splash animation cycle
        setInterval(() => {
            this.splashData.forEach(d => { d.target = Math.floor(Math.random() * 24); });
        }, 3000);

        window.addEventListener('resize', () => { this.resize(); if (this.game.screen === 'level') this.renderHexGrid(); });
        this.resize();
        this.show();
        this.loop();
    }

    makeSplashData() {
        const rng = mulberry32(42);
        const rings = [];
        for (let i = 0; i < 5; i++) {
            const ring = generateRing(24, rng);
            rings.push({ ring, rotation: rng() * 24, target: Math.floor(rng() * 24) });
        }
        return rings;
    }

    isUnlocked(level) {
        if (level <= FREE_LEVELS) return true;
        if (this.save.purchased) return true;
        return false;
    }

    completedCount() {
        return Object.keys(this.save.completed).length;
    }

    endSwipe() {
        if (this.swipeStartX === null) return;
        const thresh = 30;
        if (this.swipeCumul > thresh) this.game.rotateRight();
        else if (this.swipeCumul < -thresh) this.game.rotateLeft();
        else { if (this.game.canSlot) { this.game.slot(); this.buildKeyTray(); if (this.game.screen === 'win') this.show(); } }
        this.swipeStartX = null;
        this.swipeCumul = 0;
    }

    onKey(e) {
        if (this.game.screen !== 'game') return;
        if (e.key === 'ArrowLeft' || e.key === 'a') this.game.rotateLeft();
        else if (e.key === 'ArrowRight' || e.key === 'd') this.game.rotateRight();
        else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.game.slot(); this.buildKeyTray(); if (this.game.screen === 'win') this.show(); }
        else if (e.key === 'Tab') { e.preventDefault(); this.game.nextKey(); this.buildKeyTray(); }
        else if (e.key === 'z' || e.key === 'Z') { this.game.undo(); this.buildKeyTray(); }
        else if (e.key === 'Escape') { this.game.screen = 'level'; this.show(); this.renderHexGrid(); }
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        [this.splashCanvas, this.canvas].forEach(c => {
            const w = c.clientWidth, h = c.clientHeight;
            if (w > 0 && h > 0) {
                c.width = w * dpr;
                c.height = h * dpr;
                c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
            }
        });
    }

    show() {
        const s = this.game.screen;
        this.$splash.classList.toggle('hidden', s !== 'splash');
        this.$level.classList.toggle('hidden', s !== 'level');
        this.$game.classList.toggle('hidden', s !== 'game');
        this.$win.classList.toggle('hidden', s !== 'win');
        if (s === 'win') this.populateWin();
        if (s === 'game') setTimeout(() => this.resize(), 10);
        if (s === 'level') {
            document.getElementById('level-progress').textContent = `${this.completedCount()} / ${TOTAL_LEVELS}`;
            const banner = document.getElementById('purchase-banner');
            banner.classList.toggle('hidden', this.save.purchased);
        }
    }

    // ---- Hex Grid ----

    renderHexGrid() {
        const dpr = window.devicePixelRatio || 1;
        const containerW = this.hexCanvas.parentElement.clientWidth;
        this.hexW = (containerW - 32) / HEX_COLS;
        this.hexH = this.hexW * 1.15;
        this.hexR = this.hexW * 0.45;

        const totalH = hexGridTotalHeight(this.hexH);
        this.hexCanvas.style.height = totalH + 'px';
        this.hexCanvas.width = containerW * dpr;
        this.hexCanvas.height = totalH * dpr;
        this.hexCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const ctx = this.hexCtx;
        ctx.clearRect(0, 0, containerW, totalH);

        for (let i = 0; i < TOTAL_LEVELS; i++) {
            const level = i + 1;
            const { x, y } = hexLayout(i, this.hexW, this.hexH);
            const unlocked = this.isUnlocked(level);
            const completed = this.save.completed[level];
            const stars = completed ? completed.stars : 0;

            // Hex fill
            drawHex(ctx, x, y, this.hexR);
            if (completed) {
                const g = ctx.createRadialGradient(x, y, 0, x, y, this.hexR);
                g.addColorStop(0, 'rgba(92, 228, 200, 0.15)');
                g.addColorStop(1, 'rgba(92, 228, 200, 0.04)');
                ctx.fillStyle = g;
            } else if (unlocked) {
                ctx.fillStyle = 'rgba(126, 184, 255, 0.06)';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            }
            ctx.fill();

            // Hex stroke
            drawHex(ctx, x, y, this.hexR);
            if (completed) {
                ctx.strokeStyle = 'rgba(92, 228, 200, 0.35)';
            } else if (unlocked) {
                ctx.strokeStyle = 'rgba(126, 184, 255, 0.2)';
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            }
            ctx.lineWidth = 1;
            ctx.stroke();

            // Level number
            ctx.font = `600 ${this.hexR * 0.38}px system-ui`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (completed) {
                ctx.fillStyle = 'rgba(92, 228, 200, 0.9)';
                ctx.fillText(level, x, y - this.hexR * 0.12);
                // Stars
                ctx.font = `${this.hexR * 0.22}px system-ui`;
                ctx.fillStyle = stars >= 3 ? '#f0c850' : 'rgba(240, 200, 80, 0.3)';
                const starStr = '\u2605'.repeat(stars) + '\u2606'.repeat(3 - stars);
                ctx.fillText(starStr, x, y + this.hexR * 0.28);
            } else if (unlocked) {
                ctx.fillStyle = 'rgba(126, 184, 255, 0.7)';
                ctx.fillText(level, x, y);
            } else {
                // Lock icon
                ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.font = `${this.hexR * 0.35}px system-ui`;
                ctx.fillText('\uD83D\uDD12', x, y);
            }
        }
    }

    onHexClick(e) {
        const rect = this.hexCanvas.getBoundingClientRect();
        this.handleHexTap(e.clientX - rect.left, e.clientY - rect.top + this.hexCanvas.parentElement.scrollTop);
    }

    handleHexTap(mx, my) {
        // Account for scroll
        my += document.getElementById('level-scroll').scrollTop;

        for (let i = 0; i < TOTAL_LEVELS; i++) {
            const { x, y } = hexLayout(i, this.hexW, this.hexH);
            const dx = mx - x, dy = my - y;
            if (dx * dx + dy * dy < this.hexR * this.hexR) {
                const level = i + 1;
                if (this.isUnlocked(level)) {
                    this.game.startLevel(level);
                    this.show();
                    this.buildKeyTray();
                }
                return;
            }
        }
    }

    buildKeyTray() {
        const tray = document.getElementById('key-tray');
        tray.innerHTML = '';
        this.game.keys.forEach((key, idx) => {
            const slot = document.createElement('div');
            slot.className = 'key-slot';
            if (idx === this.game.selectedKey) slot.classList.add('selected');
            if (this.game.keyUsed[idx]) slot.classList.add('used');
            const cvs = document.createElement('canvas');
            slot.appendChild(cvs);
            slot.onclick = () => { this.game.selectKey(idx); this.buildKeyTray(); };
            tray.appendChild(slot);
            requestAnimationFrame(() => drawKeyThumbnail(cvs, key));
        });
    }

    populateWin() {
        const g = this.game;
        const stars = g.getStars();

        // Save completion
        const prev = this.save.completed[g.currentLevel];
        if (!prev || prev.stars < stars || prev.score < g.score) {
            this.save.completed[g.currentLevel] = { stars, score: g.score, time: g.seconds };
            writeSave(this.save);
        }

        document.getElementById('win-level').textContent = `Level ${g.currentLevel}`;
        document.getElementById('win-score').textContent = g.score;
        const m = Math.floor(g.seconds / 60);
        const s = Math.floor(g.seconds % 60).toString().padStart(2, '0');
        document.getElementById('win-time').textContent = `${m}:${s}`;
        document.getElementById('win-moves').textContent = g.moves;
        document.getElementById('win-bits').textContent = g.config.bits;
        document.getElementById('win-rings').textContent = g.config.rings;

        const starsEl = document.getElementById('win-stars');
        starsEl.textContent = '\u2605'.repeat(stars) + '\u2606'.repeat(3 - stars);
        starsEl.style.color = stars >= 3 ? '#f0c850' : stars >= 2 ? '#c8d8ef' : '#6b7a94';

        // Next level button
        const nextBtn = document.getElementById('btn-next');
        const nextLevel = g.currentLevel + 1;
        if (nextLevel > TOTAL_LEVELS || !this.isUnlocked(nextLevel)) {
            nextBtn.disabled = true;
            nextBtn.textContent = nextLevel > TOTAL_LEVELS ? 'All Complete!' : 'Unlock to Continue';
        } else {
            nextBtn.disabled = false;
            nextBtn.textContent = 'Next Level';
        }
    }

    loop() {
        this.game.tick();
        if (this.game.screen === 'splash') this.renderSplash();
        if (this.game.screen === 'game') this.renderGame();
        requestAnimationFrame(() => this.loop());
    }

    renderSplash() {
        const ctx = this.splashCtx;
        const w = this.splashCanvas.clientWidth, h = this.splashCanvas.clientHeight;
        if (w === 0 || h === 0) return;
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2;
        const baseR = Math.min(w, h) * 0.16;
        const step = Math.min(w, h) * 0.085;

        this.splashData.forEach((d, i) => {
            d.rotation += (d.target - d.rotation) * 0.015;
            const r = baseR + i * step;
            const opacity = 0.15 + i * 0.17;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-d.rotation / 24 * TAU);
            ctx.translate(-cx, -cy);
            drawRing(ctx, cx, cy, r, d.ring, Math.max(4, r * 0.09), {
                filledColor: `rgba(126, 184, 255, ${0.7 * opacity})`,
                emptyColor: `rgba(126, 184, 255, ${0.05 * opacity})`,
            });
            ctx.restore();
        });
    }

    renderGame() {
        const ctx = this.ctx;
        const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
        if (w === 0 || h === 0) return;
        ctx.clearRect(0, 0, w, h);

        const g = this.game;
        const activeIdx = g.activeRingIdx;
        if (activeIdx < 0) return;

        const cx = w / 2, cy = h / 2;
        const maxR = Math.min(w, h) * 0.40;
        const ringSpacing = maxR * 0.18;
        const totalRings = g.rings.length;

        const rk = g.rotatedKey;
        const activeRing = g.activeRing;
        let highlightSet = null;
        let invalidSet = null;

        if (rk && activeRing) {
            if (g.canSlot) {
                highlightSet = new Set();
                rk.forEach((v, i) => { if (v === 1) highlightSet.add(i); });
            } else if (g.isInvalid) {
                invalidSet = new Set();
                rk.forEach((v, i) => { if (v === 1 && activeRing[i] === 1) invalidSet.add(i); });
            }
        }

        for (let i = 0; i < totalRings; i++) {
            const ring = g.rings[i];
            const r = maxR - (totalRings - 1 - i) * ringSpacing;
            const lw = Math.max(6, r * 0.10);
            const complete = ringComplete(ring);
            const isActive = i === activeIdx;

            if (complete) {
                drawRing(ctx, cx, cy, r, ring, lw, {
                    filledColor: 'rgba(92, 228, 200, 0.2)',
                    emptyColor: 'rgba(92, 228, 200, 0.05)',
                });
            } else {
                const opacity = isActive ? 1.0 : 0.25;
                drawRing(ctx, cx, cy, r, ring, lw, {
                    filledColor: `rgba(126, 184, 255, ${0.85 * opacity})`,
                    emptyColor: `rgba(126, 184, 255, ${0.08 * opacity})`,
                    highlightIndices: isActive ? highlightSet : null,
                    highlightColor: 'rgba(92, 228, 200, 0.65)',
                    invalidIndices: isActive ? invalidSet : null,
                    invalidColor: 'rgba(255, 107, 107, 0.55)',
                });
            }
        }

        if (g.currentKey) {
            const pickR = maxR + ringSpacing * 0.8;
            const lw = Math.max(3, pickR * 0.04);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-g.smoothRotation / g.bits * TAU);
            ctx.translate(-cx, -cy);
            drawKeyPreview(ctx, cx, cy, pickR, g.currentKey, lw);
            ctx.restore();
        }

        // HUD
        const min = Math.floor(g.seconds / 60);
        const sec = Math.floor(g.seconds % 60).toString().padStart(2, '0');
        document.getElementById('hud-score').textContent = g.score;
        document.getElementById('hud-time').textContent = `${min}:${sec}`;
        document.getElementById('hud-level').textContent = g.currentLevel;
        document.getElementById('hud-info').textContent = `${g.config.bits} pins \u00B7 ${g.config.rings} ring${g.config.rings > 1 ? 's' : ''}`;

        const remaining = g.rings.filter(r => !ringComplete(r)).length;
        document.getElementById('hud-status').textContent = `${remaining} ring${remaining !== 1 ? 's' : ''} remaining`;

        document.getElementById('btn-slot').classList.toggle('disabled', !g.canSlot);
        document.getElementById('btn-undo').classList.toggle('disabled', g.history.length === 0);

        const flashEl = document.getElementById('game-flash');
        if (g.flashTimer > 0) {
            flashEl.textContent = g.flashMsg;
            flashEl.style.opacity = Math.min(1, g.flashTimer / 30);
        } else {
            flashEl.textContent = '';
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new App());
