/* ───────────────────────────────────────────────────────
   engine.js — Isometric math, grid state, camera,
   rendering pipeline, tool system, perspective modes
   ─────────────────────────────────────────────────────── */

(function () {
    'use strict';

    // ─── Constants ──────────────────────────────────────
    const BASE_TILE_W = 64;
    const BASE_TILE_H = 32;
    const ELEV_H = 16;           // pixels per elevation unit at zoom 1
    const DEFAULT_GRID = 16;

    // ─── Color Helpers ──────────────────────────────────

    function hexToRgb(hex) {
        const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [128, 128, 128];
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
    }

    function darken(hex, factor) {
        const [r, g, b] = hexToRgb(hex);
        return rgbToHex(r * (1 - factor), g * (1 - factor), b * (1 - factor));
    }

    function lighten(hex, factor) {
        const [r, g, b] = hexToRgb(hex);
        return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
    }

    function blend(hex1, hex2, t) {
        const [r1, g1, b1] = hexToRgb(hex1);
        const [r2, g2, b2] = hexToRgb(hex2);
        return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
    }

    // Shift hue for perception deception — rotate RGB channels
    function hueShift(hex, degrees) {
        const [r, g, b] = hexToRgb(hex);
        const rad = (degrees * Math.PI) / 180;
        const cos = Math.cos(rad), sin = Math.sin(rad);
        const nr = r * (0.213 + 0.787 * cos - 0.213 * sin)
                 + g * (0.715 - 0.715 * cos - 0.715 * sin)
                 + b * (0.072 - 0.072 * cos + 0.928 * sin);
        const ng = r * (0.213 - 0.213 * cos + 0.143 * sin)
                 + g * (0.715 + 0.285 * cos + 0.140 * sin)
                 + b * (0.072 - 0.072 * cos - 0.283 * sin);
        const nb = r * (0.213 - 0.213 * cos - 0.787 * sin)
                 + g * (0.715 - 0.715 * cos + 0.715 * sin)
                 + b * (0.072 + 0.928 * cos + 0.072 * sin);
        return rgbToHex(nr, ng, nb);
    }

    // ─── Perspective Mode Definitions ───────────────────
    // Each mode defines how the 6 sub-triangles of an iso diamond
    // are colored to create specific perceptual illusions

    const PERSPECTIVE_MODES = {
        none: {
            name: 'Standard',
            desc: 'Flat isometric — no sub-triangle decomposition',
            fn: null
        },
        cube: {
            name: 'Necker Cube',
            desc: 'Classic ambiguous cube — top/left/right faces create reversible depth',
            fn(baseColor, col, row, theme) {
                const top = baseColor;
                const left = darken(baseColor, 0.25);
                const right = darken(baseColor, 0.45);
                // 6 triangles: top-left, top-right (top face), mid-left-upper, mid-left-lower (left face), mid-right-upper, mid-right-lower (right face)
                return [top, top, left, left, right, right];
            }
        },
        gradient: {
            name: 'Depth Gradient',
            desc: 'Warm-to-cool gradient simulates atmospheric perspective',
            fn(baseColor, col, row, theme) {
                const maxDist = DEFAULT_GRID * 1.4;
                const dist = (col + row) / maxDist;
                const warm = '#FF6B35';
                const cool = '#2176AE';
                const c1 = blend(warm, cool, dist);
                const c2 = darken(c1, 0.15);
                const c3 = darken(c1, 0.30);
                return [c1, lighten(c1, 0.1), c2, darken(c2, 0.1), c3, darken(c3, 0.1)];
            }
        },
        tricolor: {
            name: 'Tricolor Split',
            desc: 'RGB primary decomposition — each face pair is a distinct primary',
            fn(baseColor, col, row, theme) {
                return ['#E63946', '#E63946', '#2A9D8F', '#2A9D8F', '#264653', '#264653'];
            }
        },
        checkerCube: {
            name: 'Checker Cubes',
            desc: 'Alternating light/dark per tile creates Vasarely-style op-art',
            fn(baseColor, col, row, theme) {
                const light = (col + row) % 2 === 0;
                const base = light ? lighten(baseColor, 0.3) : darken(baseColor, 0.2);
                return [base, base, darken(base, 0.2), darken(base, 0.2), darken(base, 0.4), darken(base, 0.4)];
            }
        },
        penrose: {
            name: 'Penrose Tiling',
            desc: 'Adjacent-face color contradictions create impossible-object illusion',
            fn(baseColor, col, row, theme) {
                // Alternate which "face" appears lit to break consistent lighting
                const phase = (col * 3 + row * 7) % 6;
                const colors = [
                    lighten(baseColor, 0.35),
                    darken(baseColor, 0.1),
                    darken(baseColor, 0.3),
                    lighten(baseColor, 0.2),
                    darken(baseColor, 0.45),
                    lighten(baseColor, 0.1),
                ];
                // Rotate color assignment by phase
                return colors.map((_, i) => colors[(i + phase) % 6]);
            }
        },
        spectrum: {
            name: 'Hue Spectrum',
            desc: 'Each triangle gets progressive hue rotation — chromatic dispersion',
            fn(baseColor, col, row, theme) {
                return [0, 60, 120, 180, 240, 300].map(deg => hueShift(baseColor, deg + (col + row) * 15));
            }
        },
    };

    // ─── Iso Math ───────────────────────────────────────

    function gridToScreen(col, row, elev) {
        const sx = (col - row) * BASE_TILE_W / 2;
        const sy = (col + row) * BASE_TILE_H / 2 - elev * ELEV_H;
        return { x: sx, y: sy };
    }

    function screenToGrid(sx, sy) {
        const col = Math.round(sx / BASE_TILE_W + sy / BASE_TILE_H);
        const row = Math.round(sy / BASE_TILE_H - sx / BASE_TILE_W);
        return { col, row };
    }

    function depthKey(col, row, elev, layer) {
        return (col + row) * 10000 + (elev || 0) * 10 + (layer || 0);
    }

    // ─── Grid State (Observable) ────────────────────────

    const GridState = {
        tiles: new Map(),
        entities: new Map(),
        selection: new Set(),
        hovered: null,
        gridSize: DEFAULT_GRID,
        listeners: [],

        onChange(fn) { this.listeners.push(fn); },
        notify() { this.listeners.forEach(fn => fn()); },

        setTile(col, row, type, elevation, color) {
            const key = col + ',' + row;
            this.tiles.set(key, { col, row, type: type || 'ground', elevation: elevation || 0, color: color || null });
            this.notify();
        },

        removeTile(col, row) {
            this.tiles.delete(col + ',' + row);
            this.entities.delete(col + ',' + row);
            this.notify();
        },

        getTile(col, row) {
            return this.tiles.get(col + ',' + row) || null;
        },

        setEntity(col, row, label, color) {
            const key = col + ',' + row;
            this.entities.set(key, { col, row, label, color: color || null });
            this.notify();
        },

        removeEntity(col, row) {
            this.entities.delete(col + ',' + row);
            this.notify();
        },

        clearAll() {
            this.tiles.clear();
            this.entities.clear();
            this.selection.clear();
            this.hovered = null;
            this.notify();
        },

        selectTile(key, additive) {
            if (!additive) this.selection.clear();
            if (this.selection.has(key)) this.selection.delete(key);
            else this.selection.add(key);
            this.notify();
        },

        selectRect(c1, r1, c2, r2) {
            this.selection.clear();
            const minC = Math.min(c1, c2), maxC = Math.max(c1, c2);
            const minR = Math.min(r1, r2), maxR = Math.max(r1, r2);
            for (let c = minC; c <= maxC; c++)
                for (let r = minR; r <= maxR; r++) {
                    const key = c + ',' + r;
                    if (this.tiles.has(key)) this.selection.add(key);
                }
            this.notify();
        },

        fillArea(c1, r1, c2, r2, type) {
            const minC = Math.min(c1, c2), maxC = Math.max(c1, c2);
            const minR = Math.min(r1, r2), maxR = Math.max(r1, r2);
            for (let c = minC; c <= maxC; c++)
                for (let r = minR; r <= maxR; r++)
                    this.tiles.set(c + ',' + r, { col: c, row: r, type, elevation: 0, color: null });
            this.notify();
        },

        initGrid(size) {
            this.gridSize = size || DEFAULT_GRID;
            this.tiles.clear();
            this.entities.clear();
            this.selection.clear();
            for (let c = 0; c < this.gridSize; c++)
                for (let r = 0; r < this.gridSize; r++)
                    this.tiles.set(c + ',' + r, { col: c, row: r, type: 'ground', elevation: 0, color: null });
            this.notify();
        },

        toJSON() {
            const tiles = [];
            this.tiles.forEach(t => tiles.push(t));
            const entities = [];
            this.entities.forEach(e => entities.push(e));
            return { gridSize: this.gridSize, tiles, entities };
        },

        fromJSON(data) {
            this.tiles.clear();
            this.entities.clear();
            this.selection.clear();
            this.gridSize = data.gridSize || DEFAULT_GRID;
            (data.tiles || []).forEach(t => this.tiles.set(t.col + ',' + t.row, t));
            (data.entities || []).forEach(e => this.entities.set(e.col + ',' + e.row, e));
            this.notify();
        }
    };

    // ─── Camera ─────────────────────────────────────────

    const Camera = {
        offsetX: 0,
        offsetY: 0,
        zoom: 1.0,
        minZoom: 0.25,
        maxZoom: 4.0,
        dragging: false,
        dragStart: null,
        dragOffset: null,

        screenToWorld(sx, sy) {
            return {
                x: (sx - this.offsetX) / this.zoom,
                y: (sy - this.offsetY) / this.zoom,
            };
        },

        worldToScreen(wx, wy) {
            return {
                x: wx * this.zoom + this.offsetX,
                y: wy * this.zoom + this.offsetY,
            };
        },

        zoomAt(sx, sy, delta) {
            const oldZoom = this.zoom;
            const factor = delta > 0 ? 0.9 : 1.1;
            this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
            // Keep point under cursor fixed
            this.offsetX = sx - (sx - this.offsetX) * (this.zoom / oldZoom);
            this.offsetY = sy - (sy - this.offsetY) * (this.zoom / oldZoom);
        },

        startDrag(sx, sy) {
            this.dragging = true;
            this.dragStart = { x: sx, y: sy };
            this.dragOffset = { x: this.offsetX, y: this.offsetY };
        },

        moveDrag(sx, sy) {
            if (!this.dragging) return;
            this.offsetX = this.dragOffset.x + (sx - this.dragStart.x);
            this.offsetY = this.dragOffset.y + (sy - this.dragStart.y);
        },

        endDrag() {
            this.dragging = false;
        },

        zoomToFit(canvasW, canvasH) {
            if (GridState.tiles.size === 0) return;
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            GridState.tiles.forEach(t => {
                const p = gridToScreen(t.col, t.row, t.elevation);
                // Account for tile diamond extents
                minX = Math.min(minX, p.x - BASE_TILE_W / 2);
                maxX = Math.max(maxX, p.x + BASE_TILE_W / 2);
                minY = Math.min(minY, p.y - ELEV_H * t.elevation);
                maxY = Math.max(maxY, p.y + BASE_TILE_H);
            });
            const gridW = maxX - minX;
            const gridH = maxY - minY;
            const pad = 60;
            this.zoom = Math.min(
                (canvasW - pad * 2) / gridW,
                (canvasH - pad * 2) / gridH,
                this.maxZoom
            );
            this.zoom = Math.max(this.minZoom, this.zoom);
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            this.offsetX = canvasW / 2 - cx * this.zoom;
            this.offsetY = canvasH / 2 - cy * this.zoom;
        }
    };

    // ─── Tile Color Resolution ──────────────────────────

    function tileBaseColor(tile, theme) {
        if (tile.color) return tile.color;
        const map = {
            ground: theme.tileGround,
            grass: theme.tileGrass,
            water: theme.tileWater,
            stone: theme.tileStone,
            building: theme.tileBuilding,
            accent: theme.tileAccent,
        };
        return map[tile.type] || theme.tileGround;
    }

    // ─── Rendering ──────────────────────────────────────

    let perspectiveMode = 'none';
    let showCoords = false;
    let showGridLines = true;

    function drawDiamond(ctx, cx, cy, w, h) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - h / 2);
        ctx.lineTo(cx + w / 2, cy);
        ctx.lineTo(cx, cy + h / 2);
        ctx.lineTo(cx - w / 2, cy);
        ctx.closePath();
    }

    // Draw the 6 sub-triangles of an iso diamond (top face)
    // Triangle order: top-left, top-right, right-upper, right-lower, bottom-left, bottom-right
    // Actually: we split the diamond into 6 triangles radiating from center
    function drawSubTriangles(ctx, cx, cy, w, h, colors) {
        const pts = [
            { x: cx, y: cy - h / 2 },         // top
            { x: cx + w / 2, y: cy },          // right
            { x: cx, y: cy + h / 2 },          // bottom
            { x: cx - w / 2, y: cy },          // left
        ];
        // 4 triangles from center to each edge, then split top and bottom in half
        // Actually 6 triangles: we add midpoints of top-right and top-left edges
        const midTR = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        const midBR = { x: (pts[1].x + pts[2].x) / 2, y: (pts[1].y + pts[2].y) / 2 };
        const midBL = { x: (pts[2].x + pts[3].x) / 2, y: (pts[2].y + pts[3].y) / 2 };
        const midTL = { x: (pts[3].x + pts[0].x) / 2, y: (pts[3].y + pts[0].y) / 2 };
        const center = { x: cx, y: cy };

        const triangles = [
            [pts[0], midTR, center],    // top-right triangle
            [midTR, pts[1], center],    // right-upper triangle
            [pts[1], midBR, center],    // right-lower triangle
            [midBR, pts[2], center],    // bottom-right triangle
            [pts[2], midBL, center],    // bottom-left triangle (mapped to left face)
            [midBL, pts[3], center],    // left-lower triangle
            // We have 8 sub-triangles with midpoints; let's just use 6 by splitting at midpoints of 2 edges
        ];

        // Simpler: 6 triangles from center, splitting top-bottom and left-right edges
        const tris = [
            [center, pts[0], midTR],     // 0: top face - upper right
            [center, midTR, pts[1]],     // 1: top face - right
            [center, pts[1], midBR],     // 2: right face - upper
            [center, midBR, pts[2]],     // 3: right face - lower
            [center, pts[2], midBL],     // 4: left face - lower
            [center, midBL, pts[3]],     // 5: left face - upper
            // Missing: center, pts[3], midTL and center, midTL, pts[0]
        ];

        // Actually let's do the clean 6: divide the diamond into 6 equal-ish triangles
        // by using 6 vertices: top, top-right-mid, right, bottom, bottom-left-mid, left
        // This gives us exactly 6 triangles from center
        const verts = [pts[0], midTR, pts[1], pts[2], midBL, pts[3]];

        for (let i = 0; i < 6; i++) {
            const v1 = verts[i];
            const v2 = verts[(i + 1) % 6];
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
        }
    }

    function drawTile(ctx, tile, theme, tw, th, eh) {
        const pos = gridToScreen(tile.col, tile.row, tile.elevation);
        const cx = pos.x;
        const cy = pos.y;
        const baseColor = tileBaseColor(tile, theme);
        const pMode = PERSPECTIVE_MODES[perspectiveMode];

        // Side faces (only if elevated)
        if (tile.elevation > 0) {
            const sideH = tile.elevation * eh;
            const leftColor = darken(baseColor, theme.tileSide1 + 0.10);
            const rightColor = darken(baseColor, theme.tileSide2 + 0.10);

            // Left side face
            ctx.beginPath();
            ctx.moveTo(cx - tw / 2, cy);
            ctx.lineTo(cx, cy + th / 2);
            ctx.lineTo(cx, cy + th / 2 + sideH);
            ctx.lineTo(cx - tw / 2, cy + sideH);
            ctx.closePath();
            ctx.fillStyle = leftColor;
            ctx.fill();
            ctx.strokeStyle = theme.gridLine;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Right side face
            ctx.beginPath();
            ctx.moveTo(cx + tw / 2, cy);
            ctx.lineTo(cx, cy + th / 2);
            ctx.lineTo(cx, cy + th / 2 + sideH);
            ctx.lineTo(cx + tw / 2, cy + sideH);
            ctx.closePath();
            ctx.fillStyle = rightColor;
            ctx.fill();
            ctx.strokeStyle = theme.gridLine;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Top face
        if (pMode && pMode.fn) {
            const colors = pMode.fn(baseColor, tile.col, tile.row, theme);
            drawSubTriangles(ctx, cx, cy, tw, th, colors);
        } else {
            drawDiamond(ctx, cx, cy, tw, th);
            ctx.fillStyle = baseColor;
            ctx.fill();
        }

        // Grid line on top face
        if (showGridLines) {
            drawDiamond(ctx, cx, cy, tw, th);
            ctx.strokeStyle = theme.gridLine;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    function drawHoverOverlay(ctx, col, row, theme, tw, th) {
        const tile = GridState.getTile(col, row);
        const elev = tile ? tile.elevation : 0;
        const pos = gridToScreen(col, row, elev);
        drawDiamond(ctx, pos.x, pos.y, tw, th);
        ctx.fillStyle = theme.hoverFill;
        ctx.fill();
        ctx.strokeStyle = theme.hoverStroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    function drawSelectOverlay(ctx, col, row, theme, tw, th) {
        const tile = GridState.getTile(col, row);
        const elev = tile ? tile.elevation : 0;
        const pos = gridToScreen(col, row, elev);
        drawDiamond(ctx, pos.x, pos.y, tw, th);
        ctx.fillStyle = theme.selectFill;
        ctx.fill();
        ctx.strokeStyle = theme.selectStroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    function drawEntity(ctx, ent, theme, tw, th) {
        const tile = GridState.getTile(ent.col, ent.row);
        const elev = tile ? tile.elevation : 0;
        const pos = gridToScreen(ent.col, ent.row, elev);
        // Dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 6, 4, 0, Math.PI * 2);
        ctx.fillStyle = ent.color || theme.secondary;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Label
        if (ent.label) {
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = theme.text;
            ctx.fillText(ent.label, pos.x, pos.y - 12);
        }
    }

    function drawCoordLabel(ctx, col, row, theme, tw, th) {
        const tile = GridState.getTile(col, row);
        const elev = tile ? tile.elevation : 0;
        const pos = gridToScreen(col, row, elev);
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = theme.textMuted;
        ctx.fillText(col + ',' + row, pos.x, pos.y);
    }

    function drawMeasureLine(ctx, p1, p2, theme, tw, th) {
        const t1 = GridState.getTile(p1.col, p1.row);
        const t2 = GridState.getTile(p2.col, p2.row);
        const e1 = t1 ? t1.elevation : 0;
        const e2 = t2 ? t2.elevation : 0;
        const s1 = gridToScreen(p1.col, p1.row, e1);
        const s2 = gridToScreen(p2.col, p2.row, e2);
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.strokeStyle = theme.tertiary;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        // Distance label
        const dc = Math.abs(p2.col - p1.col);
        const dr = Math.abs(p2.row - p1.row);
        const dist = Math.sqrt(dc * dc + dr * dr);
        const mx = (s1.x + s2.x) / 2;
        const my = (s1.y + s2.y) / 2 - 10;
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = theme.tertiary;
        ctx.fillText(dist.toFixed(1) + ' tiles', mx, my);
    }

    // ─── Main Render ────────────────────────────────────

    let canvas, ctx, canvasW, canvasH;
    let animFrameId = null;

    function setupCanvas() {
        canvas = document.getElementById('iso-canvas');
        const wrap = canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        const rect = wrap.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        canvasW = rect.width;
        canvasH = rect.height;
    }

    function render() {
        const theme = IsoThemes.theme;
        const tw = BASE_TILE_W;
        const th = BASE_TILE_H;
        const eh = ELEV_H;

        // Clear
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.fillStyle = theme.canvasBg;
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Camera transform
        ctx.save();
        ctx.translate(Camera.offsetX, Camera.offsetY);
        ctx.scale(Camera.zoom, Camera.zoom);

        // Build renderable list sorted by depth
        const renderables = [];
        GridState.tiles.forEach(tile => {
            renderables.push({ type: 'tile', data: tile, depth: depthKey(tile.col, tile.row, tile.elevation, 0) });
        });
        GridState.entities.forEach(ent => {
            const tile = GridState.getTile(ent.col, ent.row);
            const elev = tile ? tile.elevation : 0;
            renderables.push({ type: 'entity', data: ent, depth: depthKey(ent.col, ent.row, elev, 1) });
        });
        renderables.sort((a, b) => a.depth - b.depth);

        // Draw all
        for (const r of renderables) {
            if (r.type === 'tile') drawTile(ctx, r.data, theme, tw, th, eh);
            else if (r.type === 'entity') drawEntity(ctx, r.data, theme, tw, th);
        }

        // Selection overlays
        GridState.selection.forEach(key => {
            const [c, r] = key.split(',').map(Number);
            drawSelectOverlay(ctx, c, r, theme, tw, th);
        });

        // Hover overlay
        if (GridState.hovered && !Camera.dragging) {
            const [c, r] = GridState.hovered.split(',').map(Number);
            drawHoverOverlay(ctx, c, r, theme, tw, th);
        }

        // Coord labels
        if (showCoords) {
            GridState.tiles.forEach(tile => {
                drawCoordLabel(ctx, tile.col, tile.row, theme, tw, th);
            });
        }

        // Measure line
        if (measureState.p1 && measureState.p2) {
            drawMeasureLine(ctx, measureState.p1, measureState.p2, theme, tw, th);
        }

        // Selection rect (rubber-band) — drawn in world space
        if (selectRectState.active) {
            const s = selectRectState;
            const p1 = gridToScreen(s.c1, s.r1, 0);
            const p2 = gridToScreen(s.c2, s.r2, 0);
            const minX = Math.min(p1.x, p2.x) - tw / 2;
            const minY = Math.min(p1.y, p2.y) - th / 2;
            const maxX = Math.max(p1.x, p2.x) + tw / 2;
            const maxY = Math.max(p1.y, p2.y) + th / 2;
            ctx.strokeStyle = theme.selectStroke;
            ctx.lineWidth = 1 / Camera.zoom;
            ctx.setLineDash([4 / Camera.zoom, 4 / Camera.zoom]);
            ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
            ctx.setLineDash([]);
        }

        ctx.restore();

        // Info bar
        const info = document.getElementById('canvas-info');
        const hz = GridState.hovered ? GridState.hovered : '—';
        info.textContent = `Zoom: ${(Camera.zoom * 100).toFixed(0)}%  |  Hover: ${hz}  |  Tiles: ${GridState.tiles.size}  |  Mode: ${PERSPECTIVE_MODES[perspectiveMode].name}`;
    }

    function loop() {
        render();
        animFrameId = requestAnimationFrame(loop);
    }

    // ─── Mouse → Grid Picking ───────────────────────────

    function mouseToGrid(e) {
        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const world = Camera.screenToWorld(sx, sy);
        return screenToGrid(world.x, world.y);
    }

    function mouseToScreen(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    // ─── Tool System ────────────────────────────────────

    let activeTool = 'select';
    const measureState = { p1: null, p2: null };
    const selectRectState = { active: false, c1: 0, r1: 0, c2: 0, r2: 0, startScreen: null };

    function getSelectedType() {
        return document.getElementById('tile-type').value;
    }

    const tools = {
        select: {
            name: 'Select',
            onMouseDown(e, grid, screen) {
                if (e.shiftKey || e.button === 1) { Camera.startDrag(screen.x, screen.y); return; }
                const key = grid.col + ',' + grid.row;
                if (GridState.tiles.has(key)) {
                    if (e.ctrlKey) {
                        GridState.selectTile(key, true);
                    } else {
                        selectRectState.active = true;
                        selectRectState.c1 = grid.col;
                        selectRectState.r1 = grid.row;
                        selectRectState.c2 = grid.col;
                        selectRectState.r2 = grid.row;
                        selectRectState.startScreen = screen;
                        GridState.selectTile(key, false);
                    }
                } else {
                    GridState.selection.clear();
                    GridState.notify();
                }
            },
            onMouseMove(e, grid, screen) {
                if (Camera.dragging) { Camera.moveDrag(screen.x, screen.y); return; }
                if (selectRectState.active) {
                    selectRectState.c2 = grid.col;
                    selectRectState.r2 = grid.row;
                    GridState.selectRect(selectRectState.c1, selectRectState.r1, grid.col, grid.row);
                }
            },
            onMouseUp(e, grid, screen) {
                Camera.endDrag();
                selectRectState.active = false;
            }
        },

        place: {
            name: 'Place',
            onMouseDown(e, grid, screen) {
                if (e.shiftKey || e.button === 1) { Camera.startDrag(screen.x, screen.y); return; }
                GridState.setTile(grid.col, grid.row, getSelectedType(), 0);
            },
            onMouseMove(e, grid, screen) {
                if (Camera.dragging) { Camera.moveDrag(screen.x, screen.y); return; }
                if (e.buttons === 1) {
                    GridState.setTile(grid.col, grid.row, getSelectedType(), 0);
                }
            },
            onMouseUp(e) { Camera.endDrag(); }
        },

        elevate: {
            name: 'Elevate',
            onMouseDown(e, grid, screen) {
                if (e.shiftKey || e.button === 1) { Camera.startDrag(screen.x, screen.y); return; }
                const tile = GridState.getTile(grid.col, grid.row);
                if (!tile) return;
                if (e.button === 2) {
                    tile.elevation = Math.max(0, tile.elevation - 1);
                } else {
                    tile.elevation += 1;
                }
                GridState.notify();
            },
            onMouseMove(e, grid, screen) {
                if (Camera.dragging) Camera.moveDrag(screen.x, screen.y);
            },
            onMouseUp(e) { Camera.endDrag(); }
        },

        paint: {
            name: 'Paint',
            onMouseDown(e, grid, screen) {
                if (e.shiftKey || e.button === 1) { Camera.startDrag(screen.x, screen.y); return; }
                const type = getSelectedType();
                if (GridState.selection.size > 0) {
                    GridState.selection.forEach(key => {
                        const t = GridState.tiles.get(key);
                        if (t) t.type = type;
                    });
                    GridState.notify();
                } else {
                    const tile = GridState.getTile(grid.col, grid.row);
                    if (tile) { tile.type = type; GridState.notify(); }
                }
            },
            onMouseMove(e, grid, screen) {
                if (Camera.dragging) { Camera.moveDrag(screen.x, screen.y); return; }
                if (e.buttons === 1) {
                    const tile = GridState.getTile(grid.col, grid.row);
                    if (tile) { tile.type = getSelectedType(); GridState.notify(); }
                }
            },
            onMouseUp(e) { Camera.endDrag(); }
        },

        erase: {
            name: 'Erase',
            onMouseDown(e, grid, screen) {
                if (e.shiftKey || e.button === 1) { Camera.startDrag(screen.x, screen.y); return; }
                GridState.removeTile(grid.col, grid.row);
            },
            onMouseMove(e, grid, screen) {
                if (Camera.dragging) { Camera.moveDrag(screen.x, screen.y); return; }
                if (e.buttons === 1) GridState.removeTile(grid.col, grid.row);
            },
            onMouseUp(e) { Camera.endDrag(); }
        },

        measure: {
            name: 'Measure',
            onMouseDown(e, grid, screen) {
                if (e.shiftKey || e.button === 1) { Camera.startDrag(screen.x, screen.y); return; }
                if (!measureState.p1 || measureState.p2) {
                    measureState.p1 = { col: grid.col, row: grid.row };
                    measureState.p2 = null;
                } else {
                    measureState.p2 = { col: grid.col, row: grid.row };
                }
            },
            onMouseMove(e, grid, screen) {
                if (Camera.dragging) Camera.moveDrag(screen.x, screen.y);
            },
            onMouseUp(e) { Camera.endDrag(); }
        }
    };

    // ─── Input Handling ─────────────────────────────────

    function initInput() {
        // Mouse events
        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const grid = mouseToGrid(e);
            const screen = mouseToScreen(e);
            const tool = tools[activeTool];
            if (tool && tool.onMouseDown) tool.onMouseDown(e, grid, screen);
        });

        canvas.addEventListener('mousemove', (e) => {
            const grid = mouseToGrid(e);
            const screen = mouseToScreen(e);
            const key = grid.col + ',' + grid.row;
            if (GridState.tiles.has(key) || activeTool === 'place') {
                GridState.hovered = key;
            } else {
                GridState.hovered = null;
            }
            const tool = tools[activeTool];
            if (tool && tool.onMouseMove) tool.onMouseMove(e, grid, screen);
        });

        canvas.addEventListener('mouseup', (e) => {
            const grid = mouseToGrid(e);
            const screen = mouseToScreen(e);
            const tool = tools[activeTool];
            if (tool && tool.onMouseUp) tool.onMouseUp(e, grid, screen);
        });

        canvas.addEventListener('mouseleave', () => {
            GridState.hovered = null;
            Camera.endDrag();
        });

        // Context menu (prevent for right-click tools)
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            // Right-click for elevate tool lowers
            if (activeTool === 'elevate') {
                const grid = mouseToGrid(e);
                const tile = GridState.getTile(grid.col, grid.row);
                if (tile) {
                    tile.elevation = Math.max(0, tile.elevation - 1);
                    GridState.notify();
                }
            }
        });

        // Zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const screen = mouseToScreen(e);
            Camera.zoomAt(screen.x, screen.y, e.deltaY);
        }, { passive: false });

        // Toolbar buttons
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                setActiveTool(btn.dataset.tool);
            });
        });

        // Action buttons
        document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.action === 'zoomfit') {
                    Camera.zoomToFit(canvasW, canvasH);
                } else if (btn.dataset.action === 'perspective') {
                    cyclePerspective();
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            switch (e.key.toLowerCase()) {
                case 'v': setActiveTool('select'); break;
                case 'p': setActiveTool('place'); break;
                case 'e': setActiveTool('elevate'); break;
                case 'b': setActiveTool('paint'); break;
                case 'x': setActiveTool('erase'); break;
                case 'm': setActiveTool('measure'); break;
                case 'f': Camera.zoomToFit(canvasW, canvasH); break;
                case 'g': showGridLines = !showGridLines; break;
                case 'c': showCoords = !showCoords; break;
                case '/': cyclePerspective(); break;
                case 'escape':
                    measureState.p1 = null;
                    measureState.p2 = null;
                    GridState.selection.clear();
                    GridState.notify();
                    break;
            }
        });

        // Resize
        window.addEventListener('resize', () => {
            setupCanvas();
        });
    }

    function setActiveTool(name) {
        activeTool = name;
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === name);
        });
        const sel = document.getElementById('tile-selector');
        if (name === 'place' || name === 'paint') {
            sel.classList.add('visible');
        } else {
            sel.classList.remove('visible');
        }
    }

    function cyclePerspective() {
        const keys = Object.keys(PERSPECTIVE_MODES);
        const idx = keys.indexOf(perspectiveMode);
        perspectiveMode = keys[(idx + 1) % keys.length];
        // Flash the perspective button
        const btn = document.querySelector('[data-action="perspective"]');
        if (btn) btn.title = 'Perspective: ' + PERSPECTIVE_MODES[perspectiveMode].name + ' (/)';
    }

    // ─── Init ───────────────────────────────────────────

    function init() {
        IsoThemes.apply('dark');
        setupCanvas();
        GridState.initGrid(DEFAULT_GRID);
        Camera.zoomToFit(canvasW, canvasH);
        initInput();

        // Theme changes trigger re-render (handled by loop)
        IsoThemes.onChange(() => {});

        loop();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ─── Public API ─────────────────────────────────────

    window.IsoEngine = {
        GridState,
        Camera,
        PERSPECTIVE_MODES,
        gridToScreen,
        screenToGrid,
        setActiveTool,
        get activeTool() { return activeTool; },
        get perspectiveMode() { return perspectiveMode; },
        set perspectiveMode(m) { if (PERSPECTIVE_MODES[m]) perspectiveMode = m; },
        get showCoords() { return showCoords; },
        set showCoords(v) { showCoords = v; },
        get showGridLines() { return showGridLines; },
        set showGridLines(v) { showGridLines = v; },
        cyclePerspective,
        zoomToFit() { Camera.zoomToFit(canvasW, canvasH); },
        exportJSON() {
            const data = GridState.toJSON();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'isometric-grid.json';
            a.click();
            URL.revokeObjectURL(a.href);
        },
        importJSON(data) {
            GridState.fromJSON(data);
            Camera.zoomToFit(canvasW, canvasH);
        },
        resize(n) {
            GridState.initGrid(n);
            Camera.zoomToFit(canvasW, canvasH);
        }
    };
})();
