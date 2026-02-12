(function () {
    "use strict";

    // ========== STATE ==========
    const S = {
        canvasW: 32,
        canvasH: 32,
        frames: [],
        currentFrameIndex: 0,
        activeLayerIndex: 0,
        currentTool: "pencil",
        fgColor: { r: 0, g: 0, b: 0, a: 255 },
        bgColor: { r: 255, g: 255, b: 255, a: 255 },
        zoom: 8,
        panX: 0,
        panY: 0,
        gridOn: false,
        onionSkin: false,
        playing: false,
        fps: 8,
        undoStack: [],
        redoStack: [],
        maxUndo: 50,
        hue: 0,
        sat: 0,
        val: 0,
        selection: null, // {x,y,w,h}
    };

    // Tool dragging state
    let dragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragCurX = 0, dragCurY = 0;
    let lastPixelX = -1, lastPixelY = -1;
    let panning = false;
    let panStartMX = 0, panStartMY = 0;
    let panStartX = 0, panStartY = 0;
    let spaceDown = false;
    let playInterval = null;
    let marchOffset = 0;
    let marchTimer = null;
    let previewCanvas = null; // Off-screen canvas for shape previews

    // ========== DOM REFS ==========
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => [...document.querySelectorAll(sel)];

    const mainCanvas = $("#main-canvas");
    const ctx = mainCanvas.getContext("2d");
    const container = $("#canvas-container");
    const svCanvas = $("#sv-canvas");
    const svCtx = svCanvas.getContext("2d");
    const hueCanvas = $("#hue-canvas");
    const hueCtx = hueCanvas.getContext("2d");

    // ========== PALETTE ==========
    const PALETTE = [
        "#000000","#1d2b53","#7e2553","#008751",
        "#ab5236","#5f574f","#c2c3c7","#fff1e8",
        "#ff004d","#ffa300","#ffec27","#00e436",
        "#29adff","#83769c","#ff77a8","#ffccaa",
        "#291814","#111d35","#422136","#125359",
        "#742f29","#49333b","#a28879","#f3ef7d",
        "#be1250","#ff6c24","#a8e72e","#00b543",
        "#065ab5","#754665","#ff6e59","#ff9768",
    ];

    // ========== HELPERS ==========
    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

    function rgbToHex(r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function hexToRgb(hex) {
        hex = hex.replace("#", "");
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        const n = parseInt(hex, 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 255 };
    }

    function hsvToRgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h / 60) % 6;
        const f = h / 60 - Math.floor(h / 60);
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
            a: 255
        };
    }

    function rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const d = max - min;
        let h = 0, s = max === 0 ? 0 : d / max, v = max;
        if (d !== 0) {
            switch (max) {
                case r: h = ((g - b) / d + 6) % 6; break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }
        return { h, s, v };
    }

    function colorsEqual(a, b) {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    }

    // ========== LAYER / FRAME HELPERS ==========
    function createLayer(name) {
        const data = new ImageData(S.canvasW, S.canvasH);
        return { name, visible: true, opacity: 100, data };
    }

    function cloneLayer(layer) {
        const data = new ImageData(new Uint8ClampedArray(layer.data.data), S.canvasW, S.canvasH);
        return { name: layer.name, visible: layer.visible, opacity: layer.opacity, data };
    }

    function createFrame() {
        return { layers: [createLayer("Layer 1")] };
    }

    function cloneFrame(frame) {
        return { layers: frame.layers.map(cloneLayer) };
    }

    function currentFrame() { return S.frames[S.currentFrameIndex]; }
    function currentLayer() { return currentFrame().layers[S.activeLayerIndex]; }

    // ========== PIXEL ACCESS ==========
    function getPixel(imageData, x, y) {
        if (x < 0 || y < 0 || x >= S.canvasW || y >= S.canvasH) return { r: 0, g: 0, b: 0, a: 0 };
        const i = (y * S.canvasW + x) * 4;
        const d = imageData.data;
        return { r: d[i], g: d[i+1], b: d[i+2], a: d[i+3] };
    }

    function setPixel(imageData, x, y, c) {
        if (x < 0 || y < 0 || x >= S.canvasW || y >= S.canvasH) return;
        const i = (y * S.canvasW + x) * 4;
        const d = imageData.data;
        d[i] = c.r; d[i+1] = c.g; d[i+2] = c.b; d[i+3] = c.a;
    }

    // ========== UNDO / REDO ==========
    function pushUndo() {
        S.undoStack.push({
            frames: S.frames.map(cloneFrame),
            currentFrameIndex: S.currentFrameIndex,
            activeLayerIndex: S.activeLayerIndex,
        });
        if (S.undoStack.length > S.maxUndo) S.undoStack.shift();
        S.redoStack = [];
    }

    function undo() {
        if (S.undoStack.length === 0) return;
        S.redoStack.push({
            frames: S.frames.map(cloneFrame),
            currentFrameIndex: S.currentFrameIndex,
            activeLayerIndex: S.activeLayerIndex,
        });
        const snap = S.undoStack.pop();
        S.frames = snap.frames;
        S.currentFrameIndex = snap.currentFrameIndex;
        S.activeLayerIndex = snap.activeLayerIndex;
        render();
        refreshUI();
    }

    function redo() {
        if (S.redoStack.length === 0) return;
        S.undoStack.push({
            frames: S.frames.map(cloneFrame),
            currentFrameIndex: S.currentFrameIndex,
            activeLayerIndex: S.activeLayerIndex,
        });
        const snap = S.redoStack.pop();
        S.frames = snap.frames;
        S.currentFrameIndex = snap.currentFrameIndex;
        S.activeLayerIndex = snap.activeLayerIndex;
        render();
        refreshUI();
    }

    // ========== BRESENHAM ==========
    function bresenhamLine(x0, y0, x1, y1, callback) {
        const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            callback(x0, y0);
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    // ========== ELLIPSE (midpoint algorithm) ==========
    function midpointEllipse(cx, cy, rx, ry, callback) {
        if (rx === 0 && ry === 0) { callback(cx, cy); return; }
        if (rx === 0) { for (let y = -ry; y <= ry; y++) callback(cx, cy + y); return; }
        if (ry === 0) { for (let x = -rx; x <= rx; x++) callback(cx + x, cy); return; }
        let x = 0, y = ry;
        let rx2 = rx * rx, ry2 = ry * ry;
        let px = 0, py = 2 * rx2 * y;
        let p = ry2 - rx2 * ry + 0.25 * rx2;
        const plot4 = (x, y) => {
            callback(cx + x, cy + y);
            callback(cx - x, cy + y);
            callback(cx + x, cy - y);
            callback(cx - x, cy - y);
        };
        plot4(x, y);
        while (px < py) {
            x++;
            px += 2 * ry2;
            if (p < 0) {
                p += ry2 + px;
            } else {
                y--;
                py -= 2 * rx2;
                p += ry2 + px - py;
            }
            plot4(x, y);
        }
        p = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;
        while (y > 0) {
            y--;
            py -= 2 * rx2;
            if (p > 0) {
                p += rx2 - py;
            } else {
                x++;
                px += 2 * ry2;
                p += rx2 - py + px;
            }
            plot4(x, y);
        }
    }

    // ========== FLOOD FILL ==========
    function floodFill(imageData, startX, startY, fillColor) {
        const target = getPixel(imageData, startX, startY);
        if (colorsEqual(target, fillColor)) return;
        const w = S.canvasW, h = S.canvasH;
        const d = imageData.data;
        const stack = [[startX, startY]];
        const visited = new Uint8Array(w * h);
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            if (x < 0 || y < 0 || x >= w || y >= h) continue;
            const idx = y * w + x;
            if (visited[idx]) continue;
            const i = idx * 4;
            if (d[i] !== target.r || d[i+1] !== target.g || d[i+2] !== target.b || d[i+3] !== target.a) continue;
            visited[idx] = 1;
            d[i] = fillColor.r; d[i+1] = fillColor.g; d[i+2] = fillColor.b; d[i+3] = fillColor.a;
            stack.push([x+1, y], [x-1, y], [x, y+1], [x, y-1]);
        }
    }

    // ========== COORDINATE CONVERSION ==========
    function screenToPixel(mx, my) {
        const rect = container.getBoundingClientRect();
        const cx = mx - rect.left;
        const cy = my - rect.top;
        const px = Math.floor((cx - S.panX) / S.zoom);
        const py = Math.floor((cy - S.panY) / S.zoom);
        return [px, py];
    }

    // ========== RENDERING ==========
    function render() {
        const rect = container.getBoundingClientRect();
        const cw = rect.width;
        const ch = rect.height - 18; // minus info bar
        mainCanvas.width = cw;
        mainCanvas.height = ch;
        ctx.imageSmoothingEnabled = false;

        // Clear
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, cw, ch);

        // Checkerboard
        drawCheckerboard(ctx);

        // Onion skin previous
        if (S.onionSkin && S.currentFrameIndex > 0) {
            drawFrameComposite(S.frames[S.currentFrameIndex - 1], 0.25);
        }

        // Current frame layers
        drawFrameComposite(currentFrame(), 1.0);

        // Onion skin next
        if (S.onionSkin && S.currentFrameIndex < S.frames.length - 1) {
            drawFrameComposite(S.frames[S.currentFrameIndex + 1], 0.25);
        }

        // Grid
        if (S.gridOn && S.zoom >= 4) {
            drawGrid(ctx);
        }

        // Selection marching ants
        if (S.selection) {
            drawSelection(ctx);
        }

        // Tool preview
        if (dragging && previewCanvas) {
            ctx.globalAlpha = 0.6;
            ctx.drawImage(previewCanvas, S.panX, S.panY, S.canvasW * S.zoom, S.canvasH * S.zoom);
            ctx.globalAlpha = 1.0;
        }
    }

    function drawCheckerboard(c) {
        const size = Math.max(4, S.zoom / 2);
        const startX = S.panX;
        const startY = S.panY;
        const endX = startX + S.canvasW * S.zoom;
        const endY = startY + S.canvasH * S.zoom;

        c.save();
        c.beginPath();
        c.rect(startX, startY, S.canvasW * S.zoom, S.canvasH * S.zoom);
        c.clip();

        c.fillStyle = "#cccccc";
        c.fillRect(startX, startY, S.canvasW * S.zoom, S.canvasH * S.zoom);
        c.fillStyle = "#999999";
        for (let y = 0; y < S.canvasH * S.zoom; y += size * 2) {
            for (let x = 0; x < S.canvasW * S.zoom; x += size * 2) {
                c.fillRect(startX + x + size, startY + y, size, size);
                c.fillRect(startX + x, startY + y + size, size, size);
            }
        }
        c.restore();
    }

    function drawFrameComposite(frame, globalAlpha) {
        // Composite layers bottom-up onto an offscreen canvas
        const oc = document.createElement("canvas");
        oc.width = S.canvasW;
        oc.height = S.canvasH;
        const octx = oc.getContext("2d");

        for (let i = 0; i < frame.layers.length; i++) {
            const layer = frame.layers[i];
            if (!layer.visible) continue;
            octx.globalAlpha = layer.opacity / 100;
            const tc = document.createElement("canvas");
            tc.width = S.canvasW;
            tc.height = S.canvasH;
            tc.getContext("2d").putImageData(layer.data, 0, 0);
            octx.drawImage(tc, 0, 0);
        }

        ctx.globalAlpha = globalAlpha;
        ctx.drawImage(oc, S.panX, S.panY, S.canvasW * S.zoom, S.canvasH * S.zoom);
        ctx.globalAlpha = 1.0;
    }

    function drawGrid(c) {
        c.save();
        c.strokeStyle = "rgba(255,255,255,0.15)";
        c.lineWidth = 1;
        const sx = S.panX;
        const sy = S.panY;
        for (let x = 0; x <= S.canvasW; x++) {
            const px = sx + x * S.zoom;
            c.beginPath();
            c.moveTo(px + 0.5, sy);
            c.lineTo(px + 0.5, sy + S.canvasH * S.zoom);
            c.stroke();
        }
        for (let y = 0; y <= S.canvasH; y++) {
            const py = sy + y * S.zoom;
            c.beginPath();
            c.moveTo(sx, py + 0.5);
            c.lineTo(sx + S.canvasW * S.zoom, py + 0.5);
            c.stroke();
        }
        c.restore();
    }

    function drawSelection(c) {
        const sel = S.selection;
        const sx = S.panX + sel.x * S.zoom;
        const sy = S.panY + sel.y * S.zoom;
        const sw = sel.w * S.zoom;
        const sh = sel.h * S.zoom;
        c.save();
        c.setLineDash([4, 4]);
        c.lineDashOffset = -marchOffset;
        c.strokeStyle = "#fff";
        c.lineWidth = 1;
        c.strokeRect(sx + 0.5, sy + 0.5, sw, sh);
        c.setLineDash([4, 4]);
        c.lineDashOffset = -(marchOffset + 4);
        c.strokeStyle = "#000";
        c.strokeRect(sx + 0.5, sy + 0.5, sw, sh);
        c.restore();
    }

    function centerCanvas() {
        const rect = container.getBoundingClientRect();
        const cw = rect.width;
        const ch = rect.height - 18;
        S.panX = Math.floor((cw - S.canvasW * S.zoom) / 2);
        S.panY = Math.floor((ch - S.canvasH * S.zoom) / 2);
    }

    // ========== TOOL PREVIEW (shapes) ==========
    function updateToolPreview() {
        if (!dragging) return;
        const tool = S.currentTool;
        if (tool !== "line" && tool !== "rect" && tool !== "ellipse" && tool !== "selection") return;

        previewCanvas = document.createElement("canvas");
        previewCanvas.width = S.canvasW;
        previewCanvas.height = S.canvasH;
        const pc = previewCanvas.getContext("2d");
        const id = pc.createImageData(S.canvasW, S.canvasH);
        const c = S.fgColor;

        if (tool === "line") {
            bresenhamLine(dragStartX, dragStartY, dragCurX, dragCurY, (x, y) => {
                setPixel(id, x, y, c);
            });
        } else if (tool === "rect") {
            const x0 = Math.min(dragStartX, dragCurX), y0 = Math.min(dragStartY, dragCurY);
            const x1 = Math.max(dragStartX, dragCurX), y1 = Math.max(dragStartY, dragCurY);
            for (let x = x0; x <= x1; x++) { setPixel(id, x, y0, c); setPixel(id, x, y1, c); }
            for (let y = y0; y <= y1; y++) { setPixel(id, x0, y, c); setPixel(id, x1, y, c); }
        } else if (tool === "ellipse") {
            const cx = Math.floor((dragStartX + dragCurX) / 2);
            const cy = Math.floor((dragStartY + dragCurY) / 2);
            const rx = Math.abs(dragCurX - dragStartX) / 2;
            const ry = Math.abs(dragCurY - dragStartY) / 2;
            midpointEllipse(cx, cy, Math.round(rx), Math.round(ry), (x, y) => {
                setPixel(id, x, y, c);
            });
        } else if (tool === "selection") {
            // Draw dashed rect preview using simple pattern
            const x0 = Math.min(dragStartX, dragCurX), y0 = Math.min(dragStartY, dragCurY);
            const x1 = Math.max(dragStartX, dragCurX), y1 = Math.max(dragStartY, dragCurY);
            const white = {r:255,g:255,b:255,a:180};
            for (let x = x0; x <= x1; x++) {
                if ((x + marchOffset) % 4 < 2) { setPixel(id, x, y0, white); setPixel(id, x, y1, white); }
            }
            for (let y = y0; y <= y1; y++) {
                if ((y + marchOffset) % 4 < 2) { setPixel(id, x0, y, white); setPixel(id, x1, y, white); }
            }
        }

        pc.putImageData(id, 0, 0);
    }

    // ========== TOOLS ==========
    const tools = {
        pencil: {
            onPointerDown(px, py) {
                pushUndo();
                const layer = currentLayer();
                setPixel(layer.data, px, py, S.fgColor);
                lastPixelX = px; lastPixelY = py;
            },
            onPointerMove(px, py) {
                const layer = currentLayer();
                bresenhamLine(lastPixelX, lastPixelY, px, py, (x, y) => {
                    setPixel(layer.data, x, y, S.fgColor);
                });
                lastPixelX = px; lastPixelY = py;
            },
            onPointerUp() {}
        },
        eraser: {
            onPointerDown(px, py) {
                pushUndo();
                const layer = currentLayer();
                setPixel(layer.data, px, py, {r:0,g:0,b:0,a:0});
                lastPixelX = px; lastPixelY = py;
            },
            onPointerMove(px, py) {
                const layer = currentLayer();
                bresenhamLine(lastPixelX, lastPixelY, px, py, (x, y) => {
                    setPixel(layer.data, x, y, {r:0,g:0,b:0,a:0});
                });
                lastPixelX = px; lastPixelY = py;
            },
            onPointerUp() {}
        },
        line: {
            onPointerDown(px, py) {
                pushUndo();
                dragStartX = px; dragStartY = py;
                dragCurX = px; dragCurY = py;
            },
            onPointerMove(px, py) {
                dragCurX = px; dragCurY = py;
                updateToolPreview();
            },
            onPointerUp(px, py) {
                const layer = currentLayer();
                bresenhamLine(dragStartX, dragStartY, px, py, (x, y) => {
                    setPixel(layer.data, x, y, S.fgColor);
                });
                previewCanvas = null;
            }
        },
        rect: {
            onPointerDown(px, py) {
                pushUndo();
                dragStartX = px; dragStartY = py;
                dragCurX = px; dragCurY = py;
            },
            onPointerMove(px, py) {
                dragCurX = px; dragCurY = py;
                updateToolPreview();
            },
            onPointerUp(px, py) {
                const layer = currentLayer();
                const x0 = Math.min(dragStartX, px), y0 = Math.min(dragStartY, py);
                const x1 = Math.max(dragStartX, px), y1 = Math.max(dragStartY, py);
                for (let x = x0; x <= x1; x++) { setPixel(layer.data, x, y0, S.fgColor); setPixel(layer.data, x, y1, S.fgColor); }
                for (let y = y0; y <= y1; y++) { setPixel(layer.data, x0, y, S.fgColor); setPixel(layer.data, x1, y, S.fgColor); }
                previewCanvas = null;
            }
        },
        ellipse: {
            onPointerDown(px, py) {
                pushUndo();
                dragStartX = px; dragStartY = py;
                dragCurX = px; dragCurY = py;
            },
            onPointerMove(px, py) {
                dragCurX = px; dragCurY = py;
                updateToolPreview();
            },
            onPointerUp(px, py) {
                const layer = currentLayer();
                const cx = Math.floor((dragStartX + px) / 2);
                const cy = Math.floor((dragStartY + py) / 2);
                const rx = Math.round(Math.abs(px - dragStartX) / 2);
                const ry = Math.round(Math.abs(py - dragStartY) / 2);
                midpointEllipse(cx, cy, rx, ry, (x, y) => {
                    setPixel(layer.data, x, y, S.fgColor);
                });
                previewCanvas = null;
            }
        },
        fill: {
            onPointerDown(px, py) {
                if (px < 0 || py < 0 || px >= S.canvasW || py >= S.canvasH) return;
                pushUndo();
                floodFill(currentLayer().data, px, py, S.fgColor);
            },
            onPointerMove() {},
            onPointerUp() {}
        },
        eyedropper: {
            onPointerDown(px, py) {
                pickColor(px, py);
            },
            onPointerMove(px, py) {
                pickColor(px, py);
            },
            onPointerUp() {}
        },
        selection: {
            onPointerDown(px, py) {
                dragStartX = px; dragStartY = py;
                dragCurX = px; dragCurY = py;
                S.selection = null;
            },
            onPointerMove(px, py) {
                dragCurX = px; dragCurY = py;
                updateToolPreview();
            },
            onPointerUp(px, py) {
                const x0 = Math.min(dragStartX, px), y0 = Math.min(dragStartY, py);
                const x1 = Math.max(dragStartX, px), y1 = Math.max(dragStartY, py);
                if (x0 === x1 && y0 === y1) {
                    S.selection = null;
                } else {
                    S.selection = {
                        x: Math.max(0, x0),
                        y: Math.max(0, y0),
                        w: Math.min(S.canvasW, x1 + 1) - Math.max(0, x0),
                        h: Math.min(S.canvasH, y1 + 1) - Math.max(0, y0),
                    };
                }
                previewCanvas = null;
            }
        }
    };

    function pickColor(px, py) {
        if (px < 0 || py < 0 || px >= S.canvasW || py >= S.canvasH) return;
        const c = getPixel(currentLayer().data, px, py);
        if (c.a === 0) return;
        S.fgColor = { r: c.r, g: c.g, b: c.b, a: 255 };
        const hsv = rgbToHsv(c.r, c.g, c.b);
        S.hue = hsv.h; S.sat = hsv.s; S.val = hsv.v;
        updateColorUI();
    }

    // ========== CANVAS EVENTS ==========
    container.addEventListener("pointerdown", (e) => {
        if (e.button === 1 || spaceDown) {
            // Pan
            panning = true;
            panStartMX = e.clientX;
            panStartMY = e.clientY;
            panStartX = S.panX;
            panStartY = S.panY;
            container.classList.add("panning");
            e.preventDefault();
            return;
        }
        if (e.button !== 0) return;
        const [px, py] = screenToPixel(e.clientX, e.clientY);
        dragging = true;
        lastPixelX = px; lastPixelY = py;
        const tool = tools[S.currentTool];
        if (tool) tool.onPointerDown(px, py);
        render();
        container.setPointerCapture(e.pointerId);
    });

    container.addEventListener("pointermove", (e) => {
        const [px, py] = screenToPixel(e.clientX, e.clientY);
        $("#cursor-pos").textContent = `${px}, ${py}`;

        if (panning) {
            S.panX = panStartX + (e.clientX - panStartMX);
            S.panY = panStartY + (e.clientY - panStartMY);
            render();
            return;
        }
        if (!dragging) return;
        const tool = tools[S.currentTool];
        if (tool) tool.onPointerMove(px, py);
        render();
    });

    container.addEventListener("pointerup", (e) => {
        if (panning) {
            panning = false;
            container.classList.remove("panning");
            return;
        }
        if (!dragging) return;
        dragging = false;
        const [px, py] = screenToPixel(e.clientX, e.clientY);
        const tool = tools[S.currentTool];
        if (tool) tool.onPointerUp(px, py);
        render();
        updateTimelineThumbs();
        updateLayersList();
    });

    // Zoom
    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const oldZoom = S.zoom;
        if (e.deltaY < 0) {
            S.zoom = Math.min(64, S.zoom * 2);
        } else {
            S.zoom = Math.max(1, S.zoom / 2);
        }

        // Zoom towards cursor
        const scale = S.zoom / oldZoom;
        S.panX = mx - (mx - S.panX) * scale;
        S.panY = my - (my - S.panY) * scale;

        $("#zoom-level").textContent = S.zoom + "x";
        render();
    }, { passive: false });

    // ========== TOOLBAR ==========
    $$(".tool-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            selectTool(btn.dataset.tool);
        });
    });

    function selectTool(name) {
        S.currentTool = name;
        $$(".tool-btn").forEach(b => b.classList.toggle("active", b.dataset.tool === name));
        container.setAttribute("data-tool", name);
    }

    // ========== COLOR PICKER ==========
    function drawSVCanvas() {
        const w = svCanvas.width, h = svCanvas.height;
        const id = svCtx.createImageData(w, h);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const s = x / (w - 1);
                const v = 1 - y / (h - 1);
                const c = hsvToRgb(S.hue, s, v);
                const i = (y * w + x) * 4;
                id.data[i] = c.r; id.data[i+1] = c.g; id.data[i+2] = c.b; id.data[i+3] = 255;
            }
        }
        svCtx.putImageData(id, 0, 0);

        // Indicator
        const ix = S.sat * (w - 1);
        const iy = (1 - S.val) * (h - 1);
        svCtx.strokeStyle = "#fff";
        svCtx.lineWidth = 1.5;
        svCtx.beginPath();
        svCtx.arc(ix, iy, 4, 0, Math.PI * 2);
        svCtx.stroke();
        svCtx.strokeStyle = "#000";
        svCtx.lineWidth = 0.5;
        svCtx.beginPath();
        svCtx.arc(ix, iy, 5, 0, Math.PI * 2);
        svCtx.stroke();
    }

    function drawHueCanvas() {
        const w = hueCanvas.width, h = hueCanvas.height;
        const id = hueCtx.createImageData(w, h);
        for (let y = 0; y < h; y++) {
            const hue = (y / (h - 1)) * 360;
            const c = hsvToRgb(hue, 1, 1);
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                id.data[i] = c.r; id.data[i+1] = c.g; id.data[i+2] = c.b; id.data[i+3] = 255;
            }
        }
        hueCtx.putImageData(id, 0, 0);

        // Indicator
        const iy = (S.hue / 360) * (h - 1);
        hueCtx.strokeStyle = "#fff";
        hueCtx.lineWidth = 1;
        hueCtx.strokeRect(0, iy - 1, w, 3);
    }

    let svDragging = false;
    svCanvas.addEventListener("pointerdown", (e) => {
        svDragging = true;
        svCanvas.setPointerCapture(e.pointerId);
        updateSV(e);
    });
    svCanvas.addEventListener("pointermove", (e) => { if (svDragging) updateSV(e); });
    svCanvas.addEventListener("pointerup", () => { svDragging = false; });

    function updateSV(e) {
        const rect = svCanvas.getBoundingClientRect();
        const x = clamp(e.clientX - rect.left, 0, rect.width);
        const y = clamp(e.clientY - rect.top, 0, rect.height);
        S.sat = x / rect.width;
        S.val = 1 - y / rect.height;
        applyHSV();
    }

    let hueDragging = false;
    hueCanvas.addEventListener("pointerdown", (e) => {
        hueDragging = true;
        hueCanvas.setPointerCapture(e.pointerId);
        updateHue(e);
    });
    hueCanvas.addEventListener("pointermove", (e) => { if (hueDragging) updateHue(e); });
    hueCanvas.addEventListener("pointerup", () => { hueDragging = false; });

    function updateHue(e) {
        const rect = hueCanvas.getBoundingClientRect();
        const y = clamp(e.clientY - rect.top, 0, rect.height);
        S.hue = (y / rect.height) * 360;
        applyHSV();
    }

    function applyHSV() {
        const c = hsvToRgb(S.hue, S.sat, S.val);
        S.fgColor = c;
        updateColorUI();
    }

    function updateColorUI() {
        drawSVCanvas();
        drawHueCanvas();
        $("#fg-color").style.background = `rgb(${S.fgColor.r},${S.fgColor.g},${S.fgColor.b})`;
        $("#bg-color").style.background = `rgb(${S.bgColor.r},${S.bgColor.g},${S.bgColor.b})`;
        $("#color-r").value = S.fgColor.r;
        $("#color-g").value = S.fgColor.g;
        $("#color-b").value = S.fgColor.b;
        $("#color-hex").value = rgbToHex(S.fgColor.r, S.fgColor.g, S.fgColor.b);
    }

    // Swap colors
    $("#swap-colors").addEventListener("click", swapColors);
    function swapColors() {
        const t = S.fgColor;
        S.fgColor = S.bgColor;
        S.bgColor = t;
        const hsv = rgbToHsv(S.fgColor.r, S.fgColor.g, S.fgColor.b);
        S.hue = hsv.h; S.sat = hsv.s; S.val = hsv.v;
        updateColorUI();
    }

    // RGB inputs
    ["color-r", "color-g", "color-b"].forEach(id => {
        $(`#${id}`).addEventListener("input", () => {
            S.fgColor.r = parseInt($("#color-r").value) || 0;
            S.fgColor.g = parseInt($("#color-g").value) || 0;
            S.fgColor.b = parseInt($("#color-b").value) || 0;
            const hsv = rgbToHsv(S.fgColor.r, S.fgColor.g, S.fgColor.b);
            S.hue = hsv.h; S.sat = hsv.s; S.val = hsv.v;
            updateColorUI();
        });
    });

    // Hex input
    $("#color-hex").addEventListener("change", () => {
        const hex = $("#color-hex").value;
        if (/^[0-9a-fA-F]{6}$/.test(hex)) {
            const c = hexToRgb(hex);
            S.fgColor = c;
            const hsv = rgbToHsv(c.r, c.g, c.b);
            S.hue = hsv.h; S.sat = hsv.s; S.val = hsv.v;
            updateColorUI();
        }
    });

    // Palette grid
    function buildPalette() {
        const grid = $("#palette-grid");
        grid.innerHTML = "";
        PALETTE.forEach(hex => {
            const div = document.createElement("div");
            div.className = "palette-color";
            div.style.background = hex;
            div.addEventListener("click", (e) => {
                const c = hexToRgb(hex);
                if (e.button === 0) {
                    S.fgColor = c;
                    const hsv = rgbToHsv(c.r, c.g, c.b);
                    S.hue = hsv.h; S.sat = hsv.s; S.val = hsv.v;
                }
                updateColorUI();
            });
            div.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                S.bgColor = hexToRgb(hex);
                updateColorUI();
            });
            grid.appendChild(div);
        });
    }

    // ========== LAYERS ==========
    function updateLayersList() {
        const list = $("#layers-list");
        list.innerHTML = "";
        const frame = currentFrame();
        // Render layers top-down (highest index on top)
        for (let i = frame.layers.length - 1; i >= 0; i--) {
            const layer = frame.layers[i];
            const div = document.createElement("div");
            div.className = "layer-item" + (i === S.activeLayerIndex ? " active" : "");
            div.dataset.index = i;

            const vis = document.createElement("span");
            vis.className = "layer-vis";
            vis.textContent = layer.visible ? "👁" : "—";
            vis.addEventListener("click", (e) => {
                e.stopPropagation();
                pushUndo();
                layer.visible = !layer.visible;
                render();
                updateLayersList();
            });

            const preview = document.createElement("canvas");
            preview.className = "layer-preview";
            preview.width = S.canvasW;
            preview.height = S.canvasH;
            preview.getContext("2d").putImageData(layer.data, 0, 0);

            const name = document.createElement("span");
            name.className = "layer-name";
            name.textContent = layer.name;
            name.addEventListener("dblclick", (e) => {
                e.stopPropagation();
                const input = document.createElement("input");
                input.className = "layer-name-input";
                input.value = layer.name;
                name.replaceWith(input);
                input.focus();
                input.select();
                const finish = () => {
                    layer.name = input.value || layer.name;
                    updateLayersList();
                };
                input.addEventListener("blur", finish);
                input.addEventListener("keydown", (ke) => { if (ke.key === "Enter") input.blur(); });
            });

            div.addEventListener("click", () => {
                S.activeLayerIndex = i;
                updateLayersList();
                render();
            });

            div.appendChild(vis);
            div.appendChild(preview);
            div.appendChild(name);
            list.appendChild(div);
        }

        // Opacity slider sync
        const slider = $("#opacity-slider");
        const opVal = $("#opacity-value");
        if (frame.layers[S.activeLayerIndex]) {
            slider.value = frame.layers[S.activeLayerIndex].opacity;
            opVal.textContent = frame.layers[S.activeLayerIndex].opacity + "%";
        }
    }

    $("#add-layer").addEventListener("click", () => {
        pushUndo();
        const frame = currentFrame();
        const idx = S.activeLayerIndex + 1;
        const name = "Layer " + (frame.layers.length + 1);
        frame.layers.splice(idx, 0, createLayer(name));
        S.activeLayerIndex = idx;
        render();
        updateLayersList();
    });

    $("#remove-layer").addEventListener("click", () => {
        const frame = currentFrame();
        if (frame.layers.length <= 1) return;
        pushUndo();
        frame.layers.splice(S.activeLayerIndex, 1);
        S.activeLayerIndex = Math.min(S.activeLayerIndex, frame.layers.length - 1);
        render();
        updateLayersList();
    });

    $("#move-layer-up").addEventListener("click", () => {
        const frame = currentFrame();
        const i = S.activeLayerIndex;
        if (i >= frame.layers.length - 1) return;
        pushUndo();
        [frame.layers[i], frame.layers[i+1]] = [frame.layers[i+1], frame.layers[i]];
        S.activeLayerIndex = i + 1;
        render();
        updateLayersList();
    });

    $("#move-layer-down").addEventListener("click", () => {
        const frame = currentFrame();
        const i = S.activeLayerIndex;
        if (i <= 0) return;
        pushUndo();
        [frame.layers[i], frame.layers[i-1]] = [frame.layers[i-1], frame.layers[i]];
        S.activeLayerIndex = i - 1;
        render();
        updateLayersList();
    });

    $("#opacity-slider").addEventListener("input", () => {
        const val = parseInt($("#opacity-slider").value);
        const layer = currentFrame().layers[S.activeLayerIndex];
        if (layer) {
            layer.opacity = val;
            $("#opacity-value").textContent = val + "%";
            render();
        }
    });

    $("#opacity-slider").addEventListener("change", () => {
        // Capture undo on release
        // (opacity change is low-cost, fine to not snapshot on every input)
    });

    // ========== TIMELINE ==========
    function updateTimelineThumbs() {
        const cont = $("#frames-container");
        cont.innerHTML = "";
        S.frames.forEach((frame, i) => {
            const thumb = document.createElement("canvas");
            thumb.className = "frame-thumb" + (i === S.currentFrameIndex ? " active" : "");
            thumb.width = 48;
            thumb.height = 48;
            const tctx = thumb.getContext("2d");
            tctx.imageSmoothingEnabled = false;

            // Composite frame
            const oc = document.createElement("canvas");
            oc.width = S.canvasW;
            oc.height = S.canvasH;
            const octx = oc.getContext("2d");
            for (let j = 0; j < frame.layers.length; j++) {
                const layer = frame.layers[j];
                if (!layer.visible) continue;
                octx.globalAlpha = layer.opacity / 100;
                const tc = document.createElement("canvas");
                tc.width = S.canvasW;
                tc.height = S.canvasH;
                tc.getContext("2d").putImageData(layer.data, 0, 0);
                octx.drawImage(tc, 0, 0);
            }
            tctx.drawImage(oc, 0, 0, 48, 48);

            const num = document.createElement("span");
            num.className = "frame-number";
            num.textContent = i + 1;

            const wrapper = document.createElement("div");
            wrapper.className = "frame-thumb" + (i === S.currentFrameIndex ? " active" : "");
            wrapper.style.position = "relative";
            wrapper.appendChild(thumb);
            wrapper.appendChild(num);
            wrapper.addEventListener("click", () => {
                S.currentFrameIndex = i;
                S.activeLayerIndex = Math.min(S.activeLayerIndex, currentFrame().layers.length - 1);
                render();
                refreshUI();
            });

            // Use the wrapper div style instead of canvas style for the thumbnail
            thumb.style.width = "100%";
            thumb.style.height = "100%";
            thumb.style.borderRadius = "inherit";
            thumb.className = "";

            cont.appendChild(wrapper);
        });
    }

    $("#add-frame").addEventListener("click", () => {
        pushUndo();
        S.frames.splice(S.currentFrameIndex + 1, 0, createFrame());
        S.currentFrameIndex++;
        S.activeLayerIndex = 0;
        render();
        refreshUI();
    });

    $("#dup-frame").addEventListener("click", () => {
        pushUndo();
        S.frames.splice(S.currentFrameIndex + 1, 0, cloneFrame(currentFrame()));
        S.currentFrameIndex++;
        render();
        refreshUI();
    });

    $("#remove-frame").addEventListener("click", () => {
        if (S.frames.length <= 1) return;
        pushUndo();
        S.frames.splice(S.currentFrameIndex, 1);
        S.currentFrameIndex = Math.min(S.currentFrameIndex, S.frames.length - 1);
        S.activeLayerIndex = Math.min(S.activeLayerIndex, currentFrame().layers.length - 1);
        render();
        refreshUI();
    });

    // Play/Pause
    $("#play-btn").addEventListener("click", togglePlay);

    function togglePlay() {
        S.playing = !S.playing;
        $("#play-btn").textContent = S.playing ? "⏸" : "▶";
        if (S.playing) {
            startPlayback();
        } else {
            stopPlayback();
        }
    }

    function startPlayback() {
        stopPlayback();
        const delay = 1000 / S.fps;
        playInterval = setInterval(() => {
            S.currentFrameIndex = (S.currentFrameIndex + 1) % S.frames.length;
            render();
            updateTimelineThumbs();
        }, delay);
    }

    function stopPlayback() {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    }

    $("#fps-input").addEventListener("change", () => {
        S.fps = clamp(parseInt($("#fps-input").value) || 8, 1, 60);
        $("#fps-input").value = S.fps;
        if (S.playing) startPlayback();
    });

    $("#onion-skin").addEventListener("change", () => {
        S.onionSkin = $("#onion-skin").checked;
        render();
    });

    // ========== MENU BAR ==========
    const menus = {
        file: [
            { label: "New...", shortcut: "Ctrl+N", action: showNewCanvasModal },
            { label: "Clear Canvas", shortcut: "", action: clearCanvas },
            { label: "Resize Canvas...", shortcut: "", action: showResizeModal },
            { sep: true },
            { label: "Export PNG", shortcut: "", action: exportPNG },
            { label: "Export Spritesheet", shortcut: "", action: exportSpritesheet },
            { label: "Export GIF", shortcut: "", action: exportGIF },
        ],
        edit: [
            { label: "Undo", shortcut: "Ctrl+Z", action: undo },
            { label: "Redo", shortcut: "Ctrl+Y", action: redo },
            { sep: true },
            { label: "Clear Selection", shortcut: "Del", action: clearSelection },
        ],
        view: [
            { label: "Toggle Grid", shortcut: "", action: toggleGrid },
            { label: "Zoom In", shortcut: "+", action: () => zoomStep(1) },
            { label: "Zoom Out", shortcut: "-", action: () => zoomStep(-1) },
            { label: "Reset View", shortcut: "", action: () => { S.zoom = 8; centerCanvas(); render(); $("#zoom-level").textContent = S.zoom + "x"; } },
        ]
    };

    let openMenu = null;

    $$(".menu-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            const name = item.dataset.menu;
            if (openMenu === name) {
                closeMenu();
                return;
            }
            openMenu = name;
            showMenu(name, item);
        });
    });

    function showMenu(name, el) {
        const dd = $("#menu-dropdown");
        dd.classList.remove("hidden");
        dd.innerHTML = "";
        const rect = el.getBoundingClientRect();
        dd.style.left = rect.left + "px";

        $$(".menu-item").forEach(m => m.classList.toggle("open", m.dataset.menu === name));

        menus[name].forEach(opt => {
            if (opt.sep) {
                const sep = document.createElement("div");
                sep.className = "menu-separator";
                dd.appendChild(sep);
                return;
            }
            const div = document.createElement("div");
            div.className = "menu-option";
            div.innerHTML = `<span>${opt.label}</span><span class="shortcut">${opt.shortcut}</span>`;
            div.addEventListener("click", () => {
                closeMenu();
                opt.action();
            });
            dd.appendChild(div);
        });
    }

    function closeMenu() {
        openMenu = null;
        $("#menu-dropdown").classList.add("hidden");
        $$(".menu-item").forEach(m => m.classList.remove("open"));
    }

    document.addEventListener("click", () => { if (openMenu) closeMenu(); });

    // ========== MENU ACTIONS ==========
    function showNewCanvasModal() {
        showModal("New Canvas", `
            <label>Width: <input type="number" id="new-w" min="1" max="512" value="32"></label>
            <label>Height: <input type="number" id="new-h" min="1" max="512" value="32"></label>
        `, () => {
            const w = clamp(parseInt($("#new-w").value) || 32, 1, 512);
            const h = clamp(parseInt($("#new-h").value) || 32, 1, 512);
            initCanvas(w, h);
        });
    }

    function clearCanvas() {
        pushUndo();
        const layer = currentLayer();
        layer.data = new ImageData(S.canvasW, S.canvasH);
        render();
        updateTimelineThumbs();
        updateLayersList();
    }

    function showResizeModal() {
        showModal("Resize Canvas", `
            <label>Width: <input type="number" id="res-w" min="1" max="512" value="${S.canvasW}"></label>
            <label>Height: <input type="number" id="res-h" min="1" max="512" value="${S.canvasH}"></label>
        `, () => {
            const newW = clamp(parseInt($("#res-w").value) || S.canvasW, 1, 512);
            const newH = clamp(parseInt($("#res-h").value) || S.canvasH, 1, 512);
            resizeCanvas(newW, newH);
        });
    }

    function resizeCanvas(newW, newH) {
        pushUndo();
        S.frames.forEach(frame => {
            frame.layers.forEach(layer => {
                const newData = new ImageData(newW, newH);
                const oldD = layer.data.data;
                const newD = newData.data;
                const minW = Math.min(S.canvasW, newW);
                const minH = Math.min(S.canvasH, newH);
                for (let y = 0; y < minH; y++) {
                    for (let x = 0; x < minW; x++) {
                        const oi = (y * S.canvasW + x) * 4;
                        const ni = (y * newW + x) * 4;
                        newD[ni] = oldD[oi];
                        newD[ni+1] = oldD[oi+1];
                        newD[ni+2] = oldD[oi+2];
                        newD[ni+3] = oldD[oi+3];
                    }
                }
                layer.data = newData;
            });
        });
        S.canvasW = newW;
        S.canvasH = newH;
        S.selection = null;
        $("#canvas-size").textContent = newW + "x" + newH;
        centerCanvas();
        render();
        refreshUI();
    }

    function clearSelection() {
        if (!S.selection) return;
        pushUndo();
        const sel = S.selection;
        const layer = currentLayer();
        for (let y = sel.y; y < sel.y + sel.h; y++) {
            for (let x = sel.x; x < sel.x + sel.w; x++) {
                setPixel(layer.data, x, y, {r:0,g:0,b:0,a:0});
            }
        }
        S.selection = null;
        render();
        updateTimelineThumbs();
        updateLayersList();
    }

    function toggleGrid() {
        S.gridOn = !S.gridOn;
        render();
    }

    function zoomStep(dir) {
        if (dir > 0) S.zoom = Math.min(64, S.zoom * 2);
        else S.zoom = Math.max(1, S.zoom / 2);
        centerCanvas();
        render();
        $("#zoom-level").textContent = S.zoom + "x";
    }

    // ========== MODAL ==========
    function showModal(title, bodyHTML, onOk) {
        $("#modal-title").textContent = title;
        $("#modal-body").innerHTML = bodyHTML;
        $("#modal-overlay").classList.remove("hidden");

        const ok = $("#modal-ok");
        const cancel = $("#modal-cancel");

        const cleanup = () => {
            $("#modal-overlay").classList.add("hidden");
            ok.replaceWith(ok.cloneNode(true));
            cancel.replaceWith(cancel.cloneNode(true));
        };

        // Re-grab after clone
        setTimeout(() => {
            $("#modal-ok").addEventListener("click", () => { cleanup(); onOk(); });
            $("#modal-cancel").addEventListener("click", cleanup);
        }, 0);
    }

    // ========== EXPORT ==========
    function compositeFrame(frame) {
        const c = document.createElement("canvas");
        c.width = S.canvasW;
        c.height = S.canvasH;
        const cx = c.getContext("2d");
        for (let i = 0; i < frame.layers.length; i++) {
            const layer = frame.layers[i];
            if (!layer.visible) continue;
            cx.globalAlpha = layer.opacity / 100;
            const tc = document.createElement("canvas");
            tc.width = S.canvasW;
            tc.height = S.canvasH;
            tc.getContext("2d").putImageData(layer.data, 0, 0);
            cx.drawImage(tc, 0, 0);
        }
        return c;
    }

    function exportPNG() {
        const c = compositeFrame(currentFrame());
        const link = document.createElement("a");
        link.download = "pixel-art.png";
        link.href = c.toDataURL("image/png");
        link.click();
    }

    function exportSpritesheet() {
        const c = document.createElement("canvas");
        c.width = S.canvasW * S.frames.length;
        c.height = S.canvasH;
        const cx = c.getContext("2d");
        S.frames.forEach((frame, i) => {
            const fc = compositeFrame(frame);
            cx.drawImage(fc, i * S.canvasW, 0);
        });
        const link = document.createElement("a");
        link.download = "spritesheet.png";
        link.href = c.toDataURL("image/png");
        link.click();
    }

    // ========== GIF ENCODER (GIF89a with LZW) ==========
    function exportGIF() {
        const frames = S.frames.map(f => {
            const c = compositeFrame(f);
            return c.getContext("2d").getImageData(0, 0, S.canvasW, S.canvasH);
        });
        const delay = Math.round(100 / S.fps); // in centiseconds
        const gif = encodeGIF(frames, S.canvasW, S.canvasH, delay);
        const blob = new Blob([gif], { type: "image/gif" });
        const link = document.createElement("a");
        link.download = "animation.gif";
        link.href = URL.createObjectURL(blob);
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 5000);
    }

    function encodeGIF(frames, width, height, delay) {
        // Build global color table from all frames (quantize to 256)
        const colorMap = new Map();
        const allPixels = [];

        frames.forEach(frame => {
            const d = frame.data;
            const indexed = new Uint8Array(width * height);
            for (let i = 0; i < width * height; i++) {
                const off = i * 4;
                const a = d[off + 3];
                let r, g, b;
                if (a < 128) {
                    r = 0; g = 0; b = 0; // transparent
                } else {
                    // Quantize to 5 bits per channel for palette reduction
                    r = d[off] & 0xF8;
                    g = d[off + 1] & 0xF8;
                    b = d[off + 2] & 0xF8;
                }
                const key = (r << 16) | (g << 8) | b;
                if (!colorMap.has(key)) {
                    if (colorMap.size < 255) {
                        colorMap.set(key, colorMap.size + 1); // 0 is transparent
                    }
                }
                indexed[i] = a < 128 ? 0 : (colorMap.get(key) || 1);
            }
            allPixels.push(indexed);
        });

        // Build palette
        const palSize = 256;
        const palette = new Uint8Array(palSize * 3);
        // Index 0 = transparent color (black)
        palette[0] = 0; palette[1] = 0; palette[2] = 0;
        colorMap.forEach((idx, key) => {
            palette[idx * 3] = (key >> 16) & 0xFF;
            palette[idx * 3 + 1] = (key >> 8) & 0xFF;
            palette[idx * 3 + 2] = key & 0xFF;
        });

        // Build binary
        const buf = [];
        const writeByte = (b) => buf.push(b & 0xFF);
        const writeShort = (v) => { writeByte(v & 0xFF); writeByte((v >> 8) & 0xFF); };
        const writeStr = (s) => { for (let i = 0; i < s.length; i++) writeByte(s.charCodeAt(i)); };

        // Header
        writeStr("GIF89a");

        // Logical Screen Descriptor
        writeShort(width);
        writeShort(height);
        writeByte(0xF7); // GCT flag, 8 bits color resolution, 256 colors
        writeByte(0);    // Background color index
        writeByte(0);    // Pixel aspect ratio

        // Global Color Table (256 * 3 bytes)
        for (let i = 0; i < palSize * 3; i++) writeByte(palette[i]);

        // Netscape extension for looping
        writeByte(0x21); // Extension
        writeByte(0xFF); // Application Extension
        writeByte(11);   // Block size
        writeStr("NETSCAPE2.0");
        writeByte(3);    // Sub-block size
        writeByte(1);    // Loop sub-block id
        writeShort(0);   // Loop count (0 = infinite)
        writeByte(0);    // Block terminator

        // Frames
        allPixels.forEach(indexed => {
            // Graphic Control Extension
            writeByte(0x21); // Extension
            writeByte(0xF9); // GCE
            writeByte(4);    // Block size
            writeByte(0x09); // Disposal: restore to bg, transparent flag
            writeShort(delay);
            writeByte(0);    // Transparent color index
            writeByte(0);    // Block terminator

            // Image Descriptor
            writeByte(0x2C);
            writeShort(0);   // Left
            writeShort(0);   // Top
            writeShort(width);
            writeShort(height);
            writeByte(0);    // No local color table

            // LZW compressed data
            const minCodeSize = 8;
            writeByte(minCodeSize);
            const compressed = lzwEncode(indexed, minCodeSize);
            // Write sub-blocks
            let pos = 0;
            while (pos < compressed.length) {
                const chunkSize = Math.min(255, compressed.length - pos);
                writeByte(chunkSize);
                for (let i = 0; i < chunkSize; i++) writeByte(compressed[pos++]);
            }
            writeByte(0); // Block terminator
        });

        // Trailer
        writeByte(0x3B);

        return new Uint8Array(buf);
    }

    function lzwEncode(indexed, minCodeSize) {
        const clearCode = 1 << minCodeSize;
        const eoiCode = clearCode + 1;
        let codeSize = minCodeSize + 1;
        let nextCode = eoiCode + 1;
        const maxCodeSize = 12;
        const maxCode = 1 << maxCodeSize;

        // Output buffer (bit packer)
        const output = [];
        let curByte = 0;
        let curBits = 0;

        function writeCode(code) {
            curByte |= (code << curBits);
            curBits += codeSize;
            while (curBits >= 8) {
                output.push(curByte & 0xFF);
                curByte >>= 8;
                curBits -= 8;
            }
        }

        // Dictionary
        let dict = new Map();
        function resetDict() {
            dict = new Map();
            for (let i = 0; i < clearCode; i++) {
                dict.set(String.fromCharCode(i), i);
            }
            nextCode = eoiCode + 1;
            codeSize = minCodeSize + 1;
        }

        resetDict();
        writeCode(clearCode);

        let cur = "";
        for (let i = 0; i < indexed.length; i++) {
            const ch = String.fromCharCode(indexed[i]);
            const combined = cur + ch;
            if (dict.has(combined)) {
                cur = combined;
            } else {
                writeCode(dict.get(cur));
                if (nextCode < maxCode) {
                    dict.set(combined, nextCode++);
                    if (nextCode > (1 << codeSize) && codeSize < maxCodeSize) {
                        codeSize++;
                    }
                } else {
                    writeCode(clearCode);
                    resetDict();
                }
                cur = ch;
            }
        }

        if (cur.length > 0) writeCode(dict.get(cur));
        writeCode(eoiCode);

        // Flush remaining bits
        if (curBits > 0) output.push(curByte & 0xFF);

        return output;
    }

    // ========== KEYBOARD SHORTCUTS ==========
    document.addEventListener("keydown", (e) => {
        // Don't capture when typing in inputs
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

        if (e.key === " " || e.code === "Space") {
            e.preventDefault();
            spaceDown = true;
            container.classList.add("panning");
            return;
        }

        if (e.ctrlKey || e.metaKey) {
            if (e.key === "z" || e.key === "Z") { e.preventDefault(); undo(); return; }
            if (e.key === "y" || e.key === "Y") { e.preventDefault(); redo(); return; }
            if (e.key === "n" || e.key === "N") { e.preventDefault(); showNewCanvasModal(); return; }
            return;
        }

        const keyMap = {
            "b": "pencil", "e": "eraser", "l": "line", "r": "rect",
            "o": "ellipse", "g": "fill", "i": "eyedropper", "m": "selection"
        };

        const lower = e.key.toLowerCase();
        if (keyMap[lower]) {
            selectTool(keyMap[lower]);
            return;
        }

        if (lower === "x") { swapColors(); return; }
        if (e.key === "+" || e.key === "=") { zoomStep(1); return; }
        if (e.key === "-") { zoomStep(-1); return; }
        if (e.key === "Delete") { clearSelection(); return; }
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === " " || e.code === "Space") {
            spaceDown = false;
            if (!panning) container.classList.remove("panning");
        }
    });

    // ========== MARCHING ANTS ANIMATION ==========
    marchTimer = setInterval(() => {
        if (S.selection) {
            marchOffset = (marchOffset + 1) % 8;
            render();
        }
    }, 150);

    // ========== INIT ==========
    function initCanvas(w, h) {
        S.canvasW = w;
        S.canvasH = h;
        S.frames = [createFrame()];
        S.currentFrameIndex = 0;
        S.activeLayerIndex = 0;
        S.undoStack = [];
        S.redoStack = [];
        S.selection = null;
        $("#canvas-size").textContent = w + "x" + h;
        centerCanvas();
        render();
        refreshUI();
    }

    function refreshUI() {
        updateColorUI();
        updateLayersList();
        updateTimelineThumbs();
        $("#zoom-level").textContent = S.zoom + "x";
    }

    // Resize observer for canvas container
    const ro = new ResizeObserver(() => {
        render();
    });
    ro.observe(container);

    // Start
    buildPalette();
    initCanvas(32, 32);

})();
