/**
 * Liquid Glass Viz — D3-powered dashboard visualizations for the lg-* system.
 * Requires: D3 v7 (loaded via CDN before this script).
 * All components read --lg-* CSS custom properties for theming.
 *
 * Usage:
 *   <script src="https://d3js.org/d3.v7.min.js"></script>
 *   <script src="liquid-glass-viz.js"></script>
 *
 *   LiquidGlass.table('#my-table', { columns, data });
 *   LiquidGlass.gantt('#my-gantt', { tasks });
 *   LiquidGlass.sankey('#my-sankey', { nodes, links });
 *   LiquidGlass.forceGraph('#container', { nodes, links });
 *   LiquidGlass.treemap('#container', { data });
 *   LiquidGlass.heatmap('#container', { data, weeks, days });
 *   LiquidGlass.sparkline('#container', { data });
 *   LiquidGlass.donut('#container', { data });
 *   LiquidGlass.barChart('#container', { data });
 *   LiquidGlass.areaChart('#container', { data });
 */
(function () {
  'use strict';

  const LG = window.LiquidGlass = window.LiquidGlass || {};

  // ---------------------------------------------------------------------------
  // Theme helpers — read CSS custom properties
  // ---------------------------------------------------------------------------

  function css(prop, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
  }

  function palette() {
    return {
      primary50:  css('--lg-primary-50',  '#F3E8FC'),
      primary100: css('--lg-primary-100', '#E3CCF5'),
      primary200: css('--lg-primary-200', '#C799EA'),
      primary300: css('--lg-primary-300', '#AA66E0'),
      primary400: css('--lg-primary-400', '#8E33D5'),
      primary500: css('--lg-primary-500', '#7200CB'),
      primary600: css('--lg-primary-600', '#5B00A2'),
      primary700: css('--lg-primary-700', '#44007A'),
      secondary300: css('--lg-secondary-300', '#F666E4'),
      secondary500: css('--lg-secondary-500', '#F000D2'),
      tertiary300:  css('--lg-tertiary-300', '#7AE6DD'),
      tertiary500:  css('--lg-tertiary-500', '#21D6C6'),
      error500:   css('--lg-error-500', '#EF4444'),
      bg:      css('--lg-bg', '#141414'),
      surface: css('--lg-surface', '#1A1A1A'),
      text:    css('--lg-text', '#fff'),
      textDim: css('--lg-text-dim', '#666'),
      border:  css('--lg-border', '#333'),
    };
  }

  /** 10-color categorical palette derived from brand tokens */
  function categoricalColors() {
    const p = palette();
    return [
      p.primary500, p.secondary500, p.tertiary500,
      p.primary300, p.secondary300, p.tertiary300,
      p.primary700, p.error500,
      p.primary200, p.primary400,
    ];
  }

  // Shared tooltip
  let _tooltip;
  function tooltip() {
    if (!_tooltip) {
      _tooltip = document.createElement('div');
      _tooltip.className = 'lg-viz-tooltip';
      document.body.appendChild(_tooltip);
    }
    return _tooltip;
  }

  function showTooltip(html, event) {
    const t = tooltip();
    t.innerHTML = html;
    t.classList.add('lg-viz-tooltip--visible');
    const x = event.pageX + 12;
    const y = event.pageY - 10;
    t.style.left = x + 'px';
    t.style.top = y + 'px';
  }

  function hideTooltip() {
    tooltip().classList.remove('lg-viz-tooltip--visible');
  }

  // Resolve container
  function el(selector) {
    return typeof selector === 'string' ? document.querySelector(selector) : selector;
  }

  // ---------------------------------------------------------------------------
  // DATA TABLE
  // ---------------------------------------------------------------------------

  /**
   * Render a sortable, filterable data table.
   * @param {string|Element} selector - Container element
   * @param {Object} opts
   * @param {Array<{key:string, label:string, align?:string, format?:Function}>} opts.columns
   * @param {Array<Object>} opts.data
   * @param {string} [opts.title]
   * @param {boolean} [opts.filterable=true]
   * @param {boolean} [opts.sortable=true]
   * @param {number} [opts.pageSize=0] - 0 = no pagination
   */
  LG.table = function (selector, opts) {
    const container = el(selector);
    if (!container) return;
    const { columns, data, title = '', filterable = true, sortable = true, pageSize = 0 } = opts;

    container.innerHTML = '';
    container.classList.add('lg-table-wrap');

    // State
    let sortKey = null, sortDir = 'asc', filterText = '', page = 0;
    let filtered = [...data];

    // Header
    if (title || filterable) {
      const header = document.createElement('div');
      header.className = 'lg-table-wrap__header';
      if (title) {
        const h = document.createElement('h3');
        h.className = 'lg-table-wrap__title';
        h.textContent = title;
        header.appendChild(h);
      }
      if (filterable) {
        const input = document.createElement('input');
        input.className = 'lg-table-wrap__filter';
        input.placeholder = 'Filter...';
        input.addEventListener('input', () => { filterText = input.value.toLowerCase(); page = 0; render(); });
        header.appendChild(input);
      }
      container.appendChild(header);
    }

    const table = document.createElement('table');
    table.className = 'lg-table';
    container.appendChild(table);

    let pagination;
    if (pageSize > 0) {
      pagination = document.createElement('div');
      pagination.className = 'lg-table__pagination';
      container.appendChild(pagination);
    }

    function render() {
      // Filter
      filtered = data.filter(row =>
        filterText === '' || columns.some(c => String(row[c.key] ?? '').toLowerCase().includes(filterText))
      );

      // Sort
      if (sortKey) {
        filtered.sort((a, b) => {
          const va = a[sortKey], vb = b[sortKey];
          const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
          return sortDir === 'asc' ? cmp : -cmp;
        });
      }

      // Paginate
      const totalPages = pageSize > 0 ? Math.ceil(filtered.length / pageSize) : 1;
      page = Math.min(page, totalPages - 1);
      const slice = pageSize > 0 ? filtered.slice(page * pageSize, (page + 1) * pageSize) : filtered;

      // Render table
      table.innerHTML = '';

      // Thead
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      columns.forEach(c => {
        const th = document.createElement('th');
        th.textContent = c.label;
        if (c.align === 'right') th.style.textAlign = 'right';
        if (sortable) {
          if (sortKey === c.key) th.setAttribute('data-sort-dir', sortDir);
          th.addEventListener('click', () => {
            if (sortKey === c.key) { sortDir = sortDir === 'asc' ? 'desc' : 'asc'; }
            else { sortKey = c.key; sortDir = 'asc'; }
            render();
          });
        }
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Tbody
      const tbody = document.createElement('tbody');
      slice.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(c => {
          const td = document.createElement('td');
          const val = row[c.key];
          td.textContent = c.format ? c.format(val, row) : (val ?? '');
          if (c.align === 'right') { td.classList.add('lg-table__num'); }
          if (c.mono) { td.classList.add('lg-table__mono'); }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      // Pagination
      if (pagination) {
        pagination.innerHTML = `<span>${filtered.length} rows</span>`;
        const nav = document.createElement('div');
        nav.style.display = 'flex';
        nav.style.gap = '4px';
        const prev = document.createElement('button');
        prev.textContent = 'Prev';
        prev.disabled = page === 0;
        prev.addEventListener('click', () => { page--; render(); });
        const next = document.createElement('button');
        next.textContent = 'Next';
        next.disabled = page >= totalPages - 1;
        next.addEventListener('click', () => { page++; render(); });
        const info = document.createElement('span');
        info.style.padding = '4px 8px';
        info.textContent = `${page + 1} / ${totalPages}`;
        nav.append(prev, info, next);
        pagination.appendChild(nav);
      }
    }

    render();
    return { render, setData: d => { opts.data = d; filtered = [...d]; render(); } };
  };

  // ---------------------------------------------------------------------------
  // GANTT CHART
  // ---------------------------------------------------------------------------

  /**
   * Render a Gantt chart.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Array<{label:string, start:Date|string, end:Date|string, color?:string, group?:string}>} opts.tasks
   * @param {string} [opts.title]
   * @param {number} [opts.height] - auto-calculated if omitted
   * @param {number} [opts.barHeight=24]
   */
  LG.gantt = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { tasks, title = '', barHeight = 24 } = opts;
    const colors = categoricalColors();
    const p = palette();

    container.innerHTML = '';
    container.classList.add('lg-gantt');

    if (title) {
      const hdr = document.createElement('div');
      hdr.className = 'lg-gantt__header';
      hdr.innerHTML = `<h3 class="lg-gantt__title">${title}</h3>`;
      container.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'lg-gantt__body';
    container.appendChild(body);

    const margin = { top: 28, right: 20, bottom: 20, left: 140 };
    const width = container.clientWidth - 40; // account for padding
    const height = margin.top + tasks.length * (barHeight + 6) + margin.bottom;

    const parsedTasks = tasks.map((t, i) => ({
      ...t,
      start: new Date(t.start),
      end: new Date(t.end),
      color: t.color || colors[i % colors.length],
    }));

    const minDate = d3.min(parsedTasks, d => d.start);
    const maxDate = d3.max(parsedTasks, d => d.end);

    const x = d3.scaleTime().domain([minDate, maxDate]).range([margin.left, width - margin.right]);
    const y = d3.scaleBand()
      .domain(parsedTasks.map((_, i) => i))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    const svg = d3.select(body).append('svg')
      .attr('width', width)
      .attr('height', height);

    // Grid lines
    const gridG = svg.append('g').attr('class', 'gantt-grid');
    const ticks = x.ticks(6);
    ticks.forEach(t => {
      gridG.append('line')
        .attr('x1', x(t)).attr('x2', x(t))
        .attr('y1', margin.top).attr('y2', height - margin.bottom);
    });

    // Today line
    const now = new Date();
    if (now >= minDate && now <= maxDate) {
      svg.append('line')
        .attr('class', 'gantt-today')
        .attr('x1', x(now)).attr('x2', x(now))
        .attr('y1', margin.top - 10).attr('y2', height - margin.bottom);
    }

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${margin.top - 6})`)
      .call(d3.axisTop(x).ticks(6).tickSize(0).tickFormat(d3.timeFormat('%b %d')))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .attr('fill', p.textDim)
      .attr('font-size', 10);

    // Task labels
    parsedTasks.forEach((t, i) => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(i) + y.bandwidth() / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('fill', p.text)
        .attr('font-size', 12)
        .text(t.label);
    });

    // Bars
    svg.selectAll('.gantt-bar')
      .data(parsedTasks)
      .join('rect')
      .attr('class', 'gantt-bar')
      .attr('x', d => x(d.start))
      .attr('y', (d, i) => y(i))
      .attr('width', d => Math.max(x(d.end) - x(d.start), 4))
      .attr('height', y.bandwidth())
      .attr('fill', d => d.color)
      .on('mousemove', (event, d) => {
        const fmt = d3.timeFormat('%b %d, %Y');
        showTooltip(
          `<div class="lg-viz-tooltip__label">${d.label}</div>` +
          `<div class="lg-viz-tooltip__value">${fmt(d.start)} — ${fmt(d.end)}</div>`,
          event
        );
      })
      .on('mouseleave', hideTooltip);
  };

  // ---------------------------------------------------------------------------
  // SANKEY DIAGRAM
  // ---------------------------------------------------------------------------

  /**
   * Render a Sankey flow diagram.
   * Uses d3-sankey if available, otherwise falls back to a simple layout.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Array<{name:string}>} opts.nodes
   * @param {Array<{source:number, target:number, value:number}>} opts.links
   * @param {string} [opts.title]
   * @param {number} [opts.width] - defaults to container width
   * @param {number} [opts.height=400]
   */
  LG.sankey = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { nodes: inputNodes, links: inputLinks, title = '', height: h = 400 } = opts;
    const p = palette();
    const colors = categoricalColors();

    container.innerHTML = '';
    container.classList.add('lg-sankey');

    if (title) {
      const hdr = document.createElement('div');
      hdr.className = 'lg-sankey__header';
      hdr.innerHTML = `<h3 class="lg-sankey__title">${title}</h3>`;
      container.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'lg-sankey__body';
    container.appendChild(body);

    const width = container.clientWidth - 40;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerW = width - margin.left - margin.right;
    const innerH = h - margin.top - margin.bottom;

    // Simple Sankey layout (no d3-sankey dependency)
    // Group nodes by column (depth)
    const nodeCount = inputNodes.length;
    const linkData = inputLinks.map(l => ({ source: l.source, target: l.target, value: l.value }));

    // Determine depths via BFS
    const depths = new Array(nodeCount).fill(0);
    const adj = new Array(nodeCount).fill(null).map(() => []);
    linkData.forEach(l => adj[l.source].push(l.target));

    const visited = new Set();
    const queue = [];
    // Find source nodes (no incoming edges)
    const hasIncoming = new Set(linkData.map(l => l.target));
    for (let i = 0; i < nodeCount; i++) {
      if (!hasIncoming.has(i)) { queue.push(i); visited.add(i); }
    }
    if (queue.length === 0) queue.push(0);

    while (queue.length > 0) {
      const n = queue.shift();
      adj[n].forEach(t => {
        depths[t] = Math.max(depths[t], depths[n] + 1);
        if (!visited.has(t)) { visited.add(t); queue.push(t); }
      });
    }

    const maxDepth = Math.max(...depths);
    const colWidth = maxDepth > 0 ? innerW / maxDepth : innerW;
    const nodeWidth = 16;

    // Group nodes by depth
    const columns = [];
    for (let d = 0; d <= maxDepth; d++) {
      columns.push(inputNodes.map((n, i) => i).filter(i => depths[i] === d));
    }

    // Position nodes
    const nodePositions = new Array(nodeCount);
    columns.forEach((col, d) => {
      const totalNodeH = col.length * 24;
      const spacing = Math.max((innerH - totalNodeH) / (col.length + 1), 8);
      col.forEach((nIdx, i) => {
        const nodeValue = linkData.filter(l => l.source === nIdx).reduce((s, l) => s + l.value, 0) ||
                          linkData.filter(l => l.target === nIdx).reduce((s, l) => s + l.value, 0) || 1;
        const barH = Math.max(nodeValue * 2, 8);
        nodePositions[nIdx] = {
          x: margin.left + d * colWidth,
          y: margin.top + spacing * (i + 1) + i * 24,
          w: nodeWidth,
          h: Math.min(barH, innerH / col.length - 4),
          color: colors[nIdx % colors.length],
        };
      });
    });

    const svg = d3.select(body).append('svg').attr('width', width).attr('height', h);
    const g = svg.append('g');

    // Draw links
    linkData.forEach(l => {
      const s = nodePositions[l.source];
      const t = nodePositions[l.target];
      if (!s || !t) return;
      const sy = s.y + s.h / 2;
      const ty = t.y + t.h / 2;
      const midX = (s.x + s.w + t.x) / 2;

      g.append('path')
        .attr('class', 'sankey-link')
        .attr('d', `M${s.x + s.w},${sy} C${midX},${sy} ${midX},${ty} ${t.x},${ty}`)
        .attr('stroke', s.color)
        .attr('stroke-width', Math.max(l.value * 1.5, 2));
    });

    // Draw nodes
    const nodeG = g.selectAll('.sankey-node')
      .data(inputNodes.map((n, i) => ({ ...n, ...nodePositions[i], idx: i })))
      .join('g')
      .attr('class', 'sankey-node');

    nodeG.append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .attr('fill', d => d.color);

    nodeG.append('text')
      .attr('x', d => depths[d.idx] === maxDepth ? d.x - 6 : d.x + d.w + 6)
      .attr('y', d => d.y + d.h / 2)
      .attr('text-anchor', d => depths[d.idx] === maxDepth ? 'end' : 'start')
      .attr('dominant-baseline', 'central')
      .text(d => d.name);
  };

  // ---------------------------------------------------------------------------
  // FORCE-DIRECTED GRAPH
  // ---------------------------------------------------------------------------

  /**
   * Render a force-directed network graph.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Array<{id:string, group?:number, radius?:number}>} opts.nodes
   * @param {Array<{source:string, target:string, value?:number}>} opts.links
   * @param {string} [opts.title]
   * @param {number} [opts.height=400]
   */
  LG.forceGraph = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { nodes, links, title = '', height: h = 400 } = opts;
    const colors = categoricalColors();
    const p = palette();

    container.innerHTML = '';
    container.classList.add('lg-force-graph');

    if (title) {
      const hdr = document.createElement('div');
      hdr.className = 'lg-force-graph__header';
      hdr.innerHTML = `<h3 class="lg-force-graph__title">${title}</h3>`;
      container.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'lg-force-graph__body';
    container.appendChild(body);

    const width = container.clientWidth;

    const svg = d3.select(body).append('svg')
      .attr('width', width)
      .attr('height', h)
      .attr('viewBox', [0, 0, width, h]);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, h / 2))
      .force('collide', d3.forceCollide(20));

    const linkEl = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', 'force-link')
      .attr('stroke-width', d => Math.sqrt(d.value || 1) * 1.5);

    const nodeEl = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('class', 'force-node')
      .attr('r', d => d.radius || 6)
      .attr('fill', d => colors[(d.group || 0) % colors.length])
      .call(drag(simulation))
      .on('mousemove', (event, d) => {
        showTooltip(`<div class="lg-viz-tooltip__value">${d.id}</div>`, event);
      })
      .on('mouseleave', hideTooltip);

    const labelEl = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('class', 'force-label')
      .attr('dy', d => (d.radius || 6) + 14)
      .text(d => d.id);

    simulation.on('tick', () => {
      linkEl
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      nodeEl
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      labelEl
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function drag(sim) {
      return d3.drag()
        .on('start', (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
        });
    }
  };

  // ---------------------------------------------------------------------------
  // TREEMAP
  // ---------------------------------------------------------------------------

  /**
   * Render a treemap.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Object} opts.data - Hierarchical { name, children: [{ name, value }] }
   * @param {string} [opts.title]
   * @param {number} [opts.height=300]
   */
  LG.treemap = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { data, title = '', height: h = 300 } = opts;
    const colors = categoricalColors();
    const p = palette();

    container.innerHTML = '';
    container.classList.add('lg-treemap');

    if (title) {
      const hdr = document.createElement('div');
      hdr.className = 'lg-treemap__header';
      hdr.innerHTML = `<h3 class="lg-treemap__title">${title}</h3>`;
      container.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'lg-treemap__body';
    container.appendChild(body);

    const width = container.clientWidth - 40;

    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, h])
      .padding(3)
      .round(true)(root);

    const svg = d3.select(body).append('svg')
      .attr('width', width)
      .attr('height', h);

    const leaf = svg.selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    leaf.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('fill-opacity', 0.7)
      .on('mousemove', (event, d) => {
        showTooltip(
          `<div class="lg-viz-tooltip__label">${d.data.name}</div>` +
          `<div class="lg-viz-tooltip__value">${d.value.toLocaleString()}</div>`,
          event
        );
      })
      .on('mouseleave', hideTooltip);

    leaf.append('text')
      .attr('x', 6)
      .attr('y', 16)
      .text(d => {
        const w = d.x1 - d.x0;
        return w > 40 ? d.data.name : '';
      })
      .attr('font-size', d => {
        const w = d.x1 - d.x0;
        return w > 100 ? 12 : 10;
      })
      .attr('fill', '#fff');
  };

  // ---------------------------------------------------------------------------
  // HEATMAP / CONTRIBUTION GRID
  // ---------------------------------------------------------------------------

  /**
   * Render a GitHub-style contribution heatmap.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Array<{date:string, value:number}>} opts.data - [{date:'2026-01-01', value:5}, ...]
   * @param {string} [opts.title]
   * @param {number} [opts.cellSize=14]
   */
  LG.heatmap = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { data, title = '', cellSize = 14 } = opts;
    const p = palette();

    container.innerHTML = '';
    container.classList.add('lg-heatmap');

    if (title) {
      const hdr = document.createElement('div');
      hdr.className = 'lg-heatmap__header';
      hdr.innerHTML = `<h3 class="lg-heatmap__title">${title}</h3>`;
      container.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'lg-heatmap__body';
    container.appendChild(body);

    const maxVal = d3.max(data, d => d.value) || 1;
    const colorScale = d3.scaleLinear()
      .domain([0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal])
      .range([
        'rgba(255,255,255,0.04)',
        p.primary700 || p.primary500,
        p.primary500,
        p.primary400 || p.primary300,
        p.primary300 || p.primary200,
      ]);

    // Group by week
    const dateMap = new Map(data.map(d => [d.date, d.value]));
    const dates = data.map(d => new Date(d.date)).sort((a, b) => a - b);
    const startDate = dates[0] || new Date();
    const endDate = dates[dates.length - 1] || new Date();

    // Build weeks
    const weeks = [];
    let current = new Date(startDate);
    current.setDate(current.getDate() - current.getDay()); // align to Sunday
    while (current <= endDate) {
      const week = [];
      for (let dow = 0; dow < 7; dow++) {
        const key = current.toISOString().slice(0, 10);
        week.push({ date: new Date(current), key, value: dateMap.get(key) || 0 });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    const gap = 3;
    const labelW = 28;
    const width = labelW + weeks.length * (cellSize + gap);
    const height = 7 * (cellSize + gap) + 20;

    const svg = d3.select(body).append('svg').attr('width', width).attr('height', height);

    // Day labels
    ['Mon', 'Wed', 'Fri'].forEach((d, i) => {
      svg.append('text')
        .attr('x', 0)
        .attr('y', [1, 3, 5][i] * (cellSize + gap) + cellSize / 2 + 16)
        .attr('dominant-baseline', 'central')
        .text(d);
    });

    // Cells
    weeks.forEach((week, wi) => {
      week.forEach((day, di) => {
        svg.append('rect')
          .attr('class', 'heatmap-cell')
          .attr('x', labelW + wi * (cellSize + gap))
          .attr('y', di * (cellSize + gap) + 16)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', colorScale(day.value))
          .on('mousemove', (event) => {
            showTooltip(
              `<div class="lg-viz-tooltip__label">${day.key}</div>` +
              `<div class="lg-viz-tooltip__value">${day.value} contributions</div>`,
              event
            );
          })
          .on('mouseleave', hideTooltip);
      });
    });

    // Legend
    const legend = document.createElement('div');
    legend.className = 'lg-heatmap__legend';
    legend.innerHTML = '<span>Less</span>';
    [0, 0.25, 0.5, 0.75, 1].forEach(t => {
      const cell = document.createElement('div');
      cell.className = 'lg-heatmap__legend-cell';
      cell.style.background = colorScale(t * maxVal);
      legend.appendChild(cell);
    });
    legend.innerHTML += '<span>More</span>';
    container.appendChild(legend);
  };

  // ---------------------------------------------------------------------------
  // SPARKLINE
  // ---------------------------------------------------------------------------

  /**
   * Render an inline sparkline.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Array<number>} opts.data
   * @param {number} [opts.width=120]
   * @param {number} [opts.height=32]
   * @param {string} [opts.color] - defaults to primary-500
   * @param {boolean} [opts.showArea=true]
   * @param {boolean} [opts.showDot=true]
   */
  LG.sparkline = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { data, width: w = 120, height: h = 32, showArea = true, showDot = true } = opts;
    const p = palette();
    const color = opts.color || p.primary500;

    container.innerHTML = '';
    container.classList.add('lg-sparkline');

    const svg = d3.select(container).append('svg').attr('width', w).attr('height', h);

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([2, w - 2]);
    const y = d3.scaleLinear().domain([d3.min(data) * 0.9, d3.max(data) * 1.1]).range([h - 2, 2]);

    const line = d3.line().x((d, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX);

    if (showArea) {
      const area = d3.area()
        .x((d, i) => x(i))
        .y0(h)
        .y1(d => y(d))
        .curve(d3.curveMonotoneX);

      svg.append('path')
        .datum(data)
        .attr('class', 'sparkline-area')
        .attr('d', area)
        .attr('fill', color);
    }

    svg.append('path')
      .datum(data)
      .attr('class', 'sparkline-line')
      .attr('d', line)
      .attr('stroke', color);

    if (showDot) {
      svg.append('circle')
        .attr('class', 'sparkline-dot')
        .attr('cx', x(data.length - 1))
        .attr('cy', y(data[data.length - 1]))
        .attr('fill', color);
    }
  };

  // ---------------------------------------------------------------------------
  // DONUT CHART
  // ---------------------------------------------------------------------------

  /**
   * Render a donut/pie chart.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Array<{label:string, value:number, color?:string}>} opts.data
   * @param {string} [opts.title]
   * @param {string} [opts.centerLabel]
   * @param {string} [opts.centerValue]
   * @param {number} [opts.size=240]
   * @param {number} [opts.thickness=40]
   */
  LG.donut = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { data, title = '', centerLabel = '', centerValue = '', size = 240, thickness = 40 } = opts;
    const colors = categoricalColors();
    const p = palette();

    container.innerHTML = '';
    container.classList.add('lg-donut');

    if (title) {
      const hdr = document.createElement('div');
      hdr.className = 'lg-donut__header';
      hdr.innerHTML = `<h3 class="lg-donut__title">${title}</h3>`;
      container.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'lg-donut__body';
    container.appendChild(body);

    const radius = size / 2;
    const inner = radius - thickness;

    const svg = d3.select(body).append('svg')
      .attr('width', size)
      .attr('height', size);

    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

    const pie = d3.pie().value(d => d.value).sort(null).padAngle(0.02);
    const arc = d3.arc().innerRadius(inner).outerRadius(radius).cornerRadius(3);

    g.selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d, i) => d.data.color || colors[i % colors.length])
      .on('mousemove', (event, d) => {
        showTooltip(
          `<div class="lg-viz-tooltip__label">${d.data.label}</div>` +
          `<div class="lg-viz-tooltip__value">${d.data.value.toLocaleString()}</div>`,
          event
        );
      })
      .on('mouseleave', hideTooltip);

    // Center text
    if (centerValue) {
      g.append('text')
        .attr('class', 'lg-donut__center-value')
        .attr('text-anchor', 'middle')
        .attr('dy', centerLabel ? '-0.2em' : '0.1em')
        .text(centerValue);
    }
    if (centerLabel) {
      g.append('text')
        .attr('class', 'lg-donut__center-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.2em')
        .text(centerLabel);
    }

    // Legend
    const legend = document.createElement('div');
    legend.className = 'lg-donut__legend';
    data.forEach((d, i) => {
      const item = document.createElement('div');
      item.className = 'lg-donut__legend-item';
      item.innerHTML = `<div class="lg-donut__legend-dot" style="background:${d.color || colors[i % colors.length]}"></div>${d.label}`;
      legend.appendChild(item);
    });
    container.appendChild(legend);
  };

  // ---------------------------------------------------------------------------
  // BAR CHART
  // ---------------------------------------------------------------------------

  /**
   * Render a vertical bar chart.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Array<{label:string, value:number, color?:string}>} opts.data
   * @param {string} [opts.title]
   * @param {number} [opts.height=260]
   * @param {boolean} [opts.horizontal=false]
   */
  LG.barChart = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { data, title = '', height: h = 260, horizontal = false } = opts;
    const colors = categoricalColors();
    const p = palette();

    container.innerHTML = '';
    container.classList.add('lg-bar-chart');

    if (title) {
      const hdr = document.createElement('div');
      hdr.className = 'lg-bar-chart__header';
      hdr.innerHTML = `<h3 class="lg-bar-chart__title">${title}</h3>`;
      container.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'lg-bar-chart__body';
    container.appendChild(body);

    const width = container.clientWidth - 40;
    const margin = horizontal
      ? { top: 10, right: 20, bottom: 10, left: 100 }
      : { top: 10, right: 10, bottom: 40, left: 46 };

    const svg = d3.select(body).append('svg').attr('width', width).attr('height', h);

    if (horizontal) {
      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.1])
        .range([margin.left, width - margin.right]);
      const y = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.top, h - margin.bottom])
        .padding(0.3);

      svg.append('g').attr('class', 'axis')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .call(g => g.select('.domain').remove())
        .selectAll('text').attr('fill', p.textDim);

      svg.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', margin.left)
        .attr('y', d => y(d.label))
        .attr('width', d => x(d.value) - margin.left)
        .attr('height', y.bandwidth())
        .attr('fill', (d, i) => d.color || colors[i % colors.length])
        .on('mousemove', (event, d) => {
          showTooltip(`<div class="lg-viz-tooltip__value">${d.label}: ${d.value.toLocaleString()}</div>`, event);
        })
        .on('mouseleave', hideTooltip);

    } else {
      const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.3);
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.1])
        .range([h - margin.bottom, margin.top]);

      svg.append('g').attr('class', 'axis')
        .attr('transform', `translate(0,${h - margin.bottom})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call(g => g.select('.domain').remove())
        .selectAll('text').attr('fill', p.textDim);

      svg.append('g').attr('class', 'axis')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5).tickSize(0).tickFormat(d3.format('~s')))
        .call(g => g.select('.domain').remove())
        .selectAll('text').attr('fill', p.textDim);

      svg.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.label))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => h - margin.bottom - y(d.value))
        .attr('fill', (d, i) => d.color || colors[i % colors.length])
        .on('mousemove', (event, d) => {
          showTooltip(`<div class="lg-viz-tooltip__value">${d.label}: ${d.value.toLocaleString()}</div>`, event);
        })
        .on('mouseleave', hideTooltip);
    }
  };

  // ---------------------------------------------------------------------------
  // AREA CHART
  // ---------------------------------------------------------------------------

  /**
   * Render an area chart with gradient fill.
   * @param {string|Element} selector
   * @param {Object} opts
   * @param {Array<{label:string, value:number}>} opts.data
   * @param {string} [opts.title]
   * @param {number} [opts.height=260]
   * @param {string} [opts.color]
   */
  LG.areaChart = function (selector, opts) {
    const container = el(selector);
    if (!container || !d3) return;
    const { data, title = '', height: h = 260 } = opts;
    const p = palette();
    const color = opts.color || p.primary500;

    container.innerHTML = '';
    container.classList.add('lg-area-chart');

    if (title) {
      const hdr = document.createElement('div');
      hdr.className = 'lg-area-chart__header';
      hdr.innerHTML = `<h3 class="lg-area-chart__title">${title}</h3>`;
      container.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'lg-area-chart__body';
    container.appendChild(body);

    const width = container.clientWidth - 40;
    const margin = { top: 10, right: 10, bottom: 30, left: 46 };
    const uid = 'area-grad-' + Math.random().toString(36).slice(2, 8);

    const svg = d3.select(body).append('svg').attr('width', width).attr('height', h);

    // Gradient
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', uid).attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1);
    grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.3);
    grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.02);

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.15])
      .range([h - margin.bottom, margin.top]);

    // Grid
    svg.append('g').attr('class', 'grid')
      .selectAll('line')
      .data(y.ticks(5))
      .join('line')
      .attr('x1', margin.left).attr('x2', width - margin.right)
      .attr('y1', d => y(d)).attr('y2', d => y(d));

    // X axis
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${h - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(Math.min(data.length, 8)).tickSize(0).tickFormat(i => data[Math.round(i)]?.label || ''))
      .call(g => g.select('.domain').remove());

    // Y axis
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickFormat(d3.format('~s')))
      .call(g => g.select('.domain').remove());

    // Area
    const area = d3.area()
      .x((d, i) => x(i))
      .y0(h - margin.bottom)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('class', 'area-fill')
      .attr('d', area)
      .attr('fill', `url(#${uid})`);

    // Line
    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('class', 'area-line')
      .attr('d', line)
      .attr('stroke', color);

    // Dots
    svg.selectAll('.area-dot')
      .data(data)
      .join('circle')
      .attr('class', 'area-dot')
      .attr('cx', (d, i) => x(i))
      .attr('cy', d => y(d.value))
      .attr('fill', color)
      .on('mousemove', (event, d) => {
        showTooltip(
          `<div class="lg-viz-tooltip__label">${d.label}</div>` +
          `<div class="lg-viz-tooltip__value">${d.value.toLocaleString()}</div>`,
          event
        );
      })
      .on('mouseleave', hideTooltip);
  };

})();
