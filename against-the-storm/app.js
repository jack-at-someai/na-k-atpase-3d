(function () {
    'use strict';

    // ========================================================================
    //  GAME DATA — The Knowledge Graph
    // ========================================================================

    const SPECIES = {
        human:  { name: 'Human',  color: '#f59e0b', baseResolve: 15, hunger: 6, breakInt: 120, resilience: 'Normal',
                  firekeeper: '+2 Global Resolve' },
        beaver: { name: 'Beaver', color: '#f97316', baseResolve: 10, hunger: 6, breakInt: 120, resilience: 'Normal',
                  firekeeper: '-20% Fuel Consumption' },
        lizard: { name: 'Lizard', color: '#10b981', baseResolve: 5,  hunger: 12, breakInt: 100, resilience: 'High',
                  firekeeper: '+1 Global Resolve' },
        harpy:  { name: 'Harpy',  color: '#a78bfa', baseResolve: 5,  hunger: 4, breakInt: 100, resilience: 'Normal',
                  firekeeper: 'Increased Break Frequency' },
        fox:    { name: 'Fox',    color: '#ef4444', baseResolve: 5,  hunger: 3, breakInt: 120, resilience: 'Low',
                  firekeeper: '-6 Hostility / Glade' }
    };

    const SPECIALIZATIONS = {
        human:  ['Small Farm', 'Herb Garden', 'Bakery', 'Granary', 'Brewery', 'Tavern', 'Butcher'],
        beaver: ['Woodcutters Camp', 'Lumber Mill', 'Cooperage', 'Mine', 'Toolshop', 'Rain Mill'],
        lizard: ['Trappers Camp', 'Smokehouse', 'Ranch', 'Furnace', 'Kiln', 'Blight Post'],
        harpy:  ['Alchemist Hut', 'Clothier', 'Teahouse'],
        fox:    ['Rain Collector']
    };

    const NEEDS = {
        human:  { food: ['Pie', 'Biscuits', 'Jerky'],
                  housing: 'Human House',
                  service1: { type: 'Religion', buildings: ['Library', 'Market', 'Temple'] },
                  service2: { type: 'Leisure', buildings: ['Guild House', 'Tavern', 'Tea Doctor'] }},
        beaver: { food: ['Biscuits', 'Pickled Goods'],
                  housing: 'Beaver House',
                  service1: { type: 'Luxury', buildings: ['Tea Doctor', 'Library', 'Market'] },
                  service2: { type: 'Education', buildings: ['Guild House', 'Library', 'Temple'] }},
        lizard: { food: ['Jerky', 'Pie', 'Biscuits', 'Pickled Goods', 'Skewers'],
                  housing: 'Lizard House',
                  service1: { type: 'Religion', buildings: ['Library', 'Market', 'Temple'] },
                  service2: { type: 'Brotherhood', buildings: ['Market', 'Tavern', 'Temple'] }},
        harpy:  { food: ['Jerky', 'Biscuits', 'Skewers'],
                  housing: 'Harpy House',
                  service1: { type: 'Bloodthirst', buildings: [] },
                  service2: { type: 'Cleanliness', buildings: ['Bath House'] }},
        fox:    { food: ['Biscuits', 'Jerky', 'Pie'],
                  housing: 'Fox House',
                  service1: { type: 'Luxury', buildings: ['Tea Doctor', 'Library', 'Market'] },
                  service2: { type: 'Education', buildings: ['Guild House', 'Library', 'Temple'] }}
    };

    const RECIPES = [
        // Food
        { building: 'Bakery',      input: 'Grain',      output: 'Pie',           stars: 3, species: 'human' },
        { building: 'Bakery',      input: 'Grain',      output: 'Biscuits',      stars: 2, species: 'human' },
        { building: 'Bakery',      input: 'Herbs',      output: 'Biscuits',      stars: 2, species: 'human' },
        { building: 'Smokehouse',  input: 'Meat',       output: 'Jerky',         stars: 3, species: 'lizard' },
        { building: 'Smokehouse',  input: 'Insects',    output: 'Jerky',         stars: 2, species: 'lizard' },
        { building: 'Beanery',     input: 'Vegetables', output: 'Pickled Goods', stars: 2, species: null },
        { building: 'Beanery',     input: 'Mushrooms',  output: 'Pickled Goods', stars: 2, species: null },
        { building: 'Beanery',     input: 'Grain',      output: 'Porridge',      stars: 2, species: null },
        { building: 'Beanery',     input: 'Herbs',      output: 'Porridge',      stars: 2, species: null },
        { building: 'Cookhouse',   input: 'Meat',       output: 'Stew',          stars: 2, species: null },
        { building: 'Cookhouse',   input: 'Mushrooms',  output: 'Stew',          stars: 2, species: null },
        { building: 'Cookhouse',   input: 'Vegetables', output: 'Stew',          stars: 2, species: null },
        { building: 'Grill',       input: 'Meat',       output: 'Skewers',       stars: 2, species: null },
        { building: 'Grill',       input: 'Insects',    output: 'Skewers',       stars: 2, species: null },
        { building: 'Teahouse',    input: 'Herbs',      output: 'Tea',           stars: 2, species: 'harpy' },
        { building: 'Brewery',     input: 'Grain',      output: 'Beer',          stars: 2, species: 'human' },
        { building: 'Brewery',     input: 'Roots',      output: 'Beer',          stars: 2, species: 'human' },
        { building: 'Cellar',      input: 'Berries',    output: 'Wine',          stars: 2, species: null },
        // Materials
        { building: 'Carpenter',   input: 'Wood',       output: 'Planks',        stars: 2, species: null },
        { building: 'Lumber Mill', input: 'Wood',       output: 'Planks',        stars: 3, species: 'beaver' },
        { building: 'Workshop',    input: 'Wood',       output: 'Planks',        stars: 2, species: null },
        { building: 'Workshop',    input: 'Clay',       output: 'Bricks',        stars: 2, species: null },
        { building: 'Workshop',    input: 'Plant Fiber', output: 'Fabric',       stars: 2, species: null },
        { building: 'Workshop',    input: 'Copper Ore', output: 'Pipes',         stars: 1, species: null },
        { building: 'Brick Oven',  input: 'Clay',       output: 'Bricks',        stars: 2, species: null },
        { building: 'Brickyard',   input: 'Clay',       output: 'Bricks',        stars: 2, species: null },
        { building: 'Kiln',        input: 'Wood',       output: 'Coal',          stars: 2, species: 'lizard' },
        // Tools / Metal
        { building: 'Furnace',     input: 'Copper Ore', output: 'Metal Bars',    stars: 2, species: 'lizard' },
        { building: 'Furnace',     input: 'Metal Bars', output: 'Tools',         stars: 2, species: 'lizard' },
        { building: 'Toolshop',    input: 'Wood',       output: 'Tools',         stars: 1, species: 'beaver' },
        { building: 'Toolshop',    input: 'Metal Bars', output: 'Tools',         stars: 3, species: 'beaver' },
        // Trade / Craft
        { building: 'Alchemist Hut', input: 'Herbs',    output: 'Crystal Dew',   stars: 2, species: 'harpy' },
        { building: 'Apothecary',  input: 'Herbs',      output: 'Incense',       stars: 2, species: null },
        { building: 'Artisan',     input: 'Resin',      output: 'Pigment',       stars: 2, species: null },
        { building: 'Artisan',     input: 'Wood',       output: 'Barrels',       stars: 2, species: null },
        { building: 'Clothier',    input: 'Plant Fiber', output: 'Cloth',        stars: 2, species: 'harpy' },
        { building: 'Cooperage',   input: 'Planks',     output: 'Barrels',       stars: 2, species: 'beaver' },
        { building: 'Press',       input: 'Grain',      output: 'Oil',           stars: 2, species: null },
        { building: 'Stamping Mill', input: 'Wood',     output: 'Scrolls',       stars: 2, species: null },
        { building: 'Scribe',      input: 'Plant Fiber', output: 'Scrolls',      stars: 2, species: null },
    ];

    // Production chain graph — nodes and edges for canvas visualization
    const CHAIN_NODES = {
        // Raw
        'Wood':        { x: 0, y: 0, cat: 'raw' },
        'Meat':        { x: 0, y: 1, cat: 'raw' },
        'Grain':       { x: 0, y: 2, cat: 'raw' },
        'Clay':        { x: 0, y: 3, cat: 'raw' },
        'Copper Ore':  { x: 0, y: 4, cat: 'raw' },
        'Herbs':       { x: 0, y: 5, cat: 'raw' },
        'Berries':     { x: 0, y: 6, cat: 'raw' },
        'Vegetables':  { x: 0, y: 7, cat: 'raw' },
        'Mushrooms':   { x: 0, y: 8, cat: 'raw' },
        'Plant Fiber': { x: 0, y: 9, cat: 'raw' },
        'Roots':       { x: 0, y: 10, cat: 'raw' },
        'Insects':     { x: 0, y: 11, cat: 'raw' },
        'Resin':       { x: 0, y: 12, cat: 'raw' },
        // Processed
        'Planks':      { x: 2, y: 0, cat: 'material' },
        'Coal':        { x: 2, y: 1, cat: 'fuel' },
        'Metal Bars':  { x: 2, y: 4, cat: 'material' },
        'Bricks':      { x: 2, y: 3, cat: 'material' },
        'Fabric':      { x: 2, y: 9, cat: 'material' },
        'Pipes':       { x: 2, y: 5, cat: 'material' },
        // Food
        'Pie':           { x: 2, y: 2, cat: 'food' },
        'Biscuits':      { x: 2, y: 2.5, cat: 'food' },
        'Jerky':         { x: 2, y: 1.5, cat: 'food' },
        'Pickled Goods': { x: 2, y: 7, cat: 'food' },
        'Porridge':      { x: 2, y: 7.5, cat: 'food' },
        'Stew':          { x: 2, y: 8, cat: 'food' },
        'Skewers':       { x: 2, y: 8.5, cat: 'food' },
        'Tea':           { x: 2, y: 6, cat: 'food' },
        'Beer':          { x: 2, y: 10, cat: 'food' },
        'Wine':          { x: 2, y: 6.5, cat: 'food' },
        // End goods
        'Tools':       { x: 4, y: 4, cat: 'tool' },
        'Barrels':     { x: 4, y: 0, cat: 'trade' },
        'Crystal Dew': { x: 4, y: 5, cat: 'trade' },
        'Incense':     { x: 4, y: 6, cat: 'trade' },
        'Cloth':       { x: 4, y: 9, cat: 'trade' },
        'Oil':         { x: 4, y: 2, cat: 'fuel' },
        'Scrolls':     { x: 4, y: 10, cat: 'trade' },
        'Pigment':     { x: 4, y: 12, cat: 'trade' },
    };

    const CHAIN_GROUPS = {
        food:      ['Pie', 'Biscuits', 'Jerky', 'Pickled Goods', 'Porridge', 'Stew', 'Skewers', 'Tea', 'Beer', 'Wine'],
        fuel:      ['Coal', 'Oil'],
        materials: ['Planks', 'Bricks', 'Fabric', 'Pipes'],
        tools:     ['Tools', 'Metal Bars'],
        trade:     ['Barrels', 'Crystal Dew', 'Incense', 'Cloth', 'Scrolls', 'Pigment'],
    };

    const CAT_COLORS = {
        raw: '#64748b', material: '#f97316', fuel: '#ef4444', food: '#10b981',
        tool: '#22d3ee', trade: '#f59e0b'
    };

    // ========================================================================
    //  HEX MATH (subset from hexgrid)
    // ========================================================================

    const Hex = {
        cube(q, r, s) { if (s === undefined) s = -q - r; return { q, r, s }; },
        add(a, b) { return { q: a.q + b.q, r: a.r + b.r, s: a.s + b.s }; },
        eq(a, b) { return a.q === b.q && a.r === b.r; },
        key(h) { return h.q + ',' + h.r; },
        directions: [
            { q: 1, r: 0, s: -1 }, { q: 1, r: -1, s: 0 }, { q: 0, r: -1, s: 1 },
            { q: -1, r: 0, s: 1 }, { q: -1, r: 1, s: 0 }, { q: 0, r: 1, s: -1 }
        ],
        ring(center, radius) {
            if (radius === 0) return [center];
            const results = [];
            let h = Hex.add(center, { q: -radius, r: radius, s: 0 });
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < radius; j++) {
                    results.push(h);
                    h = Hex.add(h, Hex.directions[i]);
                }
            }
            return results;
        }
    };

    const Orientation = {
        flat: {
            f0: 3 / 2, f1: 0, f2: Math.sqrt(3) / 2, f3: Math.sqrt(3),
            b0: 2 / 3, b1: 0, b2: -1 / 3, b3: Math.sqrt(3) / 3,
            startAngle: 0
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

    function hexRound(frac) {
        let q = Math.round(frac.q), r = Math.round(frac.r), s = Math.round(frac.s);
        const dq = Math.abs(q - frac.q), dr = Math.abs(r - frac.r), ds = Math.abs(s - frac.s);
        if (dq > dr && dq > ds) q = -r - s;
        else if (dr > ds) r = -q - s;
        else s = -q - r;
        return { q, r, s };
    }

    function hexCorners(h, layout) {
        const center = hexToPixel(h, layout);
        const corners = [];
        for (let i = 0; i < 6; i++) {
            const angle = 2 * Math.PI * (layout.orientation.startAngle + i) / 6;
            corners.push({ x: center.x + layout.size * Math.cos(angle), y: center.y + layout.size * Math.sin(angle) });
        }
        return corners;
    }

    function drawHex(ctx, h, layout, fill, stroke, lw) {
        const c = hexCorners(h, layout);
        ctx.beginPath();
        ctx.moveTo(c[0].x, c[0].y);
        for (let i = 1; i < 6; i++) ctx.lineTo(c[i].x, c[i].y);
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
    }

    // ========================================================================
    //  CANVAS UTILITIES
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

    // ========================================================================
    //  TAB 0: COMPOSITION
    // ========================================================================

    const compState = { selected: new Set() };

    function initComposition() {
        const checks = document.querySelectorAll('.sp-check');
        checks.forEach(cb => {
            cb.addEventListener('change', () => {
                const sp = cb.dataset.sp;
                if (cb.checked) {
                    if (compState.selected.size >= 3) { cb.checked = false; return; }
                    compState.selected.add(sp);
                } else {
                    compState.selected.delete(sp);
                }
                drawComposition();
                updateCompInfo();
            });
        });
    }

    function updateCompInfo() {
        const el = document.getElementById('comp-info');
        const sel = [...compState.selected];
        if (sel.length === 0) { el.innerHTML = 'Select up to 3 species'; return; }

        const has = {
            fuel:     sel.includes('beaver'),
            food:     sel.includes('human'),
            survival: sel.includes('lizard'),
            repConv:  sel.includes('harpy'),
            pressure: sel.includes('fox')
        };

        // Shared food preferences
        const foodSets = sel.map(s => new Set(NEEDS[s].food));
        const sharedFood = [...foodSets[0]].filter(f => foodSets.every(set => set.has(f)));

        // Shared service buildings
        const allServiceBldgs = sel.flatMap(s => [...NEEDS[s].service1.buildings, ...NEEDS[s].service2.buildings]);
        const bldgCount = {};
        allServiceBldgs.forEach(b => bldgCount[b] = (bldgCount[b] || 0) + 1);
        const sharedBldgs = Object.entries(bldgCount).filter(([, c]) => c >= 2).map(([b]) => b);

        let html = `<div class="stat-line"><span class="label">Species:</span> ${sel.map(s => `<span style="color:${SPECIES[s].color}">${SPECIES[s].name}</span>`).join(', ')}</div>`;
        html += `<div class="stat-line">&nbsp;</div>`;
        html += `<div class="stat-line"><span class="label">Strengths:</span></div>`;
        if (has.fuel)     html += `<div class="stat-line good">  Fuel security (Beaver)</div>`;
        if (has.food)     html += `<div class="stat-line good">  Food security (Human)</div>`;
        if (has.survival) html += `<div class="stat-line good">  Collapse resistance (Lizard)</div>`;
        if (has.repConv)  html += `<div class="stat-line good">  Rep conversion (Harpy)</div>`;
        if (has.pressure) html += `<div class="stat-line good">  Hostility mgmt (Fox)</div>`;

        html += `<div class="stat-line">&nbsp;</div>`;
        html += `<div class="stat-line"><span class="label">Gaps:</span></div>`;
        if (!has.fuel)     html += `<div class="stat-line warn">  No fuel edge</div>`;
        if (!has.food)     html += `<div class="stat-line warn">  No food anchor</div>`;
        if (!has.survival) html += `<div class="stat-line warn">  No survival anchor</div>`;
        if (!has.repConv)  html += `<div class="stat-line warn">  No rep conversion</div>`;
        if (!has.pressure) html += `<div class="stat-line warn">  No hostility control</div>`;

        html += `<div class="stat-line">&nbsp;</div>`;
        html += `<div class="stat-line"><span class="label">Shared Foods:</span> ${sharedFood.length ? sharedFood.join(', ') : '<span class="warn">None!</span>'}</div>`;
        html += `<div class="stat-line"><span class="label">Key Buildings:</span> ${sharedBldgs.length ? sharedBldgs.join(', ') : 'None shared'}</div>`;

        // Avg stats
        const avgResolve = sel.reduce((s, sp) => s + SPECIES[sp].baseResolve, 0) / sel.length;
        const avgHunger = sel.reduce((s, sp) => s + SPECIES[sp].hunger, 0) / sel.length;
        html += `<div class="stat-line">&nbsp;</div>`;
        html += `<div class="stat-line"><span class="label">Avg Base Resolve:</span> <span>${avgResolve.toFixed(1)}</span></div>`;
        html += `<div class="stat-line"><span class="label">Avg Hunger Tol:</span> <span>${avgHunger.toFixed(1)}</span></div>`;

        el.innerHTML = html;
    }

    function drawComposition() {
        const canvas = document.getElementById('canvas-0');
        const { ctx, w, h } = setupCanvas(canvas);
        ctx.clearRect(0, 0, w, h);

        const layout = { orientation: Orientation.flat, size: 55, origin: { x: w / 2, y: h / 2 } };
        const center = Hex.cube(0, 0);
        const ring1 = Hex.ring(center, 1);

        // Map species to hex positions: center = settlement, ring = 5 species
        const speciesOrder = ['human', 'beaver', 'lizard', 'harpy', 'fox'];
        // Draw center hex (settlement)
        drawHex(ctx, center, layout, '#1e293b', '#334155', 2);
        const cp = hexToPixel(center, layout);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SETTLEMENT', cp.x, cp.y);

        // Draw species hexes
        for (let i = 0; i < 5; i++) {
            const sp = speciesOrder[i];
            const hex = ring1[i];
            const selected = compState.selected.has(sp);
            const fill = selected ? SPECIES[sp].color + '40' : '#111827';
            const stroke = selected ? SPECIES[sp].color : '#334155';
            drawHex(ctx, hex, layout, fill, stroke, selected ? 3 : 1);

            const p = hexToPixel(hex, layout);
            ctx.fillStyle = selected ? SPECIES[sp].color : '#64748b';
            ctx.font = '600 13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(SPECIES[sp].name, p.x, p.y - 8);
            ctx.font = '400 10px Inter, sans-serif';
            ctx.fillStyle = selected ? '#e2e8f0' : '#475569';
            ctx.fillText(`R:${SPECIES[sp].baseResolve}  H:${SPECIES[sp].hunger}`, p.x, p.y + 8);

            // Draw edge to center if selected
            if (selected) {
                ctx.beginPath();
                ctx.moveTo(cp.x, cp.y);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = SPECIES[sp].color + '60';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // Draw empty hex for the 6th ring slot
        drawHex(ctx, ring1[5], layout, '#0a0e17', '#1e293b', 1);
    }

    // ========================================================================
    //  TAB 1: SPECIES DETAIL
    // ========================================================================

    const speciesState = { hovered: null };

    function drawSpeciesView() {
        const canvas = document.getElementById('canvas-1');
        const { ctx, w, h } = setupCanvas(canvas);
        ctx.clearRect(0, 0, w, h);

        const layout = { orientation: Orientation.flat, size: 65, origin: { x: w / 2, y: h / 2 } };
        const center = Hex.cube(0, 0);
        const ring1 = Hex.ring(center, 1);
        const speciesOrder = ['human', 'beaver', 'lizard', 'harpy', 'fox'];

        // Center: title
        drawHex(ctx, center, layout, '#1e293b', '#6366f1', 2);
        const cp = hexToPixel(center, layout);
        ctx.fillStyle = '#22d3ee';
        ctx.font = '700 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SPECIES', cp.x, cp.y);

        for (let i = 0; i < 5; i++) {
            const sp = speciesOrder[i];
            const hex = ring1[i];
            const isHov = speciesState.hovered === sp;
            const fill = isHov ? SPECIES[sp].color + '50' : SPECIES[sp].color + '20';
            const stroke = SPECIES[sp].color;
            drawHex(ctx, hex, layout, fill, stroke, isHov ? 3 : 2);

            const p = hexToPixel(hex, layout);
            ctx.fillStyle = SPECIES[sp].color;
            ctx.font = '700 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(SPECIES[sp].name, p.x, p.y - 10);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '400 10px Inter, sans-serif';
            ctx.fillText(`Resolve ${SPECIES[sp].baseResolve} | Hunger ${SPECIES[sp].hunger}`, p.x, p.y + 6);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '400 9px Inter, sans-serif';
            ctx.fillText(SPECIES[sp].resilience + ' resilience', p.x, p.y + 19);
        }

        // Draw ring 2: specializations for hovered species
        if (speciesState.hovered) {
            const sp = speciesState.hovered;
            const specs = SPECIALIZATIONS[sp];
            const ring2 = Hex.ring(center, 2);
            const step = Math.max(1, Math.floor(ring2.length / specs.length));
            for (let i = 0; i < specs.length && i * step < ring2.length; i++) {
                const hex = ring2[i * step];
                drawHex(ctx, hex, layout, SPECIES[sp].color + '15', SPECIES[sp].color + '40', 1);
                const p = hexToPixel(hex, layout);
                ctx.fillStyle = SPECIES[sp].color;
                ctx.font = '500 9px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Word wrap for long names
                const words = specs[i].split(' ');
                if (words.length > 1 && specs[i].length > 10) {
                    const mid = Math.ceil(words.length / 2);
                    ctx.fillText(words.slice(0, mid).join(' '), p.x, p.y - 5);
                    ctx.fillText(words.slice(mid).join(' '), p.x, p.y + 7);
                } else {
                    ctx.fillText(specs[i], p.x, p.y);
                }
            }
        }

        // Mouse handling
        canvas.onmousemove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const px = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            const frac = pixelToHex(px, layout);
            const rounded = hexRound(frac);
            let found = null;
            for (let i = 0; i < 5; i++) {
                if (Hex.eq(rounded, ring1[i])) { found = speciesOrder[i]; break; }
            }
            if (found !== speciesState.hovered) {
                speciesState.hovered = found;
                drawSpeciesView();
                updateSpeciesInfo(found);
            }
        };
    }

    function updateSpeciesInfo(sp) {
        const el = document.getElementById('species-info');
        if (!sp) { el.innerHTML = 'Hover over a species to inspect'; return; }
        const s = SPECIES[sp];
        const n = NEEDS[sp];
        let html = '';
        html += `<div style="color:${s.color};font-weight:700;font-size:1rem;margin-bottom:4px">${s.name}</div>`;
        html += `<div class="stat-line"><span class="label">Base Resolve:</span> <span>${s.baseResolve}</span></div>`;
        html += `<div class="stat-line"><span class="label">Hunger Tol:</span> <span>${s.hunger}</span></div>`;
        html += `<div class="stat-line"><span class="label">Break:</span> <span>${s.breakInt}s</span></div>`;
        html += `<div class="stat-line"><span class="label">Resilience:</span> <span>${s.resilience}</span></div>`;
        html += `<div class="stat-line"><span class="label">Firekeeper:</span> <span>${s.firekeeper}</span></div>`;
        html += `<div class="stat-line">&nbsp;</div>`;
        html += `<div class="stat-line"><span class="label">Foods:</span> ${n.food.join(', ')}</div>`;
        html += `<div class="stat-line"><span class="label">Housing:</span> ${n.housing}</div>`;
        html += `<div class="stat-line"><span class="label">${n.service1.type}:</span> ${n.service1.buildings.join(', ') || 'N/A'}</div>`;
        html += `<div class="stat-line"><span class="label">${n.service2.type}:</span> ${n.service2.buildings.join(', ') || 'N/A'}</div>`;
        html += `<div class="stat-line">&nbsp;</div>`;
        html += `<div class="stat-line"><span class="label">Specs:</span></div>`;
        SPECIALIZATIONS[sp].forEach(b => { html += `<div class="stat-line">  ${b}</div>`; });
        el.innerHTML = html;
    }

    // ========================================================================
    //  TAB 2: RECIPES TABLE
    // ========================================================================

    function initRecipes() {
        renderRecipes('');
        document.getElementById('recipe-search').addEventListener('input', (e) => {
            renderRecipes(e.target.value.toLowerCase());
        });
    }

    function renderRecipes(filter) {
        const tbody = document.getElementById('recipe-body');
        const rows = RECIPES.filter(r => {
            if (!filter) return true;
            return r.building.toLowerCase().includes(filter) ||
                   r.input.toLowerCase().includes(filter) ||
                   r.output.toLowerCase().includes(filter) ||
                   (r.species && r.species.includes(filter));
        });
        tbody.innerHTML = rows.map(r => {
            const stars = '<span class="star">' + '\u2605'.repeat(r.stars) + '</span>' + '\u2606'.repeat(3 - r.stars);
            const tag = r.species ? `<span class="species-tag ${r.species}">${SPECIES[r.species].name}</span>` : '';
            return `<tr><td>${r.building}</td><td>${r.input}</td><td>${r.output}</td><td>${stars}</td><td>${tag}</td></tr>`;
        }).join('');
    }

    // ========================================================================
    //  TAB 3: PRODUCTION CHAINS (Canvas)
    // ========================================================================

    let chainFocus = 'all';
    let chainHover = null;

    function drawChains() {
        const canvas = document.getElementById('canvas-3');
        const { ctx, w, h } = setupCanvas(canvas);
        ctx.clearRect(0, 0, w, h);

        // Layout constants
        const padL = 40, padT = 30;
        const colW = (w - padL * 2) / 5;
        const rowH = Math.min(38, (h - padT * 2) / 14);

        // Determine which nodes to highlight based on focus
        const focusSet = new Set();
        if (chainFocus !== 'all' && CHAIN_GROUPS[chainFocus]) {
            const targets = CHAIN_GROUPS[chainFocus];
            targets.forEach(t => focusSet.add(t));
            // Add inputs that lead to targets
            RECIPES.forEach(r => {
                if (focusSet.has(r.output)) { focusSet.add(r.input); focusSet.add(r.building); }
            });
        }

        // Draw edges first
        RECIPES.forEach(r => {
            const inp = CHAIN_NODES[r.input];
            const out = CHAIN_NODES[r.output];
            if (!inp || !out) return;
            const inFocus = chainFocus === 'all' || (focusSet.has(r.input) && focusSet.has(r.output));
            const x1 = padL + inp.x * colW + colW / 2;
            const y1 = padT + inp.y * rowH + rowH / 2;
            const x2 = padL + out.x * colW + colW / 2;
            const y2 = padT + out.y * rowH + rowH / 2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            // Bezier curve for visual clarity
            const mx = (x1 + x2) / 2;
            ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);
            ctx.strokeStyle = inFocus ? (CAT_COLORS[out.cat] || '#334155') + '60' : '#1e293b';
            ctx.lineWidth = inFocus ? 1.5 : 0.5;
            ctx.stroke();

            // Arrow head
            if (inFocus) {
                const angle = Math.atan2(y2 - y1, x2 - x1);
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - 6 * Math.cos(angle - 0.4), y2 - 6 * Math.sin(angle - 0.4));
                ctx.lineTo(x2 - 6 * Math.cos(angle + 0.4), y2 - 6 * Math.sin(angle + 0.4));
                ctx.closePath();
                ctx.fillStyle = (CAT_COLORS[out.cat] || '#334155') + '80';
                ctx.fill();
            }
        });

        // Draw nodes
        Object.entries(CHAIN_NODES).forEach(([name, node]) => {
            const inFocus = chainFocus === 'all' || focusSet.has(name);
            const isHov = chainHover === name;
            const x = padL + node.x * colW + colW / 2;
            const y = padT + node.y * rowH + rowH / 2;
            const color = CAT_COLORS[node.cat] || '#64748b';

            // Node circle
            ctx.beginPath();
            ctx.arc(x, y, isHov ? 8 : 5, 0, Math.PI * 2);
            ctx.fillStyle = inFocus ? color : '#1e293b';
            ctx.fill();
            if (isHov) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Label
            ctx.fillStyle = inFocus ? '#e2e8f0' : '#334155';
            ctx.font = (isHov ? '600' : '400') + ' 10px Inter, sans-serif';
            ctx.textAlign = node.x === 0 ? 'right' : node.x === 4 ? 'left' : 'center';
            const lx = node.x === 0 ? x - 10 : node.x === 4 ? x + 10 : x;
            ctx.textBaseline = 'middle';
            ctx.fillText(name, lx, y);
        });

        // Column headers
        const headers = ['Raw', '', 'Processed', '', 'End Goods'];
        ctx.fillStyle = '#64748b';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        for (let i = 0; i < 5; i++) {
            if (headers[i]) ctx.fillText(headers[i], padL + i * colW + colW / 2, 16);
        }

        // Mouse handling for hover
        canvas.onmousemove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            let found = null;
            Object.entries(CHAIN_NODES).forEach(([name, node]) => {
                const x = padL + node.x * colW + colW / 2;
                const y = padT + node.y * rowH + rowH / 2;
                if (Math.hypot(mx - x, my - y) < 15) found = name;
            });
            if (found !== chainHover) {
                chainHover = found;
                drawChains();
                updateChainInfo(found);
            }
        };
    }

    function updateChainInfo(node) {
        const el = document.getElementById('chain-info');
        if (!node) {
            el.innerHTML = chainFocus === 'all' ? 'Showing all production chains' : `Showing: ${chainFocus}`;
            return;
        }
        const producedBy = RECIPES.filter(r => r.output === node);
        const usedIn = RECIPES.filter(r => r.input === node);
        let html = `<div style="color:${CAT_COLORS[CHAIN_NODES[node]?.cat] || '#e2e8f0'};font-weight:700">${node}</div>`;
        if (producedBy.length) {
            html += `<div class="stat-line"><span class="label">Made by:</span></div>`;
            producedBy.forEach(r => { html += `<div class="stat-line">  ${r.building} (${r.input})</div>`; });
        }
        if (usedIn.length) {
            html += `<div class="stat-line"><span class="label">Used in:</span></div>`;
            usedIn.forEach(r => { html += `<div class="stat-line">  ${r.building} → ${r.output}</div>`; });
        }
        el.innerHTML = html;
    }

    // ========================================================================
    //  TAB 4: NEEDS MATRIX
    // ========================================================================

    function initNeeds() {
        const grid = document.getElementById('needs-grid');
        const speciesOrder = ['human', 'beaver', 'lizard', 'harpy', 'fox'];
        grid.innerHTML = speciesOrder.map(sp => {
            const s = SPECIES[sp];
            const n = NEEDS[sp];
            const tag = (items) => items.map(i => `<span class="tag">${i}</span>`).join('');
            return `
            <div class="needs-card">
                <h3 class="${sp}">${s.name} — Base Resolve ${s.baseResolve} | Hunger ${s.hunger} | ${s.resilience}</h3>
                <div class="needs-row"><div class="needs-label">Firekeeper</div><div class="needs-value">${s.firekeeper}</div></div>
                <div class="needs-row"><div class="needs-label">Complex Foods</div><div class="needs-value">${tag(n.food)}</div></div>
                <div class="needs-row"><div class="needs-label">Housing</div><div class="needs-value"><span class="tag">${n.housing}</span></div></div>
                <div class="needs-row"><div class="needs-label">${n.service1.type}</div><div class="needs-value">${n.service1.buildings.length ? tag(n.service1.buildings) : '<em>Special</em>'}</div></div>
                <div class="needs-row"><div class="needs-label">${n.service2.type}</div><div class="needs-value">${n.service2.buildings.length ? tag(n.service2.buildings) : '<em>Special</em>'}</div></div>
                <div class="needs-row"><div class="needs-label">Specializations</div><div class="needs-value">${tag(SPECIALIZATIONS[sp])}</div></div>
            </div>`;
        }).join('');
    }

    // ========================================================================
    //  TAB SYSTEM
    // ========================================================================

    const demos = [
        { init: () => { initComposition(); drawComposition(); }, activate: drawComposition },
        { init: () => {}, activate: drawSpeciesView },
        { init: initRecipes, activate: () => {} },
        { init: () => {
            document.getElementById('chain-focus').addEventListener('change', (e) => {
                chainFocus = e.target.value;
                drawChains();
            });
        }, activate: drawChains },
        { init: initNeeds, activate: () => {} }
    ];

    let activeTab = 0;
    const initialized = new Set();

    function switchTab(idx) {
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', +t.dataset.tab === idx));
        document.querySelectorAll('.demo-panel').forEach(p => p.classList.toggle('active', +p.dataset.demo === idx));
        activeTab = idx;
        if (!initialized.has(idx)) {
            demos[idx].init();
            initialized.add(idx);
        }
        demos[idx].activate();
    }

    document.getElementById('tab-bar').addEventListener('click', (e) => {
        const tab = e.target.closest('.tab');
        if (tab) switchTab(+tab.dataset.tab);
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (demos[activeTab].activate) demos[activeTab].activate();
    });

    // Boot
    switchTab(0);
})();
