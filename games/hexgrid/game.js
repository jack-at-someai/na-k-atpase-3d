(function () {
    'use strict';

    // ========================================================================
    //  HEX MATH LIBRARY
    // ========================================================================
    const Hex = {
        // --- Cube coordinate constructors ---
        cube(q, r, s) {
            if (s === undefined) s = -q - r;
            return { q, r, s };
        },

        // --- Arithmetic ---
        add(a, b) { return { q: a.q + b.q, r: a.r + b.r, s: a.s + b.s }; },
        sub(a, b) { return { q: a.q - b.q, r: a.r - b.r, s: a.s - b.s }; },
        scale(h, k) { return { q: h.q * k, r: h.r * k, s: h.s * k }; },
        eq(a, b) { return a.q === b.q && a.r === b.r && a.s === b.s; },
        key(h) { return h.q + ',' + h.r; },

        // --- Distance ---
        length(h) { return (Math.abs(h.q) + Math.abs(h.r) + Math.abs(h.s)) / 2; },
        distance(a, b) { return Hex.length(Hex.sub(a, b)); },

        // --- Directions (cube) ---
        directions: [
            { q: 1, r: 0, s: -1 }, { q: 1, r: -1, s: 0 }, { q: 0, r: -1, s: 1 },
            { q: -1, r: 0, s: 1 }, { q: -1, r: 1, s: 0 }, { q: 0, r: 1, s: -1 }
        ],
        diagonals: [
            { q: 2, r: -1, s: -1 }, { q: 1, r: -2, s: 1 }, { q: -1, r: -1, s: 2 },
            { q: -2, r: 1, s: 1 }, { q: -1, r: 2, s: -1 }, { q: 1, r: 1, s: -2 }
        ],

        neighbor(h, dir) { return Hex.add(h, Hex.directions[dir]); },
        neighbors(h) { return Hex.directions.map(d => Hex.add(h, d)); },
        diagonalNeighbors(h) { return Hex.diagonals.map(d => Hex.add(h, d)); },

        // --- Rounding ---
        round(frac) {
            let q = Math.round(frac.q);
            let r = Math.round(frac.r);
            let s = Math.round(frac.s);
            const dq = Math.abs(q - frac.q);
            const dr = Math.abs(r - frac.r);
            const ds = Math.abs(s - frac.s);
            if (dq > dr && dq > ds) q = -r - s;
            else if (dr > ds) r = -q - s;
            else s = -q - r;
            return { q, r, s };
        },

        // --- Lerp ---
        lerp(a, b, t) {
            return {
                q: a.q + (b.q - a.q) * t,
                r: a.r + (b.r - a.r) * t,
                s: a.s + (b.s - a.s) * t
            };
        },

        // --- Line drawing ---
        lineDraw(a, b) {
            const N = Hex.distance(a, b);
            if (N === 0) return [a];
            const nudge = { q: a.q + 1e-6, r: a.r + 1e-6, s: a.s - 2e-6 };
            const nudgeB = { q: b.q + 1e-6, r: b.r + 1e-6, s: b.s - 2e-6 };
            const results = [];
            for (let i = 0; i <= N; i++) {
                results.push(Hex.round(Hex.lerp(nudge, nudgeB, i / N)));
            }
            return results;
        },

        // --- Ring ---
        ring(center, radius) {
            if (radius === 0) return [center];
            const results = [];
            let h = Hex.add(center, Hex.scale(Hex.directions[4], radius));
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < radius; j++) {
                    results.push(h);
                    h = Hex.neighbor(h, i);
                }
            }
            return results;
        },

        // --- Spiral ---
        spiral(center, radius) {
            const results = [center];
            for (let k = 1; k <= radius; k++) {
                results.push(...Hex.ring(center, k));
            }
            return results;
        },

        // --- Range (all hexes within N) ---
        range(center, N) {
            const results = [];
            for (let q = -N; q <= N; q++) {
                for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
                    results.push(Hex.add(center, Hex.cube(q, r)));
                }
            }
            return results;
        },

        // --- BFS reachable (respects obstacles) ---
        reachable(start, movement, blocked) {
            const visited = new Set();
            visited.add(Hex.key(start));
            const fringes = [[start]];
            for (let k = 1; k <= movement; k++) {
                fringes.push([]);
                for (const h of fringes[k - 1]) {
                    for (let dir = 0; dir < 6; dir++) {
                        const nb = Hex.neighbor(h, dir);
                        const key = Hex.key(nb);
                        if (!visited.has(key) && !blocked.has(key)) {
                            visited.add(key);
                            fringes[k].push(nb);
                        }
                    }
                }
            }
            const all = [];
            for (const fringe of fringes) all.push(...fringe);
            return all;
        },

        // --- Rotation (60 deg CW steps) ---
        rotateCW(h) { return { q: -h.r, r: -h.s, s: -h.q }; },
        rotateCCW(h) { return { q: -h.s, r: -h.q, s: -h.r }; },
        rotations(h) {
            const result = [h];
            let cur = h;
            for (let i = 0; i < 5; i++) {
                cur = Hex.rotateCW(cur);
                result.push(cur);
            }
            return result;
        },

        // --- Reflection ---
        reflectQ(h) { return { q: h.q, r: h.s, s: h.r }; },
        reflectR(h) { return { q: h.s, r: h.r, s: h.q }; },
        reflectS(h) { return { q: h.r, r: h.q, s: h.s }; },

        // --- Conversions ---
        cubeToAxial(h) { return { q: h.q, r: h.r }; },
        axialToCube(a) { return { q: a.q, r: a.r, s: -a.q - a.r }; },

        cubeToOffsetEvenR(h) {
            const col = h.q + (h.r + (h.r & 1)) / 2;
            return { col, row: h.r };
        },
        cubeToOffsetOddR(h) {
            const col = h.q + (h.r - (h.r & 1)) / 2;
            return { col, row: h.r };
        },
        cubeToDoubledCol(h) {
            return { col: 2 * h.q + h.r, row: h.r };
        },

        // --- Map generators ---
        hexagonalMap(radius) {
            return Hex.range(Hex.cube(0, 0, 0), radius);
        },
        rectangularMap(w, h) {
            const results = [];
            for (let r = 0; r < h; r++) {
                const offset = Math.floor(r / 2);
                for (let q = -offset; q < w - offset; q++) {
                    results.push(Hex.cube(q, r));
                }
            }
            return results;
        },
        triangularMap(size) {
            const results = [];
            for (let q = 0; q <= size; q++) {
                for (let r = 0; r <= size - q; r++) {
                    results.push(Hex.cube(q, r));
                }
            }
            return results;
        },
        rhombusMap(w, h) {
            const results = [];
            for (let q = 0; q < w; q++) {
                for (let r = 0; r < h; r++) {
                    results.push(Hex.cube(q, r));
                }
            }
            return results;
        }
    };

    // ========================================================================
    //  LAYOUT / ORIENTATION
    // ========================================================================
    const Orientation = {
        flat: {
            f0: 3.0 / 2.0, f1: 0.0, f2: Math.sqrt(3.0) / 2.0, f3: Math.sqrt(3.0),
            b0: 2.0 / 3.0, b1: 0.0, b2: -1.0 / 3.0, b3: Math.sqrt(3.0) / 3.0,
            startAngle: 0.0
        },
        pointy: {
            f0: Math.sqrt(3.0), f1: Math.sqrt(3.0) / 2.0, f2: 0.0, f3: 3.0 / 2.0,
            b0: Math.sqrt(3.0) / 3.0, b1: -1.0 / 3.0, b2: 0.0, b3: 2.0 / 3.0,
            startAngle: 0.5
        }
    };

    function hexToPixel(h, layout) {
        const M = layout.orientation;
        const x = (M.f0 * h.q + M.f1 * h.r) * layout.size;
        const y = (M.f2 * h.q + M.f3 * h.r) * layout.size;
        return { x: x + layout.origin.x, y: y + layout.origin.y };
    }

    function pixelToHex(p, layout) {
        const M = layout.orientation;
        const pt = { x: (p.x - layout.origin.x) / layout.size, y: (p.y - layout.origin.y) / layout.size };
        const q = M.b0 * pt.x + M.b1 * pt.y;
        const r = M.b2 * pt.x + M.b3 * pt.y;
        return { q, r, s: -q - r };
    }

    function hexCornerOffset(corner, layout) {
        const angle = 2.0 * Math.PI * (layout.orientation.startAngle + corner) / 6.0;
        return { x: layout.size * Math.cos(angle), y: layout.size * Math.sin(angle) };
    }

    function hexCorners(h, layout) {
        const center = hexToPixel(h, layout);
        const corners = [];
        for (let i = 0; i < 6; i++) {
            const off = hexCornerOffset(i, layout);
            corners.push({ x: center.x + off.x, y: center.y + off.y });
        }
        return corners;
    }

    // ========================================================================
    //  SHARED STATE
    // ========================================================================
    const SharedState = {
        flat: true,
        hexSize: 35,
        get orientation() { return this.flat ? Orientation.flat : Orientation.pointy; },
        listeners: [],
        onChange(fn) { this.listeners.push(fn); },
        notify() { this.listeners.forEach(fn => fn()); }
    };

    // ========================================================================
    //  RENDERING UTILITIES
    // ========================================================================
    function setupCanvas(canvas) {
        const wrap = canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        const rect = wrap.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, w: rect.width, h: rect.height };
    }

    function makeLayout(canvas) {
        const wrap = canvas.parentElement;
        const rect = wrap.getBoundingClientRect();
        return {
            orientation: SharedState.orientation,
            size: SharedState.hexSize,
            origin: { x: rect.width / 2, y: rect.height / 2 }
        };
    }

    function drawHexPath(ctx, corners) {
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < 6; i++) ctx.lineTo(corners[i].x, corners[i].y);
        ctx.closePath();
    }

    function drawHex(ctx, h, layout, fill, stroke, lineWidth) {
        const corners = hexCorners(h, layout);
        drawHexPath(ctx, corners);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth || 1; ctx.stroke(); }
    }

    function drawGrid(ctx, hexes, layout, fill, stroke) {
        for (const h of hexes) {
            drawHex(ctx, h, layout, fill || '#111827', stroke || '#1e293b', 1);
        }
    }

    function drawLabel(ctx, h, layout, text, color, fontSize) {
        const p = hexToPixel(h, layout);
        ctx.fillStyle = color || '#94a3b8';
        ctx.font = (fontSize || 10) + 'px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, p.x, p.y);
    }

    function drawPath(ctx, hexes, layout, color, width) {
        if (hexes.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = color || '#22d3ee';
        ctx.lineWidth = width || 2;
        const p0 = hexToPixel(hexes[0], layout);
        ctx.moveTo(p0.x, p0.y);
        for (let i = 1; i < hexes.length; i++) {
            const p = hexToPixel(hexes[i], layout);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }

    function clearCanvas(ctx, w, h) {
        ctx.fillStyle = '#060910';
        ctx.fillRect(0, 0, w, h);
    }

    function getCanvasMousePos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    // ========================================================================
    //  MINHEAP (for A*)
    // ========================================================================
    class MinHeap {
        constructor() { this.data = []; }
        push(item) {
            this.data.push(item);
            this._bubbleUp(this.data.length - 1);
        }
        pop() {
            const top = this.data[0];
            const last = this.data.pop();
            if (this.data.length > 0) { this.data[0] = last; this._sinkDown(0); }
            return top;
        }
        get size() { return this.data.length; }
        _bubbleUp(i) {
            while (i > 0) {
                const p = (i - 1) >> 1;
                if (this.data[i].f < this.data[p].f) {
                    [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
                    i = p;
                } else break;
            }
        }
        _sinkDown(i) {
            const n = this.data.length;
            while (true) {
                let smallest = i;
                const l = 2 * i + 1, r = 2 * i + 2;
                if (l < n && this.data[l].f < this.data[smallest].f) smallest = l;
                if (r < n && this.data[r].f < this.data[smallest].f) smallest = r;
                if (smallest !== i) {
                    [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
                    i = smallest;
                } else break;
            }
        }
    }

    // ========================================================================
    //  A* PATHFINDING
    // ========================================================================
    function astar(start, end, blocked, gridSet, heuristicType, layout) {
        const openSet = new MinHeap();
        const cameFrom = new Map();
        const gScore = new Map();
        const explored = [];

        const heuristic = (a, b) => {
            if (heuristicType === 'dijkstra') return 0;
            if (heuristicType === 'euclidean') {
                const pa = hexToPixel(a, layout);
                const pb = hexToPixel(b, layout);
                const dx = pa.x - pb.x, dy = pa.y - pb.y;
                return Math.sqrt(dx * dx + dy * dy) / layout.size;
            }
            return Hex.distance(a, b);
        };

        const startKey = Hex.key(start);
        gScore.set(startKey, 0);
        openSet.push({ hex: start, f: heuristic(start, end) });

        while (openSet.size > 0) {
            const current = openSet.pop().hex;
            const currentKey = Hex.key(current);
            explored.push(current);

            if (Hex.eq(current, end)) {
                const path = [current];
                let k = currentKey;
                while (cameFrom.has(k)) {
                    const prev = cameFrom.get(k);
                    path.unshift(prev);
                    k = Hex.key(prev);
                }
                return { path, explored };
            }

            const currentG = gScore.get(currentKey);
            for (let d = 0; d < 6; d++) {
                const nb = Hex.neighbor(current, d);
                const nbKey = Hex.key(nb);
                if (blocked.has(nbKey) || !gridSet.has(nbKey)) continue;
                const tentG = currentG + 1;
                if (!gScore.has(nbKey) || tentG < gScore.get(nbKey)) {
                    gScore.set(nbKey, tentG);
                    cameFrom.set(nbKey, current);
                    openSet.push({ hex: nb, f: tentG + heuristic(nb, end) });
                }
            }
        }
        return { path: [], explored };
    }

    // ========================================================================
    //  DEMO MANAGER
    // ========================================================================
    const demos = [];
    let activeDemo = 0;

    function registerDemo(demo) {
        demos.push(demo);
    }

    function switchDemo(index) {
        if (index === activeDemo && demos[index]._initialized) return;
        const panels = document.querySelectorAll('.demo-panel');
        const tabs = document.querySelectorAll('.tab');

        if (demos[activeDemo] && demos[activeDemo]._initialized) {
            demos[activeDemo].deactivate();
        }
        panels[activeDemo].classList.remove('active');
        tabs[activeDemo].classList.remove('active');

        activeDemo = index;
        panels[index].classList.add('active');
        tabs[index].classList.add('active');

        if (!demos[index]._initialized) {
            demos[index].init();
            demos[index]._initialized = true;
        }
        demos[index].activate();
    }

    // ========================================================================
    //  DEMO 0: GEOMETRY
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, hovered: null,

        init() {
            this.canvas = document.getElementById('canvas-0');
            this.grid = Hex.hexagonalMap(2);
            this.canvas.addEventListener('mousemove', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const frac = pixelToHex(pos, this.layout);
                const rounded = Hex.round(frac);
                const inGrid = this.grid.some(h => Hex.eq(h, rounded));
                this.hovered = inGrid ? rounded : null;
                this.draw();
                this.updateInfo();
            });
            this.canvas.addEventListener('mouseleave', () => {
                this.hovered = null;
                this.draw();
                this.updateInfo();
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },

        deactivate() {},

        resize() {
            if (!this._initialized) return;
            this.activate();
        },

        updateInfo() {
            const el = document.getElementById('info-geometry');
            const s = this.layout.size;
            const orient = SharedState.flat ? 'flat-top' : 'pointy-top';
            const w = SharedState.flat ? 2 * s : Math.sqrt(3) * s;
            const h = SharedState.flat ? Math.sqrt(3) * s : 2 * s;
            const horiz = SharedState.flat ? w * 3 / 4 : w;
            const vert = SharedState.flat ? h : h * 3 / 4;
            if (!this.hovered) {
                el.innerHTML = `<div>Orientation: <span>${orient}</span></div>` +
                    `<div>Width: <span>${w.toFixed(1)}px</span></div>` +
                    `<div>Height: <span>${h.toFixed(1)}px</span></div>` +
                    `<div>Horiz spacing: <span>${horiz.toFixed(1)}px</span></div>` +
                    `<div>Vert spacing: <span>${vert.toFixed(1)}px</span></div>` +
                    `<div>Area: <span>${(3 * Math.sqrt(3) / 2 * s * s).toFixed(1)}px²</span></div>`;
                return;
            }
            el.innerHTML = `<div>Hex: <span>(${this.hovered.q}, ${this.hovered.r}, ${this.hovered.s})</span></div>` +
                `<div>Corners: <span>6 vertices</span></div>` +
                `<div>Interior angle: <span>120°</span></div>` +
                `<div>Side length: <span>${s.toFixed(1)}px</span></div>` +
                `<div>Perimeter: <span>${(6 * s).toFixed(1)}px</span></div>`;
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;

            // Draw grid with subtle fill
            for (const h of this.grid) {
                const isHov = this.hovered && Hex.eq(h, this.hovered);
                drawHex(ctx, h, layout,
                    isHov ? 'rgba(34,211,238,0.2)' : '#111827',
                    isHov ? '#22d3ee' : '#1e293b', isHov ? 2 : 1);
            }

            if (this.hovered) {
                const corners = hexCorners(this.hovered, layout);
                const center = hexToPixel(this.hovered, layout);

                // Draw edge dimension lines
                ctx.strokeStyle = 'rgba(129,140,248,0.5)';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                for (let i = 0; i < 6; i++) {
                    const next = (i + 1) % 6;
                    const mx = (corners[i].x + corners[next].x) / 2;
                    const my = (corners[i].y + corners[next].y) / 2;
                    ctx.beginPath();
                    ctx.moveTo(center.x, center.y);
                    ctx.lineTo(mx, my);
                    ctx.stroke();
                }
                ctx.setLineDash([]);

                // Draw width/height dimension arrows
                const s = layout.size;
                const drawDimLine = (x1, y1, x2, y2, label, col) => {
                    ctx.strokeStyle = col;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    // Arrowheads
                    const len = 6;
                    const angle = Math.atan2(y2 - y1, x2 - x1);
                    for (const [px, py, a] of [[x1, y1, angle], [x2, y2, angle + Math.PI]]) {
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(px + len * Math.cos(a + 0.4), py + len * Math.sin(a + 0.4));
                        ctx.moveTo(px, py);
                        ctx.lineTo(px + len * Math.cos(a - 0.4), py + len * Math.sin(a - 0.4));
                        ctx.stroke();
                    }
                    ctx.fillStyle = col;
                    ctx.font = '10px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
                    const nx = -(y2 - y1), ny = x2 - x1;
                    const nl = Math.sqrt(nx * nx + ny * ny);
                    ctx.fillText(label, mx + nx / nl * 14, my + ny / nl * 14);
                };

                if (SharedState.flat) {
                    drawDimLine(center.x - s, center.y, center.x + s, center.y,
                        (2 * s).toFixed(0) + 'w', '#ec4899');
                    const hh = Math.sqrt(3) / 2 * s;
                    drawDimLine(center.x, center.y - hh, center.x, center.y + hh,
                        (2 * hh).toFixed(0) + 'h', '#22d3ee');
                } else {
                    const ww = Math.sqrt(3) / 2 * s;
                    drawDimLine(center.x - ww, center.y, center.x + ww, center.y,
                        (2 * ww).toFixed(0) + 'w', '#ec4899');
                    drawDimLine(center.x, center.y - s, center.x, center.y + s,
                        (2 * s).toFixed(0) + 'h', '#22d3ee');
                }

                // Draw corner dots and angles
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    ctx.arc(corners[i].x, corners[i].y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = '#ec4899';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(corners[i].x, corners[i].y, 5, 0, Math.PI * 2);
                    ctx.strokeStyle = '#e2e8f0';
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    const angle = (360 / 6 * i + (SharedState.flat ? 0 : 30)).toFixed(0);
                    ctx.fillStyle = '#e2e8f0';
                    ctx.font = 'bold 10px monospace';
                    ctx.textAlign = 'center';
                    const ox = (corners[i].x - center.x) * 0.35;
                    const oy = (corners[i].y - center.y) * 0.35;
                    ctx.fillText(angle + '°', corners[i].x + ox, corners[i].y + oy);
                }

                // Center dot
                ctx.beginPath();
                ctx.arc(center.x, center.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#22d3ee';
                ctx.fill();
            }
        }
    });

    // ========================================================================
    //  DEMO 1: COORDINATES
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, selected: null, hovered: null,

        init() {
            this.canvas = document.getElementById('canvas-1');
            this.grid = Hex.hexagonalMap(3);
            this.canvas.addEventListener('click', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const frac = pixelToHex(pos, this.layout);
                const rounded = Hex.round(frac);
                if (this.grid.some(h => Hex.eq(h, rounded))) {
                    this.selected = rounded;
                    this.draw();
                    this.updateInfo();
                }
            });
            this.canvas.addEventListener('mousemove', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                const prev = this.hovered;
                this.hovered = this.grid.some(h => Hex.eq(h, rounded)) ? rounded : null;
                if (!prev && !this.hovered) return;
                if (prev && this.hovered && Hex.eq(prev, this.hovered)) return;
                this.draw();
            });
            this.canvas.addEventListener('mouseleave', () => {
                this.hovered = null;
                this.draw();
            });
            ['coord-cube', 'coord-axial', 'coord-offset', 'coord-doubled'].forEach(id => {
                document.getElementById(id).addEventListener('change', () => {
                    this.draw();
                    if (this.selected) this.updateInfo();
                });
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        updateInfo() {
            const el = document.getElementById('info-coords');
            if (!this.selected) { el.textContent = 'Click a hex to inspect'; return; }
            const h = this.selected;
            const ax = Hex.cubeToAxial(h);
            const off = Hex.cubeToOffsetEvenR(h);
            const dbl = Hex.cubeToDoubledCol(h);
            let html = '';
            if (document.getElementById('coord-cube').checked)
                html += `<div>Cube: <span>(${h.q}, ${h.r}, ${h.s})</span></div>`;
            if (document.getElementById('coord-axial').checked)
                html += `<div>Axial: <span>(${ax.q}, ${ax.r})</span></div>`;
            if (document.getElementById('coord-offset').checked)
                html += `<div>Offset: <span>(${off.col}, ${off.row})</span></div>`;
            if (document.getElementById('coord-doubled').checked)
                html += `<div>Doubled: <span>(${dbl.col}, ${dbl.row})</span></div>`;
            html += `<div>Constraint: <span>q+r+s = ${h.q}+${h.r}+${h.s} = 0</span></div>`;
            el.innerHTML = html || 'Enable a coordinate system above';
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;
            const showCube = document.getElementById('coord-cube').checked;
            const showAxial = document.getElementById('coord-axial').checked;
            const showOffset = document.getElementById('coord-offset').checked;
            const showDoubled = document.getElementById('coord-doubled').checked;

            // Draw coordinate axes through origin
            const origin = hexToPixel(Hex.cube(0, 0, 0), layout);
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 4]);
            // q axis
            const qDir = SharedState.flat
                ? { x: layout.size * 1.5, y: layout.size * Math.sqrt(3) / 2 }
                : { x: layout.size * Math.sqrt(3), y: 0 };
            ctx.strokeStyle = '#22d3ee';
            ctx.beginPath();
            ctx.moveTo(origin.x - qDir.x * 4, origin.y - qDir.y * 4);
            ctx.lineTo(origin.x + qDir.x * 4, origin.y + qDir.y * 4);
            ctx.stroke();
            // r axis
            const rDir = SharedState.flat
                ? { x: 0, y: layout.size * Math.sqrt(3) }
                : { x: layout.size * Math.sqrt(3) / 2, y: layout.size * 1.5 };
            ctx.strokeStyle = '#ec4899';
            ctx.beginPath();
            ctx.moveTo(origin.x - rDir.x * 4, origin.y - rDir.y * 4);
            ctx.lineTo(origin.x + rDir.x * 4, origin.y + rDir.y * 4);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1.0;

            for (const h of this.grid) {
                const isSel = this.selected && Hex.eq(h, this.selected);
                const isHov = this.hovered && Hex.eq(h, this.hovered) && !isSel;
                const isOrigin = h.q === 0 && h.r === 0 && h.s === 0;
                let fill = '#111827', stroke = '#1e293b', lw = 1;
                if (isSel) { fill = 'rgba(129,140,248,0.4)'; stroke = '#ec4899'; lw = 2; }
                else if (isHov) { fill = 'rgba(34,211,238,0.12)'; stroke = '#22d3ee'; lw = 1.5; }
                else if (isOrigin) { fill = 'rgba(34,211,238,0.1)'; stroke = '#22d3ee'; lw = 1.5; }
                drawHex(ctx, h, layout, fill, stroke, lw);

                // Color-coded multi-line labels
                const p = hexToPixel(h, layout);
                ctx.textAlign = 'center';
                ctx.font = '9px monospace';
                let lines = [];
                if (showCube) lines.push({ text: `${h.q},${h.r},${h.s}`, color: '#94a3b8' });
                else if (showAxial) lines.push({ text: `${h.q},${h.r}`, color: '#94a3b8' });
                if (showOffset) {
                    const off = Hex.cubeToOffsetEvenR(h);
                    lines.push({ text: `${off.col},${off.row}`, color: '#94a3b8' });
                }
                if (showDoubled) {
                    const dbl = Hex.cubeToDoubledCol(h);
                    lines.push({ text: `d:${dbl.col},${dbl.row}`, color: '#818cf8' });
                }
                const lineH = 11;
                const startY = p.y - (lines.length - 1) * lineH / 2;
                lines.forEach((ln, i) => {
                    ctx.fillStyle = ln.color;
                    ctx.textBaseline = 'middle';
                    ctx.fillText(ln.text, p.x, startY + i * lineH);
                });
            }
        }
    });

    // ========================================================================
    //  DEMO 2: NEIGHBORS
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, selected: null,

        init() {
            this.canvas = document.getElementById('canvas-2');
            this.grid = Hex.hexagonalMap(3);
            this.canvas.addEventListener('click', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (this.grid.some(h => Hex.eq(h, rounded))) {
                    this.selected = rounded;
                    this.draw();
                    this.updateInfo();
                }
            });
            document.getElementById('diag-toggle').addEventListener('change', () => this.draw());
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        updateInfo() {
            const el = document.getElementById('info-neighbors');
            if (!this.selected) { el.textContent = 'Click a hex to see neighbors'; return; }
            const nb = Hex.neighbors(this.selected);
            const showDiag = document.getElementById('diag-toggle').checked;
            let html = `<div>Selected: <span>(${this.selected.q}, ${this.selected.r}, ${this.selected.s})</span></div>`;
            html += `<div>Adjacent: <span>6</span></div>`;
            if (showDiag) html += `<div>Diagonals: <span>6</span></div>`;
            el.innerHTML = html;
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;
            const gridSet = new Set(this.grid.map(h => Hex.key(h)));
            const nbSet = new Set();
            const diagSet = new Set();
            const nbHexes = [];
            const diagHexes = [];
            const showDiag = document.getElementById('diag-toggle').checked;

            if (this.selected) {
                Hex.neighbors(this.selected).forEach(n => {
                    if (gridSet.has(Hex.key(n))) { nbSet.add(Hex.key(n)); nbHexes.push(n); }
                });
                if (showDiag) {
                    Hex.diagonalNeighbors(this.selected).forEach(n => {
                        if (gridSet.has(Hex.key(n))) { diagSet.add(Hex.key(n)); diagHexes.push(n); }
                    });
                }
            }

            for (const h of this.grid) {
                const key = Hex.key(h);
                const isSel = this.selected && Hex.eq(h, this.selected);
                const isNb = nbSet.has(key);
                const isDiag = diagSet.has(key);
                let fill = '#111827', stroke = '#1e293b', lw = 1;
                if (isSel) { fill = 'rgba(236,72,153,0.3)'; stroke = '#ec4899'; lw = 2; }
                else if (isNb) { fill = 'rgba(34,211,238,0.25)'; stroke = '#22d3ee'; lw = 2; }
                else if (isDiag) { fill = 'rgba(129,140,248,0.25)'; stroke = '#818cf8'; lw = 2; }
                drawHex(ctx, h, layout, fill, stroke, lw);
            }

            // Draw connection lines from selected to neighbors
            if (this.selected) {
                const sc = hexToPixel(this.selected, layout);
                // Diagonal connections (draw first so adjacents render on top)
                for (const dh of diagHexes) {
                    const dc = hexToPixel(dh, layout);
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(129,140,248,0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([4, 4]);
                    ctx.moveTo(sc.x, sc.y);
                    ctx.lineTo(dc.x, dc.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
                // Adjacent connections
                for (const nb of nbHexes) {
                    const nc = hexToPixel(nb, layout);
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(34,211,238,0.6)';
                    ctx.lineWidth = 2;
                    ctx.moveTo(sc.x, sc.y);
                    ctx.lineTo(nc.x, nc.y);
                    ctx.stroke();
                    // Arrow dot at midpoint
                    const mx = (sc.x + nc.x) / 2;
                    const my = (sc.y + nc.y) / 2;
                    ctx.beginPath();
                    ctx.arc(mx, my, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#22d3ee';
                    ctx.fill();
                }

                // Labels on neighbors
                for (const nb of nbHexes) {
                    const dir = Hex.directions.findIndex(d => Hex.eq(Hex.add(this.selected, d), nb));
                    if (dir >= 0) {
                        const dirNames = ['E', 'NE', 'NW', 'W', 'SW', 'SE'];
                        const p = hexToPixel(nb, layout);
                        ctx.fillStyle = '#22d3ee';
                        ctx.font = 'bold 11px monospace';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(dirNames[dir], p.x, p.y - 6);
                        ctx.fillStyle = '#94a3b8';
                        ctx.font = '9px monospace';
                        ctx.fillText('dir ' + dir, p.x, p.y + 7);
                    }
                }

                for (const dh of diagHexes) {
                    drawLabel(ctx, dh, layout, 'diag', '#818cf8', 9);
                }
            }
        }
    });

    // ========================================================================
    //  DEMO 3: DISTANCES
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, start: null, end: null,

        init() {
            this.canvas = document.getElementById('canvas-3');
            this.grid = Hex.hexagonalMap(4);
            this.canvas.addEventListener('click', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (!this.grid.some(h => Hex.eq(h, rounded))) return;
                if (!this.start || (this.start && this.end)) {
                    this.start = rounded; this.end = null;
                    document.getElementById('info-distances').textContent = 'Click second hex (end)';
                } else {
                    this.end = rounded;
                    const d = Hex.distance(this.start, this.end);
                    const diff = Hex.sub(this.end, this.start);
                    document.getElementById('info-distances').innerHTML =
                        `<div>From: <span>(${this.start.q},${this.start.r},${this.start.s})</span></div>` +
                        `<div>To: <span>(${this.end.q},${this.end.r},${this.end.s})</span></div>` +
                        `<div>Distance: <span>${d}</span></div>` +
                        `<div>Δ: <span>(${diff.q},${diff.r},${diff.s})</span></div>` +
                        `<div>Formula: <span>max(|${Math.abs(diff.q)}|,|${Math.abs(diff.r)}|,|${Math.abs(diff.s)}|) = ${d}</span></div>`;
                }
                this.draw();
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        // Color per distance ring
        ringColor(d, maxD) {
            if (maxD === 0) return { fill: 'rgba(34,211,238,0.25)', stroke: '#22d3ee' };
            const t = d / maxD;
            const r = Math.floor(33 + t * (240 - 33));
            const g = Math.floor(214 - t * 180);
            const b = Math.floor(198 - t * (198 - 210));
            return {
                fill: `rgba(${r},${g},${b},0.18)`,
                stroke: `rgb(${r},${g},${b})`
            };
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;
            const pathSet = new Set();
            let pathHexes = [];
            const refHex = this.start || null;
            let maxD = 0;

            if (refHex) {
                for (const h of this.grid) {
                    const d = Hex.distance(refHex, h);
                    if (d > maxD) maxD = d;
                }
            }

            if (this.start && this.end) {
                pathHexes = Hex.lineDraw(this.start, this.end);
                pathHexes.forEach(h => pathSet.add(Hex.key(h)));
            }

            for (const h of this.grid) {
                const isStart = this.start && Hex.eq(h, this.start);
                const isEnd = this.end && Hex.eq(h, this.end);
                const isPath = pathSet.has(Hex.key(h)) && !isStart && !isEnd;
                let fill = '#111827', stroke = '#1e293b', lw = 1;

                if (isStart) { fill = 'rgba(34,211,238,0.4)'; stroke = '#22d3ee'; lw = 2; }
                else if (isEnd) { fill = 'rgba(236,72,153,0.4)'; stroke = '#ec4899'; lw = 2; }
                else if (isPath) { fill = 'rgba(129,140,248,0.3)'; stroke = '#818cf8'; lw = 2; }
                else if (refHex) {
                    const d = Hex.distance(refHex, h);
                    const c = this.ringColor(d, maxD);
                    fill = c.fill; stroke = c.stroke; lw = 1;
                }
                drawHex(ctx, h, layout, fill, stroke, lw);

                // Distance label
                if (refHex) {
                    const d = Hex.distance(refHex, h);
                    const c = this.ringColor(d, maxD);
                    drawLabel(ctx, h, layout, '' + d, c.stroke, 11);
                }
            }

            if (pathHexes.length > 1) {
                drawPath(ctx, pathHexes, layout, '#ec4899', 2.5);
                // Dot at each step
                for (const h of pathHexes) {
                    const p = hexToPixel(h, layout);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#ec4899';
                    ctx.fill();
                }
            }
        }
    });

    // ========================================================================
    //  DEMO 4: LINE DRAWING
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, start: null, end: null,

        init() {
            this.canvas = document.getElementById('canvas-4');
            this.grid = Hex.hexagonalMap(4);
            this.canvas.addEventListener('click', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (!this.grid.some(h => Hex.eq(h, rounded))) return;
                if (!this.start || (this.start && this.end)) {
                    this.start = rounded; this.end = null;
                    document.getElementById('info-lines').textContent = 'Click second hex (end)';
                } else {
                    this.end = rounded;
                    const line = Hex.lineDraw(this.start, this.end);
                    document.getElementById('info-lines').innerHTML =
                        `<div>Start: <span>(${this.start.q},${this.start.r},${this.start.s})</span></div>` +
                        `<div>End: <span>(${this.end.q},${this.end.r},${this.end.s})</span></div>` +
                        `<div>Steps: <span>${line.length - 1}</span></div>` +
                        `<div>Method: <span>lerp + cube round</span></div>` +
                        `<div>Nudge: <span>ε = 1e-6</span></div>`;
                }
                this.draw();
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;
            let lineHexes = [];
            const lineSet = new Set();

            if (this.start && this.end) {
                lineHexes = Hex.lineDraw(this.start, this.end);
                lineHexes.forEach(h => lineSet.add(Hex.key(h)));
            }

            for (const h of this.grid) {
                const isStart = this.start && Hex.eq(h, this.start);
                const isEnd = this.end && Hex.eq(h, this.end);
                const isLine = lineSet.has(Hex.key(h)) && !isStart && !isEnd;
                let fill = '#111827', stroke = '#1e293b', lw = 1;
                if (isStart) { fill = 'rgba(34,211,238,0.35)'; stroke = '#22d3ee'; lw = 2; }
                else if (isEnd) { fill = 'rgba(236,72,153,0.35)'; stroke = '#ec4899'; lw = 2; }
                else if (isLine) { fill = 'rgba(129,140,248,0.25)'; stroke = '#818cf8'; lw = 2; }
                drawHex(ctx, h, layout, fill, stroke, lw);
            }

            // Draw the true geometric line between start and end centers
            if (this.start && this.end) {
                const ps = hexToPixel(this.start, layout);
                const pe = hexToPixel(this.end, layout);
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(236,72,153,0.35)';
                ctx.lineWidth = 1;
                ctx.setLineDash([6, 4]);
                ctx.moveTo(ps.x, ps.y);
                ctx.lineTo(pe.x, pe.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Draw hex path with numbered steps
            if (lineHexes.length > 1) {
                drawPath(ctx, lineHexes, layout, '#ec4899', 2.5);
            }
            for (let i = 0; i < lineHexes.length; i++) {
                const p = hexToPixel(lineHexes[i], layout);
                // Step number circle
                const radius = 9;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(6,9,16,0.8)';
                ctx.fill();
                ctx.strokeStyle = '#22d3ee';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.fillStyle = '#22d3ee';
                ctx.font = 'bold 10px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('' + i, p.x, p.y);
            }
        }
    });

    // ========================================================================
    //  DEMO 5: RANGE / FLOOD FILL
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, center: null, obstacles: new Set(),

        init() {
            this.canvas = document.getElementById('canvas-5');
            this.grid = Hex.hexagonalMap(5);
            this.obstacles = new Set();

            this.canvas.addEventListener('click', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (!this.grid.some(h => Hex.eq(h, rounded))) return;
                if (!this.obstacles.has(Hex.key(rounded))) {
                    this.center = rounded;
                    this.draw();
                    this.updateInfo();
                }
            });

            this.canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (!this.grid.some(h => Hex.eq(h, rounded))) return;
                const key = Hex.key(rounded);
                if (this.obstacles.has(key)) this.obstacles.delete(key);
                else this.obstacles.add(key);
                this.draw();
                this.updateInfo();
            });

            document.getElementById('range-slider').addEventListener('input', (e) => {
                document.getElementById('range-value').textContent = e.target.value;
                this.draw();
                this.updateInfo();
            });

            document.getElementById('range-clear').addEventListener('click', () => {
                this.obstacles.clear();
                this.draw();
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        // BFS with distance tracking
        reachableWithDist(start, movement) {
            const visited = new Map();
            visited.set(Hex.key(start), 0);
            const fringes = [[start]];
            for (let k = 1; k <= movement; k++) {
                fringes.push([]);
                for (const h of fringes[k - 1]) {
                    for (let dir = 0; dir < 6; dir++) {
                        const nb = Hex.neighbor(h, dir);
                        const key = Hex.key(nb);
                        if (!visited.has(key) && !this.obstacles.has(key)) {
                            visited.set(key, k);
                            fringes[k].push(nb);
                        }
                    }
                }
            }
            return visited;
        },

        updateInfo() {
            const el = document.getElementById('info-range');
            if (!this.center) { el.textContent = 'Click to set center'; return; }
            const range = parseInt(document.getElementById('range-slider').value);
            const reachable = this.reachableWithDist(this.center, range);
            const unrestricted = Hex.range(this.center, range).length;
            el.innerHTML = `<div>Center: <span>(${this.center.q},${this.center.r},${this.center.s})</span></div>` +
                `<div>Range: <span>${range}</span></div>` +
                `<div>Reachable: <span>${reachable.size}</span></div>` +
                `<div>Unrestricted: <span>${unrestricted}</span></div>` +
                `<div>Blocked: <span>${unrestricted - reachable.size}</span></div>` +
                `<div>Obstacles: <span>${this.obstacles.size}</span></div>`;
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;
            const range = parseInt(document.getElementById('range-slider').value);
            let reachDist = new Map();
            if (this.center) {
                reachDist = this.reachableWithDist(this.center, range);
            }

            for (const h of this.grid) {
                const key = Hex.key(h);
                const isCenter = this.center && Hex.eq(h, this.center);
                const isObs = this.obstacles.has(key);
                const dist = reachDist.get(key);
                const isReach = dist !== undefined;
                let fill = '#111827', stroke = '#1e293b', lw = 1;

                if (isObs) {
                    fill = 'rgba(236,72,153,0.35)'; stroke = '#ec4899'; lw = 2;
                } else if (isCenter) {
                    fill = 'rgba(34,211,238,0.4)'; stroke = '#22d3ee'; lw = 2;
                } else if (isReach) {
                    // Gradient from teal (close) to purple (far)
                    const t = dist / Math.max(range, 1);
                    const r = Math.floor(33 + t * (114 - 33));
                    const g = Math.floor(214 - t * 214);
                    const b = Math.floor(198 - t * (198 - 203));
                    fill = `rgba(${r},${g},${b},0.25)`;
                    stroke = `rgb(${r},${g},${b})`;
                    lw = 1.5;
                }
                drawHex(ctx, h, layout, fill, stroke, lw);

                // Show BFS distance inside reachable hexes
                if (isReach && !isCenter) {
                    drawLabel(ctx, h, layout, '' + dist, stroke, 9);
                }
                if (isObs) {
                    const p = hexToPixel(h, layout);
                    ctx.fillStyle = '#ec4899';
                    ctx.font = 'bold 14px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('×', p.x, p.y);
                }
            }
        }
    });

    // ========================================================================
    //  DEMO 6: RINGS & SPIRALS
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, animFrame: 0, animating: false, animTimer: null,

        init() {
            this.canvas = document.getElementById('canvas-6');
            this.grid = Hex.hexagonalMap(5);

            document.getElementById('ring-slider').addEventListener('input', (e) => {
                document.getElementById('ring-value').textContent = e.target.value;
                this.stopAnim();
                this.draw();
                this.updateInfo();
            });

            document.getElementById('spiral-toggle').addEventListener('change', () => {
                this.stopAnim();
                this.draw();
            });

            document.getElementById('ring-animate').addEventListener('click', () => {
                if (this.animating) { this.stopAnim(); return; }
                this.animFrame = 0;
                this.animating = true;
                document.getElementById('ring-animate').textContent = 'Stop';
                const tick = () => {
                    this.animFrame++;
                    this.draw();
                    const radius = parseInt(document.getElementById('ring-slider').value);
                    const total = document.getElementById('spiral-toggle').checked
                        ? Hex.spiral(Hex.cube(0, 0, 0), radius).length
                        : Hex.ring(Hex.cube(0, 0, 0), radius).length;
                    if (this.animFrame >= total) { this.stopAnim(); return; }
                    this.animTimer = setTimeout(tick, 100);
                };
                tick();
            });
        },

        stopAnim() {
            this.animating = false;
            clearTimeout(this.animTimer);
            document.getElementById('ring-animate').textContent = 'Animate';
            this.animFrame = 0;
            this.draw();
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
            this.updateInfo();
        },
        deactivate() { this.stopAnim(); },
        resize() { if (this._initialized) this.activate(); },

        updateInfo() {
            const radius = parseInt(document.getElementById('ring-slider').value);
            const ringHexes = Hex.ring(Hex.cube(0, 0, 0), radius);
            document.getElementById('info-rings').innerHTML =
                `<div>Ring radius: <span>${radius}</span></div>` +
                `<div>Ring hexes: <span>${ringHexes.length}</span></div>` +
                `<div>Spiral total: <span>${Hex.spiral(Hex.cube(0, 0, 0), radius).length}</span></div>`;
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const radius = parseInt(document.getElementById('ring-slider').value);
            const showSpiral = document.getElementById('spiral-toggle').checked;
            const center = Hex.cube(0, 0, 0);

            const target = showSpiral ? Hex.spiral(center, radius) : Hex.ring(center, radius);
            const targetSet = new Set(target.map(h => Hex.key(h)));

            for (const h of this.grid) {
                const key = Hex.key(h);
                drawHex(this.ctx, h, layout,
                    targetSet.has(key) ? 'rgba(99,102,241,0.15)' : '#111827',
                    '#1e293b', 1);
            }

            const limit = this.animating ? this.animFrame : target.length;
            for (let i = 0; i < Math.min(limit, target.length); i++) {
                const h = target[i];
                const t = i / Math.max(target.length - 1, 1);
                const r = Math.floor(33 + t * (240 - 33));
                const g = Math.floor(214 - t * 214);
                const b = Math.floor(198 - t * (198 - 210));
                drawHex(this.ctx, h, layout, `rgba(${r},${g},${b},0.35)`, `rgb(${r},${g},${b})`, 2);
                drawLabel(this.ctx, h, layout, '' + i, '#e2e8f0', 9);
            }
        }
    });

    // ========================================================================
    //  DEMO 7: ROTATION
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, selected: null,

        init() {
            this.canvas = document.getElementById('canvas-7');
            this.grid = Hex.hexagonalMap(3);
            this.canvas.addEventListener('click', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (this.grid.some(h => Hex.eq(h, rounded))) {
                    this.selected = rounded;
                    this.draw();
                    this.updateInfo();
                }
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        updateInfo() {
            const el = document.getElementById('info-rotation');
            if (!this.selected) { el.textContent = 'Click a hex to rotate'; return; }
            const rots = Hex.rotations(this.selected);
            let html = `<div>Selected: <span>(${this.selected.q},${this.selected.r},${this.selected.s})</span></div>`;
            html += `<div>Rotations:</div>`;
            rots.forEach((r, i) => {
                html += `<div>&nbsp;${i * 60}°: <span>(${r.q},${r.r},${r.s})</span></div>`;
            });
            el.innerHTML = html;
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const gridSet = new Set(this.grid.map(h => Hex.key(h)));
            const rotSet = new Set();
            const reflSet = new Set();

            if (this.selected) {
                Hex.rotations(this.selected).forEach(r => rotSet.add(Hex.key(r)));
                [Hex.reflectQ(this.selected), Hex.reflectR(this.selected), Hex.reflectS(this.selected)]
                    .forEach(r => reflSet.add(Hex.key(r)));
            }

            for (const h of this.grid) {
                const key = Hex.key(h);
                const isSel = this.selected && Hex.eq(h, this.selected);
                const isRot = rotSet.has(key) && !isSel;
                const isRefl = reflSet.has(key) && !isSel && !isRot;
                let fill = '#111827', stroke = '#1e293b', lw = 1;
                if (isSel) { fill = 'rgba(236,72,153,0.35)'; stroke = '#ec4899'; lw = 2; }
                else if (isRot) { fill = 'rgba(34,211,238,0.25)'; stroke = '#22d3ee'; lw = 2; }
                else if (isRefl) { fill = 'rgba(129,140,248,0.25)'; stroke = '#818cf8'; lw = 2; }
                drawHex(this.ctx, h, layout, fill, stroke, lw);
            }

            if (this.selected) {
                const rots = Hex.rotations(this.selected);
                rots.forEach((r, i) => {
                    if (gridSet.has(Hex.key(r))) {
                        drawLabel(this.ctx, r, layout, i * 60 + '°', '#22d3ee', 10);
                    }
                });
                // draw reflection axes through center
                const center = hexToPixel(Hex.cube(0, 0, 0), layout);
                this.ctx.setLineDash([4, 4]);
                this.ctx.strokeStyle = '#818cf8';
                this.ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    const angle = (SharedState.flat ? 0 : 30) + i * 60;
                    const rad = angle * Math.PI / 180;
                    const len = layout.size * 5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(center.x - Math.cos(rad) * len, center.y - Math.sin(rad) * len);
                    this.ctx.lineTo(center.x + Math.cos(rad) * len, center.y + Math.sin(rad) * len);
                    this.ctx.stroke();
                }
                this.ctx.setLineDash([]);
            }
        }
    });

    // ========================================================================
    //  DEMO 8: FIELD OF VIEW
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, viewer: null, walls: new Set(),

        init() {
            this.canvas = document.getElementById('canvas-8');
            this.grid = Hex.hexagonalMap(5);
            this.walls = new Set();

            this.canvas.addEventListener('click', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (!this.grid.some(h => Hex.eq(h, rounded))) return;
                if (!this.walls.has(Hex.key(rounded))) {
                    this.viewer = rounded;
                    this.draw();
                    this.updateInfo();
                }
            });

            this.canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (!this.grid.some(h => Hex.eq(h, rounded))) return;
                const key = Hex.key(rounded);
                if (this.walls.has(key)) this.walls.delete(key);
                else this.walls.add(key);
                this.draw();
                this.updateInfo();
            });

            document.getElementById('fov-slider').addEventListener('input', (e) => {
                document.getElementById('fov-value').textContent = e.target.value;
                this.draw();
                this.updateInfo();
            });

            document.getElementById('fov-clear').addEventListener('click', () => {
                this.walls.clear();
                this.draw();
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        computeFOV() {
            if (!this.viewer) return new Set();
            const range = parseInt(document.getElementById('fov-slider').value);
            const visible = new Set();
            visible.add(Hex.key(this.viewer));
            // Also cast rays to intermediate rings for better coverage
            for (let r = 1; r <= range; r++) {
                const ring = Hex.ring(this.viewer, r);
                for (const target of ring) {
                    const line = Hex.lineDraw(this.viewer, target);
                    for (const h of line) {
                        const key = Hex.key(h);
                        if (this.walls.has(key)) {
                            visible.add(key);
                            break;
                        }
                        visible.add(key);
                    }
                }
            }
            return visible;
        },

        updateInfo() {
            const el = document.getElementById('info-fov');
            if (!this.viewer) { el.textContent = 'Click to set viewer'; return; }
            const vis = this.computeFOV();
            const range = parseInt(document.getElementById('fov-slider').value);
            const totalInRange = Hex.range(this.viewer, range).length;
            el.innerHTML = `<div>Viewer: <span>(${this.viewer.q},${this.viewer.r},${this.viewer.s})</span></div>` +
                `<div>Vision range: <span>${range}</span></div>` +
                `<div>Visible: <span>${vis.size}</span></div>` +
                `<div>In range: <span>${totalInRange}</span></div>` +
                `<div>Shadow: <span>${totalInRange - vis.size}</span></div>` +
                `<div>Walls: <span>${this.walls.size}</span></div>`;
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;
            const visible = this.computeFOV();
            const range = this.viewer ? parseInt(document.getElementById('fov-slider').value) : 0;
            const inRangeSet = this.viewer
                ? new Set(Hex.range(this.viewer, range).map(h => Hex.key(h)))
                : new Set();

            for (const h of this.grid) {
                const key = Hex.key(h);
                const isViewer = this.viewer && Hex.eq(h, this.viewer);
                const isWall = this.walls.has(key);
                const isVisible = visible.has(key);
                const inRange = inRangeSet.has(key);
                let fill, stroke, lw = 1;

                if (isWall && isVisible) {
                    // Wall that's visible — bright wall
                    fill = 'rgba(236,72,153,0.5)'; stroke = '#ec4899'; lw = 2;
                } else if (isWall) {
                    // Wall in shadow
                    fill = 'rgba(236,72,153,0.15)'; stroke = 'rgba(236,72,153,0.4)'; lw = 1.5;
                } else if (isViewer) {
                    fill = 'rgba(34,211,238,0.45)'; stroke = '#22d3ee'; lw = 2.5;
                } else if (isVisible) {
                    // Lit — brightness fades with distance
                    const d = this.viewer ? Hex.distance(this.viewer, h) : 0;
                    const t = d / Math.max(range, 1);
                    const alpha = 0.3 - t * 0.15;
                    fill = `rgba(34,211,238,${alpha})`; stroke = `rgba(34,211,238,${0.7 - t * 0.3})`; lw = 1;
                } else if (inRange) {
                    // In range but shadowed
                    fill = '#060910'; stroke = '#0a0e17'; lw = 1;
                } else {
                    // Out of range
                    fill = '#060910'; stroke = '#0a0e17'; lw = 0.5;
                }
                drawHex(ctx, h, layout, fill, stroke, lw);

                if (isWall && isVisible) {
                    const p = hexToPixel(h, layout);
                    ctx.fillStyle = '#ec4899';
                    ctx.font = 'bold 14px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('▓', p.x, p.y);
                }
            }

            // Viewer glow effect
            if (this.viewer) {
                const vc = hexToPixel(this.viewer, layout);
                const grad = ctx.createRadialGradient(vc.x, vc.y, 0, vc.x, vc.y, layout.size * range * 2);
                grad.addColorStop(0, 'rgba(34,211,238,0.08)');
                grad.addColorStop(1, 'rgba(34,211,238,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, this.w, this.h);

                // Eye icon at viewer
                ctx.fillStyle = '#22d3ee';
                ctx.font = 'bold 16px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('◉', vc.x, vc.y);
            }
        }
    });

    // ========================================================================
    //  DEMO 9: A* PATHFINDING
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null, gridSet: null,
        start: null, end: null, walls: new Set(),
        result: null, animFrame: 0, animating: false, animTimer: null,
        clickState: 0, // 0=set start, 1=set end, 2=toggle walls

        init() {
            this.canvas = document.getElementById('canvas-9');
            this.grid = Hex.hexagonalMap(5);
            this.gridSet = new Set(this.grid.map(h => Hex.key(h)));
            this.walls = new Set();

            this.canvas.addEventListener('click', (e) => {
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (!this.gridSet.has(Hex.key(rounded))) return;
                if (this.walls.has(Hex.key(rounded))) return;

                if (this.clickState === 0) {
                    this.start = rounded;
                    this.end = null;
                    this.result = null;
                    this.clickState = 1;
                    document.getElementById('info-path').textContent = 'Click to set end';
                } else if (this.clickState === 1) {
                    this.end = rounded;
                    this.clickState = 2;
                    this.runPathfinding();
                    document.getElementById('info-path').textContent = 'Right-click to add walls, click to reset';
                } else {
                    this.clickState = 0;
                    this.start = rounded;
                    this.end = null;
                    this.result = null;
                    this.stopAnim();
                    this.clickState = 1;
                    document.getElementById('info-path').textContent = 'Click to set end';
                }
                this.draw();
            });

            this.canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.layout));
                if (!this.gridSet.has(Hex.key(rounded))) return;
                const key = Hex.key(rounded);
                if (this.start && Hex.eq(rounded, this.start)) return;
                if (this.end && Hex.eq(rounded, this.end)) return;
                if (this.walls.has(key)) this.walls.delete(key);
                else this.walls.add(key);
                if (this.start && this.end) this.runPathfinding();
                this.draw();
            });

            document.getElementById('heuristic-select').addEventListener('change', () => {
                if (this.start && this.end) { this.runPathfinding(); this.draw(); }
            });

            document.getElementById('path-animate').addEventListener('click', () => {
                if (!this.result || !this.result.explored.length) return;
                if (this.animating) { this.stopAnim(); return; }
                this.animFrame = 0;
                this.animating = true;
                document.getElementById('path-animate').textContent = 'Stop';
                const tick = () => {
                    this.animFrame++;
                    this.draw();
                    if (this.animFrame >= this.result.explored.length) { this.stopAnim(); return; }
                    this.animTimer = setTimeout(tick, 40);
                };
                tick();
            });

            document.getElementById('path-clear').addEventListener('click', () => {
                this.start = null; this.end = null; this.walls.clear();
                this.result = null; this.clickState = 0;
                this.stopAnim();
                document.getElementById('info-path').textContent = 'Click to set start';
                this.draw();
            });
        },

        stopAnim() {
            this.animating = false;
            clearTimeout(this.animTimer);
            document.getElementById('path-animate').textContent = 'Animate';
        },

        runPathfinding() {
            const hType = document.getElementById('heuristic-select').value;
            this.result = astar(this.start, this.end, this.walls, this.gridSet, hType, this.layout);
            const el = document.getElementById('info-path');
            el.innerHTML = `<div>Path length: <span>${this.result.path.length > 0 ? this.result.path.length - 1 : 'none'}</span></div>` +
                `<div>Explored: <span>${this.result.explored.length}</span></div>` +
                `<div>Heuristic: <span>${hType}</span></div>`;
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() { this.stopAnim(); },
        resize() { if (this._initialized) this.activate(); },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;
            const pathSet = new Set();
            const exploredMap = new Map();

            if (this.result) {
                this.result.path.forEach(h => pathSet.add(Hex.key(h)));
                const limit = this.animating ? this.animFrame : this.result.explored.length;
                for (let i = 0; i < Math.min(limit, this.result.explored.length); i++) {
                    exploredMap.set(Hex.key(this.result.explored[i]), i);
                }
            }

            const maxExplored = this.result ? this.result.explored.length : 1;

            for (const h of this.grid) {
                const key = Hex.key(h);
                const isStart = this.start && Hex.eq(h, this.start);
                const isEnd = this.end && Hex.eq(h, this.end);
                const isWall = this.walls.has(key);
                const isPath = pathSet.has(key) && !isStart && !isEnd;
                const exploreIdx = exploredMap.get(key);
                const isExplored = exploreIdx !== undefined && !isPath && !isStart && !isEnd;
                let fill = '#111827', stroke = '#1e293b', lw = 1;

                if (isWall) {
                    fill = '#111827'; stroke = '#ec4899'; lw = 2;
                } else if (isStart) {
                    fill = 'rgba(34,211,238,0.45)'; stroke = '#22d3ee'; lw = 2.5;
                } else if (isEnd) {
                    fill = 'rgba(236,72,153,0.45)'; stroke = '#ec4899'; lw = 2.5;
                } else if (isPath) {
                    fill = 'rgba(34,211,238,0.3)'; stroke = '#22d3ee'; lw = 2;
                } else if (isExplored) {
                    // Color by exploration order — early = purple, late = teal
                    const t = exploreIdx / maxExplored;
                    const r = Math.floor(114 - t * 80);
                    const g = Math.floor(t * 160);
                    const b = Math.floor(203 - t * 40);
                    fill = `rgba(${r},${g},${b},0.15)`;
                    stroke = `rgba(${r},${g},${b},0.6)`;
                    lw = 1;
                }
                drawHex(ctx, h, layout, fill, stroke, lw);

                if (isWall) {
                    const p = hexToPixel(h, layout);
                    ctx.fillStyle = '#ec4899';
                    ctx.font = 'bold 14px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('×', p.x, p.y);
                }
            }

            // Draw path with directional markers
            if (this.result && this.result.path.length > 1 && !this.animating) {
                drawPath(ctx, this.result.path, layout, '#22d3ee', 3);
                // Step dots along path
                for (let i = 0; i < this.result.path.length; i++) {
                    const p = hexToPixel(this.result.path[i], layout);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                    ctx.fillStyle = '#22d3ee';
                    ctx.fill();
                }
            }

            // Labels for start/end
            if (this.start) {
                const p = hexToPixel(this.start, layout);
                ctx.fillStyle = '#22d3ee';
                ctx.font = 'bold 13px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('S', p.x, p.y);
            }
            if (this.end) {
                const p = hexToPixel(this.end, layout);
                ctx.fillStyle = '#ec4899';
                ctx.font = 'bold 13px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('E', p.x, p.y);
            }
        }
    });

    // ========================================================================
    //  DEMO 10: MAP SHAPES
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, cachedLayout: null, cachedHexes: null, hovered: null,

        init() {
            this.canvas = document.getElementById('canvas-10');

            document.getElementById('shape-select').addEventListener('change', () => {
                this.cachedLayout = null;
                this.draw();
            });
            document.getElementById('shape-slider').addEventListener('input', (e) => {
                document.getElementById('shape-value').textContent = e.target.value;
                this.cachedLayout = null;
                this.draw();
            });

            this.canvas.addEventListener('mousemove', (e) => {
                if (!this.cachedLayout || !this.cachedHexes) return;
                const pos = getCanvasMousePos(this.canvas, e);
                const rounded = Hex.round(pixelToHex(pos, this.cachedLayout));
                const prev = this.hovered;
                this.hovered = this.cachedHexes.some(h => Hex.eq(h, rounded)) ? rounded : null;
                if (!prev && !this.hovered) return;
                if (prev && this.hovered && Hex.eq(prev, this.hovered)) return;
                this.draw();
            });
            this.canvas.addEventListener('mouseleave', () => {
                if (this.hovered) { this.hovered = null; this.draw(); }
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.cachedLayout = null;
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        getShapeHexes() {
            const shape = document.getElementById('shape-select').value;
            const size = parseInt(document.getElementById('shape-slider').value);
            switch (shape) {
                case 'hexagonal': return Hex.hexagonalMap(size);
                case 'rectangular': return Hex.rectangularMap(size * 2, size * 2);
                case 'triangular': return Hex.triangularMap(size);
                case 'rhombus': return Hex.rhombusMap(size, size);
                default: return [];
            }
        },

        computeLayout(hexes) {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            const baseLayout = {
                orientation: SharedState.orientation,
                size: SharedState.hexSize,
                origin: { x: 0, y: 0 }
            };
            for (const h of hexes) {
                const p = hexToPixel(h, baseLayout);
                minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
            }
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            return {
                orientation: SharedState.orientation,
                size: SharedState.hexSize,
                origin: { x: this.w / 2 - cx, y: this.h / 2 - cy }
            };
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const ctx = this.ctx;
            const hexes = this.getShapeHexes();
            this.cachedHexes = hexes;

            if (!this.cachedLayout) {
                this.cachedLayout = this.computeLayout(hexes);
            }
            const layout = this.cachedLayout;

            const shape = document.getElementById('shape-select').value;
            const size = parseInt(document.getElementById('shape-slider').value);
            const descriptions = {
                hexagonal: `Radius ${size}, all hexes where max(|q|,|r|,|s|) ≤ ${size}`,
                rectangular: `${size * 2}×${size * 2} grid with offset rows`,
                triangular: `Side length ${size}, q ≥ 0, r ≥ 0, q+r ≤ ${size}`,
                rhombus: `${size}×${size}, 0 ≤ q < ${size}, 0 ≤ r < ${size}`
            };

            document.getElementById('info-shapes').innerHTML =
                `<div>Shape: <span>${shape}</span></div>` +
                `<div>Hexes: <span>${hexes.length}</span></div>` +
                `<div>Rule: <span>${descriptions[shape] || ''}</span></div>`;

            // Draw outline border of shape for clarity
            const hexSet = new Set(hexes.map(h => Hex.key(h)));

            for (const h of hexes) {
                const isHov = this.hovered && Hex.eq(h, this.hovered);
                const isBorder = Hex.neighbors(h).some(n => !hexSet.has(Hex.key(n)));

                let fill, stroke, lw;
                if (isHov) {
                    fill = 'rgba(34,211,238,0.3)'; stroke = '#22d3ee'; lw = 2;
                } else if (isBorder) {
                    fill = 'rgba(99,102,241,0.25)'; stroke = '#818cf8'; lw = 1.5;
                } else {
                    fill = 'rgba(99,102,241,0.12)'; stroke = '#334155'; lw = 1;
                }
                drawHex(ctx, h, layout, fill, stroke, lw);
                drawLabel(ctx, h, layout, `${h.q},${h.r}`, isHov ? '#22d3ee' : '#94a3b8', 8);
            }
        }
    });

    // ========================================================================
    //  DEMO 11: PIXEL-HEX CONVERSION
    // ========================================================================
    registerDemo({
        _initialized: false,
        canvas: null, ctx: null, w: 0, h: 0,
        layout: null, grid: null,
        mousePos: null, fracHex: null, roundedHex: null,

        init() {
            this.canvas = document.getElementById('canvas-11');
            this.grid = Hex.hexagonalMap(4);

            this.canvas.addEventListener('mousemove', (e) => {
                this.mousePos = getCanvasMousePos(this.canvas, e);
                this.fracHex = pixelToHex(this.mousePos, this.layout);
                this.roundedHex = Hex.round(this.fracHex);
                this.draw();
                this.updateInfo();
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.mousePos = null;
                this.fracHex = null;
                this.roundedHex = null;
                this.draw();
                document.getElementById('px-pixel').textContent = '—';
                document.getElementById('px-frac').textContent = '—';
                document.getElementById('px-round').textContent = '—';
            });
        },

        activate() {
            const r = setupCanvas(this.canvas);
            this.ctx = r.ctx; this.w = r.w; this.h = r.h;
            this.layout = makeLayout(this.canvas);
            this.draw();
        },
        deactivate() {},
        resize() { if (this._initialized) this.activate(); },

        updateInfo() {
            if (!this.mousePos) return;
            const f = this.fracHex;
            const rd = this.roundedHex;
            document.getElementById('px-pixel').textContent =
                `(${this.mousePos.x.toFixed(1)}, ${this.mousePos.y.toFixed(1)})`;
            document.getElementById('px-frac').textContent =
                `(${f.q.toFixed(3)}, ${f.r.toFixed(3)}, ${f.s.toFixed(3)})`;
            const dq = Math.abs(rd.q - f.q).toFixed(3);
            const dr = Math.abs(rd.r - f.r).toFixed(3);
            const ds = Math.abs(rd.s - f.s).toFixed(3);
            document.getElementById('px-round').textContent =
                `(${rd.q}, ${rd.r}, ${rd.s})  Δ(${dq}, ${dr}, ${ds})`;
        },

        draw() {
            clearCanvas(this.ctx, this.w, this.h);
            const layout = this.layout;
            const ctx = this.ctx;

            // Draw all grid hexes
            for (const h of this.grid) {
                const isHov = this.roundedHex && Hex.eq(h, this.roundedHex);
                drawHex(ctx, h, layout,
                    isHov ? 'rgba(34,211,238,0.25)' : '#111827',
                    isHov ? '#22d3ee' : '#1e293b', isHov ? 2 : 1);
                drawLabel(ctx, h, layout, `${h.q},${h.r}`, '#94a3b8', 9);
            }

            if (this.mousePos && this.fracHex) {
                const f = this.fracHex;
                const inGrid = this.grid.some(h => Hex.eq(h, this.roundedHex));

                // Draw crosshair
                ctx.strokeStyle = 'rgba(236,72,153,0.4)';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(this.mousePos.x, 0);
                ctx.lineTo(this.mousePos.x, this.h);
                ctx.moveTo(0, this.mousePos.y);
                ctx.lineTo(this.w, this.mousePos.y);
                ctx.stroke();
                ctx.setLineDash([]);

                // Draw line from grid center (origin) to mouse to show conversion
                const origin = layout.origin;
                ctx.strokeStyle = 'rgba(129,140,248,0.3)';
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 4]);
                ctx.beginPath();
                ctx.moveTo(origin.x, origin.y);
                ctx.lineTo(this.mousePos.x, this.mousePos.y);
                ctx.stroke();
                ctx.setLineDash([]);

                // If hovering a valid hex, show the rounded hex center
                if (inGrid) {
                    const rc = hexToPixel(this.roundedHex, layout);
                    // Line from mouse to rounded center
                    ctx.strokeStyle = 'rgba(34,211,238,0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(this.mousePos.x, this.mousePos.y);
                    ctx.lineTo(rc.x, rc.y);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Rounded center dot
                    ctx.beginPath();
                    ctx.arc(rc.x, rc.y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = '#22d3ee';
                    ctx.fill();
                }

                // Mouse dot
                ctx.beginPath();
                ctx.arc(this.mousePos.x, this.mousePos.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#ec4899';
                ctx.fill();
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Fractional coords label near mouse
                ctx.fillStyle = '#e2e8f0';
                ctx.font = '10px monospace';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                ctx.fillText(
                    `frac: (${f.q.toFixed(2)}, ${f.r.toFixed(2)})`,
                    this.mousePos.x + 10, this.mousePos.y - 4
                );
            }
        }
    });

    // ========================================================================
    //  INITIALIZATION
    // ========================================================================
    function init() {
        // Tab switching
        document.getElementById('tab-bar').addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (!tab) return;
            switchDemo(parseInt(tab.dataset.tab));
        });

        // Orientation toggle
        document.getElementById('orientation-toggle').addEventListener('click', () => {
            SharedState.flat = !SharedState.flat;
            document.getElementById('orientation-toggle').textContent =
                SharedState.flat ? 'Flat Top' : 'Pointy Top';
            SharedState.notify();
        });

        // Hex size slider
        document.getElementById('hex-size-slider').addEventListener('input', (e) => {
            SharedState.hexSize = parseInt(e.target.value);
            document.getElementById('hex-size-value').textContent = e.target.value;
            SharedState.notify();
        });

        // SharedState change handler — re-activate current demo
        SharedState.onChange(() => {
            if (demos[activeDemo] && demos[activeDemo]._initialized) {
                demos[activeDemo].activate();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (demos[activeDemo] && demos[activeDemo]._initialized) {
                demos[activeDemo].resize();
            }
        });

        // Initialize first demo
        switchDemo(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
