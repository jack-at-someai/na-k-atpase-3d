// ═══════════════════════════════════════════════════════════════
//  CONSOLIDATED KNOWLEDGE GRAPH — D3 v7 Force-Directed Engine
//  SomeAI Design System — Enhanced Visual Edition
//  Curved edges, node glows, ambient particles, smooth animations
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  reference: '#E53E3E',
  domain:    '#F56565',
  person:    '#4A9EE5',
  document:  '#A855F7',
  project:   '#34D399',
  business:  '#FB923C',
  primitive: '#EC4899',
  cluster:   '#2DD4BF',
  category:  '#8B8BA0'
};

const BADGE_CSS = {
  reference: 'background:rgba(229,62,62,0.12);color:#F56565;border:1px solid rgba(229,62,62,0.2)',
  domain:    'background:rgba(245,101,101,0.12);color:#F56565;border:1px solid rgba(245,101,101,0.2)',
  person:    'background:rgba(74,158,229,0.12);color:#4A9EE5;border:1px solid rgba(74,158,229,0.2)',
  document:  'background:rgba(168,85,247,0.12);color:#A855F7;border:1px solid rgba(168,85,247,0.2)',
  project:   'background:rgba(52,211,153,0.12);color:#34D399;border:1px solid rgba(52,211,153,0.2)',
  business:  'background:rgba(251,146,60,0.12);color:#FB923C;border:1px solid rgba(251,146,60,0.2)',
  primitive: 'background:rgba(236,72,153,0.12);color:#EC4899;border:1px solid rgba(236,72,153,0.2)',
  cluster:   'background:rgba(45,212,191,0.12);color:#2DD4BF;border:1px solid rgba(45,212,191,0.2)',
  category:  'background:rgba(139,139,160,0.12);color:#8B8BA0;border:1px solid rgba(139,139,160,0.2)'
};

const TYPE_LABELS = {
  reference: 'References',
  domain:    'Domains',
  person:    'People',
  document:  'Documents',
  project:   'Projects',
  business:  'Businesses',
  primitive: 'Primitives',
  cluster:   'Clusters',
  category:  'Categories'
};

const SIZE_MAP = {
  primitive: 22,
  cluster:   18,
  domain:    16,
  business:  14,
  person:    12,
  category:  10,
  document:  8,
  project:   8,
  reference: 4
};

// Default visible types (references hidden for readability)
const DEFAULT_VISIBLE = new Set(['domain', 'person', 'business', 'primitive', 'cluster', 'project', 'document', 'category']);

let allNodes = [];
let allEdges = [];
let nodeMap = new Map();
let activeFilter = 'default';
let currentView = 'graph';
let sim, svg, g, linkGroup, nodeGroup, labelGroup, zoomBehavior;
let link, node, nodeGlow, label;
let gradientDefs;

// ─── Ambient Particle System ────────────────────────────────

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const COUNT = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229, 62, 62, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── Load Data ───────────────────────────────────────────────

async function loadGraph() {
  try {
    let data;
    if (typeof GRAPH_DATA !== 'undefined') {
      data = GRAPH_DATA;
    } else {
      const resp = await fetch('data/graph.json');
      if (!resp.ok) throw new Error('Failed to load graph.json');
      data = await resp.json();
    }
    allNodes = data.nodes || [];
    allEdges = data.edges || [];

    // Assign sizes
    allNodes.forEach(n => { n.size = SIZE_MAP[n.type] || 5; });
    nodeMap = new Map(allNodes.map(n => [n.id, n]));

    updateStats();
    buildLegend();
    buildFilters();
    initGraph();
    buildListView();

    // Fade out loading screen
    const loader = document.getElementById('loading');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 600);
    }
  } catch (err) {
    console.error('Error loading graph:', err);
    const loader = document.getElementById('loading');
    if (loader) {
      loader.querySelector('.loading-text').textContent = 'Error — run extract_all.py first';
      loader.querySelector('.loading-ring').style.display = 'none';
    }
  }
}

// ─── Stats ───────────────────────────────────────────────────

function updateStats() {
  const typeCount = {};
  allNodes.forEach(n => { typeCount[n.type] = (typeCount[n.type] || 0) + 1; });

  document.getElementById('node-count').textContent = allNodes.length.toLocaleString();
  document.getElementById('edge-count').textContent = allEdges.length.toLocaleString();
  document.getElementById('stat-nodes').textContent = allNodes.length.toLocaleString();
  document.getElementById('stat-edges').textContent = allEdges.length.toLocaleString();
  document.getElementById('stat-domains').textContent = typeCount.domain || 0;
  document.getElementById('stat-refs').textContent = (typeCount.reference || 0).toLocaleString();
}

// ─── Legend ───────────────────────────────────────────────────

function buildLegend() {
  const typeCount = {};
  allNodes.forEach(n => { typeCount[n.type] = (typeCount[n.type] || 0) + 1; });

  const el = document.getElementById('legend');
  el.innerHTML = '<h3>Node Types</h3>' +
    Object.entries(TYPE_LABELS)
      .filter(([type]) => typeCount[type])
      .map(([type, lbl]) =>
        `<div class="legend-item" onclick="filterByType('${type}')">` +
        `<span class="legend-dot" style="background:${COLORS[type]};box-shadow:0 0 6px ${COLORS[type]}"></span>` +
        `${lbl} <span style="opacity:0.5">${(typeCount[type] || 0).toLocaleString()}</span></div>`)
      .join('');
}

// ─── Filters ─────────────────────────────────────────────────

function buildFilters() {
  const typeCount = {};
  allNodes.forEach(n => { typeCount[n.type] = (typeCount[n.type] || 0) + 1; });

  const types = ['default', 'all', ...Object.keys(TYPE_LABELS).filter(t => typeCount[t])];
  const filtersEl = document.getElementById('filters');
  filtersEl.innerHTML = '';

  types.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (t === activeFilter ? ' active' : '');
    if (t === 'default') btn.textContent = 'Overview';
    else if (t === 'all') btn.textContent = 'All';
    else btn.textContent = (TYPE_LABELS[t] || t) + ` (${(typeCount[t] || 0).toLocaleString()})`;
    btn.dataset.type = t;
    btn.onclick = () => filterByType(t);
    filtersEl.appendChild(btn);
  });
}

function filterByType(type) {
  activeFilter = type;
  document.querySelectorAll('.filter-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.type === type));

  const t = 400; // transition duration

  if (type === 'default') {
    node.transition().duration(t)
      .attr('opacity', d => DEFAULT_VISIBLE.has(d.type) ? 1 : 0.02);
    nodeGlow.transition().duration(t)
      .attr('opacity', d => DEFAULT_VISIBLE.has(d.type) ? 0.3 : 0);
    label.transition().duration(t)
      .attr('opacity', d => {
        if (!DEFAULT_VISIBLE.has(d.type)) return 0;
        return d.size >= 12 ? 0.9 : 0;
      });
    link.transition().duration(t)
      .attr('opacity', d => {
        const sn = getNode(d.source);
        const tn = getNode(d.target);
        if (!sn || !tn) return 0.01;
        if (DEFAULT_VISIBLE.has(sn.type) && DEFAULT_VISIBLE.has(tn.type))
          return Math.max(0.03, d.strength * 0.15);
        return 0.005;
      });
  } else if (type === 'all') {
    node.transition().duration(t).attr('opacity', 1);
    nodeGlow.transition().duration(t).attr('opacity', 0.25);
    label.transition().duration(t).attr('opacity', d => d.size >= 10 ? 0.85 : 0);
    link.transition().duration(t).attr('opacity', d => Math.max(0.02, d.strength * 0.12));
  } else {
    node.transition().duration(t).attr('opacity', d => d.type === type ? 1 : 0.02);
    nodeGlow.transition().duration(t).attr('opacity', d => d.type === type ? 0.4 : 0);
    label.transition().duration(t).attr('opacity', d => d.type === type ? 0.9 : 0);
    link.transition().duration(t).attr('opacity', d => {
      const sn = getNode(d.source);
      const tn = getNode(d.target);
      return (sn?.type === type || tn?.type === type) ? 0.4 : 0.005;
    });
  }
}

function getNode(ref) {
  if (typeof ref === 'object') return ref;
  return nodeMap.get(ref);
}

// ─── Edge Gradient Generator ─────────────────────────────────

function getGradientId(src, tgt) {
  return `grad-${src}-${tgt}`;
}

function ensureGradient(srcColor, tgtColor, srcId, tgtId) {
  const id = getGradientId(srcId, tgtId);
  if (gradientDefs.select('#' + id).empty()) {
    const grad = gradientDefs.append('linearGradient')
      .attr('id', id)
      .attr('gradientUnits', 'userSpaceOnUse');
    grad.append('stop').attr('offset', '0%').attr('stop-color', srcColor).attr('stop-opacity', 0.6);
    grad.append('stop').attr('offset', '100%').attr('stop-color', tgtColor).attr('stop-opacity', 0.6);
  }
  return `url(#${id})`;
}

// ─── Curved Edge Path ────────────────────────────────────────

function curvedPath(d) {
  const sx = d.source.x, sy = d.source.y;
  const tx = d.target.x, ty = d.target.y;
  const dx = tx - sx, dy = ty - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  // Slight curve — offset perpendicular to the midpoint
  const curve = Math.min(dist * 0.08, 20);
  const mx = (sx + tx) / 2 - dy * curve / dist;
  const my = (sy + ty) / 2 + dx * curve / dist;
  return `M${sx},${sy} Q${mx},${my} ${tx},${ty}`;
}

// ─── D3 Graph ────────────────────────────────────────────────

function initGraph() {
  const W = window.innerWidth;
  const H = window.innerHeight;

  svg = d3.select('#graph-svg').attr('width', W).attr('height', H);

  // Defs for filters and gradients
  const defs = svg.append('defs');
  gradientDefs = defs;

  // Glow filter — per-type colored glow
  Object.entries(COLORS).forEach(([type, color]) => {
    const f = defs.append('filter').attr('id', `glow-${type}`)
      .attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
    f.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'blur');
    f.append('feFlood').attr('flood-color', color).attr('flood-opacity', '0.3').attr('result', 'color');
    f.append('feComposite').attr('in', 'color').attr('in2', 'blur').attr('operator', 'in').attr('result', 'shadow');
    const merge = f.append('feMerge');
    merge.append('feMergeNode').attr('in', 'shadow');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');
  });

  // Strong glow for primitives
  const primeGlow = defs.append('filter').attr('id', 'glow-strong')
    .attr('x', '-150%').attr('y', '-150%').attr('width', '400%').attr('height', '400%');
  primeGlow.append('feGaussianBlur').attr('stdDeviation', '10').attr('result', 'blur');
  primeGlow.append('feFlood').attr('flood-color', '#EC4899').attr('flood-opacity', '0.5').attr('result', 'color');
  primeGlow.append('feComposite').attr('in', 'color').attr('in2', 'blur').attr('operator', 'in').attr('result', 'shadow');
  const pm = primeGlow.append('feMerge');
  pm.append('feMergeNode').attr('in', 'shadow');
  pm.append('feMergeNode').attr('in', 'SourceGraphic');

  // Label shadow filter
  const labelShadow = defs.append('filter').attr('id', 'text-shadow')
    .attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
  labelShadow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '2');

  g = svg.append('g');

  // Zoom
  zoomBehavior = d3.zoom()
    .scaleExtent([0.05, 8])
    .on('zoom', e => g.attr('transform', e.transform));
  svg.call(zoomBehavior);
  svg.call(zoomBehavior.transform,
    d3.zoomIdentity.translate(W / 2, H / 2).scale(0.7).translate(-W / 2, -H / 2));

  // Filter edges to only those with valid nodes
  const validEdges = allEdges.filter(e => nodeMap.has(e.source) && nodeMap.has(e.target));

  // Simulation
  sim = d3.forceSimulation(allNodes)
    .force('link', d3.forceLink(validEdges).id(d => d.id)
      .distance(d => {
        const sn = getNode(d.source);
        const tn = getNode(d.target);
        const big = Math.max(sn?.size || 5, tn?.size || 5);
        return 50 + (22 - big) * 4;
      })
      .strength(d => (d.strength || 0.5) * 0.2))
    .force('charge', d3.forceManyBody()
      .strength(d => -40 - d.size * 8)
      .distanceMax(600))
    .force('center', d3.forceCenter(W / 2, H / 2).strength(0.02))
    .force('collision', d3.forceCollide().radius(d => d.size + 3).strength(0.6))
    .force('x', d3.forceX(W / 2).strength(0.008))
    .force('y', d3.forceY(H / 2).strength(0.008));

  // Links — curved paths
  linkGroup = g.append('g').attr('class', 'links');
  link = linkGroup.selectAll('path').data(validEdges).join('path')
    .attr('fill', 'none')
    .attr('stroke', '#2A2A3A')
    .attr('stroke-width', d => Math.max(0.3, (d.strength || 0.5) * 1.2))
    .attr('opacity', d => Math.max(0.02, (d.strength || 0.5) * 0.12));

  // Node glow halos (behind nodes)
  nodeGroup = g.append('g').attr('class', 'nodes');
  nodeGlow = nodeGroup.selectAll('circle.glow').data(allNodes).join('circle')
    .attr('class', 'glow')
    .attr('r', d => d.size * 2.5)
    .attr('fill', d => COLORS[d.type] || '#666')
    .attr('opacity', d => DEFAULT_VISIBLE.has(d.type) ? 0.06 : 0)
    .attr('pointer-events', 'none');

  // Nodes
  node = nodeGroup.selectAll('circle.node').data(allNodes).join('circle')
    .attr('class', 'node')
    .attr('r', d => d.size)
    .attr('fill', d => COLORS[d.type] || '#666')
    .attr('stroke', d => {
      if (d.type === 'primitive') return COLORS.primitive;
      if (d.type === 'domain') return COLORS.domain;
      return 'rgba(255,255,255,0.08)';
    })
    .attr('stroke-width', d => {
      if (d.type === 'primitive') return 3;
      if (d.type === 'domain') return 2;
      return 1;
    })
    .attr('filter', d => d.type === 'primitive' ? 'url(#glow-strong)' : null)
    .attr('opacity', d => DEFAULT_VISIBLE.has(d.type) ? 1 : 0.02)
    .style('cursor', 'pointer')
    .call(d3.drag().on('start', ds).on('drag', dd).on('end', de))
    .on('click', (e, d) => { e.stopPropagation(); showDetail(d); })
    .on('mouseover', handleMouseOver)
    .on('mousemove', e => moveTooltip(e))
    .on('mouseout', handleMouseOut);

  // Labels
  labelGroup = g.append('g').attr('class', 'labels');
  label = labelGroup.selectAll('text').data(allNodes).join('text')
    .text(d => d.label && d.label.length > 28 ? d.label.slice(0, 26) + '...' : d.label)
    .attr('font-size', d => Math.max(8, Math.min(12, d.size * 0.55)))
    .attr('fill', '#D0CDE0')
    .attr('text-anchor', 'middle')
    .attr('dy', d => d.size + 14)
    .attr('opacity', d => {
      if (!DEFAULT_VISIBLE.has(d.type)) return 0;
      return d.size >= 12 ? 0.9 : 0;
    })
    .attr('pointer-events', 'none')
    .attr('font-family', "'Inter', sans-serif")
    .attr('font-weight', d => d.type === 'primitive' ? 700 : d.size >= 14 ? 600 : 400)
    .style('text-shadow', '0 0 8px rgba(11,11,15,0.9), 0 0 16px rgba(11,11,15,0.7)');

  // Tick
  sim.on('tick', () => {
    link.attr('d', curvedPath);
    node.attr('cx', d => d.x).attr('cy', d => d.y);
    nodeGlow.attr('cx', d => d.x).attr('cy', d => d.y);
    label.attr('x', d => d.x).attr('y', d => d.y);
  });

  // Click on background to deselect
  svg.on('click', () => {
    closeDetail();
  });

  // Apply default filter
  filterByType('default');

  // Warm up simulation faster
  sim.alpha(1).alphaDecay(0.02);
}

// Drag handlers
function ds(e, d) {
  if (!e.active) sim.alphaTarget(0.3).restart();
  d.fx = d.x; d.fy = d.y;
}
function dd(e, d) { d.fx = e.x; d.fy = e.y; }
function de(e, d) {
  if (!e.active) sim.alphaTarget(0);
  d.fx = null; d.fy = null;
}

// ─── Hover Effects ──────────────────────────────────────────

function handleMouseOver(e, d) {
  // Scale up node
  d3.select(this)
    .transition().duration(150)
    .attr('r', d.size * 1.4)
    .attr('filter', `url(#glow-${d.type})`);

  // Show label for this node
  label.filter(n => n.id === d.id)
    .transition().duration(150)
    .attr('opacity', 0.95)
    .attr('font-size', Math.max(10, d.size * 0.7));

  showTooltip(e, d);
}

function handleMouseOut(e, d) {
  d3.select(this)
    .transition().duration(300)
    .attr('r', d.size)
    .attr('filter', d.type === 'primitive' ? 'url(#glow-strong)' : null);

  // Restore label
  label.filter(n => n.id === d.id)
    .transition().duration(300)
    .attr('font-size', Math.max(8, Math.min(12, d.size * 0.55)));

  // Re-apply current filter to fix label opacity
  if (activeFilter !== 'searching') {
    label.filter(n => n.id === d.id)
      .transition().duration(300)
      .attr('opacity', () => {
        if (activeFilter === 'all') return d.size >= 10 ? 0.85 : 0;
        if (activeFilter === 'default') return DEFAULT_VISIBLE.has(d.type) && d.size >= 12 ? 0.9 : 0;
        if (activeFilter === d.type) return 0.9;
        return 0;
      });
  }

  hideTooltip();
}

// ─── Tooltip ─────────────────────────────────────────────────

const tooltipEl = document.getElementById('tooltip');

function showTooltip(e, d) {
  tooltipEl.style.display = 'block';
  tooltipEl.style.left = (e.clientX + 16) + 'px';
  tooltipEl.style.top = (e.clientY - 12) + 'px';

  let html = `<strong>${d.label}</strong>`;
  html += `<div class="tt-type" style="color:${COLORS[d.type]}">${d.type}</div>`;
  if (d.desc) {
    const short = d.desc.length > 100 ? d.desc.slice(0, 100) + '...' : d.desc;
    html += `<div class="tt-desc">${short}</div>`;
  }
  tooltipEl.innerHTML = html;
}

function moveTooltip(e) {
  tooltipEl.style.left = (e.clientX + 16) + 'px';
  tooltipEl.style.top = (e.clientY - 12) + 'px';
}

function hideTooltip() { tooltipEl.style.display = 'none'; }

// ─── Detail Panel ────────────────────────────────────────────

function showDetail(d) {
  const panel = document.getElementById('detail');
  // Force reflow for animation
  panel.style.display = 'block';
  panel.offsetHeight;
  panel.classList.add('open');

  document.getElementById('detail-name').textContent = d.label;

  const badge = document.getElementById('detail-badge');
  badge.textContent = d.type.toUpperCase();
  badge.style.cssText = BADGE_CSS[d.type] || '';

  document.getElementById('detail-desc').textContent = d.desc || '';

  // Meta info
  let meta = '';
  if (d.author) meta += `<strong>Author:</strong> ${d.author}<br>`;
  if (d.resourceType) meta += `<strong>Type:</strong> ${d.resourceType}<br>`;
  if (d.level) meta += `<strong>Level:</strong> ${d.level}<br>`;
  if (d.role) meta += `<strong>Role:</strong> ${d.role}<br>`;
  if (d.category) meta += `<strong>Category:</strong> ${d.category}<br>`;
  if (d.url) meta += `<a href="${d.url}" target="_blank" rel="noopener">${d.url.length > 50 ? d.url.slice(0, 50) + '...' : d.url}</a>`;
  document.getElementById('detail-meta').innerHTML = meta;

  // Connections
  const connected = [];
  allEdges.forEach(e => {
    const sid = typeof e.source === 'object' ? e.source.id : e.source;
    const tid = typeof e.target === 'object' ? e.target.id : e.target;
    if (sid === d.id) { const n = nodeMap.get(tid); if (n) connected.push(n); }
    else if (tid === d.id) { const n = nodeMap.get(sid); if (n) connected.push(n); }
  });

  document.getElementById('detail-conn-count').textContent = connected.length;
  document.getElementById('detail-connections').innerHTML = connected
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 50)
    .map(c =>
      `<div class="conn-item" onclick="focusNode('${c.id}')">` +
      `<span class="conn-dot" style="background:${COLORS[c.type]};box-shadow:0 0 4px ${COLORS[c.type]}"></span>${c.label}</div>`)
    .join('');

  highlightNode(d);
}

function closeDetail() {
  const panel = document.getElementById('detail');
  panel.classList.remove('open');
  setTimeout(() => { if (!panel.classList.contains('open')) panel.style.display = 'none'; }, 300);
  filterByType(activeFilter);
  if (link) link.transition().duration(400).attr('stroke', '#2A2A3A');
}

function focusNode(id) {
  const n = allNodes.find(n => n.id === id);
  if (!n) return;
  showDetail(n);
  const t = d3.zoomTransform(svg.node());
  svg.transition().duration(600).ease(d3.easeCubicOut).call(zoomBehavior.transform,
    d3.zoomIdentity
      .translate(window.innerWidth / 2 - n.x * t.k, window.innerHeight / 2 - n.y * t.k)
      .scale(t.k));
}

function highlightNode(d) {
  const ids = new Set([d.id]);
  allEdges.forEach(e => {
    const sid = typeof e.source === 'object' ? e.source.id : e.source;
    const tid = typeof e.target === 'object' ? e.target.id : e.target;
    if (sid === d.id) ids.add(tid);
    if (tid === d.id) ids.add(sid);
  });

  const dur = 300;
  node.transition().duration(dur).attr('opacity', n => ids.has(n.id) ? 1 : 0.03);
  nodeGlow.transition().duration(dur).attr('opacity', n => n.id === d.id ? 0.5 : ids.has(n.id) ? 0.15 : 0);
  label.transition().duration(dur).attr('opacity', n => ids.has(n.id) && n.size >= 6 ? 0.9 : 0.01);
  link.transition().duration(dur)
    .attr('opacity', e => {
      const sid = typeof e.source === 'object' ? e.source.id : e.source;
      const tid = typeof e.target === 'object' ? e.target.id : e.target;
      return (sid === d.id || tid === d.id) ? 0.6 : 0.005;
    })
    .attr('stroke', e => {
      const sid = typeof e.source === 'object' ? e.source.id : e.source;
      const tid = typeof e.target === 'object' ? e.target.id : e.target;
      return (sid === d.id || tid === d.id) ? COLORS[d.type] : '#2A2A3A';
    })
    .attr('stroke-width', e => {
      const sid = typeof e.source === 'object' ? e.source.id : e.source;
      const tid = typeof e.target === 'object' ? e.target.id : e.target;
      return (sid === d.id || tid === d.id) ? 1.5 : Math.max(0.3, (e.strength || 0.5) * 1.2);
    });
}

// ─── Search ──────────────────────────────────────────────────

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();

  if (currentView === 'list') {
    buildListView(q);
    return;
  }

  if (!q) {
    activeFilter = activeFilter === 'searching' ? 'default' : activeFilter;
    filterByType(activeFilter);
    if (link) link.transition().duration(300).attr('stroke', '#2A2A3A');
    return;
  }

  activeFilter = 'searching';

  const hits = new Set();
  allNodes.forEach(n => {
    const hay = ((n.label || '') + ' ' + (n.desc || '') + ' ' + (n.author || '')).toLowerCase();
    if (hay.includes(q)) hits.add(n.id);
  });

  const dur = 200;
  node.transition().duration(dur).attr('opacity', n => hits.has(n.id) ? 1 : 0.02);
  nodeGlow.transition().duration(dur).attr('opacity', n => hits.has(n.id) ? 0.4 : 0);
  label.transition().duration(dur).attr('opacity', n => hits.has(n.id) ? 0.9 : 0);
  link.transition().duration(dur).attr('opacity', 0.005);
});

// ─── View Toggle ─────────────────────────────────────────────

function setView(view) {
  currentView = view;
  document.querySelectorAll('.view-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.view === view));

  const graphView = document.getElementById('graph-view');
  const listView = document.getElementById('list-view');

  if (view === 'graph') {
    graphView.classList.remove('hidden');
    listView.classList.remove('active');
  } else {
    graphView.classList.add('hidden');
    listView.classList.add('active');
    buildListView(searchInput.value.toLowerCase().trim());
  }
}

// ─── List View ───────────────────────────────────────────────

function buildListView(query) {
  const container = document.getElementById('list-view');
  query = query || '';

  let filtered = allNodes;
  if (query) {
    filtered = allNodes.filter(n => {
      const hay = ((n.label || '') + ' ' + (n.desc || '') + ' ' + (n.author || '') + ' ' + (n.type || '')).toLowerCase();
      return hay.includes(query);
    });
  }

  // Sort: domains first, then by type, then alphabetical
  const typeOrder = { primitive: 0, cluster: 1, domain: 2, business: 3, person: 4, document: 5, project: 6, reference: 7, category: 8 };
  filtered.sort((a, b) => {
    const ta = typeOrder[a.type] ?? 99;
    const tb = typeOrder[b.type] ?? 99;
    if (ta !== tb) return ta - tb;
    return (a.label || '').localeCompare(b.label || '');
  });

  function hl(text) {
    if (!query || !text) return text || '';
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${esc})`, 'gi'), '<mark>$1</mark>');
  }

  let html = `<table class="list-table"><thead><tr>
    <th>Type</th><th>Name</th><th>Description</th><th>Author</th><th>Link</th>
  </tr></thead><tbody>`;

  filtered.slice(0, 500).forEach(n => {
    const color = COLORS[n.type] || '#666';
    const urlCell = n.url
      ? `<a href="${n.url}" target="_blank" rel="noopener">Open</a>`
      : (n.source_path ? n.source_path.split('/').pop() : '');
    html += `<tr>
      <td><span class="type-dot" style="background:${color};box-shadow:0 0 4px ${color}"></span>${n.type}</td>
      <td>${hl(n.label)}</td>
      <td title="${(n.desc || '').replace(/"/g, '&quot;')}">${hl((n.desc || '').slice(0, 120))}${(n.desc || '').length > 120 ? '...' : ''}</td>
      <td>${hl(n.author || '')}</td>
      <td>${urlCell}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  if (filtered.length > 500) {
    html += `<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:12px">Showing 500 of ${filtered.length.toLocaleString()} results</div>`;
  }

  container.innerHTML = html;
}

// ─── Keyboard ────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeDetail();
    searchInput.value = '';
    activeFilter = 'default';
    filterByType('default');
  }
  // Cmd/Ctrl+F focuses search
  if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
    e.preventDefault();
    searchInput.focus();
  }
});

// ─── Resize ──────────────────────────────────────────────────

window.addEventListener('resize', () => {
  if (!svg) return;
  const w = window.innerWidth, h = window.innerHeight;
  svg.attr('width', w).attr('height', h);
  if (sim) {
    sim.force('center', d3.forceCenter(w / 2, h / 2));
    sim.force('x', d3.forceX(w / 2).strength(0.008));
    sim.force('y', d3.forceY(h / 2).strength(0.008));
    sim.alpha(0.1).restart();
  }
});

// ─── Init ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  loadGraph();
});
