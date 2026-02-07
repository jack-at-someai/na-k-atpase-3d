// app.js — State, animation loop, UI bindings, mouse interaction

const App = (() => {
    // --- State ---
    let renderer = null;
    let architecture = null;
    let selectedLayer = null;
    let hoveredLayer = null;
    let currentPreset = 'simple';
    let currentPattern = 'checkerboard';
    let mode = 'explore'; // explore | animate
    let paused = false;
    let speed = 1;
    let time = 0;
    let lastFrameTime = 0;
    let frameCount = 0;
    let fpsDisplay = 0;
    let fpsTimer = 0;

    // Animation state
    let kernelPositions = {}; // layerId -> {x, y}
    let particles = [];
    let animPhase = 0;

    // Visual toggles
    let showKernel = true;
    let showDataFlow = true;
    let showGrid = true;
    let showDimensions = true;
    let showHeatmap = true;

    // Mouse
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };

    // --- Init ---
    function init() {
        const canvas = document.getElementById('canvas');
        renderer = new Renderer(canvas);

        loadPreset('simple');
        bindEvents();
        buildSidebar();
        lastFrameTime = performance.now();
        requestAnimationFrame(loop);
    }

    function loadPreset(name) {
        currentPreset = name;
        architecture = createPreset(name);
        selectedLayer = null;
        hoveredLayer = null;
        kernelPositions = {};
        particles = [];

        // Run forward pass
        const inputData = generateInputPattern(currentPattern, architecture.inputSize);
        architecture.simulateForwardPass(inputData);

        buildLayerList();
        updateInfoPanel();
        updateStats();
        updateSelectedLayerControls();

        const sel = document.getElementById('preset-select');
        if (sel) sel.value = name;
    }

    function changeInputPattern(pattern) {
        currentPattern = pattern;
        const inputData = generateInputPattern(pattern, architecture.inputSize);
        architecture.simulateForwardPass(inputData);

        // Update active thumbnail
        document.querySelectorAll('.pattern-tile').forEach(el => {
            el.classList.toggle('active', el.dataset.pattern === pattern);
        });
    }

    // --- Animation Loop ---
    function loop(timestamp) {
        const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.05);
        lastFrameTime = timestamp;

        // FPS
        frameCount++;
        fpsTimer += dt;
        if (fpsTimer >= 0.5) {
            fpsDisplay = Math.round(frameCount / fpsTimer);
            frameCount = 0;
            fpsTimer = 0;
            updateStats();
        }

        if (!paused) {
            step(dt);
        }
        render();
        requestAnimationFrame(loop);
    }

    function step(dt) {
        time += dt * speed;

        // Gentle idle camera drift when not dragging
        if (!isDragging) {
            renderer.camera.orbit(dt * 0.03, 0);
        }

        // Always update particles (ambient flow even in explore mode)
        updateParticles(dt);

        if (mode === 'animate') {
            animPhase += dt * speed;
            updateKernelAnimation(dt);
        }

        // Ambient particle spawning in explore mode too
        if (mode === 'explore' && architecture) {
            spawnAmbientParticles(dt);
        }
    }

    function updateKernelAnimation(dt) {
        for (const layer of architecture.layers) {
            if (layer.type !== 'conv') continue;
            const outW = layer.outputShape.w;
            const outH = layer.outputShape.h;
            if (!kernelPositions[layer.id]) {
                kernelPositions[layer.id] = { x: 0, y: 0 };
            }
            const kp = kernelPositions[layer.id];
            const rate = 3 * speed;
            kp.x += dt * rate;
            if (kp.x >= outW) {
                kp.x = 0;
                kp.y += 1;
                if (kp.y >= outH) {
                    kp.y = 0;
                    // Spawn particles when kernel completes a pass
                    spawnParticles(layer);
                }
            }
        }
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function createParticle(from, to, fromDim, toDim, color, speedMul) {
        const yOff = (Math.random() - 0.5) * fromDim.h * 0.7;
        const zOff = (Math.random() - 0.5) * 10;
        const startPos = from.position3D.add(new Vec(fromDim.d / 2, yOff, zOff));
        const endPos = to.position3D.add(new Vec(-toDim.d / 2, yOff * (toDim.h / Math.max(1, fromDim.h)), zOff));
        return {
            startPos,
            pos: startPos.clone(),
            target: endPos,
            arcHeight: (Math.random() - 0.5) * 15,
            t: 0,
            speed: (0.5 + Math.random() * 0.6) * (speedMul || 1),
            color,
            trail: [startPos.clone()]
        };
    }

    function spawnParticles(fromLayer) {
        const idx = architecture.layers.indexOf(fromLayer);
        if (idx >= architecture.layers.length - 1) return;
        const toLayer = architecture.layers[idx + 1];
        const fromDim = renderer.getCuboidDimensions(fromLayer);
        const toDim = renderer.getCuboidDimensions(toLayer);
        const color = fromLayer.getColor();

        for (let i = 0; i < 8; i++) {
            particles.push(createParticle(fromLayer, toLayer, fromDim, toDim, color, 1));
        }
    }

    function spawnAmbientParticles(dt) {
        if (Math.random() > dt * 1.5) return;
        for (let i = 0; i < architecture.layers.length - 1; i++) {
            if (Math.random() < 0.25) {
                const from = architecture.layers[i];
                const to = architecture.layers[i + 1];
                const fromDim = renderer.getCuboidDimensions(from);
                const toDim = renderer.getCuboidDimensions(to);
                particles.push(createParticle(from, to, fromDim, toDim, from.getColor(), 0.6));
            }
        }
    }

    function updateParticles(dt) {
        const maxTrail = 6;
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.t += dt * p.speed * speed;
            const eased = easeInOutCubic(Math.min(1, p.t));
            // Lerp from start to target with arc
            const base = p.startPos.lerp(p.target, eased);
            const arcY = p.arcHeight * Math.sin(eased * Math.PI);
            p.pos = base.add(new Vec(0, arcY, 0));

            // Record trail
            if (!p.trail) p.trail = [];
            p.trail.push(p.pos.clone());
            if (p.trail.length > maxTrail) p.trail.shift();

            if (p.t >= 1) {
                particles.splice(i, 1);
            }
        }

        // Copious particle spawning in animate mode
        if (mode === 'animate') {
            const spawnRate = dt * speed * 4;
            if (Math.random() < spawnRate) {
                for (let i = 0; i < architecture.layers.length - 1; i++) {
                    if (Math.random() < 0.45) {
                        const from = architecture.layers[i];
                        const to = architecture.layers[i + 1];
                        const fromDim = renderer.getCuboidDimensions(from);
                        const toDim = renderer.getCuboidDimensions(to);
                        particles.push(createParticle(from, to, fromDim, toDim, from.getColor(), 1.2));
                    }
                }
            }
        }

        // Cap particles
        if (particles.length > 200) {
            particles.splice(0, particles.length - 200);
        }
    }

    // --- Render ---
    function render() {
        renderer.resize();
        renderer.clear();

        if (!architecture) return;

        const layers = architecture.layers;

        // Ground grid
        if (showGrid) {
            renderer.drawGroundGrid(layers);
        }

        // Connection lines (with time for potential animation)
        renderer.drawConnectionLines(layers, time);

        // Sort layers by depth for painter's algorithm
        const cx = renderer.width / 2, cy = renderer.height / 2;
        const sortedLayers = [...layers].sort((a, b) => {
            const pa = renderer.camera.project(a.position3D, cx, cy);
            const pb = renderer.camera.project(b.position3D, cx, cy);
            return (pb ? pb.z : 0) - (pa ? pa.z : 0);
        });

        for (const layer of sortedLayers) {
            const isSel = layer === selectedLayer;
            const isHov = layer === hoveredLayer;

            renderer.drawLayerCuboid(layer, isSel, isHov, time);

            if (showHeatmap) {
                renderer.drawFeatureMapHeatmap(layer);
            }

            if (showKernel && mode === 'animate' && layer.type === 'conv') {
                const kp = kernelPositions[layer.id];
                if (kp) {
                    renderer.drawKernelOverlay(layer, kp, architecture);
                }
            }

            if (showDimensions) {
                renderer.drawLayerLabel(layer);
            }
        }

        // Particles (always drawn, ambient flow even in explore)
        if (showDataFlow) {
            renderer.drawDataFlowParticles(particles);
        }
    }

    // --- UI ---
    function buildSidebar() {
        buildPatternTiles();
        buildLayerList();
    }

    function buildLayerList() {
        const container = document.getElementById('layer-list');
        if (!container) return;
        container.innerHTML = '';

        for (const layer of architecture.layers) {
            const chip = document.createElement('div');
            chip.className = 'layer-chip' + (layer === selectedLayer ? ' selected' : '');
            const color = layer.getColor();
            chip.style.borderColor = `rgba(${color.r},${color.g},${color.b},0.5)`;
            chip.innerHTML = `<span class="chip-dot" style="background:rgba(${color.r},${color.g},${color.b},0.8)"></span>
                <span class="chip-label">${layer.getShortLabel()}</span>
                <span class="chip-dims">${layer.getDimsLabel()}</span>`;
            chip.addEventListener('click', () => selectLayer(layer));
            container.appendChild(chip);
        }
    }

    function buildPatternTiles() {
        const container = document.getElementById('pattern-tiles');
        if (!container) return;
        container.innerHTML = '';

        for (const pattern of INPUT_PATTERNS) {
            const tile = document.createElement('canvas');
            tile.width = 32;
            tile.height = 32;
            tile.className = 'pattern-tile' + (pattern === currentPattern ? ' active' : '');
            tile.dataset.pattern = pattern;
            tile.title = pattern;

            // Draw small preview
            const tctx = tile.getContext('2d');
            const size = 16;
            const data = generateInputPattern(pattern, size);
            const cellW = 32 / size;
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const v = data[y * size + x];
                    const brightness = Math.round(v * 200 + 30);
                    tctx.fillStyle = `rgb(${brightness},${brightness},${Math.round(brightness * 1.1)})`;
                    tctx.fillRect(x * cellW, y * cellW, cellW + 0.5, cellW + 0.5);
                }
            }

            tile.addEventListener('click', () => changeInputPattern(pattern));
            container.appendChild(tile);
        }
    }

    function selectLayer(layer) {
        selectedLayer = (selectedLayer === layer) ? null : layer;
        buildLayerList();
        updateInfoPanel();
        updateSelectedLayerControls();
    }

    function updateInfoPanel() {
        const panel = document.getElementById('info-panel');
        if (!panel) return;

        if (!selectedLayer) {
            panel.classList.remove('visible');
            return;
        }

        panel.classList.add('visible');
        const info = LAYER_INFO[selectedLayer.type];
        if (!info) return;

        const color = selectedLayer.getColor();
        document.getElementById('info-title').textContent = info.title;
        document.getElementById('info-title').style.color = `rgb(${color.r},${color.g},${color.b})`;
        document.getElementById('info-description').textContent = info.description;
        document.getElementById('info-formula').textContent = info.formula;
        document.getElementById('info-insight').textContent = info.insight;

        // Draw mini diagram
        const diagramCanvas = document.getElementById('info-diagram');
        if (diagramCanvas) {
            const dctx = diagramCanvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            diagramCanvas.width = diagramCanvas.clientWidth * dpr;
            diagramCanvas.height = diagramCanvas.clientHeight * dpr;
            dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            dctx.clearRect(0, 0, diagramCanvas.clientWidth, diagramCanvas.clientHeight);
            renderer.drawInfoPanelMiniDiagram(dctx, selectedLayer.type, 0, 0, diagramCanvas.clientWidth, diagramCanvas.clientHeight);
        }
    }

    function updateSelectedLayerControls() {
        const panel = document.getElementById('layer-controls');
        if (!panel) return;

        if (!selectedLayer) {
            panel.innerHTML = '<p class="controls-hint">Click a layer to see controls</p>';
            return;
        }

        const layer = selectedLayer;
        const cfg = layer.config;
        let html = '';

        if (layer.type === 'conv') {
            html = `
                <label>Kernel Size
                    <select id="ctrl-kernel-size">
                        ${[1, 3, 5, 7].map(v => `<option value="${v}" ${cfg.kernelSize === v ? 'selected' : ''}>${v}x${v}</option>`).join('')}
                    </select>
                </label>
                <label>Filters
                    <input type="range" id="ctrl-filter-count" min="1" max="64" value="${cfg.filterCount}">
                    <span id="ctrl-filter-count-val">${cfg.filterCount}</span>
                </label>
                <label>Stride
                    <select id="ctrl-stride">
                        ${[1, 2, 3].map(v => `<option value="${v}" ${cfg.stride === v ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="ctrl-padding" ${cfg.padding > 0 ? 'checked' : ''}>
                    Padding (same)
                </label>
                <label>Activation
                    <select id="ctrl-activation">
                        ${['relu', 'sigmoid', 'tanh', 'none'].map(v => `<option value="${v}" ${cfg.activation === v ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                </label>`;
        } else if (layer.type === 'pool') {
            html = `
                <label>Pool Size
                    <select id="ctrl-pool-size">
                        ${[2, 3].map(v => `<option value="${v}" ${cfg.poolSize === v ? 'selected' : ''}>${v}x${v}</option>`).join('')}
                    </select>
                </label>
                <label>Pool Type
                    <select id="ctrl-pool-type">
                        ${['max', 'avg'].map(v => `<option value="${v}" ${cfg.poolType === v ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                </label>`;
        } else if (layer.type === 'fc' || layer.type === 'output') {
            html = `
                <label>Neurons
                    <input type="range" id="ctrl-neuron-count" min="2" max="512" value="${cfg.neuronCount || 10}" step="1">
                    <span id="ctrl-neuron-count-val">${cfg.neuronCount || 10}</span>
                </label>
                <label>Activation
                    <select id="ctrl-activation">
                        ${['relu', 'sigmoid', 'tanh', 'none'].map(v => `<option value="${v}" ${cfg.activation === v ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                </label>`;
        } else {
            html = '<p class="controls-hint">No editable parameters</p>';
        }

        panel.innerHTML = html;

        // Bind control events
        bindLayerControls();
    }

    function bindLayerControls() {
        const apply = () => {
            architecture.computeShapes();
            architecture.computeLayout();
            const inputData = generateInputPattern(currentPattern, architecture.inputSize);
            architecture.simulateForwardPass(inputData);
            buildLayerList();
            updateInfoPanel();
            updateStats();
        };

        const el = (id) => document.getElementById(id);

        if (el('ctrl-kernel-size')) {
            el('ctrl-kernel-size').addEventListener('change', e => {
                selectedLayer.config.kernelSize = parseInt(e.target.value);
                apply();
            });
        }
        if (el('ctrl-filter-count')) {
            el('ctrl-filter-count').addEventListener('input', e => {
                const v = parseInt(e.target.value);
                selectedLayer.config.filterCount = v;
                el('ctrl-filter-count-val').textContent = v;
                apply();
            });
        }
        if (el('ctrl-stride')) {
            el('ctrl-stride').addEventListener('change', e => {
                selectedLayer.config.stride = parseInt(e.target.value);
                apply();
            });
        }
        if (el('ctrl-padding')) {
            el('ctrl-padding').addEventListener('change', e => {
                const k = selectedLayer.config.kernelSize;
                selectedLayer.config.padding = e.target.checked ? Math.floor(k / 2) : 0;
                apply();
            });
        }
        if (el('ctrl-pool-size')) {
            el('ctrl-pool-size').addEventListener('change', e => {
                selectedLayer.config.poolSize = parseInt(e.target.value);
                apply();
            });
        }
        if (el('ctrl-pool-type')) {
            el('ctrl-pool-type').addEventListener('change', e => {
                selectedLayer.config.poolType = e.target.value;
                apply();
            });
        }
        if (el('ctrl-neuron-count')) {
            el('ctrl-neuron-count').addEventListener('input', e => {
                const v = parseInt(e.target.value);
                selectedLayer.config.neuronCount = v;
                el('ctrl-neuron-count-val').textContent = v;
                apply();
            });
        }
        if (el('ctrl-activation')) {
            el('ctrl-activation').addEventListener('change', e => {
                selectedLayer.config.activation = e.target.value;
                apply();
            });
        }
    }

    function updateStats() {
        const fpsEl = document.getElementById('stat-fps');
        const layersEl = document.getElementById('stat-layers');
        if (fpsEl) fpsEl.textContent = fpsDisplay;
        if (layersEl) layersEl.textContent = architecture ? architecture.layers.length : 0;
    }

    // --- Events ---
    function bindEvents() {
        const canvas = document.getElementById('canvas');

        // Drag to orbit (right-click, or left-click on empty space)
        canvas.addEventListener('mousedown', e => {
            if (e.button === 2 || e.button === 0) {
                const rect = canvas.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                // For left-click, only start drag if not on a layer (click will handle selection)
                if (e.button === 0 && !e.shiftKey) {
                    const hit = architecture ? renderer.hitTestLayers(mx, my, architecture.layers) : null;
                    if (hit) return; // let click handler deal with it
                }
                isDragging = true;
                lastMouse = { x: e.clientX, y: e.clientY };
                e.preventDefault();
            }
        });

        window.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            if (isDragging) {
                const dx = e.clientX - lastMouse.x;
                const dy = e.clientY - lastMouse.y;
                renderer.camera.orbit(-dx * 0.005, -dy * 0.005);
                lastMouse = { x: e.clientX, y: e.clientY };
            } else if (architecture) {
                hoveredLayer = renderer.hitTestLayers(mx, my, architecture.layers);
                canvas.style.cursor = hoveredLayer ? 'pointer' : 'default';
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Left-click select
        canvas.addEventListener('click', e => {
            if (e.shiftKey) return; // shift+click = orbit
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            if (architecture) {
                const hit = renderer.hitTestLayers(mx, my, architecture.layers);
                selectLayer(hit);
            }
        });

        // Scroll zoom
        canvas.addEventListener('wheel', e => {
            e.preventDefault();
            renderer.camera.zoom(e.deltaY * 0.5);
        }, { passive: false });

        // Prevent context menu
        canvas.addEventListener('contextmenu', e => e.preventDefault());

        // Preset selector
        document.getElementById('preset-select').addEventListener('change', e => {
            loadPreset(e.target.value);
        });

        // Mode toggle
        document.getElementById('btn-explore').addEventListener('click', () => setMode('explore'));
        document.getElementById('btn-animate').addEventListener('click', () => setMode('animate'));
        document.getElementById('btn-pause').addEventListener('click', () => togglePause());
        document.getElementById('btn-reset').addEventListener('click', () => resetView());

        // Visual toggles
        document.getElementById('toggle-kernel').addEventListener('change', e => showKernel = e.target.checked);
        document.getElementById('toggle-dataflow').addEventListener('change', e => showDataFlow = e.target.checked);
        document.getElementById('toggle-grid').addEventListener('change', e => showGrid = e.target.checked);
        document.getElementById('toggle-dims').addEventListener('change', e => showDimensions = e.target.checked);
        document.getElementById('toggle-heatmap').addEventListener('change', e => showHeatmap = e.target.checked);

        // Speed slider
        document.getElementById('speed-slider').addEventListener('input', e => {
            speed = parseFloat(e.target.value);
            document.getElementById('speed-val').textContent = speed.toFixed(1) + 'x';
        });

        // Add/remove layer (custom mode)
        document.getElementById('btn-add-layer').addEventListener('click', () => {
            const type = document.getElementById('add-layer-type').value;
            if (currentPreset !== 'custom') {
                // Switch to custom
                currentPreset = 'custom';
                document.getElementById('preset-select').value = 'custom';
            }
            // Insert before flatten/fc/output
            const insertIdx = architecture.layers.findIndex(l => l.type === 'flatten' || l.type === 'fc' || l.type === 'output');
            const newLayer = new CNNLayer(type);
            if (insertIdx >= 0) {
                architecture.layers.splice(insertIdx, 0, newLayer);
            } else {
                architecture.layers.push(newLayer);
            }
            architecture.computeShapes();
            architecture.computeLayout();
            const inputData = generateInputPattern(currentPattern, architecture.inputSize);
            architecture.simulateForwardPass(inputData);
            buildLayerList();
            updateStats();
        });

        document.getElementById('btn-remove-layer').addEventListener('click', () => {
            if (architecture.layers.length > 2) {
                if (selectedLayer && selectedLayer.type !== 'input') {
                    const idx = architecture.layers.indexOf(selectedLayer);
                    architecture.layers.splice(idx, 1);
                    selectedLayer = null;
                } else {
                    architecture.removeLastLayer();
                }
                architecture.computeShapes();
                architecture.computeLayout();
                const inputData = generateInputPattern(currentPattern, architecture.inputSize);
                architecture.simulateForwardPass(inputData);
                buildLayerList();
                updateInfoPanel();
                updateSelectedLayerControls();
                updateStats();
            }
        });

        // Window resize
        window.addEventListener('resize', () => renderer.resize());

        // Close info panel
        document.getElementById('info-close').addEventListener('click', () => {
            selectedLayer = null;
            buildLayerList();
            updateInfoPanel();
            updateSelectedLayerControls();
        });
    }

    function setMode(m) {
        mode = m;
        document.getElementById('btn-explore').classList.toggle('active', m === 'explore');
        document.getElementById('btn-animate').classList.toggle('active', m === 'animate');
        if (m === 'animate') {
            kernelPositions = {};
            particles = [];
        }
    }

    function togglePause() {
        paused = !paused;
        document.getElementById('btn-pause').textContent = paused ? 'Play' : 'Pause';
    }

    function resetView() {
        renderer.camera.theta = 0.4;
        renderer.camera.phi = 0.35;
        renderer.camera.dist = 600;
        renderer.camera.target = new Vec(0, 0, 0);
        selectedLayer = null;
        kernelPositions = {};
        particles = [];
        buildLayerList();
        updateInfoPanel();
        updateSelectedLayerControls();
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
