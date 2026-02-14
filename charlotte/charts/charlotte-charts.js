/**
 * Charlotte Charts v3.3 — Zero-dependency Canvas 2D charting library
 * 34 chart types, 6 brand themes, mobile-first responsive, Figma-matched cards
 *
 * Usage:
 *   <script src="charlotte-charts.js"></script>
 *   CharlotteCharts.bar('#container', data, options);
 */
(function () {
  'use strict';

  // =========================================================================
  // THEME REGISTRY
  // =========================================================================

  var themes = {
    platform: {
      name: 'Charlotte Platform',
      palette: ['#03045e','#023e8a','#0077b6','#0096c7','#00b4d8','#48cae4','#90e0ef','#ade8f4','#d3f7ff'],
      categorical: ['#0077b6','#00b4d8','#03045e','#48cae4','#023e8a','#90e0ef','#0096c7','#ade8f4'],
      primary: '#0077b6', secondary: '#00b4d8', accent: '#21d6c6',
      positive: '#34D399', negative: '#F87171',
      bg: '#f0f4f8', surface: '#ffffff', card: '#ffffff', border: '#e2e8f0',
      text: '#001219', textDim: '#64748b', textMuted: '#94a3b8',
      font: 'Roboto, sans-serif', fontMono: 'SF Mono, Cascadia Code, monospace',
      cardRadius: 16, cardPadding: 24, barRadius: 6,
      shadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    },
    someai: {
      name: 'SomeAI',
      palette: ['#7f1d1d','#991b1b','#b91c1c','#dc2626','#ef4444','#f87171','#fca5a5','#fecaca','#fee2e2'],
      categorical: ['#ef4444','#f97316','#fbbf24','#f87171','#dc2626','#fca5a5','#b91c1c','#fecaca'],
      primary: '#ef4444', secondary: '#f97316', accent: '#fbbf24',
      positive: '#4ade80', negative: '#f87171',
      bg: '#09090b', surface: '#18181b', card: '#18181b', border: '#27272a',
      text: '#fafafa', textDim: '#a1a1aa', textMuted: '#52525b',
      font: 'Roboto, sans-serif', fontMono: 'SF Mono, Cascadia Code, monospace',
      cardRadius: 16, cardPadding: 24, barRadius: 6,
      shadow: '0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)',
    },
    sounder: {
      name: 'Sounder',
      palette: ['#2d004d','#3d0066','#5a009e','#7200cb','#8b33d6','#a466e0','#bd99eb','#d5ccf5','#eee6ff'],
      categorical: ['#a466e0','#8b33d6','#d5ccf5','#7200cb','#bd99eb','#5a009e','#eee6ff','#3d0066'],
      primary: '#a466e0', secondary: '#8b33d6', accent: '#e879f9',
      positive: '#4ade80', negative: '#f87171',
      bg: '#0c0015', surface: '#1a0033', card: '#1a0033', border: '#2d004d',
      text: '#f5f0ff', textDim: '#a088c0', textMuted: '#6b4d8a',
      font: 'Roboto, sans-serif', fontMono: 'SF Mono, Cascadia Code, monospace',
      cardRadius: 16, cardPadding: 24, barRadius: 6,
      shadow: '0 1px 3px rgba(114,0,203,0.15), 0 4px 12px rgba(0,0,0,0.3)',
    },
    isg: {
      name: 'ISG',
      palette: ['#001529','#002244','#003366','#004488','#1565C0','#42A5F5','#90CAF9','#BBDEFB','#E3F2FD'],
      categorical: ['#42A5F5','#1565C0','#90CAF9','#FF8F00','#004488','#BBDEFB','#003366','#E3F2FD'],
      primary: '#42A5F5', secondary: '#1565C0', accent: '#FF8F00',
      positive: '#66BB6A', negative: '#EF5350',
      bg: '#080e1a', surface: '#0d1b2a', card: '#0d1b2a', border: '#1b3a5c',
      text: '#e3f2fd', textDim: '#8bacc8', textMuted: '#4a6d8c',
      font: 'Roboto, sans-serif', fontMono: 'SF Mono, Cascadia Code, monospace',
      cardRadius: 16, cardPadding: 24, barRadius: 6,
      shadow: '0 1px 3px rgba(21,101,192,0.1), 0 4px 12px rgba(0,0,0,0.3)',
    },
    richard: {
      name: 'Richard Enterprises',
      palette: ['#3e2723','#5d4037','#795548','#a1887f','#d7a84e','#e6c068','#f0d68a','#f5e6b0','#faf3da'],
      categorical: ['#e6c068','#d7a84e','#f0d68a','#a1887f','#795548','#f5e6b0','#5d4037','#faf3da'],
      primary: '#e6c068', secondary: '#d7a84e', accent: '#FFD54F',
      positive: '#66BB6A', negative: '#EF5350',
      bg: '#110e0b', surface: '#1e1813', card: '#1e1813', border: '#3e2723',
      text: '#faf3da', textDim: '#bca07a', textMuted: '#7a6248',
      font: 'Roboto, sans-serif', fontMono: 'SF Mono, Cascadia Code, monospace',
      cardRadius: 16, cardPadding: 24, barRadius: 6,
      shadow: '0 1px 3px rgba(215,168,78,0.1), 0 4px 12px rgba(0,0,0,0.3)',
    },
    allstate: {
      name: 'All State Mfg.',
      palette: ['#004d40','#00695c','#00897b','#009688','#26a69a','#4db6ac','#80cbc4','#b2dfdb','#e0f2f1'],
      categorical: ['#26a69a','#00897b','#80cbc4','#004d40','#4db6ac','#00695c','#b2dfdb','#e0f2f1'],
      primary: '#26a69a', secondary: '#00897b', accent: '#1E88E5',
      positive: '#66BB6A', negative: '#EF5350',
      bg: '#060f0d', surface: '#0f201c', card: '#0f201c', border: '#1e4d44',
      text: '#e0f2f1', textDim: '#80cbc4', textMuted: '#4a7a70',
      font: 'Roboto, sans-serif', fontMono: 'SF Mono, Cascadia Code, monospace',
      cardRadius: 16, cardPadding: 24, barRadius: 6,
      shadow: '0 1px 3px rgba(0,137,123,0.1), 0 4px 12px rgba(0,0,0,0.3)',
    },
  };

  var activeTheme = 'platform';

  function getTheme(name) {
    return themes[name || activeTheme] || themes.platform;
  }

  function setTheme(name) {
    if (themes[name]) activeTheme = name;
  }

  function registerTheme(name, theme) {
    themes[name] = theme;
  }

  // =========================================================================
  // CANVAS UTILITIES
  // =========================================================================

  var DPR = window.devicePixelRatio || 1;

  function createCanvas(container, width, height) {
    var el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) throw new Error('CharlotteCharts: container not found');
    var canvas = document.createElement('canvas');
    var containerW = el.clientWidth;
    var w = width || containerW || 360;
    // Clamp to container width — never overflow the parent
    if (containerW > 0 && w > containerW) w = containerW;
    var h = height || 300;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.display = 'block';
    canvas.style.maxWidth = '100%';
    var ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);
    el.appendChild(canvas);
    // Enable touch → mouse event normalization for mobile tooltips
    enableTouch(canvas);
    return { canvas: canvas, ctx: ctx, w: w, h: h };
  }

  function roundedRect(ctx, x, y, w, h, r) {
    if (w <= 0 || h <= 0) return;
    r = Math.min(r, w / 2, h / 2);
    if (r < 0) r = 0;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function catmullRomSpline(points) {
    var result = [];
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = points[Math.max(0, i - 1)];
      var p1 = points[i];
      var p2 = points[i + 1];
      var p3 = points[Math.min(points.length - 1, i + 2)];
      var steps = 20;
      for (var t = 0; t <= 1; t += 1 / steps) {
        var t2 = t * t, t3 = t2 * t;
        result.push([
          0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    return result;
  }

  function linearScale(domain, range) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    var span = d1 - d0 || 1;
    return function (v) { return r0 + ((v - d0) / span) * (r1 - r0); };
  }

  function bandScale(labels, range, padding) {
    padding = padding || 0.2;
    var r0 = range[0], r1 = range[1];
    var n = labels.length;
    var step = (r1 - r0) / n;
    var bw = step * (1 - padding);
    return {
      scale: function (i) { return r0 + i * step + (step - bw) / 2; },
      bandwidth: function () { return bw; },
      step: function () { return step; },
    };
  }

  /** Resolve chart width: clamp to container, never overflow parent. */
  function resolveWidth(container, width, fallback) {
    var el = typeof container === 'string' ? document.querySelector(container) : container;
    var cw = el ? el.clientWidth : 0;
    var w = width || fallback || 360;
    return (cw > 0 && w > cw) ? cw : w;
  }

  function niceMax(values) {
    var max = Math.max.apply(null, values);
    if (max <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / mag) * mag;
  }

  function niceMaxStacked(series) {
    var n = series[0].values.length;
    var max = 0;
    for (var i = 0; i < n; i++) {
      var sum = 0;
      for (var s = 0; s < series.length; s++) sum += (series[s].values[i] || 0);
      if (sum > max) max = sum;
    }
    return niceMax([max]);
  }

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function seriesColor(theme, index) {
    return theme.categorical[index % theme.categorical.length];
  }

  function formatNum(val) {
    if (Math.abs(val) >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    if (Math.abs(val) >= 1e3) return (val / 1e3).toFixed(val >= 1e4 ? 0 : 1) + 'k';
    return Math.round(val).toString();
  }

  // =========================================================================
  // DATA UTILITIES — derivative, integral, transforms
  // =========================================================================

  var utils = {
    /** First difference (rate of change). Returns array same length, first element = 0. */
    derivative: function (values) {
      var r = [0];
      for (var i = 1; i < values.length; i++) r.push(values[i] - values[i - 1]);
      return r;
    },
    /** Cumulative sum (running total). */
    integral: function (values) {
      var r = [], sum = 0;
      for (var i = 0; i < values.length; i++) { sum += values[i]; r.push(sum); }
      return r;
    },
    /** Rolling mean. Null-pads the first (window-1) entries. */
    movingAverage: function (values, window) {
      window = window || 3;
      var r = [];
      for (var i = 0; i < values.length; i++) {
        if (i < window - 1) { r.push(null); continue; }
        var sum = 0;
        for (var j = 0; j < window; j++) sum += values[i - j];
        r.push(sum / window);
      }
      return r;
    },
    /** Percent change from previous value. First element = 0. */
    percentChange: function (values) {
      var r = [0];
      for (var i = 1; i < values.length; i++) {
        r.push(values[i - 1] ? ((values[i] - values[i - 1]) / values[i - 1]) * 100 : 0);
      }
      return r;
    },
    /** Min-max normalize to 0-1. */
    normalize: function (values) {
      var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
      var range = max - min || 1;
      return values.map(function (v) { return (v - min) / range; });
    },
    /** Bin raw values into histogram buckets. Returns [{x, count, lo, hi}]. */
    bin: function (values, numBins) {
      numBins = numBins || 12;
      var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
      var bw = (max - min) / numBins || 1;
      var bins = [];
      for (var i = 0; i < numBins; i++) {
        bins.push({ x: min + i * bw + bw / 2, count: 0, lo: min + i * bw, hi: min + (i + 1) * bw });
      }
      values.forEach(function (v) {
        var idx = Math.min(Math.floor((v - min) / bw), numBins - 1);
        if (idx < 0) idx = 0;
        bins[idx].count++;
      });
      return bins;
    },
    /** Exponential moving average. */
    ema: function (values, span) {
      span = span || 5;
      var k = 2 / (span + 1), r = [values[0]];
      for (var i = 1; i < values.length; i++) r.push(values[i] * k + r[i - 1] * (1 - k));
      return r;
    },
    /** Standard deviation of an array. */
    stdev: function (arr) {
      var n = arr.length;
      if (n < 2) return 0;
      var mean = arr.reduce(function (s, v) { return s + v; }, 0) / n;
      return Math.sqrt(arr.reduce(function (s, v) { return s + (v - mean) * (v - mean); }, 0) / (n - 1));
    },
    /** Bollinger bands — returns { upper: [], middle: [], lower: [] }. */
    bollinger: function (values, window, mult) {
      window = window || 20; mult = mult || 2;
      var ma = utils.movingAverage(values, window);
      var upper = [], lower = [];
      for (var i = 0; i < values.length; i++) {
        if (ma[i] === null) { upper.push(null); lower.push(null); continue; }
        var slice = values.slice(Math.max(0, i - window + 1), i + 1);
        var sd = utils.stdev(slice);
        upper.push(ma[i] + mult * sd);
        lower.push(ma[i] - mult * sd);
      }
      return { upper: upper, middle: ma, lower: lower };
    },
    /** Seeded random walk for reproducible demo data. */
    randomWalk: function (start, drift, volatility, n, seed) {
      seed = seed || 42;
      var s = seed;
      function rand() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }
      var v = [start];
      for (var i = 1; i < n; i++) v.push(v[i - 1] + drift + (rand() - 0.5) * volatility);
      return v;
    },
    /** Pearson correlation between two arrays. */
    correlation: function (x, y) {
      var n = Math.min(x.length, y.length);
      if (n < 2) return 0;
      var sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
      for (var i = 0; i < n; i++) { sx += x[i]; sy += y[i]; sxy += x[i] * y[i]; sx2 += x[i] * x[i]; sy2 += y[i] * y[i]; }
      var num = n * sxy - sx * sy;
      var den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
      return den ? num / den : 0;
    },
    /** NxN Pearson correlation matrix from array of series. */
    correlationMatrix: function (arrays) {
      var n = arrays.length, m = [];
      for (var i = 0; i < n; i++) { m[i] = []; for (var j = 0; j < n; j++) m[i][j] = utils.correlation(arrays[i], arrays[j]); }
      return m;
    },
  };

  // Grid + axes
  function drawAxes(ctx, area, yMax, labels, theme, opts) {
    opts = opts || {};
    var tickCount = opts.tickCount || 5;
    var yMin = opts.yMin || 0;
    ctx.save();

    // Y grid + labels
    ctx.font = '12px ' + theme.font;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (var i = 0; i <= tickCount; i++) {
      var frac = i / tickCount;
      var y = area.y + area.h - frac * area.h;
      var val = yMin + frac * (yMax - yMin);
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(area.x, y);
      ctx.lineTo(area.x + area.w, y);
      ctx.stroke();
      ctx.fillStyle = theme.textMuted;
      ctx.fillText(opts.yFormat ? opts.yFormat(val) : formatNum(val), area.x - 8, y);
    }

    // X labels
    if (labels && labels.length) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = theme.textMuted;
      ctx.font = '11px ' + theme.font;
      var step = area.w / labels.length;
      // Auto-skip: ensure each label has ≥32px; also cap at 12 visible labels
      var minLabelW = 32;
      var skipByWidth = step < minLabelW ? Math.ceil(minLabelW / step) : 1;
      var skipByCount = labels.length > 12 ? Math.ceil(labels.length / 12) : 1;
      var skip = Math.max(skipByWidth, skipByCount);
      for (var i = 0; i < labels.length; i++) {
        if (i % skip === 0 && labels[i]) {
          ctx.fillText(labels[i], area.x + step * i + step / 2, area.y + area.h + 8);
        }
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // CARD CONTAINER
  // =========================================================================

  function createCard(container, opts) {
    var el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) throw new Error('CharlotteCharts: container not found');
    var theme = getTheme(opts.theme);
    var card = document.createElement('div');
    card.style.cssText = [
      'background:' + theme.card,
      'border-radius:' + theme.cardRadius + 'px',
      'overflow:hidden',
      'font-family:' + theme.font,
      'color:' + theme.text,
      'border:1px solid ' + theme.border,
      'box-shadow:' + (theme.shadow || 'none'),
    ].join(';') + ';';

    if (opts.title) {
      var header = document.createElement('div');
      header.style.cssText = 'padding:' + theme.cardPadding + 'px ' + theme.cardPadding + 'px 0;';
      var title = document.createElement('div');
      title.style.cssText = 'font-size:16px;font-weight:600;letter-spacing:-0.01em;color:' + theme.text + ';';
      title.textContent = opts.title;
      header.appendChild(title);
      if (opts.subtitle) {
        var sub = document.createElement('div');
        sub.style.cssText = 'font-size:13px;color:' + theme.textMuted + ';margin-top:2px;';
        sub.textContent = opts.subtitle;
        header.appendChild(sub);
      }
      card.appendChild(header);
    }

    if (opts.legend && opts.legend.length) {
      var leg = document.createElement('div');
      leg.style.cssText = 'display:flex;gap:14px;flex-wrap:wrap;padding:12px ' + theme.cardPadding + 'px 4px;';
      opts.legend.forEach(function (item) {
        var span = document.createElement('span');
        span.style.cssText = 'display:inline-flex;align-items:center;gap:5px;font-size:12px;color:' + theme.textDim + ';';
        var dot = document.createElement('span');
        dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + item.color + ';display:inline-block;flex-shrink:0;';
        span.appendChild(dot);
        span.appendChild(document.createTextNode(item.label));
        leg.appendChild(span);
      });
      card.appendChild(leg);
    }

    var body = document.createElement('div');
    body.style.cssText = 'padding:' + theme.cardPadding + 'px;';
    card.appendChild(body);

    if (opts.footer) {
      var footer = document.createElement('div');
      footer.style.cssText = 'padding:0 ' + theme.cardPadding + 'px ' + theme.cardPadding + 'px;font-size:12px;color:' + theme.textMuted + ';';
      footer.textContent = opts.footer;
      card.appendChild(footer);
    }

    el.appendChild(card);
    return { card: card, body: body, theme: theme };
  }

  // =========================================================================
  // TOOLTIP
  // =========================================================================

  var tooltipEl = null;

  function showTooltip(canvas, x, y, html, theme) {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;padding:8px 12px;border-radius:8px;font-size:12px;line-height:1.5;transition:opacity 0.15s ease;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);max-width:220px;white-space:normal;word-wrap:break-word;';
      document.body.appendChild(tooltipEl);
    }
    var rect = canvas.getBoundingClientRect();
    tooltipEl.style.background = hexToRgba(theme.card, 0.92);
    tooltipEl.style.color = theme.text;
    tooltipEl.style.border = '1px solid ' + theme.border;
    tooltipEl.style.fontFamily = theme.font;
    tooltipEl.style.boxShadow = theme.shadow || 'none';
    tooltipEl.innerHTML = html;
    tooltipEl.style.opacity = '1';

    var vw = window.innerWidth, vh = window.innerHeight;
    var tx = rect.left + x + 14;
    var ty = rect.top + y - 10;
    // Keep tooltip on-screen (both horizontal and vertical)
    if (tx + 230 > vw) tx = Math.max(4, rect.left + x - 200);
    if (ty < 4) ty = 4;
    if (ty + 80 > vh) ty = vh - 80;
    tooltipEl.style.left = tx + 'px';
    tooltipEl.style.top = ty + 'px';
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.style.opacity = '0';
  }

  // Touch → mouse event normalization (all canvas charts get mobile tooltips for free)
  function enableTouch(canvas) {
    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        var t = e.touches[0];
        canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: t.clientX, clientY: t.clientY, bubbles: true }));
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', function (e) {
      if (e.touches.length === 1) {
        var t = e.touches[0];
        canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: t.clientX, clientY: t.clientY, bubbles: true }));
      }
    }, { passive: true });
    canvas.addEventListener('touchend', function () {
      canvas.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
  }

  // =========================================================================
  // CHART: BAR
  // =========================================================================

  function barChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var variant = opts.variant || 'vertical';
    var labels = data.labels || [];
    var series = data.series || [];
    if (!series.length) return;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || 260;
    var pad = { top: 16, right: 16, bottom: 36, left: 48 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;

    if (variant === 'horizontal') {
      var maxVal = 0;
      series.forEach(function (s) { s.values.forEach(function (v) { if (v > maxVal) maxVal = v; }); });
      maxVal = niceMax([maxVal]);
      var bs = bandScale(labels, [area.y, area.y + area.h], 0.25);
      var xScale = linearScale([0, maxVal], [area.x, area.x + area.w]);

      for (var i = 0; i <= 4; i++) {
        var xv = (i / 4) * maxVal, xx = xScale(xv);
        ctx.strokeStyle = theme.border; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(xx, area.y); ctx.lineTo(xx, area.y + area.h); ctx.stroke();
        ctx.fillStyle = theme.textMuted; ctx.font = '11px ' + theme.font;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(formatNum(xv), xx, area.y + area.h + 6);
      }

      labels.forEach(function (label, idx) {
        var y0 = bs.scale(idx);
        var bh = bs.bandwidth() / series.length;
        series.forEach(function (s, si) {
          var color = s.color || seriesColor(theme, si);
          var bw = xScale(s.values[idx]) - area.x;
          ctx.fillStyle = color;
          roundedRect(ctx, area.x, y0 + si * bh, Math.max(bw, 2), bh - 2, theme.barRadius / 2);
          ctx.fill();
        });
        ctx.fillStyle = theme.textMuted; ctx.font = '12px ' + theme.font;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(label, area.x - 8, y0 + bs.bandwidth() / 2);
      });
    } else if (variant === 'stacked') {
      var stackMax = niceMaxStacked(series);
      var bs = bandScale(labels, [area.x, area.x + area.w], 0.25);
      drawAxes(ctx, area, stackMax, labels, theme);

      labels.forEach(function (label, idx) {
        var cumY = area.y + area.h;
        series.forEach(function (s, si) {
          var val = s.values[idx] || 0;
          var barH = (val / stackMax) * area.h;
          ctx.fillStyle = s.color || seriesColor(theme, si);
          roundedRect(ctx, bs.scale(idx), cumY - barH, bs.bandwidth(), barH, si === series.length - 1 ? theme.barRadius : 0);
          ctx.fill();
          cumY -= barH;
        });
      });
    } else if (variant === 'grouped') {
      var maxVal = 0;
      series.forEach(function (s) { s.values.forEach(function (v) { if (v > maxVal) maxVal = v; }); });
      maxVal = niceMax([maxVal]);
      var bs = bandScale(labels, [area.x, area.x + area.w], 0.2);
      drawAxes(ctx, area, maxVal, labels, theme);

      labels.forEach(function (label, idx) {
        var gw = bs.bandwidth() / series.length;
        series.forEach(function (s, si) {
          var val = s.values[idx] || 0;
          var barH = (val / maxVal) * area.h;
          ctx.fillStyle = s.color || seriesColor(theme, si);
          roundedRect(ctx, bs.scale(idx) + si * gw, area.y + area.h - barH, gw - 2, barH, theme.barRadius);
          ctx.fill();
        });
      });
    } else {
      var maxVal = -Infinity, minVal = Infinity;
      series.forEach(function (s) { s.values.forEach(function (v) { if (v > maxVal) maxVal = v; if (v < minVal) minVal = v; }); });
      if (minVal >= 0) minVal = 0;
      maxVal = niceMax([maxVal]);
      if (minVal < 0) { var absMin = niceMax([Math.abs(minVal)]); minVal = -absMin; }
      var bs = bandScale(labels, [area.x, area.x + area.w], 0.3);
      var yScale = linearScale([minVal, maxVal], [area.y + area.h, area.y]);
      var zeroY = yScale(0);
      drawAxes(ctx, area, maxVal, labels, theme, { yMin: minVal });

      labels.forEach(function (label, idx) {
        series.forEach(function (s, si) {
          var val = s.values[idx] || 0;
          var vy = yScale(val);
          var barY = val >= 0 ? vy : zeroY;
          var barH = Math.abs(vy - zeroY);
          var isNeg = val < 0;
          ctx.fillStyle = (minVal < 0 && series.length === 1) ? (isNeg ? theme.negative : theme.positive) : (s.color || seriesColor(theme, si));
          roundedRect(ctx, bs.scale(idx), barY, bs.bandwidth(), Math.max(barH, 1), theme.barRadius);
          ctx.fill();
        });
      });

      // Zero line when chart has negative values
      if (minVal < 0) {
        ctx.strokeStyle = theme.textDim;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(area.x, zeroY);
        ctx.lineTo(area.x + area.w, zeroY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top;
      if (mx >= area.x && mx <= area.x + area.w && my >= area.y && my <= area.y + area.h) {
        var step = area.w / labels.length;
        var idx = Math.floor((mx - area.x) / step);
        if (idx >= 0 && idx < labels.length) {
          var html = '<b style="font-size:13px">' + labels[idx] + '</b><br>';
          series.forEach(function (s, si) {
            html += '<span style="color:' + (s.color || seriesColor(theme, si)) + '">\u25CF</span> ' + s.name + ': <b>' + (s.values[idx] || 0) + '</b><br>';
          });
          showTooltip(canvas, mx, my, html, theme);
          return;
        }
      }
      hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: LINE
  // =========================================================================

  function lineChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var labels = data.labels || [], series = data.series || [];
    if (!series.length) return;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || 260;
    var pad = { top: 16, right: 16, bottom: 36, left: 48 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;

    var maxVal = 0, minVal = Infinity;
    series.forEach(function (s) {
      s.values.forEach(function (v) { if (v > maxVal) maxVal = v; if (v < minVal) minVal = v; });
    });
    if (opts.yMin !== undefined) minVal = opts.yMin;
    else minVal = Math.min(0, minVal);
    maxVal = niceMax([maxVal]);

    var xStep = area.w / Math.max(1, labels.length - 1);
    var yScale = linearScale([minVal, maxVal], [area.y + area.h, area.y]);

    drawAxes(ctx, area, maxVal, labels, theme);

    series.forEach(function (s, si) {
      var color = s.color || seriesColor(theme, si);
      var pts = s.values.map(function (v, i) { return [area.x + i * xStep, yScale(v)]; });
      var smooth = pts.length > 2 ? catmullRomSpline(pts) : pts;

      if (opts.showArea || s.showArea) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(smooth[0][0], area.y + area.h);
        smooth.forEach(function (p) { ctx.lineTo(p[0], p[1]); });
        ctx.lineTo(smooth[smooth.length - 1][0], area.y + area.h);
        ctx.closePath();
        var grad = ctx.createLinearGradient(0, area.y, 0, area.y + area.h);
        grad.addColorStop(0, hexToRgba(color, 0.3));
        grad.addColorStop(1, hexToRgba(color, 0.01));
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      smooth.forEach(function (p, i) { i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); });
      ctx.stroke();

      var showDots = opts.showDots !== undefined ? opts.showDots : (pts.length <= 20);
      if (showDots) {
        pts.forEach(function (p) {
          ctx.beginPath();
          ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
          ctx.fillStyle = theme.card;
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }
    });

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      if (mx >= area.x && mx <= area.x + area.w) {
        var idx = Math.round((mx - area.x) / xStep);
        idx = Math.max(0, Math.min(idx, labels.length - 1));
        var html = '<b style="font-size:13px">' + labels[idx] + '</b><br>';
        series.forEach(function (s, si) {
          html += '<span style="color:' + (s.color || seriesColor(theme, si)) + '">\u25CF</span> ' + (s.name || 'Series') + ': <b>' + s.values[idx] + '</b><br>';
        });
        showTooltip(canvas, mx, e.clientY - rect.top, html, theme);
        return;
      }
      hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: DONUT
  // =========================================================================

  function donutChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var segments = data.segments || [];
    if (!segments.length) return;

    var cw = resolveWidth(container, opts.width, 280), ch = opts.height || 280;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;

    var cx = cw / 2, cy = ch / 2;
    var outerR = Math.min(cw, ch) / 2 - 16;
    var innerR = outerR * (opts.innerRadius !== undefined ? opts.innerRadius : 0.62);
    var total = segments.reduce(function (s, seg) { return s + seg.value; }, 0);
    var startAngle = -Math.PI / 2;
    var gap = 0.025;

    segments.forEach(function (seg, i) {
      var sweep = (seg.value / total) * Math.PI * 2 - gap;
      var color = seg.color || seriesColor(theme, i);
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, innerR, startAngle + sweep, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      startAngle += sweep + gap;
    });

    if (data.centerText || opts.centerText) {
      var centerFontSize = Math.min(26, innerR * 0.55);
      ctx.fillStyle = theme.text;
      ctx.font = 'bold ' + Math.round(centerFontSize) + 'px ' + theme.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.centerText || opts.centerText, cx, data.centerSub ? cy - centerFontSize * 0.3 : cy);
      if (data.centerSub) {
        ctx.font = Math.round(centerFontSize * 0.5) + 'px ' + theme.font;
        ctx.fillStyle = theme.textDim;
        ctx.fillText(data.centerSub, cx, cy + centerFontSize * 0.45);
      }
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left - cx, my = e.clientY - rect.top - cy;
      var dist = Math.sqrt(mx * mx + my * my);
      if (dist >= innerR && dist <= outerR) {
        var angle = Math.atan2(my, mx);
        if (angle < -Math.PI / 2) angle += Math.PI * 2;
        var cum = -Math.PI / 2;
        for (var i = 0; i < segments.length; i++) {
          var sw = (segments[i].value / total) * Math.PI * 2;
          if (angle >= cum && angle < cum + sw) {
            showTooltip(canvas, e.clientX - rect.left, e.clientY - rect.top,
              '<b>' + segments[i].label + '</b><br>' + segments[i].value + ' (' + ((segments[i].value / total) * 100).toFixed(1) + '%)', theme);
            return;
          }
          cum += sw;
        }
      }
      hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: RADAR
  // =========================================================================

  function radarChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var axes = data.axes || [], series = data.series || [];
    if (!axes.length) return;

    var cw = resolveWidth(container, opts.width, 300), ch = opts.height || 300;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var cx = cw / 2, cy = ch / 2, R = Math.min(cw, ch) / 2 - 36;
    var n = axes.length, angleStep = (Math.PI * 2) / n;

    function angleFor(i) { return -Math.PI / 2 + i * angleStep; }

    // Rings
    for (var ring = 1; ring <= 5; ring++) {
      var r = (ring / 5) * R;
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var a = angleFor(i % n);
        var px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Spokes + labels (font adapts to axis count)
    var labelSize = n > 8 ? '10px ' : '12px ';
    var labelPad = n > 8 ? 10 : 14;
    for (var i = 0; i < n; i++) {
      var a = angleFor(i);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.fillStyle = theme.textDim;
      ctx.font = labelSize + theme.font;
      ctx.textAlign = Math.cos(a) > 0.1 ? 'left' : (Math.cos(a) < -0.1 ? 'right' : 'center');
      ctx.textBaseline = Math.sin(a) > 0.1 ? 'top' : (Math.sin(a) < -0.1 ? 'bottom' : 'middle');
      ctx.fillText(axes[i], cx + Math.cos(a) * (R + labelPad), cy + Math.sin(a) * (R + labelPad));
    }

    var maxVal = 0;
    series.forEach(function (s) { s.values.forEach(function (v) { if (v > maxVal) maxVal = v; }); });
    if (!maxVal) maxVal = 100;

    series.forEach(function (s, si) {
      var color = s.color || seriesColor(theme, si);
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var idx = i % n, a = angleFor(idx);
        var frac = (s.values[idx] || 0) / maxVal;
        var px = cx + Math.cos(a) * R * frac, py = cy + Math.sin(a) * R * frac;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = hexToRgba(color, 0.15);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      for (var i = 0; i < n; i++) {
        var a = angleFor(i), frac = (s.values[i] || 0) / maxVal;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * R * frac, cy + Math.sin(a) * R * frac, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: GAUGE
  // =========================================================================

  function gaugeChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var value = data.value || 0, max = data.max || 100;
    var frac = Math.min(value / max, 1);

    var cw = resolveWidth(container, opts.width, 220), ch = opts.height || 140;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var cx = cw / 2, cy = ch - 16;
    var R = Math.min(cw / 2, ch) - 28;
    var lineW = 16;

    ctx.beginPath();
    ctx.arc(cx, cy, R, Math.PI, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(theme.primary, 0.12);
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.stroke();

    var grad = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    grad.addColorStop(0, theme.primary);
    grad.addColorStop(1, theme.accent);
    ctx.beginPath();
    ctx.arc(cx, cy, R, Math.PI, Math.PI + frac * Math.PI);
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.stroke();

    var gaugeFontSize = Math.min(28, R * 0.45);
    ctx.fillStyle = theme.text;
    ctx.font = 'bold ' + Math.round(gaugeFontSize) + 'px ' + theme.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(value) + (data.unit || ''), cx, cy - R * 0.25);

    if (data.label) {
      ctx.font = Math.round(gaugeFontSize * 0.46) + 'px ' + theme.font;
      ctx.fillStyle = theme.textDim;
      ctx.fillText(data.label, cx, cy - R * 0.02);
    }
    return ref.canvas;
  }

  // =========================================================================
  // CHART: HEATMAP
  // =========================================================================

  function heatmapChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var cells = data.cells || [];
    var cols = data.cols || 52, rows = data.rows || 7;
    var cellSize = opts.cellSize || 13, gap = opts.gap || 3;

    var rowLabels = data.rowLabels || (rows === 7 ? ['M', '', 'W', '', 'F', '', 'S'] : null);
    var colLabels = data.colLabels || null;
    var labelPadLeft = rowLabels ? 30 : 6;
    var labelPadTop = colLabels ? 18 : 6;

    var cw = resolveWidth(container, opts.width, cols * (cellSize + gap) + labelPadLeft + 8);
    var ch = opts.height || (rows * (cellSize + gap) + labelPadTop + 8);
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;
    var ox = labelPadLeft, oy = labelPadTop;
    var pal = data.palette || theme.palette;

    // Row labels
    if (rowLabels) {
      ctx.fillStyle = theme.textMuted;
      ctx.font = '10px ' + theme.font;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (var r = 0; r < rows && r < rowLabels.length; r++) {
        if (rowLabels[r]) ctx.fillText(rowLabels[r], ox - 5, oy + r * (cellSize + gap) + cellSize / 2);
      }
    }

    // Column labels
    if (colLabels) {
      ctx.fillStyle = theme.textMuted;
      ctx.font = '10px ' + theme.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      var colStep = Math.max(1, Math.ceil(colLabels.length / 12));
      for (var c = 0; c < colLabels.length; c++) {
        if (c % colStep === 0 && colLabels[c]) {
          ctx.fillText(colLabels[c], ox + c * (cellSize + gap) + cellSize / 2, oy - 3);
        }
      }
    }

    // Compute max if not provided
    var maxVal = data.maxValue;
    if (!maxVal) {
      maxVal = 0;
      cells.forEach(function (c) { var v = typeof c === 'number' ? c : (c.value || 0); if (v > maxVal) maxVal = v; });
      if (!maxVal) maxVal = 1;
    }

    // Draw cells
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var col = Math.floor(i / rows), row = i % rows;
      var x = ox + col * (cellSize + gap), y = oy + row * (cellSize + gap);
      var intensity = typeof cell === 'number' ? cell : (cell.value || 0);
      var norm = Math.min(intensity / maxVal, 1);
      var palIdx = Math.round(norm * (pal.length - 1));
      ctx.fillStyle = norm === 0 ? hexToRgba(theme.textMuted, 0.08) : pal[pal.length - 1 - palIdx];
      roundedRect(ctx, x, y, cellSize, cellSize, 2.5);
      ctx.fill();
    }

    // Tooltip
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top;
      var col = Math.floor((mx - ox) / (cellSize + gap));
      var row = Math.floor((my - oy) / (cellSize + gap));
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        var idx = col * rows + row;
        if (idx < cells.length) {
          var cell = cells[idx];
          var val = typeof cell === 'number' ? cell : (cell.value || 0);
          var label = typeof cell === 'object' && cell.label ? cell.label : '';
          var rl = rowLabels && rowLabels[row] ? rowLabels[row] : '';
          var cl = colLabels && colLabels[col] ? colLabels[col] : '';
          var html = (cl || rl ? '<b>' + [cl, rl].filter(Boolean).join(' ') + '</b><br>' : '') + 'Value: <b>' + val + '</b>' + (label ? '<br>' + label : '');
          showTooltip(canvas, mx, my, html, theme);
          return;
        }
      }
      hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: SPARKLINE
  // =========================================================================

  function sparklineChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var values = data.values || [];
    if (!values.length) return;

    var cw = resolveWidth(container, opts.width, 120), ch = opts.height || 40;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var color = data.color || opts.color || theme.primary;
    var minV = Math.min.apply(null, values), maxV = Math.max.apply(null, values);
    var range = maxV - minV || 1;
    var pad = 2;

    var pts = values.map(function (v, i) {
      return [pad + (i / (values.length - 1)) * (cw - pad * 2), ch - pad - ((v - minV) / range) * (ch - pad * 2)];
    });

    if (data.showArea || opts.showArea) {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], ch);
      pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); });
      ctx.lineTo(pts[pts.length - 1][0], ch);
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, hexToRgba(color, 0.25));
      grad.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.beginPath();
    pts.forEach(function (p, i) { i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    var last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(last[0], last[1], 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    return ref.canvas;
  }

  // =========================================================================
  // CHART: STAT CARD
  // =========================================================================

  function statCard(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;

    var card = document.createElement('div');
    card.style.cssText = 'font-family:' + theme.font + ';color:' + theme.text + ';';

    var label = document.createElement('div');
    label.style.cssText = 'font-size:13px;color:' + theme.textMuted + ';margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em;font-weight:500;';
    label.textContent = data.label || '';
    card.appendChild(label);

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:baseline;gap:8px;';

    var valEl = document.createElement('span');
    valEl.style.cssText = 'font-size:32px;font-weight:700;letter-spacing:-0.02em;color:' + theme.text + ';';
    valEl.textContent = data.value || '0';
    row.appendChild(valEl);

    if (data.unit) {
      var unit = document.createElement('span');
      unit.style.cssText = 'font-size:14px;color:' + theme.textDim + ';';
      unit.textContent = data.unit;
      row.appendChild(unit);
    }

    if (data.change !== undefined && data.change !== null) {
      var delta = document.createElement('span');
      var isPos = data.change >= 0;
      delta.style.cssText = 'font-size:13px;font-weight:600;padding:2px 8px;border-radius:6px;background:' + hexToRgba(isPos ? theme.positive : theme.negative, 0.12) + ';color:' + (isPos ? theme.positive : theme.negative) + ';';
      delta.textContent = (isPos ? '+' : '') + data.change + '%';
      row.appendChild(delta);
    }
    card.appendChild(row);

    if (data.sparkline && data.sparkline.length) {
      var sparkEl = document.createElement('div');
      sparkEl.style.cssText = 'margin-top:10px;';
      card.appendChild(sparkEl);
      el.appendChild(card);
      var sparkW = opts.sparkWidth || el.clientWidth - 8 || 140;
      sparklineChart(sparkEl, { values: data.sparkline, showArea: true }, { theme: opts.theme, width: sparkW, height: 36 });
    } else {
      el.appendChild(card);
    }
    return card;
  }

  // =========================================================================
  // CHART: CONCENTRIC RINGS
  // =========================================================================

  function ringsChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var rings = data.rings || [];
    if (!rings.length) return;

    var cw = resolveWidth(container, opts.width, 220), ch = opts.height || 220;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var cx = cw / 2, cy = ch / 2;
    var maxR = Math.min(cw, ch) / 2 - 16;
    var lineW = Math.max(10, (maxR / rings.length) * 0.55);
    var ringGap = (maxR - lineW) / rings.length;

    rings.forEach(function (ring, i) {
      var r = maxR - i * ringGap;
      var frac = Math.min((ring.value || 0) / (ring.max || 100), 1);
      var color = ring.color || seriesColor(theme, i);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(color, 0.12);
      ctx.lineWidth = lineW;
      ctx.lineCap = 'butt';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    if (data.centerText) {
      ctx.fillStyle = theme.text;
      ctx.font = 'bold 22px ' + theme.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.centerText, cx, cy);
    }
    return ref.canvas;
  }

  // =========================================================================
  // CHART: STACKED AREA
  // =========================================================================

  function stackedAreaChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var labels = data.labels || [], series = data.series || [];
    if (!series.length) return;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || 260;
    var pad = { top: 16, right: 16, bottom: 36, left: 48 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var n = labels.length, stackMax = niceMaxStacked(series);
    var xStep = area.w / Math.max(1, n - 1);

    drawAxes(ctx, area, stackMax, labels, theme);

    var cumBase = new Array(n).fill(0);
    var layerPts = [];
    for (var si = 0; si < series.length; si++) {
      var topPts = [], botPts = [];
      for (var i = 0; i < n; i++) {
        var val = series[si].values[i] || 0;
        var yBot = area.y + area.h - (cumBase[i] / stackMax) * area.h;
        cumBase[i] += val;
        var yTop = area.y + area.h - (cumBase[i] / stackMax) * area.h;
        topPts.push([area.x + i * xStep, yTop]);
        botPts.push([area.x + i * xStep, yBot]);
      }
      layerPts.push({ top: topPts, bot: botPts, color: series[si].color || seriesColor(theme, si) });
    }

    for (var si = layerPts.length - 1; si >= 0; si--) {
      var layer = layerPts[si];
      var sTop = layer.top.length > 2 ? catmullRomSpline(layer.top) : layer.top;
      var sBot = layer.bot.length > 2 ? catmullRomSpline(layer.bot) : layer.bot;
      ctx.beginPath();
      sTop.forEach(function (p, i) { i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); });
      for (var i = sBot.length - 1; i >= 0; i--) ctx.lineTo(sBot[i][0], sBot[i][1]);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(layer.color, 0.65);
      ctx.fill();
      ctx.beginPath();
      sTop.forEach(function (p, i) { i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); });
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    return ref.canvas;
  }

  // =========================================================================
  // CHART: CHOROPLETH
  // =========================================================================

  function choroplethChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var stateData = window.CharlotteStates;
    if (!stateData) { console.warn('CharlotteCharts: us-states.js not loaded'); return; }

    var values = data.states || {};
    var cw = resolveWidth(container, opts.width, 480), ch = opts.height || 300;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;

    var vals = Object.values(values).filter(function (v) { return typeof v === 'number'; });
    var minVal = vals.length ? Math.min.apply(null, vals) : 0;
    var maxVal = vals.length ? Math.max.apply(null, vals) : 1;
    var pal = theme.palette;
    var lngMin = -125, lngMax = -66, latMin = 24, latMax = 50;
    var mapW = cw - 32, mapH = ch - 32, mapX = 16, mapY = 16;

    function project(lng, lat, isAK, isHI) {
      if (isAK) return [mapX + ((lng + 190) / 60) * mapW * 0.14, mapY + mapH - ((lat - 51) / 20) * mapH * 0.14];
      if (isHI) return [mapX + mapW * 0.2 + ((lng + 161) / 8) * mapW * 0.08, mapY + mapH - ((lat - 18.5) / 4) * mapH * 0.06 - 4];
      return [mapX + ((lng - lngMin) / (lngMax - lngMin)) * mapW, mapY + ((latMax - lat) / (latMax - latMin)) * mapH];
    }

    function valueColor(val) {
      if (val === undefined || val === null) return hexToRgba(theme.textMuted, 0.1);
      var norm = maxVal > minVal ? (val - minVal) / (maxVal - minVal) : 0.5;
      return pal[pal.length - 1 - Math.round(norm * (pal.length - 1))];
    }

    var stateRects = {};
    Object.keys(stateData).forEach(function (abbr) {
      var st = stateData[abbr], hull = st.hull;
      if (!hull || !hull.length) return;
      var isAK = abbr === 'AK', isHI = abbr === 'HI';
      var projected = hull.map(function (pt) { return project(pt[0], pt[1], isAK, isHI); });

      ctx.beginPath();
      projected.forEach(function (p, i) { i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); });
      ctx.closePath();
      ctx.fillStyle = valueColor(values[abbr]);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(theme.bg, 0.6);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      var xs = projected.map(function (p) { return p[0]; }), ys = projected.map(function (p) { return p[1]; });
      stateRects[abbr] = { minX: Math.min.apply(null, xs), maxX: Math.max.apply(null, xs), minY: Math.min.apply(null, ys), maxY: Math.max.apply(null, ys), projected: projected };

      var centPt = project(st.centroid[0], st.centroid[1], isAK, isHI);
      ctx.fillStyle = theme.text;
      ctx.font = '9px ' + theme.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(abbr, centPt[0], centPt[1]);
    });

    function pip(px, py, poly) {
      var inside = false;
      for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
        if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top, found = false;
      Object.keys(stateRects).forEach(function (abbr) {
        if (found) return;
        var sr = stateRects[abbr];
        if (mx >= sr.minX && mx <= sr.maxX && my >= sr.minY && my <= sr.maxY && pip(mx, my, sr.projected)) {
          showTooltip(canvas, mx, my, '<b>' + stateData[abbr].name + '</b>' + (values[abbr] !== undefined ? '<br>Value: <b>' + values[abbr] + '</b>' : ''), theme);
          found = true;
        }
      });
      if (!found) hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: TIMELINE
  // =========================================================================

  function timelineChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var phases = data.phases || [];
    if (!phases.length) return;

    var cw = resolveWidth(container, opts.width, 400), ch = opts.height || Math.max(140, phases.length * 36 + 50);
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { top: 24, right: 16, bottom: 24, left: 110 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };

    var allStart = Infinity, allEnd = -Infinity;
    phases.forEach(function (p) {
      var s = typeof p.start === 'number' ? p.start : new Date(p.start).getTime();
      var e = typeof p.end === 'number' ? p.end : new Date(p.end).getTime();
      if (s < allStart) allStart = s;
      if (e > allEnd) allEnd = e;
    });

    var timeScale = linearScale([allStart, allEnd], [area.x, area.x + area.w]);
    var rowH = area.h / phases.length;
    var barH = Math.min(rowH * 0.6, 22);

    for (var i = 0; i <= 4; i++) {
      var x = area.x + (i / 4) * area.w;
      ctx.strokeStyle = theme.border; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x, area.y); ctx.lineTo(x, area.y + area.h); ctx.stroke();
    }

    phases.forEach(function (phase, i) {
      var s = typeof phase.start === 'number' ? phase.start : new Date(phase.start).getTime();
      var e = typeof phase.end === 'number' ? phase.end : new Date(phase.end).getTime();
      var x0 = timeScale(s), x1 = timeScale(e);
      var y = area.y + i * rowH + (rowH - barH) / 2;
      var color = phase.color || seriesColor(theme, i);

      ctx.fillStyle = color;
      roundedRect(ctx, x0, y, Math.max(x1 - x0, 4), barH, barH / 3);
      ctx.fill();

      ctx.fillStyle = theme.textDim;
      ctx.font = '12px ' + theme.font;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(phase.label || '', area.x - 10, y + barH / 2);

      if (phase.status === 'active') {
        ctx.beginPath();
        ctx.arc(x1 + 8, y + barH / 2, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = theme.positive;
        ctx.fill();
      }
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: SCATTER
  // =========================================================================

  function scatterChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var series = data.series || [];
    if (!series.length) return;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || 280;
    var pad = { top: 16, right: 16, bottom: 36, left: 48 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;

    var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    series.forEach(function (s) {
      s.points.forEach(function (p) {
        if (p[0] < xMin) xMin = p[0]; if (p[0] > xMax) xMax = p[0];
        if (p[1] < yMin) yMin = p[1]; if (p[1] > yMax) yMax = p[1];
      });
    });
    xMax = niceMax([xMax]); yMax = niceMax([yMax]);
    if (xMin > 0) xMin = 0; if (yMin > 0) yMin = 0;

    var xScale = linearScale([xMin, xMax], [area.x, area.x + area.w]);
    var yScale = linearScale([yMin, yMax], [area.y + area.h, area.y]);

    // Grid
    for (var i = 0; i <= 5; i++) {
      var fy = i / 5, y = area.y + area.h - fy * area.h;
      ctx.strokeStyle = theme.border; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(area.x, y); ctx.lineTo(area.x + area.w, y); ctx.stroke();
      ctx.fillStyle = theme.textMuted; ctx.font = '11px ' + theme.font;
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(formatNum(yMin + fy * (yMax - yMin)), area.x - 8, y);

      var fx = i / 5, x = area.x + fx * area.w;
      ctx.beginPath(); ctx.moveTo(x, area.y); ctx.lineTo(x, area.y + area.h); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(formatNum(xMin + fx * (xMax - xMin)), x, area.y + area.h + 6);
    }

    series.forEach(function (s, si) {
      var color = s.color || seriesColor(theme, si);
      s.points.forEach(function (p) {
        var px = xScale(p[0]), py = yScale(p[1]);
        var r = p[2] ? Math.sqrt(p[2]) * 1.5 + 3 : 5;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, 0.6);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    });

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top, found = false;
      series.forEach(function (s, si) {
        if (found) return;
        var color = s.color || seriesColor(theme, si);
        s.points.forEach(function (p) {
          if (found) return;
          var px = xScale(p[0]), py = yScale(p[1]);
          if (Math.abs(mx - px) < 10 && Math.abs(my - py) < 10) {
            showTooltip(canvas, mx, my, '<b>' + (s.name || '') + '</b><br>x: ' + p[0] + ', y: ' + p[1] + (p[2] ? ', size: ' + p[2] : ''), theme);
            found = true;
          }
        });
      });
      if (!found) hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: WATERFALL
  // =========================================================================

  function waterfallChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var items = data.items || [];
    if (!items.length) return;

    var cw = resolveWidth(container, opts.width, 400), ch = opts.height || 260;
    var pad = { top: 16, right: 16, bottom: 36, left: 48 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;

    // Compute running totals
    var cumulative = [0];
    var maxVal = 0, minVal = 0;
    items.forEach(function (item, i) {
      if (item.total) {
        cumulative.push(item.value);
      } else {
        cumulative.push(cumulative[i] + item.value);
      }
      if (cumulative[i + 1] > maxVal) maxVal = cumulative[i + 1];
      if (cumulative[i + 1] < minVal) minVal = cumulative[i + 1];
      if (cumulative[i] > maxVal) maxVal = cumulative[i];
    });
    maxVal = niceMax([maxVal * 1.1]);

    var labels = items.map(function (it) { return it.label; });
    var bs = bandScale(labels, [area.x, area.x + area.w], 0.3);
    var yScale = linearScale([minVal, maxVal], [area.y + area.h, area.y]);

    drawAxes(ctx, area, maxVal, labels, theme, { yMin: minVal });

    items.forEach(function (item, i) {
      var x0 = bs.scale(i), bw = bs.bandwidth();
      var base, top;
      if (item.total) {
        base = yScale(0); top = yScale(item.value);
      } else {
        base = yScale(cumulative[i]);
        top = yScale(cumulative[i + 1]);
      }
      var y = Math.min(base, top), h = Math.abs(base - top);
      var isPositive = item.total ? item.value >= 0 : item.value >= 0;
      ctx.fillStyle = item.total ? theme.primary : (isPositive ? theme.positive : theme.negative);
      roundedRect(ctx, x0, y, bw, Math.max(h, 2), theme.barRadius);
      ctx.fill();

      // Connector line
      if (i < items.length - 1 && !item.total) {
        ctx.strokeStyle = theme.textMuted;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x0 + bw, yScale(cumulative[i + 1]));
        ctx.lineTo(x0 + bw + (bs.step() - bw), yScale(cumulative[i + 1]));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Value label
      ctx.fillStyle = theme.textDim;
      ctx.font = '11px ' + theme.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = isPositive ? 'bottom' : 'top';
      ctx.fillText(formatNum(item.value), x0 + bw / 2, isPositive ? y - 4 : y + h + 4);
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: FUNNEL
  // =========================================================================

  function funnelChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var stages = data.stages || [];
    if (!stages.length) return;

    var cw = resolveWidth(container, opts.width, 320), ch = opts.height || 260;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = 24;
    var maxVal = stages[0].value;
    var rowH = (ch - pad * 2) / stages.length;
    var maxW = cw - pad * 2 - 80;

    stages.forEach(function (stage, i) {
      var frac = stage.value / maxVal;
      var w = maxW * frac;
      var x = (cw - w) / 2;
      var y = pad + i * rowH;
      var color = stage.color || seriesColor(theme, i);

      ctx.fillStyle = color;
      roundedRect(ctx, x, y + 2, w, rowH - 6, theme.barRadius);
      ctx.fill();

      // Label + value
      ctx.fillStyle = theme.text;
      ctx.font = '13px ' + theme.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stage.label, cw / 2, y + rowH / 2 - 8);

      ctx.fillStyle = theme.textDim;
      ctx.font = 'bold 12px ' + theme.font;
      ctx.fillText(formatNum(stage.value) + (i > 0 ? ' (' + Math.round(frac * 100) + '%)' : ''), cw / 2, y + rowH / 2 + 8);
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: RADIAL BAR
  // =========================================================================

  function radialBarChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var items = data.items || [];
    if (!items.length) return;

    var cw = resolveWidth(container, opts.width, 260), ch = opts.height || 260;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var cx = cw / 2, cy = ch / 2;
    var maxR = Math.min(cw, ch) / 2 - 20;
    var minR = maxR * 0.3;
    var maxVal = data.max || Math.max.apply(null, items.map(function (it) { return it.value; }));
    var barW = Math.max(6, ((maxR - minR) / items.length) * 0.7);
    var gap = ((maxR - minR) - barW * items.length) / items.length;

    items.forEach(function (item, i) {
      var r = maxR - i * (barW + gap) - barW / 2;
      var frac = Math.min(item.value / maxVal, 1);
      var color = item.color || seriesColor(theme, i);

      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(color, 0.1);
      ctx.lineWidth = barW;
      ctx.lineCap = 'butt';
      ctx.stroke();

      // Value
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = barW;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Label
      ctx.fillStyle = theme.textDim;
      ctx.font = '11px ' + theme.font;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label + ' ' + Math.round(frac * 100) + '%', cx - maxR - 4, cy - maxR + i * (barW + gap) + barW / 2);
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: BULLET
  // =========================================================================

  function bulletChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var items = data.items || [];
    if (!items.length) return;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || Math.max(120, items.length * 56 + 20);
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { left: 90, right: 16 };
    var barArea = cw - pad.left - pad.right;
    var rowH = (ch - 16) / items.length;

    items.forEach(function (item, i) {
      var y = 8 + i * rowH;
      var maxVal = item.max || 100;
      var actual = item.actual || 0;
      var target = item.target || 0;
      var barH = 22;
      var barY = y + (rowH - barH) / 2;

      // Label
      ctx.fillStyle = theme.textDim;
      ctx.font = '12px ' + theme.font;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label || '', pad.left - 12, barY + barH / 2);

      // Range background
      ctx.fillStyle = hexToRgba(theme.textMuted, 0.08);
      roundedRect(ctx, pad.left, barY, barArea, barH, 4);
      ctx.fill();

      // 75% range
      ctx.fillStyle = hexToRgba(theme.textMuted, 0.12);
      roundedRect(ctx, pad.left, barY, barArea * 0.75, barH, 4);
      ctx.fill();

      // 50% range
      ctx.fillStyle = hexToRgba(theme.textMuted, 0.16);
      roundedRect(ctx, pad.left, barY, barArea * 0.5, barH, 4);
      ctx.fill();

      // Actual bar
      var actualW = (actual / maxVal) * barArea;
      ctx.fillStyle = item.color || theme.primary;
      roundedRect(ctx, pad.left, barY + 5, actualW, barH - 10, 3);
      ctx.fill();

      // Target marker
      var targetX = pad.left + (target / maxVal) * barArea;
      ctx.strokeStyle = theme.text;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(targetX, barY + 1);
      ctx.lineTo(targetX, barY + barH - 1);
      ctx.stroke();
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: TREEMAP
  // =========================================================================

  function treemapChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var items = data.items || [];
    if (!items.length) return;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || 240;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;

    // Squarified treemap layout
    var total = items.reduce(function (s, it) { return s + it.value; }, 0);
    var sorted = items.slice().sort(function (a, b) { return b.value - a.value; });

    function layoutRow(items, x, y, w, h) {
      var rects = [];
      if (!items.length) return rects;
      var isHoriz = w >= h;
      var totalVal = items.reduce(function (s, it) { return s + it.value; }, 0);
      var offset = 0;
      items.forEach(function (item) {
        var frac = item.value / totalVal;
        if (isHoriz) {
          rects.push({ item: item, x: x + offset * w, y: y, w: frac * w, h: h });
        } else {
          rects.push({ item: item, x: x, y: y + offset * h, w: w, h: frac * h });
        }
        offset += frac;
      });
      return rects;
    }

    // Simple slice-and-dice for readability
    function layout(items, x, y, w, h) {
      if (items.length === 0) return [];
      if (items.length === 1) return [{ item: items[0], x: x, y: y, w: w, h: h }];

      var totalVal = items.reduce(function (s, it) { return s + it.value; }, 0);
      var half = totalVal / 2, running = 0, splitIdx = 0;
      for (var i = 0; i < items.length; i++) {
        running += items[i].value;
        if (running >= half) { splitIdx = i + 1; break; }
      }
      if (splitIdx === 0) splitIdx = 1;
      if (splitIdx >= items.length) splitIdx = items.length - 1;

      var leftVal = items.slice(0, splitIdx).reduce(function (s, it) { return s + it.value; }, 0);
      var frac = leftVal / totalVal;

      if (w >= h) {
        return layout(items.slice(0, splitIdx), x, y, w * frac, h)
          .concat(layout(items.slice(splitIdx), x + w * frac, y, w * (1 - frac), h));
      } else {
        return layout(items.slice(0, splitIdx), x, y, w, h * frac)
          .concat(layout(items.slice(splitIdx), x, y + h * frac, w, h * (1 - frac)));
      }
    }

    var rects = layout(sorted, 2, 2, cw - 4, ch - 4);

    rects.forEach(function (r, i) {
      var color = r.item.color || seriesColor(theme, i);
      var gapPx = 2;
      ctx.fillStyle = color;
      roundedRect(ctx, r.x + gapPx, r.y + gapPx, r.w - gapPx * 2, r.h - gapPx * 2, 6);
      ctx.fill();

      // Label
      if (r.w > 40 && r.h > 28) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px ' + theme.font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(r.item.label, r.x + gapPx + 8, r.y + gapPx + 8);

        if (r.h > 44) {
          ctx.font = '11px ' + theme.font;
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fillText(formatNum(r.item.value), r.x + gapPx + 8, r.y + gapPx + 24);
        }
      }
    });

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top, found = false;
      rects.forEach(function (r) {
        if (found) return;
        if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
          var pct = ((r.item.value / total) * 100).toFixed(1);
          showTooltip(canvas, mx, my, '<b>' + r.item.label + '</b><br>' + formatNum(r.item.value) + ' (' + pct + '%)', theme);
          found = true;
        }
      });
      if (!found) hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: PROGRESS BAR
  // =========================================================================

  function progressChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var items = data.items || [];
    if (!items.length) return;

    var cw = resolveWidth(container, opts.width, 320), ch = opts.height || Math.max(80, items.length * 44 + 16);
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var barH = 10, rowH = (ch - 8) / items.length;

    items.forEach(function (item, i) {
      var y = 4 + i * rowH;
      var frac = Math.min((item.value || 0) / (item.max || 100), 1);
      var color = item.color || seriesColor(theme, i);

      // Label + value
      ctx.fillStyle = theme.textDim;
      ctx.font = '12px ' + theme.font;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(item.label || '', 4, y + 16);

      ctx.textAlign = 'right';
      ctx.fillText(Math.round(frac * 100) + '%', cw - 4, y + 16);

      // Track
      var trackY = y + 22;
      ctx.fillStyle = hexToRgba(color, 0.1);
      roundedRect(ctx, 4, trackY, cw - 8, barH, barH / 2);
      ctx.fill();

      // Fill
      ctx.fillStyle = color;
      roundedRect(ctx, 4, trackY, Math.max((cw - 8) * frac, barH), barH, barH / 2);
      ctx.fill();
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: SANKEY DIAGRAM
  // =========================================================================

  function sankeyChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var nodes = data.nodes || [];
    var links = data.links || [];
    if (!nodes.length || !links.length) return;

    var cw = resolveWidth(container, opts.width, 480), ch = opts.height || 300;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;
    var pad = { top: 20, right: 20, bottom: 20, left: 20 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };

    // Assign columns to nodes
    var nodeMap = {};
    nodes.forEach(function (n, i) { nodeMap[n.id || n.name || i] = { idx: i, name: n.name || n.id || ('N' + i), col: n.col !== undefined ? n.col : -1, value: 0, inValue: 0, outValue: 0, y: 0, h: 0, color: n.color || seriesColor(theme, i) }; });

    // Auto-assign columns if not provided
    var maxCol = 0;
    nodes.forEach(function (n, i) { if (nodeMap[n.id || n.name || i].col >= 0) maxCol = Math.max(maxCol, nodeMap[n.id || n.name || i].col); });
    if (maxCol === 0) {
      // Topological sort for column assignment
      var visited = {}, colMap = {};
      function assignCol(id, col) {
        if (colMap[id] !== undefined) { colMap[id] = Math.max(colMap[id], col); return; }
        colMap[id] = col;
        links.forEach(function (l) { if ((l.source === id || l.from === id)) assignCol(l.target || l.to, col + 1); });
      }
      // Find source nodes (no incoming links)
      var hasIncoming = {};
      links.forEach(function (l) { hasIncoming[l.target || l.to] = true; });
      nodes.forEach(function (n, i) {
        var id = n.id || n.name || i;
        if (!hasIncoming[id]) assignCol(id, 0);
      });
      Object.keys(colMap).forEach(function (id) { nodeMap[id].col = colMap[id]; maxCol = Math.max(maxCol, colMap[id]); });
    }

    // Compute node values
    links.forEach(function (l) {
      var sid = l.source || l.from, tid = l.target || l.to;
      if (nodeMap[sid]) nodeMap[sid].outValue += l.value;
      if (nodeMap[tid]) nodeMap[tid].inValue += l.value;
    });
    Object.keys(nodeMap).forEach(function (id) { nodeMap[id].value = Math.max(nodeMap[id].inValue, nodeMap[id].outValue); });

    // Layout nodes per column
    var cols = [];
    for (var c = 0; c <= maxCol; c++) cols.push([]);
    Object.keys(nodeMap).forEach(function (id) { cols[nodeMap[id].col].push(id); });

    var totalMax = 0;
    cols.forEach(function (col) {
      var sum = 0;
      col.forEach(function (id) { sum += nodeMap[id].value; });
      if (sum > totalMax) totalMax = sum;
    });
    if (!totalMax) totalMax = 1;

    var nodeW = Math.max(8, Math.min(24, area.w / (maxCol + 1) * 0.15));
    var nodePad = 8;

    cols.forEach(function (col, ci) {
      var x = area.x + (ci / Math.max(1, maxCol)) * (area.w - nodeW);
      var colTotal = 0;
      col.forEach(function (id) { colTotal += nodeMap[id].value; });
      var usableH = area.h - (col.length - 1) * nodePad;
      var yOff = area.y;
      col.forEach(function (id) {
        var frac = nodeMap[id].value / totalMax;
        var h = Math.max(4, frac * usableH);
        nodeMap[id].x = x;
        nodeMap[id].y = yOff;
        nodeMap[id].h = h;
        nodeMap[id].w = nodeW;
        yOff += h + nodePad;
      });
    });

    // Draw links as bezier curves
    // Track port offsets per node for stacking
    var srcOff = {}, tgtOff = {};
    Object.keys(nodeMap).forEach(function (id) { srcOff[id] = 0; tgtOff[id] = 0; });

    links.forEach(function (l, li) {
      var sid = l.source || l.from, tid = l.target || l.to;
      var sn = nodeMap[sid], tn = nodeMap[tid];
      if (!sn || !tn) return;
      var frac = l.value / totalMax;
      var lh = Math.max(2, frac * (area.h - (cols[sn.col].length - 1) * nodePad));

      var x0 = sn.x + sn.w, y0 = sn.y + srcOff[sid];
      var x1 = tn.x, y1 = tn.y + tgtOff[tid];
      var cpx = (x0 + x1) / 2;

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(cpx, y0, cpx, y1, x1, y1);
      ctx.lineTo(x1, y1 + lh);
      ctx.bezierCurveTo(cpx, y1 + lh, cpx, y0 + lh, x0, y0 + lh);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(l.color || sn.color, 0.25);
      ctx.fill();

      srcOff[sid] += lh;
      tgtOff[tid] += lh;
    });

    // Draw nodes
    Object.keys(nodeMap).forEach(function (id) {
      var n = nodeMap[id];
      ctx.fillStyle = n.color;
      roundedRect(ctx, n.x, n.y, n.w, n.h, 3);
      ctx.fill();

      // Label
      ctx.fillStyle = theme.text;
      ctx.font = '11px ' + theme.font;
      var labelX, align;
      if (n.col === 0) { labelX = n.x + n.w + 6; align = 'left'; }
      else if (n.col === maxCol) { labelX = n.x - 6; align = 'right'; }
      else { labelX = n.x + n.w + 6; align = 'left'; }
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';
      ctx.fillText(n.name, labelX, n.y + n.h / 2);
    });

    // Tooltip
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top, found = false;
      Object.keys(nodeMap).forEach(function (id) {
        if (found) return;
        var n = nodeMap[id];
        if (mx >= n.x && mx <= n.x + n.w && my >= n.y && my <= n.y + n.h) {
          showTooltip(canvas, mx, my, '<b>' + n.name + '</b><br>Value: <b>' + formatNum(n.value) + '</b>', theme);
          found = true;
        }
      });
      if (!found) hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: LOLLIPOP
  // =========================================================================

  function lollipopChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var labels = data.labels || [], values = data.values || [];
    if (!values.length) return;

    var horiz = opts.horizontal !== false;
    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || (horiz ? Math.max(160, values.length * 36 + 40) : 260);
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;

    if (horiz) {
      var pad = { top: 12, right: 24, bottom: 12, left: 80 };
      var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
      var maxVal = niceMax(values);
      var rowH = area.h / values.length;

      // Grid
      for (var i = 0; i <= 4; i++) {
        var xv = area.x + (i / 4) * area.w;
        ctx.strokeStyle = theme.border; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(xv, area.y); ctx.lineTo(xv, area.y + area.h); ctx.stroke();
        ctx.fillStyle = theme.textMuted; ctx.font = '10px ' + theme.font;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(formatNum((i / 4) * maxVal), xv, area.y + area.h + 4);
      }

      values.forEach(function (val, i) {
        var cy = area.y + i * rowH + rowH / 2;
        var endX = area.x + (val / maxVal) * area.w;
        var color = data.colors ? data.colors[i] : seriesColor(theme, i);

        // Stem
        ctx.strokeStyle = hexToRgba(color, 0.5);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(area.x, cy); ctx.lineTo(endX, cy); ctx.stroke();

        // Dot
        ctx.beginPath(); ctx.arc(endX, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();

        // Value on dot
        ctx.fillStyle = '#fff'; ctx.font = 'bold 8px ' + theme.font;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (val >= 100) { /* skip small text */ }

        // Label
        ctx.fillStyle = theme.textDim; ctx.font = '12px ' + theme.font;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(labels[i] || '', area.x - 8, cy);
      });
    } else {
      var pad = { top: 16, right: 16, bottom: 36, left: 48 };
      var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
      var maxVal = niceMax(values);
      var step = area.w / values.length;

      drawAxes(ctx, area, maxVal, labels, theme);

      values.forEach(function (val, i) {
        var cx = area.x + i * step + step / 2;
        var endY = area.y + area.h - (val / maxVal) * area.h;
        var color = data.colors ? data.colors[i] : seriesColor(theme, i);

        ctx.strokeStyle = hexToRgba(color, 0.5);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, area.y + area.h); ctx.lineTo(cx, endY); ctx.stroke();

        ctx.beginPath(); ctx.arc(cx, endY, 6, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      });
    }
    return ref.canvas;
  }

  // =========================================================================
  // CHART: DUMBBELL
  // =========================================================================

  function dumbbellChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var items = data.items || [];
    if (!items.length) return;

    var cw = resolveWidth(container, opts.width, 400), ch = opts.height || Math.max(140, items.length * 40 + 40);
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { top: 12, right: 24, bottom: 28, left: 90 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };

    var allVals = [];
    items.forEach(function (it) { allVals.push(it.start, it.end); });
    var minVal = Math.min.apply(null, allVals);
    var maxVal = niceMax(allVals);
    if (minVal > 0) minVal = 0;
    var xScale = linearScale([minVal, maxVal], [area.x, area.x + area.w]);
    var rowH = area.h / items.length;

    // Grid
    for (var i = 0; i <= 5; i++) {
      var xv = area.x + (i / 5) * area.w;
      ctx.strokeStyle = theme.border; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(xv, area.y); ctx.lineTo(xv, area.y + area.h); ctx.stroke();
      ctx.fillStyle = theme.textMuted; ctx.font = '10px ' + theme.font;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(formatNum(minVal + (i / 5) * (maxVal - minVal)), xv, area.y + area.h + 6);
    }

    var colorA = data.colorA || theme.categorical[0];
    var colorB = data.colorB || theme.categorical[1];

    items.forEach(function (item, i) {
      var cy = area.y + i * rowH + rowH / 2;
      var x1 = xScale(item.start), x2 = xScale(item.end);

      // Connector bar
      ctx.strokeStyle = hexToRgba(theme.textMuted, 0.3);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x2, cy); ctx.stroke();

      // Start dot
      ctx.beginPath(); ctx.arc(x1, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = colorA; ctx.fill();

      // End dot
      ctx.beginPath(); ctx.arc(x2, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = colorB; ctx.fill();

      // Label
      ctx.fillStyle = theme.textDim; ctx.font = '12px ' + theme.font;
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(item.label || '', area.x - 10, cy);
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: SLOPE
  // =========================================================================

  function slopeChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var items = data.items || [];
    var labelLeft = data.labelLeft || 'Before';
    var labelRight = data.labelRight || 'After';
    if (!items.length) return;

    var cw = resolveWidth(container, opts.width, 320), ch = opts.height || 280;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { top: 32, right: 60, bottom: 24, left: 60 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };

    var allVals = [];
    items.forEach(function (it) { allVals.push(it.start, it.end); });
    var minVal = Math.min.apply(null, allVals) * 0.9;
    var maxVal = Math.max.apply(null, allVals) * 1.1;
    var yScale = linearScale([minVal, maxVal], [area.y + area.h, area.y]);

    // Column headers
    ctx.fillStyle = theme.textMuted; ctx.font = '600 12px ' + theme.font;
    ctx.textAlign = 'center';
    ctx.fillText(labelLeft, area.x, area.y - 14);
    ctx.fillText(labelRight, area.x + area.w, area.y - 14);

    // Vertical axes
    ctx.strokeStyle = theme.border; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(area.x, area.y); ctx.lineTo(area.x, area.y + area.h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(area.x + area.w, area.y); ctx.lineTo(area.x + area.w, area.y + area.h); ctx.stroke();

    items.forEach(function (item, i) {
      var color = item.color || seriesColor(theme, i);
      var y1 = yScale(item.start), y2 = yScale(item.end);

      // Line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(area.x, y1); ctx.lineTo(area.x + area.w, y2); ctx.stroke();

      // Dots
      ctx.beginPath(); ctx.arc(area.x, y1, 5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      ctx.beginPath(); ctx.arc(area.x + area.w, y2, 5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();

      // Labels
      ctx.fillStyle = theme.textDim; ctx.font = '11px ' + theme.font;
      ctx.textAlign = 'right';
      ctx.fillText(item.label + ' ' + item.start, area.x - 10, y1);
      ctx.textAlign = 'left';
      ctx.fillText(item.end + ' ' + item.label, area.x + area.w + 10, y2);
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: BOX PLOT
  // =========================================================================

  function boxPlotChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var groups = data.groups || [];
    if (!groups.length) return;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || 260;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { top: 16, right: 16, bottom: 36, left: 48 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };

    var allMin = Infinity, allMax = -Infinity;
    groups.forEach(function (g) {
      if (g.min < allMin) allMin = g.min;
      if (g.max > allMax) allMax = g.max;
      if (g.outliers) g.outliers.forEach(function (o) { if (o < allMin) allMin = o; if (o > allMax) allMax = o; });
    });
    allMax = niceMax([allMax * 1.05]);
    if (allMin > 0) allMin = 0;

    var labels = groups.map(function (g) { return g.label; });
    var bs = bandScale(labels, [area.x, area.x + area.w], 0.35);
    var yScale = linearScale([allMin, allMax], [area.y + area.h, area.y]);

    drawAxes(ctx, area, allMax, labels, theme, { yMin: allMin });

    groups.forEach(function (g, i) {
      var color = g.color || seriesColor(theme, i);
      var cx = bs.scale(i) + bs.bandwidth() / 2;
      var bw = bs.bandwidth() * 0.6;

      // Whiskers
      ctx.strokeStyle = theme.textDim; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, yScale(g.min)); ctx.lineTo(cx, yScale(g.q1)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, yScale(g.q3)); ctx.lineTo(cx, yScale(g.max)); ctx.stroke();

      // Whisker caps
      ctx.beginPath(); ctx.moveTo(cx - bw / 4, yScale(g.min)); ctx.lineTo(cx + bw / 4, yScale(g.min)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - bw / 4, yScale(g.max)); ctx.lineTo(cx + bw / 4, yScale(g.max)); ctx.stroke();

      // IQR box
      var boxTop = yScale(g.q3), boxBot = yScale(g.q1);
      ctx.fillStyle = hexToRgba(color, 0.2);
      roundedRect(ctx, cx - bw / 2, boxTop, bw, boxBot - boxTop, 4);
      ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      roundedRect(ctx, cx - bw / 2, boxTop, bw, boxBot - boxTop, 4);
      ctx.stroke();

      // Median
      ctx.strokeStyle = color; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx - bw / 2, yScale(g.median)); ctx.lineTo(cx + bw / 2, yScale(g.median)); ctx.stroke();

      // Outliers
      if (g.outliers) {
        g.outliers.forEach(function (o) {
          ctx.beginPath(); ctx.arc(cx, yScale(o), 3, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, 0.5); ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke();
        });
      }
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: CANDLESTICK (OHLC)
  // =========================================================================

  function candlestickChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var candles = data.candles || [];
    if (!candles.length) return;

    var cw = resolveWidth(container, opts.width, 420), ch = opts.height || 260;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;
    var pad = { top: 16, right: 16, bottom: 36, left: 56 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };

    var allMin = Infinity, allMax = -Infinity;
    candles.forEach(function (c) {
      if (c.low < allMin) allMin = c.low;
      if (c.high > allMax) allMax = c.high;
    });
    var range = allMax - allMin;
    allMin -= range * 0.05;
    allMax += range * 0.05;

    var labels = candles.map(function (c) { return c.label || ''; });
    var yScale = linearScale([allMin, allMax], [area.y + area.h, area.y]);
    var step = area.w / candles.length;
    var candleW = Math.max(4, step * 0.6);

    drawAxes(ctx, area, allMax, labels, theme, { yMin: allMin, yFormat: function (v) { return v.toFixed(0); } });

    candles.forEach(function (c, i) {
      var cx = area.x + i * step + step / 2;
      var bullish = c.close >= c.open;
      var color = bullish ? theme.positive : theme.negative;
      var bodyTop = yScale(Math.max(c.open, c.close));
      var bodyBot = yScale(Math.min(c.open, c.close));
      var bodyH = Math.max(bodyBot - bodyTop, 1);

      // Wick
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, yScale(c.high)); ctx.lineTo(cx, yScale(c.low)); ctx.stroke();

      // Body
      if (bullish) {
        ctx.fillStyle = hexToRgba(color, 0.15);
        roundedRect(ctx, cx - candleW / 2, bodyTop, candleW, bodyH, 2);
        ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = 1.5;
        roundedRect(ctx, cx - candleW / 2, bodyTop, candleW, bodyH, 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = color;
        roundedRect(ctx, cx - candleW / 2, bodyTop, candleW, bodyH, 2);
        ctx.fill();
      }
    });

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var idx = Math.floor((mx - area.x) / step);
      if (idx >= 0 && idx < candles.length) {
        var c = candles[idx];
        showTooltip(canvas, mx, e.clientY - rect.top,
          '<b>' + (c.label || 'Day ' + (idx + 1)) + '</b><br>' +
          'O: ' + c.open + ' H: ' + c.high + '<br>L: ' + c.low + ' C: ' + c.close, theme);
      } else hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: STREAM GRAPH
  // =========================================================================

  function streamChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var labels = data.labels || [], series = data.series || [];
    if (!series.length) return;

    var cw = resolveWidth(container, opts.width, 420), ch = opts.height || 240;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { top: 8, right: 8, bottom: 28, left: 8 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var n = labels.length;

    // Stack and center (wiggle baseline)
    var totals = [];
    for (var i = 0; i < n; i++) {
      var sum = 0;
      series.forEach(function (s) { sum += (s.values[i] || 0); });
      totals.push(sum);
    }
    var maxTotal = Math.max.apply(null, totals) || 1;

    // Compute baseline offsets to center the stream
    var baselines = [];
    for (var i = 0; i < n; i++) baselines.push(-totals[i] / 2);

    var xStep = area.w / Math.max(1, n - 1);

    // Build layers
    for (var si = 0; si < series.length; si++) {
      var color = series[si].color || seriesColor(theme, si);
      var topPts = [], botPts = [];

      for (var i = 0; i < n; i++) {
        var base = baselines[i];
        var val = series[si].values[i] || 0;
        var normBase = (base / maxTotal) * area.h;
        var normVal = (val / maxTotal) * area.h;
        var midY = area.y + area.h / 2;

        botPts.push([area.x + i * xStep, midY - normBase]);
        topPts.push([area.x + i * xStep, midY - normBase - normVal]);

        baselines[i] += val;
      }

      var sTop = topPts.length > 2 ? catmullRomSpline(topPts) : topPts;
      var sBot = botPts.length > 2 ? catmullRomSpline(botPts) : botPts;

      ctx.beginPath();
      sTop.forEach(function (p, i) { i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); });
      for (var i = sBot.length - 1; i >= 0; i--) ctx.lineTo(sBot[i][0], sBot[i][1]);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(color, 0.7);
      ctx.fill();
    }

    // X labels
    ctx.fillStyle = theme.textMuted; ctx.font = '11px ' + theme.font;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    var skip = n > 12 ? Math.ceil(n / 10) : 1;
    for (var i = 0; i < n; i++) {
      if (i % skip === 0) ctx.fillText(labels[i], area.x + i * xStep, area.y + area.h + 6);
    }
    return ref.canvas;
  }

  // =========================================================================
  // CHART: BUMP (RANKING)
  // =========================================================================

  function bumpChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var labels = data.labels || [], series = data.series || [];
    if (!series.length || !labels.length) return;

    var cw = resolveWidth(container, opts.width, 420), ch = opts.height || 260;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { top: 20, right: 80, bottom: 28, left: 80 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var n = labels.length;
    var numRanks = series.length;

    var xStep = area.w / Math.max(1, n - 1);
    var yStep = area.h / Math.max(1, numRanks - 1);

    // X labels
    ctx.fillStyle = theme.textMuted; ctx.font = '11px ' + theme.font;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (var i = 0; i < n; i++) ctx.fillText(labels[i], area.x + i * xStep, area.y + area.h + 8);

    series.forEach(function (s, si) {
      var color = s.color || seriesColor(theme, si);
      var pts = s.ranks.map(function (rank, i) {
        return [area.x + i * xStep, area.y + (rank - 1) * yStep];
      });

      // Smooth line
      var smooth = pts.length > 2 ? catmullRomSpline(pts) : pts;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath();
      smooth.forEach(function (p, i) { i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); });
      ctx.stroke();

      // Dots
      pts.forEach(function (p) {
        ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = theme.card; ctx.lineWidth = 2; ctx.stroke();
      });

      // Labels
      var firstPt = pts[0], lastPt = pts[pts.length - 1];
      ctx.fillStyle = color; ctx.font = '600 11px ' + theme.font;
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(s.name, firstPt[0] - 12, firstPt[1]);
      ctx.textAlign = 'left';
      ctx.fillText(s.name, lastPt[0] + 12, lastPt[1]);
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: PARALLEL COORDINATES
  // =========================================================================

  function parallelChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var axes = data.axes || [], items = data.items || [];
    if (!axes.length || !items.length) return;

    var cw = resolveWidth(container, opts.width, 440), ch = opts.height || 260;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { top: 28, right: 24, bottom: 28, left: 24 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var nAxes = axes.length;
    var axisStep = area.w / Math.max(1, nAxes - 1);

    // Compute min/max per axis
    var ranges = axes.map(function (ax, ai) {
      var vals = items.map(function (it) { return it.values[ai]; });
      return { min: Math.min.apply(null, vals), max: Math.max.apply(null, vals) };
    });

    // Draw axes
    axes.forEach(function (ax, ai) {
      var x = area.x + ai * axisStep;
      ctx.strokeStyle = theme.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, area.y); ctx.lineTo(x, area.y + area.h); ctx.stroke();

      // Label
      ctx.fillStyle = theme.textDim; ctx.font = '600 11px ' + theme.font;
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(typeof ax === 'string' ? ax : ax.label, x, area.y - 6);

      // Min/max
      ctx.font = '10px ' + theme.font; ctx.fillStyle = theme.textMuted;
      ctx.textBaseline = 'top';
      ctx.fillText(formatNum(ranges[ai].max), x, area.y - 2);
      ctx.textBaseline = 'bottom';
      // skip to avoid overlap
    });

    // Draw lines for each item
    items.forEach(function (item, ii) {
      var color = item.color || seriesColor(theme, ii);
      ctx.strokeStyle = hexToRgba(color, 0.5);
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      item.values.forEach(function (val, ai) {
        var x = area.x + ai * axisStep;
        var r = ranges[ai];
        var norm = r.max > r.min ? (val - r.min) / (r.max - r.min) : 0.5;
        var y = area.y + area.h - norm * area.h;
        ai === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dots on axes
      item.values.forEach(function (val, ai) {
        var x = area.x + ai * axisStep;
        var r = ranges[ai];
        var norm = r.max > r.min ? (val - r.min) / (r.max - r.min) : 0.5;
        var y = area.y + area.h - norm * area.h;
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      });
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: NETWORK (FORCE-DIRECTED)
  // =========================================================================

  function networkChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var nodes = data.nodes || [], edges = data.edges || [];
    if (!nodes.length) return;

    var cw = resolveWidth(container, opts.width, 380), ch = opts.height || 300;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;
    var cx = cw / 2, cy = ch / 2;

    // Initialize positions in a circle (seeded PRNG for deterministic layout)
    var _ns = opts.seed || 12345;
    function _nrand() { _ns = (_ns * 16807) % 2147483647; return (_ns - 1) / 2147483646; }
    var positions = nodes.map(function (n, i) {
      var angle = (i / nodes.length) * Math.PI * 2;
      var r = Math.min(cw, ch) * 0.3;
      return { x: cx + Math.cos(angle) * r + (_nrand() - 0.5) * 20, y: cy + Math.sin(angle) * r + (_nrand() - 0.5) * 20, vx: 0, vy: 0 };
    });

    // Node index map
    var nodeIdx = {};
    nodes.forEach(function (n, i) { nodeIdx[n.id || n.name || i] = i; });

    // Simple force simulation (run synchronously for N iterations)
    var iterations = opts.iterations || 80;
    for (var iter = 0; iter < iterations; iter++) {
      var temp = 1 - iter / iterations;
      // Repulsion (all pairs)
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = positions[j].x - positions[i].x;
          var dy = positions[j].y - positions[i].y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var force = 800 / (dist * dist);
          var fx = (dx / dist) * force * temp;
          var fy = (dy / dist) * force * temp;
          positions[i].x -= fx; positions[i].y -= fy;
          positions[j].x += fx; positions[j].y += fy;
        }
      }
      // Attraction (edges)
      edges.forEach(function (e) {
        var si = nodeIdx[e.source || e.from], ti = nodeIdx[e.target || e.to];
        if (si === undefined || ti === undefined) return;
        var dx = positions[ti].x - positions[si].x;
        var dy = positions[ti].y - positions[si].y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = (dist - 60) * 0.05 * temp;
        var fx = (dx / dist) * force;
        var fy = (dy / dist) * force;
        positions[si].x += fx; positions[si].y += fy;
        positions[ti].x -= fx; positions[ti].y -= fy;
      });
      // Center gravity
      positions.forEach(function (p) {
        p.x += (cx - p.x) * 0.01;
        p.y += (cy - p.y) * 0.01;
      });
    }

    // Clamp to bounds
    var margin = 30;
    positions.forEach(function (p) {
      p.x = Math.max(margin, Math.min(cw - margin, p.x));
      p.y = Math.max(margin, Math.min(ch - margin, p.y));
    });

    // Draw edges
    edges.forEach(function (e) {
      var si = nodeIdx[e.source || e.from], ti = nodeIdx[e.target || e.to];
      if (si === undefined || ti === undefined) return;
      ctx.strokeStyle = hexToRgba(theme.textMuted, 0.3);
      ctx.lineWidth = e.weight ? Math.min(e.weight, 4) : 1.5;
      ctx.beginPath();
      ctx.moveTo(positions[si].x, positions[si].y);
      ctx.lineTo(positions[ti].x, positions[ti].y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(function (n, i) {
      var r = n.size || (n.value ? Math.sqrt(n.value) * 2 + 4 : 8);
      var color = n.color || seriesColor(theme, n.group || i);
      ctx.beginPath();
      ctx.arc(positions[i].x, positions[i].y, r, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, 0.8);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      if (n.name || n.label) {
        ctx.fillStyle = theme.text;
        ctx.font = '10px ' + theme.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(n.name || n.label, positions[i].x, positions[i].y - r - 3);
      }
    });

    // Tooltip
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top, found = false;
      nodes.forEach(function (n, i) {
        if (found) return;
        var r = n.size || 8;
        var dx = mx - positions[i].x, dy = my - positions[i].y;
        if (dx * dx + dy * dy < (r + 4) * (r + 4)) {
          showTooltip(canvas, mx, my, '<b>' + (n.name || n.label || 'Node ' + i) + '</b>' + (n.value ? '<br>Value: ' + n.value : ''), theme);
          found = true;
        }
      });
      if (!found) hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: VIOLIN PLOT
  // =========================================================================

  function violinChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var groups = data.groups || [];
    if (!groups.length) return;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || 260;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx;
    var pad = { top: 16, right: 16, bottom: 36, left: 48 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };

    var allMin = Infinity, allMax = -Infinity;
    groups.forEach(function (g) {
      g.values.forEach(function (v) { if (v < allMin) allMin = v; if (v > allMax) allMax = v; });
    });
    var range = allMax - allMin || 1;
    allMin -= range * 0.1; allMax += range * 0.1;

    var labels = groups.map(function (g) { return g.label; });
    var bs = bandScale(labels, [area.x, area.x + area.w], 0.2);
    var yScale = linearScale([allMin, allMax], [area.y + area.h, area.y]);

    drawAxes(ctx, area, allMax, labels, theme, { yMin: allMin });

    // KDE (Gaussian kernel density estimation)
    function kde(values, min, max, steps) {
      var h = 1.06 * standardDeviation(values) * Math.pow(values.length, -0.2); // Silverman
      if (h === 0) h = 1;
      var density = [];
      var stepSize = (max - min) / steps;
      for (var i = 0; i <= steps; i++) {
        var x = min + i * stepSize;
        var sum = 0;
        values.forEach(function (v) {
          var u = (x - v) / h;
          sum += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
        });
        density.push({ x: x, y: sum / (values.length * h) });
      }
      return density;
    }

    function standardDeviation(arr) {
      var n = arr.length;
      if (n < 2) return 1;
      var mean = arr.reduce(function (s, v) { return s + v; }, 0) / n;
      var variance = arr.reduce(function (s, v) { return s + (v - mean) * (v - mean); }, 0) / (n - 1);
      return Math.sqrt(variance);
    }

    groups.forEach(function (g, gi) {
      var color = g.color || seriesColor(theme, gi);
      var cx = bs.scale(gi) + bs.bandwidth() / 2;
      var maxW = bs.bandwidth() / 2;

      var density = kde(g.values, allMin, allMax, 40);
      var maxDensity = Math.max.apply(null, density.map(function (d) { return d.y; })) || 1;

      // Right half
      ctx.beginPath();
      density.forEach(function (d, i) {
        var y = yScale(d.x);
        var w = (d.y / maxDensity) * maxW;
        i === 0 ? ctx.moveTo(cx, y) : ctx.lineTo(cx + w, y);
      });
      ctx.lineTo(cx, yScale(density[density.length - 1].x));

      // Left half (mirror)
      for (var i = density.length - 1; i >= 0; i--) {
        var y = yScale(density[i].x);
        var w = (density[i].y / maxDensity) * maxW;
        ctx.lineTo(cx - w, y);
      }
      ctx.closePath();
      ctx.fillStyle = hexToRgba(color, 0.25);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Median line
      var sorted = g.values.slice().sort(function (a, b) { return a - b; });
      var median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, yScale(median), 4, 0, Math.PI * 2);
      ctx.fill();
    });
    return ref.canvas;
  }

  // =========================================================================
  // CHART: MARIMEKKO (VARIABLE-WIDTH STACKED BAR)
  // =========================================================================

  function marimekkoChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var columns = data.columns || [];
    if (!columns.length) return;

    var cw = resolveWidth(container, opts.width, 420), ch = opts.height || 260;
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;
    var pad = { top: 16, right: 16, bottom: 36, left: 16 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };

    var totalWidth = columns.reduce(function (s, c) { return s + c.width; }, 0);
    var gap = 3;
    var usableW = area.w - (columns.length - 1) * gap;

    var xOff = area.x;
    var colRects = [];

    columns.forEach(function (col, ci) {
      var colW = (col.width / totalWidth) * usableW;
      var segTotal = col.segments.reduce(function (s, seg) { return s + seg.value; }, 0);
      var yOff = area.y;

      col.segments.forEach(function (seg, si) {
        var segH = (seg.value / segTotal) * area.h;
        var color = seg.color || seriesColor(theme, si);

        ctx.fillStyle = color;
        roundedRect(ctx, xOff, yOff, colW, segH - 1, 2);
        ctx.fill();

        // Label in segment if big enough
        if (colW > 40 && segH > 20) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px ' + theme.font;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(seg.label, xOff + colW / 2, yOff + segH / 2);
        }

        colRects.push({ x: xOff, y: yOff, w: colW, h: segH, label: seg.label, value: seg.value, colLabel: col.label });
        yOff += segH;
      });

      // Column label
      ctx.fillStyle = theme.textDim;
      ctx.font = '11px ' + theme.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(col.label, xOff + colW / 2, area.y + area.h + 6);

      // Width percentage
      ctx.fillStyle = theme.textMuted;
      ctx.font = '10px ' + theme.font;
      ctx.fillText(Math.round((col.width / totalWidth) * 100) + '%', xOff + colW / 2, area.y + area.h + 20);

      xOff += colW + gap;
    });

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top, found = false;
      colRects.forEach(function (r) {
        if (found) return;
        if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
          showTooltip(canvas, mx, my, '<b>' + r.colLabel + '</b><br>' + r.label + ': <b>' + formatNum(r.value) + '</b>', theme);
          found = true;
        }
      });
      if (!found) hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: HISTOGRAM
  // =========================================================================

  function histogramChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var values = data.values || [];
    if (!values.length) return;

    var numBins = opts.bins || 14;
    var min = data.min !== undefined ? data.min : Math.min.apply(null, values);
    var max = data.max !== undefined ? data.max : Math.max.apply(null, values);
    var bw = (max - min) / numBins || 1;

    var bins = [];
    for (var i = 0; i < numBins; i++) bins.push(0);
    values.forEach(function (v) {
      var idx = Math.min(Math.floor((v - min) / bw), numBins - 1);
      if (idx < 0) idx = 0;
      bins[idx]++;
    });
    var maxCount = Math.max.apply(null, bins);
    if (!maxCount) maxCount = 1;

    var cw = resolveWidth(container, opts.width, 360), ch = opts.height || 220;
    var pad = { top: 16, right: 16, bottom: 36, left: 48 };
    var area = { x: pad.left, y: pad.top, w: cw - pad.left - pad.right, h: ch - pad.top - pad.bottom };
    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;
    var barW = area.w / numBins;
    var color = opts.color || theme.primary;

    // Y grid
    for (var i = 0; i <= 4; i++) {
      var frac = i / 4, y = area.y + area.h - frac * area.h;
      ctx.strokeStyle = theme.border; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(area.x, y); ctx.lineTo(area.x + area.w, y); ctx.stroke();
      ctx.fillStyle = theme.textMuted; ctx.font = '11px ' + theme.font;
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(frac * maxCount).toString(), area.x - 8, y);
    }

    // X labels
    ctx.fillStyle = theme.textMuted; ctx.font = '10px ' + theme.font;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    var xSkip = numBins > 14 ? Math.ceil(numBins / 10) : (numBins > 8 ? 2 : 1);
    for (var i = 0; i <= numBins; i += xSkip) {
      var xv = min + i * bw;
      ctx.fillText(xv.toFixed(0), area.x + i * barW, area.y + area.h + 6);
    }

    // Bars
    for (var i = 0; i < numBins; i++) {
      var barH = (bins[i] / maxCount) * area.h;
      ctx.fillStyle = hexToRgba(color, 0.65);
      roundedRect(ctx, area.x + i * barW + 1, area.y + area.h - barH, barW - 2, barH, 2);
      ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 1;
      roundedRect(ctx, area.x + i * barW + 1, area.y + area.h - barH, barW - 2, barH, 2);
      ctx.stroke();
    }

    // Optional: overlay a KDE curve
    if (opts.showCurve !== false && values.length > 10) {
      var h = 1.06 * (utils.stdev(values) || 1) * Math.pow(values.length, -0.2);
      ctx.beginPath();
      var kdeMax = 0;
      var kdePoints = [];
      for (var px = 0; px < area.w; px += 2) {
        var xv = min + (px / area.w) * (max - min);
        var sum = 0;
        values.forEach(function (v) { var u = (xv - v) / h; sum += Math.exp(-0.5 * u * u); });
        var density = sum / (values.length * h * Math.sqrt(2 * Math.PI));
        kdePoints.push({ px: area.x + px, density: density });
        if (density > kdeMax) kdeMax = density;
      }
      // Scale KDE to match histogram height
      var scaleFactor = (maxCount / (kdeMax * bw * values.length)) || 1;
      kdePoints.forEach(function (p, i) {
        var y = area.y + area.h - (p.density * bw * values.length / maxCount) * area.h;
        i === 0 ? ctx.moveTo(p.px, y) : ctx.lineTo(p.px, y);
      });
      ctx.strokeStyle = theme.accent || color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Tooltip
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var idx = Math.floor((mx - area.x) / barW);
      if (idx >= 0 && idx < numBins) {
        var lo = (min + idx * bw).toFixed(1), hi = (min + (idx + 1) * bw).toFixed(1);
        showTooltip(canvas, mx, e.clientY - rect.top, '<b>' + lo + ' – ' + hi + '</b><br>Count: <b>' + bins[idx] + '</b> (' + ((bins[idx] / values.length) * 100).toFixed(1) + '%)', theme);
      } else hideTooltip();
    });
    canvas.addEventListener('mouseleave', hideTooltip);
    return canvas;
  }

  // =========================================================================
  // CHART: HORIZON
  // =========================================================================

  function horizonChart(container, data, opts) {
    opts = opts || {};
    var theme = getTheme(opts.theme);
    var series = data.series || [];
    if (!series.length) return;

    var numBands = data.bands || opts.bands || 4;
    var step = data.step || opts.step || 28;
    var labels = data.labels || [];

    // Compute label column width from longest series name
    var labelW = 0;
    if (!opts.hideLabels) {
      var mc = document.createElement('canvas').getContext('2d');
      mc.font = '500 11px ' + theme.font;
      series.forEach(function (s) {
        if (s.name) { var w = mc.measureText(s.name).width; if (w > labelW) labelW = w; }
      });
      labelW = Math.ceil(labelW) + 20;
    }

    var cw = resolveWidth(container, opts.width, 600);
    var xAxisH = labels.length ? 22 : 0;
    var ch = opts.height || (step * series.length + xAxisH);
    var chartW = cw - labelW;

    var ref = createCanvas(container, cw, ch);
    var ctx = ref.ctx, canvas = ref.canvas;

    // Alternating row stripes for readability
    for (var si = 0; si < series.length; si++) {
      if (si % 2 === 1) {
        ctx.fillStyle = hexToRgba(theme.textMuted, 0.04);
        ctx.fillRect(labelW, si * step, chartW, step);
      }
    }

    // Color ramps — palette[0]=darkest → palette[8]=lightest
    var pal = theme.palette;
    function posBandColor(b) {
      // band 0 (lowest magnitude) → lightest, band N-1 → darkest
      var t = b / Math.max(1, numBands - 1);
      var idx = Math.round((1 - t) * (pal.length - 1));
      return pal[Math.max(0, Math.min(idx, pal.length - 1))];
    }
    var negPal = ['#fee2e2','#fecaca','#fca5a5','#f87171','#ef4444','#dc2626','#b91c1c','#991b1b','#7f1d1d'];
    function negBandColor(b) {
      var t = b / Math.max(1, numBands - 1);
      var idx = Math.round(t * (negPal.length - 1));
      return negPal[Math.min(idx, negPal.length - 1)];
    }

    series.forEach(function (s, si) {
      var y0 = si * step;
      var values = s.values || [];
      if (!values.length) return;

      // Series label
      if (labelW > 0 && s.name) {
        ctx.fillStyle = s.color || theme.textDim;
        ctx.font = '500 11px ' + theme.font;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.name, labelW - 10, y0 + step / 2);
      }

      // Row separator
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(labelW, y0 + step - 0.5);
      ctx.lineTo(cw, y0 + step - 0.5);
      ctx.stroke();

      // Max absolute value for this series
      var absMax = 0;
      values.forEach(function (v) { var a = Math.abs(v); if (a > absMax) absMax = a; });
      if (absMax === 0) absMax = 1;
      var bandH = absMax / numBands;
      var xStep = chartW / Math.max(1, values.length - 1);

      // Clip to row
      ctx.save();
      ctx.beginPath();
      ctx.rect(labelW, y0, chartW, step);
      ctx.clip();

      // Draw bands: lightest (low magnitude) → darkest (high magnitude)
      for (var b = 0; b < numBands; b++) {
        // Positive fill
        ctx.beginPath();
        ctx.moveTo(labelW, y0 + step);
        for (var i = 0; i < values.length; i++) {
          var v = Math.max(0, values[i]);
          var clipped = Math.max(0, Math.min(v - b * bandH, bandH));
          var frac = clipped / bandH;
          ctx.lineTo(labelW + i * xStep, y0 + step - frac * step);
        }
        ctx.lineTo(labelW + (values.length - 1) * xStep, y0 + step);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(posBandColor(b), 0.82);
        ctx.fill();

        // Negative fill (mirrored from top)
        var hasNeg = false;
        for (var i = 0; i < values.length; i++) { if (values[i] < 0) { hasNeg = true; break; } }
        if (hasNeg) {
          ctx.beginPath();
          ctx.moveTo(labelW, y0);
          for (var i = 0; i < values.length; i++) {
            var v = Math.max(0, -values[i]);
            var clipped = Math.max(0, Math.min(v - b * bandH, bandH));
            var frac = clipped / bandH;
            ctx.lineTo(labelW + i * xStep, y0 + frac * step);
          }
          ctx.lineTo(labelW + (values.length - 1) * xStep, y0);
          ctx.closePath();
          ctx.fillStyle = hexToRgba(negBandColor(b), 0.82);
          ctx.fill();
        }
      }

      ctx.restore();
    });

    // X-axis labels
    if (labels.length) {
      var labelY = step * series.length + 4;
      ctx.fillStyle = theme.textMuted;
      ctx.font = '10px ' + theme.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      var xStep = chartW / Math.max(1, labels.length - 1);
      var skip = labels.length > 24 ? Math.ceil(labels.length / 24) : 1;
      for (var i = 0; i < labels.length; i++) {
        if (i % skip === 0 && labels[i]) ctx.fillText(labels[i], labelW + i * xStep, labelY);
      }
    }

    // Tooltip
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top;
      var si = Math.floor(my / step);
      if (si < 0 || si >= series.length || mx < labelW) { hideTooltip(); return; }
      var s = series[si], values = s.values || [];
      var xStep = chartW / Math.max(1, values.length - 1);
      var di = Math.round((mx - labelW) / xStep);
      if (di < 0 || di >= values.length) { hideTooltip(); return; }
      var html = '<b>' + (s.name || 'Series') + '</b>';
      if (labels[di]) html += ' &mdash; ' + labels[di];
      html += '<br>Value: <b>' + (typeof values[di] === 'number' ? values[di].toFixed(2) : values[di]) + '</b>';
      showTooltip(canvas, mx, my, html, theme);
    });
    canvas.addEventListener('mouseleave', hideTooltip);

    return canvas;
  }

  // =========================================================================
  // CARD WRAPPER
  // =========================================================================

  function cardWrapper(container, config) {
    var chart = config.chart || {};
    var legend = config.legend;
    if (!legend && chart.data && chart.data.series) {
      var t = getTheme(config.theme);
      legend = chart.data.series.map(function (s, i) {
        return { label: s.name || ('Series ' + (i + 1)), color: s.color || seriesColor(t, i) };
      });
    }
    if (!legend && chart.data && chart.data.segments) {
      var t = getTheme(config.theme);
      legend = chart.data.segments.map(function (s, i) {
        return { label: s.label, color: s.color || seriesColor(t, i) };
      });
    }

    var ref = createCard(container, {
      title: config.title,
      subtitle: config.subtitle,
      footer: config.footer,
      legend: legend,
      theme: config.theme,
    });

    var chartOpts = Object.assign({}, chart, { theme: config.theme });
    delete chartOpts.type;
    delete chartOpts.data;

    var fn = chartMap[chart.type];
    if (fn) fn(ref.body, chart.data, chartOpts);
    return ref.card;
  }

  // =========================================================================
  // DECLARATIVE RENDER
  // =========================================================================

  var chartMap = {
    bar: barChart,
    line: lineChart,
    donut: donutChart,
    radar: radarChart,
    gauge: gaugeChart,
    heatmap: heatmapChart,
    sparkline: sparklineChart,
    stat: statCard,
    rings: ringsChart,
    stackedArea: stackedAreaChart,
    choropleth: choroplethChart,
    timeline: timelineChart,
    scatter: scatterChart,
    waterfall: waterfallChart,
    funnel: funnelChart,
    radialBar: radialBarChart,
    bullet: bulletChart,
    treemap: treemapChart,
    progress: progressChart,
    sankey: sankeyChart,
    lollipop: lollipopChart,
    dumbbell: dumbbellChart,
    slope: slopeChart,
    boxPlot: boxPlotChart,
    candlestick: candlestickChart,
    stream: streamChart,
    bump: bumpChart,
    parallel: parallelChart,
    network: networkChart,
    violin: violinChart,
    marimekko: marimekkoChart,
    histogram: histogramChart,
    horizon: horizonChart,
  };

  function render(container, spec) {
    if (spec.type === 'card') return cardWrapper(container, spec);
    var fn = chartMap[spec.type];
    if (fn) return fn(container, spec.data || spec, spec);
    console.warn('CharlotteCharts: unknown type — ' + spec.type);
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  window.CharlotteCharts = {
    setTheme: setTheme,
    getTheme: getTheme,
    registerTheme: registerTheme,
    themes: themes,
    bar: barChart,
    line: lineChart,
    donut: donutChart,
    radar: radarChart,
    gauge: gaugeChart,
    heatmap: heatmapChart,
    sparkline: sparklineChart,
    stat: statCard,
    rings: ringsChart,
    stackedArea: stackedAreaChart,
    choropleth: choroplethChart,
    timeline: timelineChart,
    scatter: scatterChart,
    waterfall: waterfallChart,
    funnel: funnelChart,
    radialBar: radialBarChart,
    bullet: bulletChart,
    treemap: treemapChart,
    progress: progressChart,
    sankey: sankeyChart,
    lollipop: lollipopChart,
    dumbbell: dumbbellChart,
    slope: slopeChart,
    boxPlot: boxPlotChart,
    candlestick: candlestickChart,
    stream: streamChart,
    bump: bumpChart,
    parallel: parallelChart,
    network: networkChart,
    violin: violinChart,
    marimekko: marimekkoChart,
    histogram: histogramChart,
    horizon: horizonChart,
    utils: utils,
    card: cardWrapper,
    render: render,
    version: '3.3.0',
  };

})();
