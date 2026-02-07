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

    // ===== DFT Utilities =====

    function computeDFT(points) {
        const N = points.length;
        const result = [];
        for (let k = 0; k < N; k++) {
            let re = 0, im = 0;
            for (let n = 0; n < N; n++) {
                const phi = (2 * Math.PI * k * n) / N;
                re += points[n].x * Math.cos(phi) + points[n].y * Math.sin(phi);
                im += points[n].y * Math.cos(phi) - points[n].x * Math.sin(phi);
            }
            re /= N;
            im /= N;
            result.push({
                freq: k,
                amp: Math.sqrt(re * re + im * im),
                phase: Math.atan2(im, re)
            });
        }
        return result;
    }

    function evaluateEpicycles(dft, t, maxFreq) {
        const circles = [];
        let x = 0, y = 0;
        const N = dft.length;
        const count = Math.min(maxFreq || N, N);
        for (let i = 0; i < count; i++) {
            const d = dft[i];
            const prevX = x, prevY = y;
            const angle = d.freq * t * 2 * Math.PI + d.phase;
            x += d.amp * Math.cos(angle);
            y += d.amp * Math.sin(angle);
            circles.push({ cx: prevX, cy: prevY, r: d.amp, x: x, y: y });
        }
        return { x, y, circles };
    }

    function drawEpicycleCircles(ctx, circles, offsetX, offsetY, opacity) {
        const o = clamp(opacity != null ? opacity : 0.7, 0, 1);
        for (let i = 0; i < circles.length; i++) {
            const c = circles[i];
            const cx = c.cx + offsetX, cy = c.cy + offsetY;
            if (c.r < 0.5) continue;
            ctx.strokeStyle = `rgba(142, 51, 213, ${(0.5 * o).toFixed(2)})`;
            ctx.lineWidth = 1 + o;
            ctx.beginPath();
            ctx.arc(cx, cy, c.r, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.strokeStyle = `rgba(33, 214, 198, ${(0.8 * o).toFixed(2)})`;
            ctx.lineWidth = 1.5 + o * 0.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(c.x + offsetX, c.y + offsetY);
            ctx.stroke();
        }
    }

    function resamplePath(points, n) {
        if (points.length < 2) return points;
        const dists = [0];
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i - 1].x;
            const dy = points[i].y - points[i - 1].y;
            dists.push(dists[i - 1] + Math.sqrt(dx * dx + dy * dy));
        }
        const total = dists[dists.length - 1];
        if (total === 0) return points.slice(0, n);
        const result = [];
        for (let i = 0; i < n; i++) {
            const target = (i / n) * total;
            let j = 1;
            while (j < dists.length - 1 && dists[j] < target) j++;
            const segLen = dists[j] - dists[j - 1];
            const t = segLen > 0 ? (target - dists[j - 1]) / segLen : 0;
            result.push({
                x: lerp(points[j - 1].x, points[j].x, t),
                y: lerp(points[j - 1].y, points[j].y, t)
            });
        }
        return result;
    }

    // ===== Preset Shape Data =====

    function generateStar(n, outerR, innerR, samples) {
        const pts = [];
        const totalPoints = n * 2;
        for (let i = 0; i < samples; i++) {
            const t = (i / samples) * 2 * Math.PI;
            const segIdx = Math.floor((i / samples) * totalPoints);
            const segT = ((i / samples) * totalPoints) - segIdx;
            const a1 = (segIdx / totalPoints) * 2 * Math.PI - Math.PI / 2;
            const a2 = ((segIdx + 1) / totalPoints) * 2 * Math.PI - Math.PI / 2;
            const r1 = segIdx % 2 === 0 ? outerR : innerR;
            const r2 = (segIdx + 1) % 2 === 0 ? outerR : innerR;
            pts.push({
                x: lerp(r1 * Math.cos(a1), r2 * Math.cos(a2), segT),
                y: lerp(r1 * Math.sin(a1), r2 * Math.sin(a2), segT)
            });
        }
        return pts;
    }

    function generateHeart(samples) {
        const pts = [];
        for (let i = 0; i < samples; i++) {
            const t = (i / samples) * 2 * Math.PI;
            pts.push({
                x: 16 * Math.pow(Math.sin(t), 3),
                y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
            });
        }
        const scale = 8;
        return pts.map(p => ({ x: p.x * scale, y: p.y * scale }));
    }

    function generateTrebleClef(samples) {
        const keyPoints = [
            {x:0,y:80},{x:-5,y:70},{x:-10,y:55},{x:-8,y:40},{x:0,y:30},
            {x:10,y:25},{x:15,y:15},{x:12,y:5},{x:5,y:0},{x:-5,y:5},
            {x:-15,y:15},{x:-20,y:30},{x:-18,y:45},{x:-10,y:55},{x:0,y:58},
            {x:10,y:55},{x:18,y:45},{x:20,y:30},{x:15,y:15},{x:5,y:5},
            {x:0,y:-10},{x:2,y:-30},{x:5,y:-50},{x:3,y:-65},{x:0,y:-75},
            {x:-5,y:-80},{x:-10,y:-70},{x:-5,y:-60},{x:0,y:-50},
            {x:3,y:-35},{x:2,y:-15},{x:0,y:0},{x:-2,y:20},{x:-3,y:40},
            {x:-2,y:60},{x:0,y:80}
        ];
        const scaled = keyPoints.map(p => ({ x: p.x * 1.5, y: p.y * 1.5 }));
        return resamplePath(scaled, samples);
    }

    function generatePi(samples) {
        const keyPoints = [
            {x:-50,y:30},{x:-50,y:-30},{x:-45,y:-35},{x:-35,y:-38},
            {x:35,y:-38},{x:45,y:-35},{x:50,y:-30},{x:50,y:30},
            {x:45,y:30},{x:40,y:-30},{x:35,y:-33},{x:30,y:-33},
            {x:25,y:-30},{x:20,y:25},{x:15,y:35},{x:10,y:38},
            {x:5,y:35},{x:5,y:25},{x:8,y:-30},{x:5,y:-33},
            {x:-5,y:-33},{x:-8,y:-30},{x:-5,y:25},{x:-5,y:35},
            {x:-10,y:38},{x:-15,y:35},{x:-20,y:25},{x:-25,y:-30},
            {x:-30,y:-33},{x:-35,y:-33},{x:-40,y:-30},{x:-45,y:30},
            {x:-50,y:30}
        ];
        const scaled = keyPoints.map(p => ({ x: p.x * 2, y: p.y * 2 }));
        return resamplePath(scaled, samples);
    }

    function generateInfinity(samples) {
        const pts = [];
        const a = 100;
        for (let i = 0; i < samples; i++) {
            const t = (i / samples) * 2 * Math.PI;
            const denom = 1 + Math.sin(t) * Math.sin(t);
            pts.push({
                x: a * Math.cos(t) / denom,
                y: a * Math.sin(t) * Math.cos(t) / denom
            });
        }
        return pts;
    }

    function generateButterfly(samples) {
        const pts = [];
        for (let i = 0; i < samples; i++) {
            const t = (i / samples) * 12 * Math.PI;
            const r = Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin((2 * t - Math.PI) / 24), 5);
            pts.push({
                x: r * Math.sin(t) * 40,
                y: -r * Math.cos(t) * 40
            });
        }
        return pts;
    }

    function generateArrow(samples) {
        const keyPoints = [
            {x:0,y:-80},{x:50,y:0},{x:25,y:0},{x:25,y:80},
            {x:-25,y:80},{x:-25,y:0},{x:-50,y:0},{x:0,y:-80}
        ];
        const scaled = keyPoints.map(p => ({ x: p.x * 1.2, y: p.y * 1.2 }));
        return resamplePath(scaled, samples);
    }

    function generateSigma(samples) {
        const keyPoints = [
            {x:50,y:-60},{x:45,y:-55},{x:-5,y:-55},{x:-35,y:0},
            {x:-5,y:55},{x:45,y:55},{x:50,y:60},{x:50,y:65},
            {x:-55,y:65},{x:-55,y:55},{x:-10,y:0},{x:-55,y:-55},
            {x:-55,y:-65},{x:50,y:-65},{x:50,y:-60}
        ];
        const scaled = keyPoints.map(p => ({ x: p.x * 1.5, y: p.y * 1.5 }));
        return resamplePath(scaled, samples);
    }

    const PRESET_SHAPES = {
        star: () => generateStar(5, 120, 50, 200),
        heart: () => generateHeart(200),
        treble: () => generateTrebleClef(200),
        pi: () => generatePi(200),
        infinity: () => generateInfinity(200),
        butterfly: () => generateButterfly(250),
        arrow: () => generateArrow(150),
        sigma: () => generateSigma(150)
    };

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

    // ===== Demo 0: Epicycles Intro =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        numCircles: 5, speed: 1, trailLen: 600,
        showWave: true, circleOpacity: 0.7, time: 0, trail: [],
        animId: null,

        init() {
            this.canvas = document.getElementById('canvas-0');
            const self = this;
            bindSlider('epi-circles', 'epi-circles-val', v => { self.numCircles = v; self.trail = []; });
            bindSlider('epi-speed', 'epi-speed-val', v => { self.speed = v; });
            bindSlider('epi-trail', 'epi-trail-val', v => { self.trailLen = v; });
            bindSlider('epi-opacity', 'epi-opacity-val', v => { self.circleOpacity = v; });
            document.getElementById('epi-showwave').addEventListener('change', function () {
                self.showWave = this.checked;
            });
            document.getElementById('epi-reset').addEventListener('click', () => {
                self.time = 0; self.trail = [];
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
            this.time += 0.008 * this.speed;
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);
            const cx = w * 0.3, cy = h * 0.5;
            let x = 0, y = 0;
            const circles = [];
            for (let i = 0; i < this.numCircles; i++) {
                const n = i * 2 + 1;
                const r = 80 * (4 / (n * Math.PI));
                const prevX = x, prevY = y;
                const angle = n * this.time;
                x += r * Math.cos(angle);
                y += r * Math.sin(angle);
                circles.push({ cx: prevX, cy: prevY, r: r, x: x, y: y });
            }

            drawEpicycleCircles(ctx, circles, cx, cy, this.circleOpacity);

            const tipX = x + cx, tipY = y + cy;
            ctx.fillStyle = '#21D6C6';
            ctx.beginPath();
            ctx.arc(tipX, tipY, 3, 0, 2 * Math.PI);
            ctx.fill();

            this.trail.push({ x: tipX, y: tipY });
            while (this.trail.length > this.trailLen) this.trail.shift();

            if (this.trail.length > 1) {
                ctx.lineWidth = 2;
                for (let i = 1; i < this.trail.length; i++) {
                    const t = i / this.trail.length;
                    const [r, g, b] = hslToRgb(170 + t * 60, 0.9, 0.4 + t * 0.3);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 + t * 0.8})`;
                    ctx.beginPath();
                    ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
                    ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    ctx.stroke();
                }
            }

            if (this.showWave) {
                const waveX = w * 0.6;
                ctx.strokeStyle = 'rgba(142, 51, 213, 0.3)';
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(waveX, tipY);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.lineWidth = 2;
                const waveLen = Math.min(this.trail.length, Math.floor(w * 0.35));
                if (waveLen > 1) {
                    for (let i = 0; i < waveLen; i++) {
                        const idx = this.trail.length - 1 - i;
                        if (idx < 0) break;
                        const t = 1 - i / waveLen;
                        const [r, g, b] = hslToRgb(170 + t * 60, 0.9, 0.4 + t * 0.3);
                        ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 + t * 0.8})`;
                        if (i > 0) {
                            const prevIdx = this.trail.length - i;
                            ctx.beginPath();
                            ctx.moveTo(waveX + (i - 1), this.trail[prevIdx].y);
                            ctx.lineTo(waveX + i, this.trail[idx].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            document.getElementById('epi-count').textContent = this.numCircles;
            document.getElementById('epi-tipx').textContent = x.toFixed(1);
            document.getElementById('epi-tipy').textContent = y.toFixed(1);
        }
    });

    // ===== Demo 1: Square Wave =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        harmonics: 5, speed: 1, showTarget: true,
        time: 0, wave: [], animId: null,

        init() {
            this.canvas = document.getElementById('canvas-1');
            const self = this;
            bindSlider('sq-harmonics', 'sq-harmonics-val', v => { self.harmonics = v; });
            bindSlider('sq-speed', 'sq-speed-val', v => { self.speed = v; });
            document.getElementById('sq-target').addEventListener('change', function () {
                self.showTarget = this.checked;
            });
            document.getElementById('sq-reset').addEventListener('click', () => {
                self.time = 0; self.wave = [];
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
            this.deactivate(); this.activate();
        },

        step() {
            this.time += 0.008 * this.speed;
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);

            const cx = w * 0.25, cy = h * 0.5;
            let x = 0, y = 0;
            const circles = [];

            for (let i = 0; i < this.harmonics; i++) {
                const n = i * 2 + 1;
                const r = 90 * (4 / (n * Math.PI));
                const prevX = x, prevY = y;
                const angle = n * this.time;
                x += r * Math.cos(angle);
                y += r * Math.sin(angle);
                circles.push({ cx: prevX, cy: prevY, r: r, x: x, y: y });
            }

            drawEpicycleCircles(ctx, circles, cx, cy);

            const tipX = x + cx, tipY = y + cy;
            ctx.fillStyle = '#21D6C6';
            ctx.beginPath();
            ctx.arc(tipX, tipY, 3, 0, 2 * Math.PI);
            ctx.fill();

            this.wave.unshift(tipY);
            while (this.wave.length > w * 0.55) this.wave.pop();

            const waveStart = w * 0.45;
            ctx.strokeStyle = 'rgba(142, 51, 213, 0.3)';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(waveStart, tipY);
            ctx.stroke();
            ctx.setLineDash([]);

            if (this.showTarget) {
                ctx.strokeStyle = 'rgba(240, 0, 210, 0.25)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < this.wave.length; i++) {
                    const px = waveStart + i;
                    const signalPhase = this.time - i * 0.008 * this.speed;
                    const target = Math.sin(signalPhase) >= 0 ? cy - 90 : cy + 90;
                    if (i === 0) ctx.moveTo(px, target);
                    else ctx.lineTo(px, target);
                }
                ctx.stroke();
            }

            ctx.lineWidth = 2;
            for (let i = 1; i < this.wave.length; i++) {
                const t = 1 - i / this.wave.length;
                const [r, g, b] = hslToRgb(170 + t * 60, 0.9, 0.4 + t * 0.3);
                ctx.strokeStyle = `rgba(${r},${g},${b},${0.3 + t * 0.7})`;
                ctx.beginPath();
                ctx.moveTo(waveStart + i - 1, this.wave[i - 1]);
                ctx.lineTo(waveStart + i, this.wave[i]);
                ctx.stroke();
            }

            document.getElementById('sq-count').textContent = this.harmonics;
            const maxOvershoot = (1 + (this.harmonics > 0 ? 0.09 : 0)) * 100;
            document.getElementById('sq-gibbs').textContent = this.harmonics > 1 ? '~9%' : 'N/A';
        }
    });

    // ===== Demo 2: Sawtooth & Triangle =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        waveType: 'sawtooth', harmonics: 5, speed: 1, showTarget: true,
        time: 0, wave: [], animId: null,

        init() {
            this.canvas = document.getElementById('canvas-2');
            const self = this;
            document.getElementById('saw-type').addEventListener('change', function () {
                self.waveType = this.value;
                self.wave = [];
            });
            bindSlider('saw-harmonics', 'saw-harmonics-val', v => { self.harmonics = v; });
            bindSlider('saw-speed', 'saw-speed-val', v => { self.speed = v; });
            document.getElementById('saw-target').addEventListener('change', function () {
                self.showTarget = this.checked;
            });
            document.getElementById('saw-reset').addEventListener('click', () => {
                self.time = 0; self.wave = [];
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
            this.deactivate(); this.activate();
        },

        step() {
            this.time += 0.008 * this.speed;
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);

            const cx = w * 0.25, cy = h * 0.5;
            let x = 0, y = 0;
            const circles = [];
            const isSawtooth = this.waveType === 'sawtooth';

            for (let i = 1; i <= this.harmonics; i++) {
                let n, amp;
                if (isSawtooth) {
                    n = i;
                    amp = 80 * (2 / (n * Math.PI)) * (n % 2 === 0 ? -1 : 1);
                } else {
                    if (i % 2 === 0) continue;
                    n = i;
                    amp = 80 * (8 / (n * n * Math.PI * Math.PI)) * ((Math.floor(n / 2) % 2 === 0) ? 1 : -1);
                }
                const r = Math.abs(amp);
                const prevX = x, prevY = y;
                const sign = amp < 0 ? -1 : 1;
                const angle = n * this.time;
                x += r * Math.cos(angle) * sign;
                y += r * Math.sin(angle) * sign;
                circles.push({ cx: prevX, cy: prevY, r: r, x: x, y: y });
            }

            drawEpicycleCircles(ctx, circles, cx, cy);

            const tipX = x + cx, tipY = y + cy;
            ctx.fillStyle = '#21D6C6';
            ctx.beginPath();
            ctx.arc(tipX, tipY, 3, 0, 2 * Math.PI);
            ctx.fill();

            this.wave.unshift(tipY);
            while (this.wave.length > w * 0.55) this.wave.pop();

            const waveStart = w * 0.45;
            ctx.strokeStyle = 'rgba(142, 51, 213, 0.3)';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(waveStart, tipY);
            ctx.stroke();
            ctx.setLineDash([]);

            if (this.showTarget) {
                ctx.strokeStyle = 'rgba(240, 0, 210, 0.25)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < this.wave.length; i++) {
                    const px = waveStart + i;
                    const phase = this.time - i * 0.008 * this.speed;
                    let target;
                    if (isSawtooth) {
                        const p = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
                        target = cy - 80 * (1 - p / Math.PI);
                    } else {
                        const p = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
                        if (p < Math.PI) target = cy - 80 * (2 * p / Math.PI - 1);
                        else target = cy - 80 * (3 - 2 * p / Math.PI);
                    }
                    if (i === 0) ctx.moveTo(px, target);
                    else ctx.lineTo(px, target);
                }
                ctx.stroke();
            }

            ctx.lineWidth = 2;
            for (let i = 1; i < this.wave.length; i++) {
                const t = 1 - i / this.wave.length;
                const [r, g, b] = hslToRgb(170 + t * 60, 0.9, 0.4 + t * 0.3);
                ctx.strokeStyle = `rgba(${r},${g},${b},${0.3 + t * 0.7})`;
                ctx.beginPath();
                ctx.moveTo(waveStart + i - 1, this.wave[i - 1]);
                ctx.lineTo(waveStart + i, this.wave[i]);
                ctx.stroke();
            }

            document.getElementById('saw-wtype').textContent = isSawtooth ? 'Sawtooth' : 'Triangle';
            document.getElementById('saw-count').textContent = this.harmonics;
        }
    });

    // ===== Demo 3: Drawing =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        isDrawing: false, drawMode: true,
        rawPoints: [], dft: null, numEpicycles: 80, speed: 1,
        circleOpacity: 0.7, time: 0, trail: [], animId: null,

        init() {
            this.canvas = document.getElementById('canvas-3');
            const self = this;
            bindSlider('draw-epicycles', 'draw-epicycles-val', v => {
                self.numEpicycles = v;
                if (self.dft) self.recomputeDFT();
            });
            bindSlider('draw-speed', 'draw-speed-val', v => { self.speed = v; });
            bindSlider('draw-opacity', 'draw-opacity-val', v => { self.circleOpacity = v; });

            document.getElementById('draw-toggle').addEventListener('click', () => {
                if (self.drawMode) {
                    if (self.rawPoints.length > 10) {
                        self.drawMode = false;
                        self.startReplay();
                    }
                } else {
                    self.drawMode = true;
                    self.dft = null;
                    self.trail = [];
                    self.time = 0;
                }
                self.updateUI();
            });

            document.getElementById('draw-clear').addEventListener('click', () => {
                self.rawPoints = [];
                self.dft = null;
                self.trail = [];
                self.time = 0;
                self.drawMode = true;
                self.updateUI();
            });

            this.canvas.addEventListener('mousedown', e => {
                if (!self.drawMode) return;
                self.isDrawing = true;
                self.rawPoints = [];
                const pos = getCanvasMousePos(self.canvas, e);
                self.rawPoints.push({ x: pos.x - self.w / 2, y: pos.y - self.h / 2 });
            });
            this.canvas.addEventListener('mousemove', e => {
                if (!self.isDrawing || !self.drawMode) return;
                const pos = getCanvasMousePos(self.canvas, e);
                self.rawPoints.push({ x: pos.x - self.w / 2, y: pos.y - self.h / 2 });
            });
            this.canvas.addEventListener('mouseup', () => { self.isDrawing = false; });
            this.canvas.addEventListener('mouseleave', () => { self.isDrawing = false; });
        },

        updateUI() {
            const toggleBtn = document.getElementById('draw-toggle');
            const canvasWrap = this.canvas.parentElement;
            if (this.drawMode) {
                toggleBtn.textContent = 'Play';
                canvasWrap.classList.add('drawing-mode');
                document.getElementById('draw-mode').textContent = 'Drawing';
            } else {
                toggleBtn.textContent = 'Draw';
                canvasWrap.classList.remove('drawing-mode');
                document.getElementById('draw-mode').textContent = 'Playing';
            }
            document.getElementById('draw-pts').textContent = this.rawPoints.length;
            document.getElementById('draw-nepi').textContent = this.dft ?
                Math.min(this.numEpicycles, this.dft.length) : '—';
        },

        recomputeDFT() {
            const resampled = resamplePath(this.rawPoints, Math.max(this.numEpicycles * 2, 100));
            this.dft = computeDFT(resampled);
            this.dft.sort((a, b) => b.amp - a.amp);
            this.trail = [];
            this.time = 0;
        },

        startReplay() {
            this.recomputeDFT();
            this.updateUI();
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.updateUI();
            const self = this;
            function loop() {
                self.draw();
                self.animId = requestAnimationFrame(loop);
            }
            this.animId = requestAnimationFrame(loop);
        },

        deactivate() {
            if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
            this.canvas.parentElement.classList.remove('drawing-mode');
        },

        resize() {
            if (!this._initialized) return;
            this.deactivate(); this.activate();
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);
            const cx = w / 2, cy = h / 2;

            if (this.drawMode) {
                if (this.rawPoints.length > 1) {
                    ctx.strokeStyle = 'rgba(33, 214, 198, 0.6)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(this.rawPoints[0].x + cx, this.rawPoints[0].y + cy);
                    for (let i = 1; i < this.rawPoints.length; i++) {
                        ctx.lineTo(this.rawPoints[i].x + cx, this.rawPoints[i].y + cy);
                    }
                    ctx.stroke();
                }
                if (this.rawPoints.length === 0) {
                    ctx.fillStyle = 'rgba(199, 153, 234, 0.4)';
                    ctx.font = '18px Segoe UI, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('Click and drag to draw a shape', cx, cy);
                }
            } else if (this.dft) {
                this.time += 0.003 * this.speed;
                if (this.time > 1) this.time -= 1;

                const result = evaluateEpicycles(this.dft, this.time, this.numEpicycles);
                drawEpicycleCircles(ctx, result.circles, cx, cy, this.circleOpacity);

                ctx.fillStyle = '#21D6C6';
                ctx.beginPath();
                ctx.arc(result.x + cx, result.y + cy, 3, 0, 2 * Math.PI);
                ctx.fill();

                this.trail.push({ x: result.x + cx, y: result.y + cy });
                const maxTrail = this.dft.length * 3;
                while (this.trail.length > maxTrail) this.trail.shift();

                if (this.trail.length > 1) {
                    ctx.lineWidth = 2;
                    for (let i = 1; i < this.trail.length; i++) {
                        const t = i / this.trail.length;
                        const [r, g, b] = hslToRgb(170 + t * 60, 0.9, 0.4 + t * 0.3);
                        ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 + t * 0.8})`;
                        ctx.beginPath();
                        ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
                        ctx.lineTo(this.trail[i].x, this.trail[i].y);
                        ctx.stroke();
                    }
                }
            }
        }
    });

    // ===== Demo 4: Preset Shapes =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        shapeName: 'star', numEpicycles: 100, speed: 1,
        circleOpacity: 0.7, dft: null, time: 0, trail: [], animId: null,

        init() {
            this.canvas = document.getElementById('canvas-4');
            const self = this;
            document.getElementById('shape-preset').addEventListener('change', function () {
                self.shapeName = this.value;
                self.loadShape();
            });
            bindSlider('shape-epicycles', 'shape-epicycles-val', v => {
                self.numEpicycles = v;
                self.loadShape();
            });
            bindSlider('shape-speed', 'shape-speed-val', v => { self.speed = v; });
            bindSlider('shape-opacity', 'shape-opacity-val', v => { self.circleOpacity = v; });
            document.getElementById('shape-reset').addEventListener('click', () => {
                self.time = 0; self.trail = [];
            });
        },

        loadShape() {
            const gen = PRESET_SHAPES[this.shapeName];
            if (!gen) return;
            const points = gen();
            this.dft = computeDFT(points);
            this.dft.sort((a, b) => b.amp - a.amp);
            this.trail = [];
            this.time = 0;
            this.updateInfo(points.length);
        },

        updateInfo(numPts) {
            document.getElementById('shape-name').textContent = this.shapeName;
            document.getElementById('shape-pts').textContent = numPts;
            document.getElementById('shape-nepi').textContent = Math.min(this.numEpicycles, this.dft ? this.dft.length : 0);
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            if (!this.dft) this.loadShape();
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
            this.deactivate(); this.activate();
        },

        step() {
            this.time += 0.002 * this.speed;
            if (this.time > 1) this.time -= 1;
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);
            if (!this.dft) return;
            const cx = w / 2, cy = h / 2;

            const result = evaluateEpicycles(this.dft, this.time, this.numEpicycles);
            drawEpicycleCircles(ctx, result.circles, cx, cy, this.circleOpacity);

            ctx.fillStyle = '#21D6C6';
            ctx.beginPath();
            ctx.arc(result.x + cx, result.y + cy, 3, 0, 2 * Math.PI);
            ctx.fill();

            this.trail.push({ x: result.x + cx, y: result.y + cy });
            const maxTrail = Math.max(this.dft.length * 3, 800);
            while (this.trail.length > maxTrail) this.trail.shift();

            if (this.trail.length > 1) {
                ctx.lineWidth = 2;
                for (let i = 1; i < this.trail.length; i++) {
                    const t = i / this.trail.length;
                    const [r, g, b] = hslToRgb(170 + t * 60, 0.9, 0.4 + t * 0.3);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 + t * 0.8})`;
                    ctx.beginPath();
                    ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
                    ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    ctx.stroke();
                }
            }

            this.updateInfo(this.dft.length);
        }
    });

    // ===== Demo 5: DFT Explorer =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        freqAmps: [80, 40, 20, 0, 0, 0, 0, 0],
        speed: 1, time: 0, wave: [], animId: null,

        init() {
            this.canvas = document.getElementById('canvas-5');
            const self = this;
            for (let i = 0; i < 8; i++) {
                const idx = i;
                bindSlider('dft-f' + (i + 1), 'dft-f' + (i + 1) + '-val', v => {
                    self.freqAmps[idx] = v;
                    self.wave = [];
                });
            }
            bindSlider('dft-speed', 'dft-speed-val', v => { self.speed = v; });
            document.getElementById('dft-reset').addEventListener('click', () => {
                self.time = 0; self.wave = [];
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
            this.deactivate(); this.activate();
        },

        step() {
            this.time += 0.008 * this.speed;
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);

            // Bar chart on top
            const barH = h * 0.25;
            const barW = (w * 0.8) / 8;
            const barX = w * 0.1;
            const maxAmp = 100;

            ctx.fillStyle = 'rgba(142, 51, 213, 0.15)';
            ctx.fillRect(barX - 5, 10, barW * 8 + 10, barH + 10);

            let activeCount = 0;
            let totalAmp = 0;
            for (let i = 0; i < 8; i++) {
                const amp = this.freqAmps[i];
                const bh = (amp / maxAmp) * barH;
                const bx = barX + i * barW;
                const [r, g, b] = hslToRgb(170 + i * 25, 0.9, 0.5);
                ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
                ctx.fillRect(bx + 4, 15 + barH - bh, barW - 8, bh);

                ctx.fillStyle = 'rgba(199, 153, 234, 0.7)';
                ctx.font = '11px Segoe UI, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('f' + (i + 1), bx + barW / 2, 15 + barH + 15);

                if (amp > 0) { activeCount++; totalAmp += amp; }
            }

            // Epicycles
            const epiCx = w * 0.2, epiCy = h * 0.65;
            let x = 0, y = 0;
            const circles = [];
            for (let i = 0; i < 8; i++) {
                if (this.freqAmps[i] === 0) continue;
                const freq = i + 1;
                const r = this.freqAmps[i] * 0.6;
                const prevX = x, prevY = y;
                const angle = freq * this.time;
                x += r * Math.cos(angle);
                y += r * Math.sin(angle);
                circles.push({ cx: prevX, cy: prevY, r: r, x: x, y: y });
            }
            drawEpicycleCircles(ctx, circles, epiCx, epiCy);

            const tipX = x + epiCx, tipY = y + epiCy;
            ctx.fillStyle = '#21D6C6';
            ctx.beginPath();
            ctx.arc(tipX, tipY, 3, 0, 2 * Math.PI);
            ctx.fill();

            // Wave
            this.wave.unshift(tipY);
            while (this.wave.length > w * 0.45) this.wave.pop();

            const waveStart = w * 0.5;
            ctx.strokeStyle = 'rgba(142, 51, 213, 0.3)';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(waveStart, tipY);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.lineWidth = 2;
            for (let i = 1; i < this.wave.length; i++) {
                const t = 1 - i / this.wave.length;
                const [r, g, b] = hslToRgb(170 + t * 60, 0.9, 0.4 + t * 0.3);
                ctx.strokeStyle = `rgba(${r},${g},${b},${0.3 + t * 0.7})`;
                ctx.beginPath();
                ctx.moveTo(waveStart + i - 1, this.wave[i - 1]);
                ctx.lineTo(waveStart + i, this.wave[i]);
                ctx.stroke();
            }

            document.getElementById('dft-active').textContent = activeCount;
            document.getElementById('dft-totalamp').textContent = totalAmp.toFixed(0);
        }
    });

    // ===== Demo 6: Signal Builder =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        comps: [
            { freq: 1, amp: 80, phase: 0 },
            { freq: 3, amp: 40, phase: 0 },
            { freq: 5, amp: 0, phase: 0 },
            { freq: 7, amp: 0, phase: 0 }
        ],
        speed: 1, showComponents: true,
        time: 0, animId: null,

        init() {
            this.canvas = document.getElementById('canvas-6');
            const self = this;
            for (let i = 0; i < 4; i++) {
                const idx = i;
                bindSlider('sig-f' + (i + 1), 'sig-f' + (i + 1) + '-val', v => { self.comps[idx].freq = v; });
                bindSlider('sig-a' + (i + 1), 'sig-a' + (i + 1) + '-val', v => { self.comps[idx].amp = v; });
                bindSlider('sig-p' + (i + 1), 'sig-p' + (i + 1) + '-val', v => {
                    self.comps[idx].phase = v * Math.PI / 180;
                }, v => v + '\u00B0');
            }
            bindSlider('sig-speed', 'sig-speed-val', v => { self.speed = v; });
            document.getElementById('sig-components').addEventListener('change', function () {
                self.showComponents = this.checked;
            });
            document.getElementById('sig-reset').addEventListener('click', () => {
                self.time = 0;
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
            this.deactivate(); this.activate();
        },

        step() {
            this.time += 0.01 * this.speed;
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);

            const margin = 40;
            const plotW = w - margin * 2;
            const plotH = h - margin * 2;
            const cy = h / 2;
            const maxAmp = 200;

            // Axes
            ctx.strokeStyle = 'rgba(74, 0, 128, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(margin, cy);
            ctx.lineTo(w - margin, cy);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(margin, margin);
            ctx.lineTo(margin, h - margin);
            ctx.stroke();

            // Grid lines
            ctx.strokeStyle = 'rgba(74, 0, 128, 0.2)';
            for (let i = -3; i <= 3; i++) {
                if (i === 0) continue;
                const gy = cy - (i / 3) * (plotH / 2);
                ctx.beginPath();
                ctx.moveTo(margin, gy);
                ctx.lineTo(w - margin, gy);
                ctx.stroke();
            }

            // Component waves
            let activeCount = 0;
            let peak = 0;
            const compColors = [
                [33, 214, 198],
                [142, 51, 213],
                [240, 0, 210],
                [114, 0, 203]
            ];

            if (this.showComponents) {
                for (let c = 0; c < 4; c++) {
                    const comp = this.comps[c];
                    if (comp.amp === 0) continue;
                    const [r, g, b] = compColors[c];
                    ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    for (let px = 0; px <= plotW; px++) {
                        const t = (px / plotW) * 4 * Math.PI + this.time;
                        const val = comp.amp * Math.sin(comp.freq * t + comp.phase);
                        const sy = cy - val * (plotH / 2) / maxAmp;
                        if (px === 0) ctx.moveTo(margin + px, sy);
                        else ctx.lineTo(margin + px, sy);
                    }
                    ctx.stroke();
                }
            }

            // Combined wave
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for (let px = 0; px <= plotW; px++) {
                const t = (px / plotW) * 4 * Math.PI + this.time;
                let val = 0;
                for (let c = 0; c < 4; c++) {
                    const comp = this.comps[c];
                    if (comp.amp === 0) continue;
                    val += comp.amp * Math.sin(comp.freq * t + comp.phase);
                }
                if (Math.abs(val) > peak) peak = Math.abs(val);
                const sy = cy - val * (plotH / 2) / maxAmp;
                const hue = 170 + (px / plotW) * 60;
                const [r, g, b] = hslToRgb(hue, 0.9, 0.55);
                if (px === 0) {
                    ctx.moveTo(margin + px, sy);
                } else {
                    ctx.lineTo(margin + px, sy);
                }
            }
            ctx.strokeStyle = '#21D6C6';
            ctx.stroke();

            // Time marker
            const markerX = margin;
            let markerVal = 0;
            for (let c = 0; c < 4; c++) {
                if (this.comps[c].amp > 0) activeCount++;
                markerVal += this.comps[c].amp * Math.sin(this.comps[c].freq * this.time + this.comps[c].phase);
            }
            const markerY = cy - markerVal * (plotH / 2) / maxAmp;
            ctx.fillStyle = '#F000D2';
            ctx.beginPath();
            ctx.arc(markerX, markerY, 5, 0, 2 * Math.PI);
            ctx.fill();

            document.getElementById('sig-active').textContent = activeCount + ' / 4';
            document.getElementById('sig-peak').textContent = peak.toFixed(1);
        }
    });

    // ===== Demo 7: Spirograph =====

    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        R1: 100, R2: 40, pen: 30, speed: 2,
        showCircles: true, time: 0, trail: [],
        animId: null,

        presets: {
            custom: null,
            flower5: { R1: 100, R2: 20, pen: 20 },
            flower8: { R1: 100, R2: 12.5, pen: 12 },
            star3: { R1: 120, R2: 40, pen: 40 },
            star7: { R1: 140, R2: 20, pen: 20 },
            deltoid: { R1: 120, R2: 40, pen: 40 },
            astroid: { R1: 120, R2: 30, pen: 30 },
            cardioid: { R1: 80, R2: 80, pen: 80 }
        },

        init() {
            this.canvas = document.getElementById('canvas-7');
            const self = this;
            bindSlider('spiro-r1', 'spiro-r1-val', v => { self.R1 = v; self.trail = []; self.time = 0; });
            bindSlider('spiro-r2', 'spiro-r2-val', v => { self.R2 = v; self.trail = []; self.time = 0; });
            bindSlider('spiro-pen', 'spiro-pen-val', v => { self.pen = v; self.trail = []; self.time = 0; });
            bindSlider('spiro-speed', 'spiro-speed-val', v => { self.speed = v; });
            document.getElementById('spiro-circles').addEventListener('change', function () {
                self.showCircles = this.checked;
            });
            document.getElementById('spiro-preset').addEventListener('change', function () {
                const p = self.presets[this.value];
                if (p) {
                    self.R1 = p.R1; self.R2 = p.R2; self.pen = p.pen;
                    document.getElementById('spiro-r1').value = p.R1;
                    document.getElementById('spiro-r1-val').textContent = p.R1;
                    document.getElementById('spiro-r2').value = p.R2;
                    document.getElementById('spiro-r2-val').textContent = p.R2;
                    document.getElementById('spiro-pen').value = p.pen;
                    document.getElementById('spiro-pen-val').textContent = p.pen;
                    self.trail = [];
                    self.time = 0;
                }
            });
            document.getElementById('spiro-reset').addEventListener('click', () => {
                self.trail = []; self.time = 0;
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
            this.deactivate(); this.activate();
        },

        step() {
            const dt = 0.02 * this.speed;
            const steps = 3;
            for (let s = 0; s < steps; s++) {
                this.time += dt / steps;
                const t = this.time;
                const R = this.R1, r = this.R2, d = this.pen;
                const x = (R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t);
                const y = (R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t);
                this.trail.push({ x, y });
            }
            while (this.trail.length > 15000) this.trail.shift();
        },

        draw() {
            const ctx = this.ctx, w = this.w, h = this.h;
            clearCanvas(ctx, w, h);
            const cx = w / 2, cy = h / 2;

            if (this.showCircles) {
                const t = this.time;
                const R = this.R1, r = this.R2, d = this.pen;

                // Outer circle
                ctx.strokeStyle = 'rgba(142, 51, 213, 0.25)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, R, 0, 2 * Math.PI);
                ctx.stroke();

                // Inner circle center
                const innerCx = cx + (R - r) * Math.cos(t);
                const innerCy = cy + (R - r) * Math.sin(t);

                ctx.strokeStyle = 'rgba(142, 51, 213, 0.35)';
                ctx.beginPath();
                ctx.arc(innerCx, innerCy, r, 0, 2 * Math.PI);
                ctx.stroke();

                // Pen arm
                const penX = cx + (R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t);
                const penY = cy + (R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t);

                ctx.strokeStyle = 'rgba(33, 214, 198, 0.5)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(innerCx, innerCy);
                ctx.lineTo(penX, penY);
                ctx.stroke();

                ctx.fillStyle = '#21D6C6';
                ctx.beginPath();
                ctx.arc(penX, penY, 3, 0, 2 * Math.PI);
                ctx.fill();
            }

            // Trail
            if (this.trail.length > 1) {
                ctx.lineWidth = 1.5;
                for (let i = 1; i < this.trail.length; i++) {
                    const t = i / this.trail.length;
                    const [r, g, b] = hslToRgb(250 + t * 110, 0.85, 0.35 + t * 0.35);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${0.15 + t * 0.85})`;
                    ctx.beginPath();
                    ctx.moveTo(this.trail[i - 1].x + cx, this.trail[i - 1].y + cy);
                    ctx.lineTo(this.trail[i].x + cx, this.trail[i].y + cy);
                    ctx.stroke();
                }
            }

            // Info
            const ratio = this.R2 !== 0 ? (this.R1 / this.R2).toFixed(2) : '—';
            document.getElementById('spiro-r1disp').textContent = this.R1;
            document.getElementById('spiro-r2disp').textContent = this.R2;
            document.getElementById('spiro-ratio').textContent = ratio;
            document.getElementById('spiro-pts').textContent = this.trail.length;
        }
    });

    // ===== Initialization =====

    document.addEventListener('DOMContentLoaded', function () {
        tabs = Array.from(document.querySelectorAll('.tab'));
        panels = Array.from(document.querySelectorAll('.demo-panel'));

        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => switchDemo(i));
        });

        window.addEventListener('resize', () => {
            if (demos[activeDemo] && demos[activeDemo]._initialized && demos[activeDemo].resize) {
                demos[activeDemo].resize();
            }
        });

        // Initialize first demo
        switchDemo(0);
    });

})();
