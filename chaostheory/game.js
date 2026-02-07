(function () {
    'use strict';

    // ===== Shared Utilities =====

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function mapRange(v, a1, b1, a2, b2) { return a2 + (v - a1) / (b1 - a1) * (b2 - a2); }

    function hslToRgb(h, s, l) {
        h = ((h % 360) + 360) % 360;
        s = clamp(s, 0, 1);
        l = clamp(l, 0, 1);
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r, g, b;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        return [(r + m) * 255 | 0, (g + m) * 255 | 0, (b + m) * 255 | 0];
    }

    function valueToColor(t, palette) {
        t = clamp(t, 0, 1);
        switch (palette) {
            case 'fire': return hslToRgb(t * 60, 1, 0.3 + t * 0.4);
            case 'ice': return hslToRgb(180 + t * 60, 0.8, 0.2 + t * 0.5);
            case 'rainbow': return hslToRgb(t * 360, 0.9, 0.5);
            case 'green': return hslToRgb(100 + t * 40, 0.8, 0.2 + t * 0.45);
            case 'purple':
            default: return hslToRgb(270 + t * 50, 0.8, 0.15 + t * 0.55);
        }
    }

    function setupCanvas(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, w: rect.width, h: rect.height };
    }

    function clearCanvas(ctx, w, h) {
        ctx.fillStyle = '#0d001a';
        ctx.fillRect(0, 0, w, h);
    }

    function getCanvasMousePos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function project3D(x, y, z, angleY, angleX, scale, cx, cy) {
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        return { px: cx + x1 * scale, py: cy + y1 * scale };
    }

    function makeZoomPan(defaults) {
        return {
            cx: defaults.cx || 0,
            cy: defaults.cy || 0,
            zoom: defaults.zoom || 1,
            defCx: defaults.cx || 0,
            defCy: defaults.cy || 0,
            defZoom: defaults.zoom || 1,
            reset() {
                this.cx = this.defCx;
                this.cy = this.defCy;
                this.zoom = this.defZoom;
            },
            screenToWorld(sx, sy, w, h) {
                const scale = Math.min(w, h) * this.zoom;
                return {
                    x: (sx - w / 2) / scale + this.cx,
                    y: (sy - h / 2) / scale + this.cy
                };
            },
            worldToScreen(wx, wy, w, h) {
                const scale = Math.min(w, h) * this.zoom;
                return {
                    x: (wx - this.cx) * scale + w / 2,
                    y: (wy - this.cy) * scale + h / 2
                };
            },
            zoomAt(sx, sy, factor, w, h) {
                const before = this.screenToWorld(sx, sy, w, h);
                this.zoom *= factor;
                const after = this.screenToWorld(sx, sy, w, h);
                this.cx += before.x - after.x;
                this.cy += before.y - after.y;
            }
        };
    }

    // ===== Demo Manager =====

    const demos = [];
    let activeDemo = 0;
    let tabs, panels;

    function registerDemo(demo) {
        demos.push(demo);
    }

    function switchDemo(index) {
        if (index === activeDemo && demos[index] && demos[index]._initialized) return;

        if (demos[activeDemo] && demos[activeDemo]._initialized) {
            demos[activeDemo].deactivate();
        }
        if (panels[activeDemo]) panels[activeDemo].classList.remove('active');
        if (tabs[activeDemo]) tabs[activeDemo].classList.remove('active');

        activeDemo = index;
        panels[index].classList.add('active');
        tabs[index].classList.add('active');

        if (!demos[index]._initialized) {
            demos[index].init();
            demos[index]._initialized = true;
        }
        demos[index].activate();
    }

    // Helper to bind slider to value display
    function bindSlider(id, valId, cb, fmt) {
        const slider = document.getElementById(id);
        const valEl = document.getElementById(valId);
        slider.addEventListener('input', function () {
            const v = parseFloat(this.value);
            valEl.textContent = fmt ? fmt(v) : v;
            if (cb) cb(v);
        });
        return slider;
    }

    // ===== Demo 0: Lorenz Attractor =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        trail: [], sigma: 10, rho: 28, beta: 2.667,
        x: 0.1, y: 0, z: 0,
        trailLen: 2000, rotateY: 0,
        animId: null,

        init() {
            this.canvas = document.getElementById('canvas-0');
            const self = this;
            bindSlider('lorenz-sigma', 'lorenz-sigma-val', v => { self.sigma = v; });
            bindSlider('lorenz-rho', 'lorenz-rho-val', v => { self.rho = v; });
            bindSlider('lorenz-beta', 'lorenz-beta-val', v => { self.beta = v; });
            bindSlider('lorenz-trail', 'lorenz-trail-val', v => { self.trailLen = v; });
            bindSlider('lorenz-rotate', 'lorenz-rotate-val', v => { self.rotateY = v * Math.PI / 180; }, v => v + '\u00B0');
            document.getElementById('lorenz-reset').addEventListener('click', () => {
                self.x = 0.1; self.y = 0; self.z = 0;
                self.trail = [];
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            const self = this;
            function loop() {
                self.step();
                self.draw();
                self.animId = requestAnimationFrame(loop);
            }
            this.animId = requestAnimationFrame(loop);
        },

        deactivate() {
            if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
        },

        resize() {
            if (!this._initialized) return;
            this.deactivate();
            this.activate();
        },

        step() {
            const dt = 0.005;
            for (let i = 0; i < 10; i++) {
                const dx = this.sigma * (this.y - this.x) * dt;
                const dy = (this.x * (this.rho - this.z) - this.y) * dt;
                const dz = (this.x * this.y - this.beta * this.z) * dt;
                this.x += dx; this.y += dy; this.z += dz;
            }
            this.trail.push({ x: this.x, y: this.y, z: this.z });
            while (this.trail.length > this.trailLen) this.trail.shift();
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);
            if (this.trail.length < 2) return;
            const scale = Math.min(w, h) / 70;
            const cx = w / 2, cy = h * 0.6;
            const angleY = this.rotateY;
            const trail = this.trail;
            ctx.lineWidth = 1.2;
            for (let i = 1; i < trail.length; i++) {
                const p0 = project3D(trail[i - 1].x, -trail[i - 1].z, trail[i - 1].y, angleY, 0.3, scale, cx, cy);
                const p1 = project3D(trail[i].x, -trail[i].z, trail[i].y, angleY, 0.3, scale, cx, cy);
                const t = i / trail.length;
                const [r, g, b] = hslToRgb(260 + t * 100, 0.9, 0.4 + t * 0.3);
                ctx.strokeStyle = `rgba(${r},${g},${b},${0.3 + t * 0.7})`;
                ctx.beginPath();
                ctx.moveTo(p0.px, p0.py);
                ctx.lineTo(p1.px, p1.py);
                ctx.stroke();
            }
            // Info
            document.getElementById('lorenz-x').textContent = this.x.toFixed(3);
            document.getElementById('lorenz-y').textContent = this.y.toFixed(3);
            document.getElementById('lorenz-z').textContent = this.z.toFixed(3);
            document.getElementById('lorenz-pts').textContent = this.trail.length;
        }
    });

    // ===== Demo 1: Mandelbrot & Julia =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        zp: null,
        maxIter: 200,
        juliaMode: false,
        juliaRe: -0.7, juliaIm: 0.27015,
        rendering: false,

        init() {
            this.canvas = document.getElementById('canvas-1');
            this.zp = makeZoomPan({ cx: -0.5, cy: 0, zoom: 0.3 });
            const self = this;
            bindSlider('mandel-iter', 'mandel-iter-val', v => { self.maxIter = v; self.render(); });
            document.getElementById('mandel-julia').addEventListener('change', function () {
                self.juliaMode = this.checked;
                document.getElementById('mandel-mode').textContent = self.juliaMode ? 'Julia' : 'Mandelbrot';
                self.render();
            });
            bindSlider('mandel-julia-re', 'mandel-julia-re-val', v => { self.juliaRe = v; if (self.juliaMode) self.render(); });
            bindSlider('mandel-julia-im', 'mandel-julia-im-val', v => { self.juliaIm = v; if (self.juliaMode) self.render(); }, v => v.toFixed(3));
            document.getElementById('mandel-reset').addEventListener('click', () => {
                self.zp.reset(); self.render();
            });

            this.canvas.addEventListener('click', e => {
                const pos = getCanvasMousePos(self.canvas, e);
                self.zp.zoomAt(pos.x, pos.y, 2, self.w, self.h);
                self.render();
            });
            this.canvas.addEventListener('contextmenu', e => {
                e.preventDefault();
                const pos = getCanvasMousePos(self.canvas, e);
                self.zp.zoomAt(pos.x, pos.y, 0.5, self.w, self.h);
                self.render();
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.render();
        },

        deactivate() { this.rendering = false; },

        resize() {
            if (!this._initialized) return;
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.render();
        },

        render() {
            const ctx = this.ctx, w = this.w, h = this.h;
            if (!ctx) return;
            const dpr = window.devicePixelRatio || 1;
            const pw = Math.floor(w * dpr), ph = Math.floor(h * dpr);
            const imgData = ctx.createImageData(pw, ph);
            const data = imgData.data;
            const maxIter = this.maxIter;
            const julia = this.juliaMode;
            const jRe = this.juliaRe, jIm = this.juliaIm;
            const scale = Math.min(w, h) * this.zp.zoom;
            const cx = this.zp.cx, cy = this.zp.cy;

            for (let py = 0; py < ph; py++) {
                for (let px = 0; px < pw; px++) {
                    const x0 = (px / dpr - w / 2) / scale + cx;
                    const y0 = (py / dpr - h / 2) / scale + cy;
                    let zr, zi, cr, ci;
                    if (julia) {
                        zr = x0; zi = y0; cr = jRe; ci = jIm;
                    } else {
                        zr = 0; zi = 0; cr = x0; ci = y0;
                    }
                    let iter = 0;
                    while (zr * zr + zi * zi <= 4 && iter < maxIter) {
                        const tmp = zr * zr - zi * zi + cr;
                        zi = 2 * zr * zi + ci;
                        zr = tmp;
                        iter++;
                    }
                    const idx = (py * pw + px) * 4;
                    if (iter === maxIter) {
                        data[idx] = data[idx + 1] = data[idx + 2] = 0;
                    } else {
                        const t = iter / maxIter;
                        const [r, g, b] = hslToRgb(240 + t * 300, 0.85, t * 0.7);
                        data[idx] = r; data[idx + 1] = g; data[idx + 2] = b;
                    }
                    data[idx + 3] = 255;
                }
            }

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.putImageData(imgData, 0, 0);
            ctx.restore();

            document.getElementById('mandel-center').textContent =
                `${this.zp.cx.toFixed(4)}, ${this.zp.cy.toFixed(4)}`;
            document.getElementById('mandel-zoom').textContent = this.zp.zoom.toFixed(2) + 'x';
        }
    });

    // ===== Demo 2: Bifurcation Diagram =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        zp: null,
        warmup: 500, plotIters: 500,

        init() {
            this.canvas = document.getElementById('canvas-2');
            this.zp = makeZoomPan({ cx: 3.2, cy: 0.5, zoom: 0.35 });
            const self = this;
            bindSlider('bifur-warmup', 'bifur-warmup-val', v => { self.warmup = v; self.render(); });
            bindSlider('bifur-iters', 'bifur-iters-val', v => { self.plotIters = v; self.render(); });
            document.getElementById('bifur-reset').addEventListener('click', () => {
                self.zp.reset(); self.render();
            });
            this.canvas.addEventListener('click', e => {
                const pos = getCanvasMousePos(self.canvas, e);
                self.zp.zoomAt(pos.x, pos.y, 2, self.w, self.h);
                self.render();
            });
            this.canvas.addEventListener('contextmenu', e => {
                e.preventDefault();
                const pos = getCanvasMousePos(self.canvas, e);
                self.zp.zoomAt(pos.x, pos.y, 0.5, self.w, self.h);
                self.render();
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.render();
        },

        deactivate() {},

        resize() {
            if (!this._initialized) return;
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.render();
        },

        render() {
            const ctx = this.ctx, w = this.w, h = this.h;
            if (!ctx) return;
            const dpr = window.devicePixelRatio || 1;
            const pw = Math.floor(w * dpr), ph = Math.floor(h * dpr);
            const density = new Uint32Array(pw * ph);
            const scale = Math.min(w, h) * this.zp.zoom;
            const warmup = this.warmup, plotIters = this.plotIters;

            for (let col = 0; col < pw; col++) {
                const r = (col / dpr - w / 2) / scale + this.zp.cx;
                if (r < 0 || r > 4) continue;
                let x = 0.5;
                for (let i = 0; i < warmup; i++) x = r * x * (1 - x);
                for (let i = 0; i < plotIters; i++) {
                    x = r * x * (1 - x);
                    const sy = ((x - this.zp.cy) * scale + h / 2) * dpr;
                    const row = Math.floor(sy);
                    if (row >= 0 && row < ph) {
                        density[row * pw + col]++;
                    }
                }
            }

            let maxD = 0;
            for (let i = 0; i < density.length; i++) if (density[i] > maxD) maxD = density[i];

            const imgData = ctx.createImageData(pw, ph);
            const data = imgData.data;
            for (let i = 0; i < density.length; i++) {
                const t = maxD > 0 ? Math.pow(density[i] / maxD, 0.4) : 0;
                const [r, g, b] = hslToRgb(260 + t * 80, 0.9, t * 0.7);
                const idx = i * 4;
                data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
            }

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.putImageData(imgData, 0, 0);
            ctx.restore();

            const topLeft = this.zp.screenToWorld(0, 0, w, h);
            const botRight = this.zp.screenToWorld(w, h, w, h);
            document.getElementById('bifur-range').textContent =
                `${topLeft.x.toFixed(3)} .. ${botRight.x.toFixed(3)}`;
            document.getElementById('bifur-xrange').textContent =
                `${topLeft.y.toFixed(3)} .. ${botRight.y.toFixed(3)}`;
        }
    });

    // ===== Demo 3: Double Pendulum =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        pendulums: [],
        l1: 120, l2: 120, m1: 10, m2: 10, damping: 0, count: 1,
        trail: [],
        animId: null,
        g: 1,

        init() {
            this.canvas = document.getElementById('canvas-3');
            const self = this;
            bindSlider('pend-l1', 'pend-l1-val', v => { self.l1 = v; });
            bindSlider('pend-l2', 'pend-l2-val', v => { self.l2 = v; });
            bindSlider('pend-m1', 'pend-m1-val', v => { self.m1 = v; });
            bindSlider('pend-m2', 'pend-m2-val', v => { self.m2 = v; });
            bindSlider('pend-damp', 'pend-damp-val', v => { self.damping = v; });
            bindSlider('pend-count', 'pend-count-val', v => { self.count = v; self.resetPendulums(); });
            document.getElementById('pend-reset').addEventListener('click', () => self.resetPendulums());
            this.resetPendulums();
        },

        resetPendulums() {
            this.pendulums = [];
            this.trail = [];
            for (let i = 0; i < this.count; i++) {
                this.pendulums.push({
                    a1: Math.PI / 2 + (i * 0.001),
                    a2: Math.PI / 2,
                    v1: 0, v2: 0
                });
            }
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            const self = this;
            function loop() {
                self.step();
                self.draw();
                self.animId = requestAnimationFrame(loop);
            }
            this.animId = requestAnimationFrame(loop);
        },

        deactivate() {
            if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
        },

        resize() {
            if (!this._initialized) return;
            this.deactivate();
            this.activate();
        },

        step() {
            const g = this.g;
            const dt = 0.3;
            for (const p of this.pendulums) {
                const m1 = this.m1, m2 = this.m2;
                const l1 = this.l1, l2 = this.l2;
                const a1 = p.a1, a2 = p.a2, v1 = p.v1, v2 = p.v2;
                const d = a1 - a2;
                const den1 = (2 * m1 + m2 - m2 * Math.cos(2 * d));
                const num1 = -g * (2 * m1 + m2) * Math.sin(a1)
                    - m2 * g * Math.sin(a1 - 2 * a2)
                    - 2 * Math.sin(d) * m2 * (v2 * v2 * l2 + v1 * v1 * l1 * Math.cos(d));
                const acc1 = num1 / (l1 * den1);

                const num2 = 2 * Math.sin(d) * (v1 * v1 * l1 * (m1 + m2)
                    + g * (m1 + m2) * Math.cos(a1)
                    + v2 * v2 * l2 * m2 * Math.cos(d));
                const acc2 = num2 / (l2 * den1);

                p.v1 += acc1 * dt;
                p.v2 += acc2 * dt;
                p.v1 *= (1 - this.damping);
                p.v2 *= (1 - this.damping);
                p.a1 += p.v1 * dt;
                p.a2 += p.v2 * dt;
            }
            // Trail for first pendulum
            if (this.pendulums.length > 0) {
                const p = this.pendulums[0];
                const x1 = this.l1 * Math.sin(p.a1);
                const y1 = this.l1 * Math.cos(p.a1);
                const x2 = x1 + this.l2 * Math.sin(p.a2);
                const y2 = y1 + this.l2 * Math.cos(p.a2);
                this.trail.push({ x: x2, y: y2 });
                if (this.trail.length > 2000) this.trail.shift();
            }
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);
            const ox = w / 2, oy = h * 0.3;

            // Trail
            if (this.trail.length > 1) {
                for (let i = 1; i < this.trail.length; i++) {
                    const t = i / this.trail.length;
                    const [r, g, b] = hslToRgb(180 + t * 180, 0.8, 0.3 + t * 0.4);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${t * 0.6})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(ox + this.trail[i - 1].x, oy + this.trail[i - 1].y);
                    ctx.lineTo(ox + this.trail[i].x, oy + this.trail[i].y);
                    ctx.stroke();
                }
            }

            // Pendulum colors for multi-pendulum
            const colors = ['#21D6C6', '#F000D2', '#8E33D5', '#FFD700', '#FF6347'];

            for (let pi = 0; pi < this.pendulums.length; pi++) {
                const p = this.pendulums[pi];
                const x1 = ox + this.l1 * Math.sin(p.a1);
                const y1 = oy + this.l1 * Math.cos(p.a1);
                const x2 = x1 + this.l2 * Math.sin(p.a2);
                const y2 = y1 + this.l2 * Math.cos(p.a2);
                const col = colors[pi % colors.length];

                // Rods
                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(ox, oy);
                ctx.lineTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                // Bobs
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(x1, y1, Math.sqrt(this.m1) * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x2, y2, Math.sqrt(this.m2) * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Pivot
            ctx.fillStyle = '#AA66E0';
            ctx.beginPath();
            ctx.arc(ox, oy, 4, 0, Math.PI * 2);
            ctx.fill();

            if (this.pendulums.length > 0) {
                const p = this.pendulums[0];
                document.getElementById('pend-a1').textContent = (p.a1 % (Math.PI * 2)).toFixed(3);
                document.getElementById('pend-a2').textContent = (p.a2 % (Math.PI * 2)).toFixed(3);
                const ke = 0.5 * this.m1 * this.l1 * this.l1 * p.v1 * p.v1
                    + 0.5 * this.m2 * (this.l1 * this.l1 * p.v1 * p.v1 + this.l2 * this.l2 * p.v2 * p.v2);
                document.getElementById('pend-energy').textContent = ke.toFixed(1);
            }
        }
    });

    // ===== Demo 4: IFS Fractals (Barnsley) =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        x: 0, y: 0,
        pointCount: 0,
        speed: 1000,
        pointSize: 1,
        colorMode: 'green',
        preset: 'fern',
        animId: null,
        lastTf: 0,

        presets: {
            fern: {
                transforms: [
                    { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, p: 0.01 },
                    { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, p: 0.85 },
                    { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, p: 0.07 },
                    { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, p: 0.07 }
                ],
                bounds: { xMin: -2.5, xMax: 2.5, yMin: 0, yMax: 10 }
            },
            sierpinski: {
                transforms: [
                    { a: 0.5, b: 0, c: 0, d: 0.5, e: 0, f: 0, p: 0.333 },
                    { a: 0.5, b: 0, c: 0, d: 0.5, e: 0.5, f: 0, p: 0.333 },
                    { a: 0.5, b: 0, c: 0, d: 0.5, e: 0.25, f: 0.433, p: 0.334 }
                ],
                bounds: { xMin: -0.1, xMax: 1.1, yMin: -0.1, yMax: 0.97 }
            },
            tree: {
                transforms: [
                    { a: 0, b: 0, c: 0, d: 0.5, e: 0, f: 0, p: 0.05 },
                    { a: 0.42, b: -0.42, c: 0.42, d: 0.42, e: 0, f: 0.2, p: 0.4 },
                    { a: 0.42, b: 0.42, c: -0.42, d: 0.42, e: 0, f: 0.2, p: 0.4 },
                    { a: 0.1, b: 0, c: 0, d: 0.1, e: 0, f: 0.2, p: 0.15 }
                ],
                bounds: { xMin: -0.8, xMax: 0.8, yMin: -0.1, yMax: 0.9 }
            },
            dragon: {
                transforms: [
                    { a: 0.824074, b: 0.281482, c: -0.212346, d: 0.864198, e: -1.882290, f: -0.110607, p: 0.787473 },
                    { a: 0.088272, b: 0.520988, c: -0.463889, d: -0.377778, e: 0.785360, f: 8.095795, p: 0.212527 }
                ],
                bounds: { xMin: -12, xMax: 5, yMin: -1, yMax: 12 }
            }
        },

        init() {
            this.canvas = document.getElementById('canvas-4');
            const self = this;
            document.getElementById('barnsley-preset').addEventListener('change', function () {
                self.preset = this.value;
                self.reset();
            });
            bindSlider('barnsley-speed', 'barnsley-speed-val', v => { self.speed = v; });
            bindSlider('barnsley-size', 'barnsley-size-val', v => { self.pointSize = v; });
            document.getElementById('barnsley-color').addEventListener('change', function () {
                self.colorMode = this.value;
                self.reset();
            });
            document.getElementById('barnsley-reset').addEventListener('click', () => self.reset());
        },

        reset() {
            this.x = 0; this.y = 0;
            this.pointCount = 0;
            if (this.ctx) {
                clearCanvas(this.ctx, this.w, this.h);
            }
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.reset();
            const self = this;
            function loop() {
                self.step();
                self.animId = requestAnimationFrame(loop);
            }
            this.animId = requestAnimationFrame(loop);
        },

        deactivate() {
            if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
        },

        resize() {
            if (!this._initialized) return;
            this.deactivate();
            this.activate();
        },

        step() {
            const p = this.presets[this.preset];
            const transforms = p.transforms;
            const b = p.bounds;
            const ctx = this.ctx, w = this.w, h = this.h;
            const ps = this.pointSize;

            for (let i = 0; i < this.speed; i++) {
                let rnd = Math.random();
                let tf = 0;
                let cum = 0;
                for (let j = 0; j < transforms.length; j++) {
                    cum += transforms[j].p;
                    if (rnd <= cum) { tf = j; break; }
                }
                const t = transforms[tf];
                const nx = t.a * this.x + t.b * this.y + t.e;
                const ny = t.c * this.x + t.d * this.y + t.f;
                this.x = nx; this.y = ny;
                this.lastTf = tf;

                if (this.pointCount > 20) {
                    const sx = mapRange(this.x, b.xMin, b.xMax, 20, w - 20);
                    const sy = mapRange(this.y, b.yMax, b.yMin, 20, h - 20);
                    const t2 = tf / transforms.length;
                    const [r, g, bl] = valueToColor(t2, this.colorMode);
                    ctx.fillStyle = `rgb(${r},${g},${bl})`;
                    ctx.fillRect(sx, sy, ps, ps);
                }
                this.pointCount++;
            }

            document.getElementById('barnsley-pts').textContent = this.pointCount.toLocaleString();
            document.getElementById('barnsley-tf').textContent = this.lastTf;
        }
    });

    // ===== Demo 5: Chaos Game =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        vertices: 3, jump: 0.5, speed: 1000,
        restrict: false,
        x: 0, y: 0,
        verts: [],
        pointCount: 0,
        lastVert: -1,
        animId: null,

        init() {
            this.canvas = document.getElementById('canvas-5');
            const self = this;
            bindSlider('chaos-verts', 'chaos-verts-val', v => { self.vertices = v; self.reset(); });
            bindSlider('chaos-jump', 'chaos-jump-val', v => { self.jump = v; self.reset(); });
            bindSlider('chaos-speed', 'chaos-speed-val', v => { self.speed = v; });
            document.getElementById('chaos-restrict').addEventListener('change', function () {
                self.restrict = this.checked; self.reset();
            });
            document.getElementById('chaos-reset').addEventListener('click', () => self.reset());
        },

        computeVerts() {
            const cx = this.w / 2, cy = this.h / 2;
            const r = Math.min(this.w, this.h) * 0.42;
            this.verts = [];
            for (let i = 0; i < this.vertices; i++) {
                const angle = (i / this.vertices) * Math.PI * 2 - Math.PI / 2;
                this.verts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
            }
            this.x = cx; this.y = cy;
        },

        reset() {
            this.pointCount = 0;
            this.lastVert = -1;
            this.computeVerts();
            if (this.ctx) {
                clearCanvas(this.ctx, this.w, this.h);
                this.drawVerts();
            }
        },

        drawVerts() {
            const ctx = this.ctx;
            ctx.fillStyle = '#F000D2';
            for (const v of this.verts) {
                ctx.beginPath();
                ctx.arc(v.x, v.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.reset();
            const self = this;
            function loop() {
                self.step();
                self.animId = requestAnimationFrame(loop);
            }
            this.animId = requestAnimationFrame(loop);
        },

        deactivate() {
            if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
        },

        resize() {
            if (!this._initialized) return;
            this.deactivate();
            this.activate();
        },

        step() {
            const ctx = this.ctx;
            for (let i = 0; i < this.speed; i++) {
                let vi;
                do {
                    vi = Math.floor(Math.random() * this.verts.length);
                } while (this.restrict && vi === this.lastVert);
                this.lastVert = vi;
                const v = this.verts[vi];
                this.x = lerp(this.x, v.x, this.jump);
                this.y = lerp(this.y, v.y, this.jump);

                if (this.pointCount > 10) {
                    const t = vi / this.verts.length;
                    const [r, g, b] = hslToRgb(260 + t * 100, 0.9, 0.55);
                    ctx.fillStyle = `rgb(${r},${g},${b})`;
                    ctx.fillRect(this.x, this.y, 1, 1);
                }
                this.pointCount++;
            }

            document.getElementById('chaos-pts').textContent = this.pointCount.toLocaleString();
            document.getElementById('chaos-last').textContent = this.lastVert;
        }
    });

    // ===== Demo 6: Henon Map =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        a: 1.4, b: 0.3,
        iterations: 50000,

        init() {
            this.canvas = document.getElementById('canvas-6');
            const self = this;
            bindSlider('henon-a', 'henon-a-val', v => { self.a = v; self.draw(); });
            bindSlider('henon-b', 'henon-b-val', v => { self.b = v; self.draw(); });
            bindSlider('henon-iters', 'henon-iters-val', v => { self.iterations = v; self.draw(); });
            document.getElementById('henon-reset').addEventListener('click', () => self.draw());
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.draw();
        },

        deactivate() {},

        resize() {
            if (!this._initialized) return;
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.draw();
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            if (!ctx) return;
            clearCanvas(ctx, w, h);

            const points = [];
            let x = 0.1, y = 0.1;
            let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;

            for (let i = 0; i < this.iterations; i++) {
                const nx = 1 - this.a * x * x + y;
                const ny = this.b * x;
                x = nx; y = ny;
                if (Math.abs(x) > 1e10) { x = 0.1; y = 0.1; continue; }
                if (i > 100) {
                    points.push({ x, y });
                    if (x < xMin) xMin = x;
                    if (x > xMax) xMax = x;
                    if (y < yMin) yMin = y;
                    if (y > yMax) yMax = y;
                }
            }

            const pad = 30;
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                const sx = mapRange(p.x, xMin, xMax, pad, w - pad);
                const sy = mapRange(p.y, yMax, yMin, pad, h - pad);
                const t = i / points.length;
                const [r, g, b] = hslToRgb(260 + t * 60, 0.8, 0.5);
                ctx.fillStyle = `rgba(${r},${g},${b},0.6)`;
                ctx.fillRect(sx, sy, 1.5, 1.5);
            }

            document.getElementById('henon-pts').textContent = points.length.toLocaleString();
            document.getElementById('henon-xr').textContent = `${xMin.toFixed(3)} .. ${xMax.toFixed(3)}`;
            document.getElementById('henon-yr').textContent = `${yMin.toFixed(3)} .. ${yMax.toFixed(3)}`;
        }
    });

    // ===== Demo 7: Rossler Attractor =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        trail: [], a: 0.2, b: 0.2, c: 5.7,
        x: 1, y: 1, z: 1,
        trailLen: 2000, rotateY: 0,
        animId: null,

        init() {
            this.canvas = document.getElementById('canvas-7');
            const self = this;
            bindSlider('rossler-a', 'rossler-a-val', v => { self.a = v; });
            bindSlider('rossler-b', 'rossler-b-val', v => { self.b = v; });
            bindSlider('rossler-c', 'rossler-c-val', v => { self.c = v; });
            bindSlider('rossler-trail', 'rossler-trail-val', v => { self.trailLen = v; });
            bindSlider('rossler-rotate', 'rossler-rotate-val', v => { self.rotateY = v * Math.PI / 180; }, v => v + '\u00B0');
            document.getElementById('rossler-reset').addEventListener('click', () => {
                self.x = 1; self.y = 1; self.z = 1;
                self.trail = [];
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            const self = this;
            function loop() {
                self.step();
                self.draw();
                self.animId = requestAnimationFrame(loop);
            }
            this.animId = requestAnimationFrame(loop);
        },

        deactivate() {
            if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
        },

        resize() {
            if (!this._initialized) return;
            this.deactivate();
            this.activate();
        },

        step() {
            const dt = 0.01;
            for (let i = 0; i < 5; i++) {
                const dx = (-this.y - this.z) * dt;
                const dy = (this.x + this.a * this.y) * dt;
                const dz = (this.b + this.z * (this.x - this.c)) * dt;
                this.x += dx; this.y += dy; this.z += dz;
            }
            this.trail.push({ x: this.x, y: this.y, z: this.z });
            while (this.trail.length > this.trailLen) this.trail.shift();
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);
            if (this.trail.length < 2) return;
            const scale = Math.min(w, h) / 40;
            const cx = w / 2, cy = h / 2;
            const angleY = this.rotateY;
            const trail = this.trail;
            ctx.lineWidth = 1.2;
            for (let i = 1; i < trail.length; i++) {
                const p0 = project3D(trail[i - 1].x, -trail[i - 1].z, trail[i - 1].y, angleY, 0.4, scale, cx, cy);
                const p1 = project3D(trail[i].x, -trail[i].z, trail[i].y, angleY, 0.4, scale, cx, cy);
                const t = i / trail.length;
                const [r, g, b] = hslToRgb(300 + t * 80, 0.85, 0.35 + t * 0.35);
                ctx.strokeStyle = `rgba(${r},${g},${b},${0.3 + t * 0.7})`;
                ctx.beginPath();
                ctx.moveTo(p0.px, p0.py);
                ctx.lineTo(p1.px, p1.py);
                ctx.stroke();
            }

            document.getElementById('rossler-x').textContent = this.x.toFixed(3);
            document.getElementById('rossler-y').textContent = this.y.toFixed(3);
            document.getElementById('rossler-z').textContent = this.z.toFixed(3);
            document.getElementById('rossler-pts').textContent = this.trail.length;
        }
    });

    // ===== Demo 8: Cellular Automata =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        mode: 'elementary',
        rule: 30,
        cellSize: 4,
        speed: 10,
        playing: false,
        animId: null,
        // Elementary CA
        row: null,
        rows: [],
        // Game of Life
        lifeGrid: null,
        lifeCols: 0, lifeRows: 0,
        generation: 0,
        frameCount: 0,

        init() {
            this.canvas = document.getElementById('canvas-8');
            const self = this;
            document.getElementById('ca-mode').addEventListener('change', function () {
                self.mode = this.value;
                document.getElementById('ca-rule').disabled = (self.mode === 'life');
                self.resetCA();
            });
            bindSlider('ca-rule', 'ca-rule-val', v => { self.rule = v; self.resetCA(); });
            bindSlider('ca-size', 'ca-size-val', v => { self.cellSize = v; self.resetCA(); });
            bindSlider('ca-speed', 'ca-speed-val', v => { self.speed = v; });
            document.getElementById('ca-step').addEventListener('click', () => { self.stepCA(); self.draw(); });
            document.getElementById('ca-play').addEventListener('click', () => {
                self.playing = !self.playing;
                document.getElementById('ca-play').textContent = self.playing ? 'Pause' : 'Play';
            });
            document.getElementById('ca-reset').addEventListener('click', () => self.resetCA());

            this.canvas.addEventListener('click', e => {
                if (self.mode !== 'life') return;
                const pos = getCanvasMousePos(self.canvas, e);
                const col = Math.floor(pos.x / self.cellSize);
                const row = Math.floor(pos.y / self.cellSize);
                if (col >= 0 && col < self.lifeCols && row >= 0 && row < self.lifeRows) {
                    self.lifeGrid[row * self.lifeCols + col] ^= 1;
                    self.draw();
                }
            });
        },

        resetCA() {
            this.generation = 0;
            if (this.mode === 'elementary') {
                const cols = Math.floor(this.w / this.cellSize);
                this.row = new Uint8Array(cols);
                this.row[Math.floor(cols / 2)] = 1;
                this.rows = [this.row.slice()];
            } else {
                this.lifeCols = Math.floor(this.w / this.cellSize);
                this.lifeRows = Math.floor(this.h / this.cellSize);
                this.lifeGrid = new Uint8Array(this.lifeCols * this.lifeRows);
                // Random seed
                for (let i = 0; i < this.lifeGrid.length; i++) {
                    this.lifeGrid[i] = Math.random() < 0.3 ? 1 : 0;
                }
            }
            if (this.ctx) this.draw();
        },

        stepCA() {
            this.generation++;
            if (this.mode === 'elementary') {
                const cols = this.row.length;
                const next = new Uint8Array(cols);
                for (let i = 0; i < cols; i++) {
                    const l = i > 0 ? this.row[i - 1] : 0;
                    const c = this.row[i];
                    const r = i < cols - 1 ? this.row[i + 1] : 0;
                    const idx = (l << 2) | (c << 1) | r;
                    next[i] = (this.rule >> idx) & 1;
                }
                this.row = next;
                this.rows.push(this.row.slice());
                const maxRows = Math.floor(this.h / this.cellSize);
                if (this.rows.length > maxRows) this.rows.shift();
            } else {
                const cols = this.lifeCols, rows = this.lifeRows;
                const grid = this.lifeGrid;
                const next = new Uint8Array(cols * rows);
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        let neighbors = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                if (dx === 0 && dy === 0) continue;
                                const nx = (x + dx + cols) % cols;
                                const ny = (y + dy + rows) % rows;
                                neighbors += grid[ny * cols + nx];
                            }
                        }
                        const alive = grid[y * cols + x];
                        if (alive) {
                            next[y * cols + x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                        } else {
                            next[y * cols + x] = (neighbors === 3) ? 1 : 0;
                        }
                    }
                }
                this.lifeGrid = next;
            }
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.resetCA();
            const self = this;
            this.frameCount = 0;
            function loop() {
                self.frameCount++;
                if (self.playing && self.frameCount % Math.max(1, Math.floor(30 / self.speed)) === 0) {
                    self.stepCA();
                }
                self.draw();
                self.animId = requestAnimationFrame(loop);
            }
            this.animId = requestAnimationFrame(loop);
        },

        deactivate() {
            if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
            this.playing = false;
            document.getElementById('ca-play').textContent = 'Play';
        },

        resize() {
            if (!this._initialized) return;
            this.deactivate();
            this.activate();
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h, cs = this.cellSize;
            clearCanvas(ctx, w, h);

            if (this.mode === 'elementary') {
                for (let r = 0; r < this.rows.length; r++) {
                    const row = this.rows[r];
                    for (let c = 0; c < row.length; c++) {
                        if (row[c]) {
                            const t = r / Math.max(1, this.rows.length - 1);
                            const [rv, gv, bv] = hslToRgb(270 + t * 60, 0.8, 0.5);
                            ctx.fillStyle = `rgb(${rv},${gv},${bv})`;
                            ctx.fillRect(c * cs, r * cs, cs - 0.5, cs - 0.5);
                        }
                    }
                }
            } else {
                const cols = this.lifeCols, rows = this.lifeRows;
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        if (this.lifeGrid[y * cols + x]) {
                            ctx.fillStyle = '#21D6C6';
                            ctx.fillRect(x * cs, y * cs, cs - 0.5, cs - 0.5);
                        }
                    }
                }
            }

            document.getElementById('ca-gen').textContent = this.generation;
            let live = 0;
            if (this.mode === 'elementary') {
                for (let i = 0; i < this.row.length; i++) live += this.row[i];
            } else {
                for (let i = 0; i < this.lifeGrid.length; i++) live += this.lifeGrid[i];
            }
            document.getElementById('ca-live').textContent = live;
            document.getElementById('ca-rule-disp').textContent =
                this.mode === 'elementary' ? this.rule + ' (0b' + this.rule.toString(2).padStart(8, '0') + ')' : 'Game of Life';
        }
    });

    // ===== Demo 9: L-Systems =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        preset: 'koch',
        iterations: 4,
        angle: 60,
        segLength: 5,

        presets: {
            koch: { axiom: 'F--F--F', rules: { F: 'F+F--F+F' }, angle: 60 },
            sierpinski: { axiom: 'F-G-G', rules: { F: 'F-G+F+G-F', G: 'GG' }, angle: 120 },
            dragon: { axiom: 'FX', rules: { X: 'X+YF+', Y: '-FX-Y' }, angle: 90 },
            plant: { axiom: 'X', rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' }, angle: 25 },
            hilbert: { axiom: 'A', rules: { A: '-BF+AFA+FB-', B: '+AF-BFB-FA+' }, angle: 90 },
            penrose: { axiom: '[7]++[7]++[7]++[7]++[7]', rules: { '6': '81++91----71[-81----61]++', '7': '+81--91[---61--71]+', '8': '-61++71[+++81++91]-', '9': '--81++++61[+91++++71]--71', '1': '' }, angle: 36 }
        },

        init() {
            this.canvas = document.getElementById('canvas-9');
            const self = this;
            document.getElementById('lsys-preset').addEventListener('change', function () {
                self.preset = this.value;
                const p = self.presets[self.preset];
                document.getElementById('lsys-angle').value = p.angle;
                document.getElementById('lsys-angle-val').textContent = p.angle + '\u00B0';
                self.angle = p.angle;
                self.drawLSystem();
            });
            bindSlider('lsys-iters', 'lsys-iters-val', v => { self.iterations = v; self.drawLSystem(); });
            bindSlider('lsys-angle', 'lsys-angle-val', v => { self.angle = v; self.drawLSystem(); }, v => v + '\u00B0');
            bindSlider('lsys-length', 'lsys-length-val', v => { self.segLength = v; self.drawLSystem(); });
            document.getElementById('lsys-draw').addEventListener('click', () => self.drawLSystem());
        },

        generate() {
            const p = this.presets[this.preset];
            let str = p.axiom;
            for (let i = 0; i < this.iterations; i++) {
                let next = '';
                for (const ch of str) {
                    next += p.rules[ch] !== undefined ? p.rules[ch] : ch;
                }
                str = next;
                if (str.length > 2000000) break;
            }
            return str;
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.drawLSystem();
        },

        deactivate() {},

        resize() {
            if (!this._initialized) return;
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.drawLSystem();
        },

        drawLSystem() {
            const ctx = this.ctx, w = this.w, h = this.h;
            if (!ctx) return;
            clearCanvas(ctx, w, h);

            const str = this.generate();
            const angleRad = this.angle * Math.PI / 180;
            const len = this.segLength;

            // First pass: compute bounds
            let x = 0, y = 0, dir = -Math.PI / 2;
            let minX = 0, maxX = 0, minY = 0, maxY = 0;
            const stack = [];
            let segments = 0;
            for (const ch of str) {
                if (ch === 'F' || ch === 'G' || ch === '1') {
                    x += Math.cos(dir) * len;
                    y += Math.sin(dir) * len;
                    if (x < minX) minX = x; if (x > maxX) maxX = x;
                    if (y < minY) minY = y; if (y > maxY) maxY = y;
                    segments++;
                } else if (ch === '+') { dir += angleRad; }
                else if (ch === '-') { dir -= angleRad; }
                else if (ch === '[') { stack.push({ x, y, dir }); }
                else if (ch === ']') { const s = stack.pop(); if (s) { x = s.x; y = s.y; dir = s.dir; } }
            }

            // Scale and center
            const bw = maxX - minX || 1;
            const bh = maxY - minY || 1;
            const scaleX = (w - 40) / bw;
            const scaleY = (h - 40) / bh;
            const sc = Math.min(scaleX, scaleY);
            const offsetX = (w - bw * sc) / 2 - minX * sc;
            const offsetY = (h - bh * sc) / 2 - minY * sc;

            // Second pass: draw
            x = 0; y = 0; dir = -Math.PI / 2;
            stack.length = 0;
            let segIdx = 0;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x * sc + offsetX, y * sc + offsetY);
            for (const ch of str) {
                if (ch === 'F' || ch === 'G' || ch === '1') {
                    x += Math.cos(dir) * len;
                    y += Math.sin(dir) * len;
                    const t = segIdx / Math.max(1, segments);
                    const [r, g, b] = hslToRgb(140 + t * 200, 0.8, 0.4 + t * 0.2);
                    ctx.strokeStyle = `rgb(${r},${g},${b})`;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo((x - Math.cos(dir) * len) * sc + offsetX, (y - Math.sin(dir) * len) * sc + offsetY);
                    ctx.lineTo(x * sc + offsetX, y * sc + offsetY);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x * sc + offsetX, y * sc + offsetY);
                    segIdx++;
                } else if (ch === '+') { dir += angleRad; }
                else if (ch === '-') { dir -= angleRad; }
                else if (ch === '[') { stack.push({ x, y, dir }); }
                else if (ch === ']') {
                    const s = stack.pop();
                    if (s) { x = s.x; y = s.y; dir = s.dir; }
                    ctx.beginPath();
                    ctx.moveTo(x * sc + offsetX, y * sc + offsetY);
                }
            }
            ctx.stroke();

            document.getElementById('lsys-strlen').textContent = str.length.toLocaleString();
            document.getElementById('lsys-segs').textContent = segments.toLocaleString();
        }
    });

    // ===== Demo 10: Lyapunov Fractal =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        zp: null,
        sequence: 'AB',
        iterations: 80,
        rendering: false,

        init() {
            this.canvas = document.getElementById('canvas-10');
            this.zp = makeZoomPan({ cx: 3, cy: 3, zoom: 0.12 });
            const self = this;
            document.getElementById('lyap-seq').addEventListener('change', function () {
                self.sequence = this.value.toUpperCase().replace(/[^AB]/g, '') || 'AB';
                this.value = self.sequence;
            });
            bindSlider('lyap-iters', 'lyap-iters-val', v => { self.iterations = v; });
            document.getElementById('lyap-reset').addEventListener('click', () => {
                self.zp.reset(); self.render();
            });
            document.getElementById('lyap-render').addEventListener('click', () => self.render());

            this.canvas.addEventListener('click', e => {
                const pos = getCanvasMousePos(self.canvas, e);
                self.zp.zoomAt(pos.x, pos.y, 2, self.w, self.h);
                self.render();
            });
            this.canvas.addEventListener('contextmenu', e => {
                e.preventDefault();
                const pos = getCanvasMousePos(self.canvas, e);
                self.zp.zoomAt(pos.x, pos.y, 0.5, self.w, self.h);
                self.render();
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.render();
        },

        deactivate() { this.rendering = false; },

        resize() {
            if (!this._initialized) return;
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.render();
        },

        render() {
            const ctx = this.ctx, w = this.w, h = this.h;
            if (!ctx) return;
            this.rendering = true;
            const dpr = window.devicePixelRatio || 1;
            const pw = Math.floor(w * dpr), ph = Math.floor(h * dpr);
            const imgData = ctx.createImageData(pw, ph);
            const data = imgData.data;
            const seq = this.sequence;
            const seqLen = seq.length;
            const iters = this.iterations;
            const scale = Math.min(w, h) * this.zp.zoom;

            for (let py = 0; py < ph; py++) {
                for (let px = 0; px < pw; px++) {
                    const a = (px / dpr - w / 2) / scale + this.zp.cx;
                    const b = (py / dpr - h / 2) / scale + this.zp.cy;

                    if (a < 0 || a > 4 || b < 0 || b > 4) {
                        const idx = (py * pw + px) * 4;
                        data[idx] = 13; data[idx + 1] = 0; data[idx + 2] = 26; data[idx + 3] = 255;
                        continue;
                    }

                    let x = 0.5;
                    let lyap = 0;
                    for (let n = 0; n < iters; n++) {
                        const r = seq[n % seqLen] === 'A' ? a : b;
                        x = r * x * (1 - x);
                        if (x <= 0 || x >= 1) { lyap = Infinity; break; }
                        lyap += Math.log(Math.abs(r * (1 - 2 * x)));
                    }
                    lyap /= iters;

                    const idx = (py * pw + px) * 4;
                    if (!isFinite(lyap)) {
                        data[idx] = 0; data[idx + 1] = 0; data[idx + 2] = 0;
                    } else if (lyap < 0) {
                        // Stable: blue-purple
                        const t = clamp(-lyap / 3, 0, 1);
                        const [rv, gv, bv] = hslToRgb(240 + t * 40, 0.7, 0.1 + t * 0.5);
                        data[idx] = rv; data[idx + 1] = gv; data[idx + 2] = bv;
                    } else {
                        // Chaotic: warm
                        const t = clamp(lyap / 2, 0, 1);
                        const [rv, gv, bv] = hslToRgb(60 - t * 60, 0.9, 0.2 + t * 0.5);
                        data[idx] = rv; data[idx + 1] = gv; data[idx + 2] = bv;
                    }
                    data[idx + 3] = 255;
                }
            }

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.putImageData(imgData, 0, 0);
            ctx.restore();
            this.rendering = false;

            const topLeft = this.zp.screenToWorld(0, 0, w, h);
            const botRight = this.zp.screenToWorld(w, h, w, h);
            document.getElementById('lyap-arange').textContent =
                `${topLeft.x.toFixed(2)} .. ${botRight.x.toFixed(2)}`;
            document.getElementById('lyap-brange').textContent =
                `${topLeft.y.toFixed(2)} .. ${botRight.y.toFixed(2)}`;
            document.getElementById('lyap-seqdisp').textContent = this.sequence;
        }
    });

    // ===== Demo 11: Clifford Attractor =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        a: -1.4, b: 1.6, c: 1.0, d: 0.7,
        speed: 20000,
        colorMode: 'purple',
        density: null,
        maxDensity: 0,
        totalPoints: 0,
        x: 0.1, y: 0.1,
        dw: 0, dh: 0,
        animId: null,

        init() {
            this.canvas = document.getElementById('canvas-11');
            const self = this;
            bindSlider('cliff-a', 'cliff-a-val', v => { self.a = v; self.reset(); });
            bindSlider('cliff-b', 'cliff-b-val', v => { self.b = v; self.reset(); });
            bindSlider('cliff-c', 'cliff-c-val', v => { self.c = v; self.reset(); });
            bindSlider('cliff-d', 'cliff-d-val', v => { self.d = v; self.reset(); });
            bindSlider('cliff-speed', 'cliff-speed-val', v => { self.speed = v; });
            document.getElementById('cliff-color').addEventListener('change', function () {
                self.colorMode = this.value;
            });
            document.getElementById('cliff-reset').addEventListener('click', () => self.reset());
        },

        reset() {
            this.x = 0.1; this.y = 0.1;
            this.totalPoints = 0;
            this.maxDensity = 0;
            if (this.density) this.density.fill(0);
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            const dpr = window.devicePixelRatio || 1;
            this.dw = Math.floor(this.w * dpr);
            this.dh = Math.floor(this.h * dpr);
            this.density = new Uint32Array(this.dw * this.dh);
            this.reset();
            const self = this;
            function loop() {
                self.step();
                self.render();
                self.animId = requestAnimationFrame(loop);
            }
            this.animId = requestAnimationFrame(loop);
        },

        deactivate() {
            if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
        },

        resize() {
            if (!this._initialized) return;
            this.deactivate();
            this.activate();
        },

        step() {
            const dpr = window.devicePixelRatio || 1;
            const w = this.w, h = this.h;
            const dw = this.dw, dh = this.dh;

            for (let i = 0; i < this.speed; i++) {
                const nx = Math.sin(this.a * this.y) + this.c * Math.cos(this.a * this.x);
                const ny = Math.sin(this.b * this.x) + this.d * Math.cos(this.b * this.y);
                this.x = nx; this.y = ny;

                // Map to screen (attractor range is roughly -3..3)
                const sx = Math.floor(((nx + 3) / 6) * dw);
                const sy = Math.floor(((ny + 3) / 6) * dh);
                if (sx >= 0 && sx < dw && sy >= 0 && sy < dh) {
                    const idx = sy * dw + sx;
                    this.density[idx]++;
                    if (this.density[idx] > this.maxDensity) {
                        this.maxDensity = this.density[idx];
                    }
                }
                this.totalPoints++;
            }
        },

        render() {
            const ctx = this.ctx;
            const dw = this.dw, dh = this.dh;
            const imgData = ctx.createImageData(dw, dh);
            const data = imgData.data;
            const maxD = this.maxDensity || 1;
            const colorMode = this.colorMode;

            for (let i = 0; i < this.density.length; i++) {
                const d = this.density[i];
                const t = d > 0 ? Math.pow(d / maxD, 0.35) : 0;
                const [r, g, b] = valueToColor(t, colorMode);
                const idx = i * 4;
                data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
            }

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.putImageData(imgData, 0, 0);
            ctx.restore();

            document.getElementById('cliff-pts').textContent = this.totalPoints.toLocaleString();
            document.getElementById('cliff-maxd').textContent = this.maxDensity;
        }
    });

    // ===== Initialization =====

    function init() {
        tabs = document.querySelectorAll('.tab');
        panels = document.querySelectorAll('.demo-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchDemo(parseInt(tab.dataset.tab));
            });
        });

        window.addEventListener('resize', () => {
            if (demos[activeDemo] && demos[activeDemo]._initialized) {
                demos[activeDemo].resize();
            }
        });

        // Activate first demo
        switchDemo(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
