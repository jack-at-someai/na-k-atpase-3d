// renderer.js — Camera, 3D cuboid rendering, kernel overlay, data flow particles

class Camera {
    constructor() {
        this.theta = 0.4;    // horizontal angle
        this.phi = 0.35;     // vertical angle
        this.dist = 600;     // distance from target
        this.target = new Vec(0, 0, 0);
        this.fov = 800;      // perspective strength
        this.minDist = 200;
        this.maxDist = 2000;
    }

    getPosition() {
        return new Vec(
            this.target.x + this.dist * Math.sin(this.theta) * Math.cos(this.phi),
            this.target.y - this.dist * Math.sin(this.phi),
            this.target.z + this.dist * Math.cos(this.theta) * Math.cos(this.phi)
        );
    }

    getViewMatrix() {
        const pos = this.getPosition();
        const forward = this.target.sub(pos).norm();
        const worldUp = new Vec(0, 1, 0);
        const right = forward.cross(worldUp).norm();
        const up = right.cross(forward).norm();
        return { pos, forward, right, up };
    }

    project(point, cx, cy) {
        const view = this.getViewMatrix();
        const rel = point.sub(view.pos);
        const x = rel.dot(view.right);
        const y = rel.dot(view.up);
        const z = rel.dot(view.forward);
        if (z < 1) return null; // behind camera
        const scale = this.fov / z;
        return { x: cx + x * scale, y: cy - y * scale, z, scale };
    }

    orbit(dTheta, dPhi) {
        this.theta += dTheta;
        this.phi = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.phi + dPhi));
    }

    zoom(delta) {
        this.dist = Math.max(this.minDist, Math.min(this.maxDist, this.dist + delta));
    }
}

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = new Camera();
        this.width = 0;
        this.height = 0;
        this.resize();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    clear() {
        const ctx = this.ctx;
        // Dark gradient background with subtle vignette
        const grad = ctx.createRadialGradient(
            this.width / 2, this.height / 2, this.width * 0.15,
            this.width / 2, this.height / 2, this.width * 0.85
        );
        grad.addColorStop(0, '#111118');
        grad.addColorStop(1, '#07070b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    // --- 3D cuboid rendering ---
    getCuboidDimensions(layer) {
        const s = layer.outputShape;
        const scaleBase = 3.5;
        let w, h, d;
        if (layer.type === 'fc' || layer.type === 'output' || layer.type === 'flatten') {
            w = 8;
            h = Math.min(80, Math.max(20, Math.sqrt(s.c) * 2.5));
            d = 8;
        } else {
            w = s.w * scaleBase;
            h = s.h * scaleBase;
            d = Math.max(6, s.c * 2.5);
        }
        return { w, h, d };
    }

    getCuboidCorners(layer) {
        const dim = this.getCuboidDimensions(layer);
        const pos = layer.position3D;
        const hw = dim.w / 2, hh = dim.h / 2, hd = dim.d / 2;
        return [
            pos.add(new Vec(-hd, -hh, -hw)), // 0: back-bottom-left
            pos.add(new Vec( hd, -hh, -hw)), // 1: back-bottom-right
            pos.add(new Vec( hd,  hh, -hw)), // 2: back-top-right
            pos.add(new Vec(-hd,  hh, -hw)), // 3: back-top-left
            pos.add(new Vec(-hd, -hh,  hw)), // 4: front-bottom-left
            pos.add(new Vec( hd, -hh,  hw)), // 5: front-bottom-right
            pos.add(new Vec( hd,  hh,  hw)), // 6: front-top-right
            pos.add(new Vec(-hd,  hh,  hw)), // 7: front-top-left
        ];
    }

    drawLayerCuboid(layer, isSelected, isHovered, time) {
        const ctx = this.ctx;
        const cx = this.width / 2, cy = this.height / 2;
        const corners3D = this.getCuboidCorners(layer);
        const corners2D = corners3D.map(c => this.camera.project(c, cx, cy));

        if (corners2D.some(c => c === null)) return;

        const color = layer.getColor();
        const t = time || 0;

        // Breathing pulse for hovered/selected
        const pulse = isSelected ? 0.06 * Math.sin(t * 3) : (isHovered ? 0.03 * Math.sin(t * 4) : 0);

        const faces = [
            { indices: [0, 1, 2, 3], name: 'back' },
            { indices: [4, 5, 6, 7], name: 'front' },
            { indices: [0, 4, 7, 3], name: 'left' },
            { indices: [1, 5, 6, 2], name: 'right' },
            { indices: [3, 2, 6, 7], name: 'top' },
            { indices: [0, 1, 5, 4], name: 'bottom' },
        ];

        // Backface culling + depth sorting
        const visibleFaces = [];
        for (const face of faces) {
            const pts = face.indices.map(i => corners2D[i]);
            const pts3D = face.indices.map(i => corners3D[i]);

            const e1 = pts3D[1].sub(pts3D[0]);
            const e2 = pts3D[3].sub(pts3D[0]);
            const normal = e1.cross(e2).norm();
            const camPos = this.camera.getPosition();
            const toCamera = camPos.sub(pts3D[0]).norm();

            if (normal.dot(toCamera) > 0) {
                const avgZ = pts.reduce((sum, p) => sum + p.z, 0) / pts.length;
                // Compute facing strength for lighting
                const facing = Math.max(0, normal.dot(toCamera));
                visibleFaces.push({ ...face, pts, avgZ, facing });
            }
        }

        visibleFaces.sort((a, b) => b.avgZ - a.avgZ);

        // Outer glow (drawn behind faces) for selected/hovered
        if (isSelected || isHovered) {
            const center = corners2D.reduce((acc, p) => ({ x: acc.x + p.x / 8, y: acc.y + p.y / 8 }), { x: 0, y: 0 });
            const avgScale = corners2D.reduce((acc, p) => acc + p.scale, 0) / 8;
            const glowSize = Math.max(50, avgScale * 40);
            const glowAlpha = isSelected ? 0.2 + pulse : 0.1;
            ctx.save();
            ctx.shadowColor = `rgba(${color.r},${color.g},${color.b},${glowAlpha})`;
            ctx.shadowBlur = isSelected ? 30 : 15;
            ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.01)`;
            ctx.beginPath();
            ctx.arc(center.x, center.y, glowSize * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        for (const face of visibleFaces) {
            ctx.beginPath();
            ctx.moveTo(face.pts[0].x, face.pts[0].y);
            for (let i = 1; i < face.pts.length; i++) {
                ctx.lineTo(face.pts[i].x, face.pts[i].y);
            }
            ctx.closePath();

            // Much more visible face fills with directional shading
            let baseAlpha = 0.28;
            if (face.name === 'top') baseAlpha = 0.42;
            else if (face.name === 'front') baseAlpha = 0.35;
            else if (face.name === 'left' || face.name === 'right') baseAlpha = 0.30;
            else if (face.name === 'bottom') baseAlpha = 0.18;
            baseAlpha += pulse;
            if (isSelected) baseAlpha += 0.15;
            if (isHovered) baseAlpha += 0.08;

            // Gradient fill on each face for depth feel
            const fc = face.pts;
            const faceGrad = ctx.createLinearGradient(
                (fc[0].x + fc[3].x) / 2, (fc[0].y + fc[3].y) / 2,
                (fc[1].x + fc[2].x) / 2, (fc[1].y + fc[2].y) / 2
            );
            const cr = color.r, cg = color.g, cb = color.b;
            faceGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${baseAlpha})`);
            faceGrad.addColorStop(1, `rgba(${Math.round(cr * 0.7)},${Math.round(cg * 0.7)},${Math.round(cb * 0.7)},${baseAlpha * 0.75})`);
            ctx.fillStyle = faceGrad;
            ctx.fill();

            // Bold vivid edges
            let edgeAlpha = 0.7;
            let edgeWidth = 1.5;
            if (isSelected) { edgeAlpha = 1.0; edgeWidth = 2.5; }
            else if (isHovered) { edgeAlpha = 0.85; edgeWidth = 2; }

            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${edgeAlpha})`;
            ctx.lineWidth = edgeWidth;
            ctx.stroke();
        }

        // Inner highlight line on top edge for gloss
        if (visibleFaces.some(f => f.name === 'top')) {
            const topFace = visibleFaces.find(f => f.name === 'top');
            if (topFace) {
                ctx.beginPath();
                ctx.moveTo(topFace.pts[0].x, topFace.pts[0].y);
                ctx.lineTo(topFace.pts[1].x, topFace.pts[1].y);
                ctx.strokeStyle = `rgba(255,255,255,0.08)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    drawLayerLabel(layer) {
        const ctx = this.ctx;
        const cx = this.width / 2, cy = this.height / 2;
        const dim = this.getCuboidDimensions(layer);
        const labelPos = layer.position3D.add(new Vec(0, dim.h / 2 + 14, 0));
        const proj = this.camera.project(labelPos, cx, cy);
        if (!proj || proj.z < 1) return;

        const color = layer.getColor();
        const fontSize = Math.max(10, Math.min(14, proj.scale * 9));

        ctx.save();
        ctx.shadowColor = `rgba(0,0,0,0.7)`;
        ctx.shadowBlur = 4;
        ctx.font = `600 ${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
        ctx.fillText(layer.getShortLabel(), proj.x, proj.y - 4);

        ctx.font = `${Math.max(9, Math.min(11, proj.scale * 7))}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.fillStyle = `rgba(200,200,220,0.6)`;
        ctx.fillText(layer.getDimsLabel(), proj.x, proj.y + 12);
        ctx.restore();
    }

    drawFeatureMapHeatmap(layer) {
        if (!layer.featureMapData || layer.type === 'flatten' || layer.type === 'fc' || layer.type === 'output') return;

        const ctx = this.ctx;
        const cx = this.width / 2, cy = this.height / 2;
        const corners3D = this.getCuboidCorners(layer);
        // Draw on front face (indices 4,5,6,7)
        const frontCorners = [4, 5, 6, 7].map(i => this.camera.project(corners3D[i], cx, cy));
        if (frontCorners.some(c => c === null)) return;

        // Check if front face is visible
        const e1 = corners3D[5].sub(corners3D[4]);
        const e2 = corners3D[7].sub(corners3D[4]);
        const normal = e1.cross(e2).norm();
        const toCamera = this.camera.getPosition().sub(corners3D[4]).norm();
        if (normal.dot(toCamera) <= 0) return;

        const s = layer.outputShape;
        const gridW = s.w, gridH = s.h;
        const data = layer.featureMapData;

        // Find data range for first channel
        let minVal = Infinity, maxVal = -Infinity;
        for (let i = 0; i < gridW * gridH; i++) {
            const v = data[i] || 0;
            if (v < minVal) minVal = v;
            if (v > maxVal) maxVal = v;
        }
        const range = maxVal - minVal || 1;

        // Draw cells using bilinear interpolation on projected corners
        for (let gy = 0; gy < gridH; gy++) {
            for (let gx = 0; gx < gridW; gx++) {
                const u0 = gx / gridW, u1 = (gx + 1) / gridW;
                const v0 = gy / gridH, v1 = (gy + 1) / gridH;

                // Bilinear interpolation of corners: BL=4, BR=5, TR=6, TL=7
                // Note: y is inverted (top=7,6, bottom=4,5)
                const tl = this._bilerp(frontCorners, u0, 1 - v0);
                const tr = this._bilerp(frontCorners, u1, 1 - v0);
                const br = this._bilerp(frontCorners, u1, 1 - v1);
                const bl = this._bilerp(frontCorners, u0, 1 - v1);

                const val = (data[gy * gridW + gx] - minVal) / range;
                const hue = (1 - val) * 240; // blue(0) to red(1)
                ctx.fillStyle = `hsla(${hue}, 85%, 55%, 0.7)`;
                ctx.beginPath();
                ctx.moveTo(tl.x, tl.y);
                ctx.lineTo(tr.x, tr.y);
                ctx.lineTo(br.x, br.y);
                ctx.lineTo(bl.x, bl.y);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    _bilerp(corners, u, v) {
        // corners: [BL(4), BR(5), TR(6), TL(7)]
        const bl = corners[0], br = corners[1], tr = corners[2], tl = corners[3];
        return {
            x: (1 - u) * (1 - v) * bl.x + u * (1 - v) * br.x + u * v * tr.x + (1 - u) * v * tl.x,
            y: (1 - u) * (1 - v) * bl.y + u * (1 - v) * br.y + u * v * tr.y + (1 - u) * v * tl.y
        };
    }

    drawKernelOverlay(layer, kernelPos, architecture) {
        if (layer.type !== 'conv') return;
        const ctx = this.ctx;
        const cx = this.width / 2, cy = this.height / 2;

        // Find previous layer
        const idx = architecture.layers.indexOf(layer);
        if (idx <= 0) return;
        const prevLayer = architecture.layers[idx - 1];

        const prevCorners3D = this.getCuboidCorners(prevLayer);
        // Front face of previous layer
        const frontCorners = [4, 5, 6, 7].map(i => this.camera.project(prevCorners3D[i], cx, cy));
        if (frontCorners.some(c => c === null)) return;

        const inShape = layer.inputShape;
        const kSize = layer.config.kernelSize;
        const stride = layer.config.stride;
        const padding = layer.config.padding;

        // Kernel position on input
        const kx = (kernelPos.x * stride - padding) / inShape.w;
        const ky = (kernelPos.y * stride - padding) / inShape.h;
        const kw = kSize / inShape.w;
        const kh = kSize / inShape.h;

        const tl = this._bilerp(frontCorners, Math.max(0, kx), 1 - Math.max(0, ky));
        const tr = this._bilerp(frontCorners, Math.min(1, kx + kw), 1 - Math.max(0, ky));
        const br = this._bilerp(frontCorners, Math.min(1, kx + kw), 1 - Math.min(1, ky + kh));
        const bl = this._bilerp(frontCorners, Math.max(0, kx), 1 - Math.min(1, ky + kh));

        const color = LAYER_COLORS.conv;
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.9)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.2)`;
        ctx.fill();

        // Line from kernel center to corresponding output cell
        const kernelCenter = {
            x: (tl.x + tr.x + br.x + bl.x) / 4,
            y: (tl.y + tr.y + br.y + bl.y) / 4
        };

        const layerCorners3D = this.getCuboidCorners(layer);
        const layerFront = [4, 5, 6, 7].map(i => this.camera.project(layerCorners3D[i], cx, cy));
        if (layerFront.some(c => c === null)) return;

        const outShape = layer.outputShape;
        const ou = (kernelPos.x + 0.5) / outShape.w;
        const ov = (kernelPos.y + 0.5) / outShape.h;
        const outPt = this._bilerp(layerFront, ou, 1 - ov);

        ctx.beginPath();
        ctx.moveTo(kernelCenter.x, kernelCenter.y);
        ctx.lineTo(outPt.x, outPt.y);
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.4)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawConnectionLines(layers, time) {
        const ctx = this.ctx;
        const cx = this.width / 2, cy = this.height / 2;
        const t = time || 0;

        for (let i = 0; i < layers.length - 1; i++) {
            const from = layers[i];
            const to = layers[i + 1];
            const fromDim = this.getCuboidDimensions(from);
            const toDim = this.getCuboidDimensions(to);

            const fromColor = from.getColor();
            const toColor = to.getColor();

            const isFanout = (to.type === 'flatten' || to.type === 'fc' || to.type === 'output') &&
                             (from.type !== 'fc' && from.type !== 'output' && from.type !== 'flatten');

            const numLines = isFanout ? 7 : 3;
            for (let j = 0; j < numLines; j++) {
                const frac = (j + 0.5) / numLines;
                const fromYOff = (frac - 0.5) * fromDim.h * (isFanout ? 0.8 : 0.6);
                const toYOff = (frac - 0.5) * toDim.h * (isFanout ? 0.8 : 0.6);
                const fromPt = from.position3D.add(new Vec(fromDim.d / 2, fromYOff, 0));
                const toPt = to.position3D.add(new Vec(-toDim.d / 2, toYOff, 0));
                const midPt = fromPt.lerp(toPt, 0.5).add(new Vec(0, 4, 0)); // slight arc
                const p1 = this.camera.project(fromPt, cx, cy);
                const p2 = this.camera.project(toPt, cx, cy);
                const pm = this.camera.project(midPt, cx, cy);
                if (p1 && p2 && pm) {
                    // Gradient from source to target color
                    const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    grad.addColorStop(0, `rgba(${fromColor.r},${fromColor.g},${fromColor.b},0.25)`);
                    grad.addColorStop(1, `rgba(${toColor.r},${toColor.g},${toColor.b},0.25)`);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.quadraticCurveTo(pm.x, pm.y, p2.x, p2.y);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    drawDataFlowParticles(particles) {
        const ctx = this.ctx;
        const cx = this.width / 2, cy = this.height / 2;

        for (const p of particles) {
            const proj = this.camera.project(p.pos, cx, cy);
            if (!proj || proj.z < 1) continue;

            const cr = p.color.r, cg = p.color.g, cb = p.color.b;
            const life = 1 - Math.abs(p.t * 2 - 1); // fade in/out
            const size = Math.max(3, proj.scale * 5) * (0.6 + life * 0.4);

            // Trail: draw previous positions
            if (p.trail && p.trail.length > 1) {
                ctx.beginPath();
                let first = true;
                for (let ti = 0; ti < p.trail.length; ti++) {
                    const tp = this.camera.project(p.trail[ti], cx, cy);
                    if (!tp) continue;
                    if (first) { ctx.moveTo(tp.x, tp.y); first = false; }
                    else ctx.lineTo(tp.x, tp.y);
                }
                const trailAlpha = life * 0.35;
                ctx.strokeStyle = `rgba(${cr},${cg},${cb},${trailAlpha})`;
                ctx.lineWidth = size * 0.4;
                ctx.lineCap = 'round';
                ctx.stroke();
            }

            // Outer glow
            ctx.save();
            ctx.shadowColor = `rgba(${cr},${cg},${cb},${life * 0.6})`;
            ctx.shadowBlur = size * 2;

            // Core dot
            const gradient = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, size);
            gradient.addColorStop(0, `rgba(${Math.min(255, cr + 80)},${Math.min(255, cg + 80)},${Math.min(255, cb + 80)},${life * 0.95})`);
            gradient.addColorStop(0.4, `rgba(${cr},${cg},${cb},${life * 0.7})`);
            gradient.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    drawGroundGrid(layers) {
        const ctx = this.ctx;
        const cx = this.width / 2, cy = this.height / 2;

        const gridY = -60;
        const gridSize = 500;
        const step = 40;

        for (let x = -gridSize; x <= gridSize; x += step) {
            const p1 = this.camera.project(new Vec(x, gridY, -gridSize), cx, cy);
            const p2 = this.camera.project(new Vec(x, gridY, gridSize), cx, cy);
            if (p1 && p2) {
                // Fade based on distance from center
                const dist = Math.abs(x) / gridSize;
                const alpha = 0.12 * (1 - dist * 0.7);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(110,110,160,${alpha})`;
                ctx.lineWidth = x === 0 ? 1 : 0.5;
                ctx.stroke();
            }
        }
        for (let z = -gridSize; z <= gridSize; z += step) {
            const p1 = this.camera.project(new Vec(-gridSize, gridY, z), cx, cy);
            const p2 = this.camera.project(new Vec(gridSize, gridY, z), cx, cy);
            if (p1 && p2) {
                const dist = Math.abs(z) / gridSize;
                const alpha = 0.12 * (1 - dist * 0.7);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(110,110,160,${alpha})`;
                ctx.lineWidth = z === 0 ? 1 : 0.5;
                ctx.stroke();
            }
        }
    }

    hitTestLayers(mx, my, layers) {
        const cx = this.width / 2, cy = this.height / 2;
        let closest = null;
        let closestZ = Infinity;

        for (const layer of layers) {
            const corners3D = this.getCuboidCorners(layer);
            const corners2D = corners3D.map(c => this.camera.project(c, cx, cy));
            if (corners2D.some(c => c === null)) continue;

            // Bounding rect of projected corners
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            let avgZ = 0;
            for (const c of corners2D) {
                if (c.x < minX) minX = c.x;
                if (c.y < minY) minY = c.y;
                if (c.x > maxX) maxX = c.x;
                if (c.y > maxY) maxY = c.y;
                avgZ += c.z;
            }
            avgZ /= corners2D.length;

            if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
                if (avgZ < closestZ) {
                    closestZ = avgZ;
                    closest = layer;
                }
            }
        }
        return closest;
    }

    drawInfoPanelMiniDiagram(ctx, type, x, y, w, h) {
        ctx.save();
        const color = LAYER_COLORS[type] || LAYER_COLORS.input;

        switch (type) {
            case 'conv':
            case 'input':
                this._drawKernelDiagram(ctx, x, y, w, h, color);
                break;
            case 'pool':
                this._drawPoolDiagram(ctx, x, y, w, h, color);
                break;
            case 'flatten':
                this._drawFlattenDiagram(ctx, x, y, w, h, color);
                break;
            case 'fc':
            case 'output':
                this._drawFCDiagram(ctx, x, y, w, h, color);
                break;
        }
        ctx.restore();
    }

    _drawKernelDiagram(ctx, x, y, w, h, color) {
        const cellSize = Math.min(w, h) / 7;
        const gridX = x + 10;
        const gridY = y + (h - cellSize * 5) / 2;

        // Input grid 5x5
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.3)`;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(gridX + c * cellSize, gridY + r * cellSize, cellSize, cellSize);
            }
        }

        // Kernel 3x3 highlighted
        const kx = 1, ky = 1;
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.25)`;
        ctx.fillRect(gridX + kx * cellSize, gridY + ky * cellSize, cellSize * 3, cellSize * 3);
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.9)`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(gridX + kx * cellSize, gridY + ky * cellSize, cellSize * 3, cellSize * 3);

        // Arrow
        const arrowX = gridX + 5 * cellSize + 15;
        const arrowY = gridY + 2.5 * cellSize;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 20, arrowY);
        ctx.lineTo(arrowX + 15, arrowY - 4);
        ctx.moveTo(arrowX + 20, arrowY);
        ctx.lineTo(arrowX + 15, arrowY + 4);
        ctx.strokeStyle = `rgba(200,200,220,0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Output cell
        const outX = arrowX + 30;
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.4)`;
        ctx.fillRect(outX, arrowY - cellSize / 2, cellSize, cellSize);
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.8)`;
        ctx.strokeRect(outX, arrowY - cellSize / 2, cellSize, cellSize);
    }

    _drawPoolDiagram(ctx, x, y, w, h, color) {
        const cellSize = Math.min(w, h) / 6;
        const gridX = x + 10;
        const gridY = y + (h - cellSize * 4) / 2;
        const vals = [[1, 3, 2, 1], [4, 6, 5, 2], [3, 1, 7, 4], [2, 5, 3, 8]];

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const isMax = (r < 2 && c < 2 && vals[r][c] === 6) ||
                              (r < 2 && c >= 2 && vals[r][c] === 5) ||
                              (r >= 2 && c < 2 && vals[r][c] === 7) ||
                              (r >= 2 && c >= 2 && vals[r][c] === 8);
                ctx.fillStyle = isMax ? `rgba(${color.r},${color.g},${color.b},0.4)` : 'transparent';
                ctx.fillRect(gridX + c * cellSize, gridY + r * cellSize, cellSize, cellSize);
                ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.3)`;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(gridX + c * cellSize, gridY + r * cellSize, cellSize, cellSize);
                ctx.fillStyle = `rgba(200,200,220,${isMax ? 0.9 : 0.4})`;
                ctx.font = `${cellSize * 0.5}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(vals[r][c], gridX + c * cellSize + cellSize / 2, gridY + r * cellSize + cellSize / 2);
            }
        }
        // Pool boundary lines
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.6)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(gridX + 2 * cellSize, gridY);
        ctx.lineTo(gridX + 2 * cellSize, gridY + 4 * cellSize);
        ctx.moveTo(gridX, gridY + 2 * cellSize);
        ctx.lineTo(gridX + 4 * cellSize, gridY + 2 * cellSize);
        ctx.stroke();
    }

    _drawFlattenDiagram(ctx, x, y, w, h, color) {
        const cellSize = Math.min(w, h) / 6;
        const gridX = x + 10;
        const gridY = y + (h - cellSize * 3) / 2;

        // 3x3 grid
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.15)`;
                ctx.fillRect(gridX + c * cellSize, gridY + r * cellSize, cellSize, cellSize);
                ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.4)`;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(gridX + c * cellSize, gridY + r * cellSize, cellSize, cellSize);
            }
        }

        // Arrow
        const arrowX = gridX + 3 * cellSize + 15;
        const arrowY = gridY + 1.5 * cellSize;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 20, arrowY);
        ctx.lineTo(arrowX + 15, arrowY - 4);
        ctx.moveTo(arrowX + 20, arrowY);
        ctx.lineTo(arrowX + 15, arrowY + 4);
        ctx.strokeStyle = 'rgba(200,200,220,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Column
        const colX = arrowX + 30;
        const colH = cellSize * 3;
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.2)`;
        ctx.fillRect(colX, gridY, cellSize * 0.7, colH);
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.6)`;
        ctx.strokeRect(colX, gridY, cellSize * 0.7, colH);
    }

    _drawFCDiagram(ctx, x, y, w, h, color) {
        const cxd = x + w * 0.3;
        const cxd2 = x + w * 0.7;
        const cy = y + h / 2;
        const leftNodes = 4;
        const rightNodes = 3;
        const spacing = h / (Math.max(leftNodes, rightNodes) + 1);

        for (let i = 0; i < leftNodes; i++) {
            for (let j = 0; j < rightNodes; j++) {
                ctx.beginPath();
                ctx.moveTo(cxd, cy + (i - (leftNodes - 1) / 2) * spacing);
                ctx.lineTo(cxd2, cy + (j - (rightNodes - 1) / 2) * spacing);
                ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.15)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        for (let i = 0; i < leftNodes; i++) {
            const ny = cy + (i - (leftNodes - 1) / 2) * spacing;
            ctx.beginPath();
            ctx.arc(cxd, ny, 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.6)`;
            ctx.fill();
        }
        for (let j = 0; j < rightNodes; j++) {
            const ny = cy + (j - (rightNodes - 1) / 2) * spacing;
            ctx.beginPath();
            ctx.arc(cxd2, ny, 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.6)`;
            ctx.fill();
        }
    }
}
