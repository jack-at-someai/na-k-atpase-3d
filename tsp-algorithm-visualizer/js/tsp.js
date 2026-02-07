(function () {
    'use strict';

    // ========================================================================
    // Config
    // ========================================================================
    var COLORS = {
        bruteforce: '#ef4444',
        nearest:    '#f59e0b',
        twoopt:     '#3b82f6',
        astar:      '#10b981'
    };

    var ALGO_NAMES = {
        bruteforce: 'Brute Force',
        nearest:    'Nearest Neighbor',
        twoopt:     '2-Opt',
        astar:      'A* Search'
    };

    var ALGO_COMPLEXITY = {
        bruteforce: 'O(n!)',
        nearest:    'O(n\u00B2)',
        twoopt:     'O(n\u00B2/iter)',
        astar:      'O(b^d)'
    };

    var CITY_RADIUS = 6;
    var PADDING = 60;

    // ========================================================================
    // State
    // ========================================================================
    var cities = [];
    var results = {};       // algo key -> { tour, distance, time, states, steps }
    var currentAlgo = null;  // which algo's animation is showing
    var stepIndex = 0;
    var playing = false;
    var playTimer = null;
    var comparing = false;

    // ========================================================================
    // Canvas setup
    // ========================================================================
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ========================================================================
    // DOM references
    // ========================================================================
    var elCityCount    = document.getElementById('city-count');
    var elLegend       = document.getElementById('legend');
    var elLegendBody   = document.getElementById('legend-body');
    var elStepControls = document.getElementById('step-controls');
    var elStepCurrent  = document.getElementById('step-current');
    var elStepTotal    = document.getElementById('step-total');
    var elSpeedSlider  = document.getElementById('speed-slider');
    var elAlgoSelect   = document.getElementById('step-algo-select');
    var elBtnPlay      = document.getElementById('btn-play');

    // ========================================================================
    // Utilities
    // ========================================================================
    function dist(a, b) {
        var dx = a.x - b.x, dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function tourDistance(tour, cities) {
        var d = 0;
        for (var i = 0; i < tour.length - 1; i++) {
            d += dist(cities[tour[i]], cities[tour[i + 1]]);
        }
        d += dist(cities[tour[tour.length - 1]], cities[tour[0]]);
        return d;
    }

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        return arr;
    }

    function getSpeed() {
        var v = parseInt(elSpeedSlider.value, 10);
        // map 1..100 -> 500ms..5ms
        return Math.round(500 - (v - 1) * (495 / 99));
    }

    // ========================================================================
    // MinHeap (for A*)
    // ========================================================================
    function MinHeap(compareFn) {
        this.data = [];
        this.cmp = compareFn;
    }
    MinHeap.prototype.push = function (val) {
        this.data.push(val);
        this._bubbleUp(this.data.length - 1);
    };
    MinHeap.prototype.pop = function () {
        var top = this.data[0];
        var last = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = last;
            this._sinkDown(0);
        }
        return top;
    };
    MinHeap.prototype.size = function () {
        return this.data.length;
    };
    MinHeap.prototype._bubbleUp = function (i) {
        while (i > 0) {
            var parent = (i - 1) >> 1;
            if (this.cmp(this.data[i], this.data[parent]) < 0) {
                var tmp = this.data[i]; this.data[i] = this.data[parent]; this.data[parent] = tmp;
                i = parent;
            } else break;
        }
    };
    MinHeap.prototype._sinkDown = function (i) {
        var n = this.data.length;
        while (true) {
            var l = 2 * i + 1, r = 2 * i + 2, smallest = i;
            if (l < n && this.cmp(this.data[l], this.data[smallest]) < 0) smallest = l;
            if (r < n && this.cmp(this.data[r], this.data[smallest]) < 0) smallest = r;
            if (smallest !== i) {
                var tmp = this.data[i]; this.data[i] = this.data[smallest]; this.data[smallest] = tmp;
                i = smallest;
            } else break;
        }
    };

    // ========================================================================
    // MST cost (Prim's) — used by A* heuristic
    // ========================================================================
    function mstCost(nodeIndices, cities) {
        var n = nodeIndices.length;
        if (n <= 1) return 0;

        var inMST = new Array(n);
        var minEdge = new Array(n);
        for (var i = 0; i < n; i++) { inMST[i] = false; minEdge[i] = Infinity; }
        minEdge[0] = 0;
        var total = 0;

        for (var count = 0; count < n; count++) {
            // pick cheapest
            var u = -1, best = Infinity;
            for (var j = 0; j < n; j++) {
                if (!inMST[j] && minEdge[j] < best) { best = minEdge[j]; u = j; }
            }
            if (u === -1) break;
            inMST[u] = true;
            total += best;

            var cu = cities[nodeIndices[u]];
            for (var v = 0; v < n; v++) {
                if (!inMST[v]) {
                    var d = dist(cu, cities[nodeIndices[v]]);
                    if (d < minEdge[v]) minEdge[v] = d;
                }
            }
        }
        return total;
    }

    // ========================================================================
    // Algorithms
    // ========================================================================

    // --- Brute Force ---
    function solveBruteForce(cities) {
        var n = cities.length;
        var indices = [];
        for (var i = 1; i < n; i++) indices.push(i);

        var bestTour = null, bestDist = Infinity;
        var steps = [];
        var statesExplored = 0;
        // Cap steps to ~2000 max for memory, sample evenly
        var totalPerms = 1;
        for (var f = 2; f < n; f++) totalPerms *= f;
        var sampleEvery = Math.max(1, Math.floor(totalPerms / 2000));

        function permute(arr, l) {
            if (l === arr.length) {
                statesExplored++;
                var tour = [0].concat(arr);
                var d = tourDistance(tour, cities);
                var isBest = d < bestDist;
                if (isBest) { bestDist = d; bestTour = tour.slice(); }
                // Record step for new-bests always, others sampled
                if (isBest || statesExplored % sampleEvery === 0) {
                    steps.push({
                        type: 'eval',
                        tour: tour.slice(),
                        distance: d,
                        bestTour: bestTour.slice(),
                        bestDist: bestDist,
                        isBest: isBest,
                        states: statesExplored
                    });
                }
                return;
            }
            for (var i = l; i < arr.length; i++) {
                var tmp = arr[l]; arr[l] = arr[i]; arr[i] = tmp;
                permute(arr, l + 1);
                tmp = arr[l]; arr[l] = arr[i]; arr[i] = tmp;
            }
        }

        var t0 = performance.now();
        permute(indices, 0);
        var elapsed = performance.now() - t0;

        return {
            tour: bestTour,
            distance: bestDist,
            time: elapsed,
            states: statesExplored,
            steps: steps
        };
    }

    // --- Nearest Neighbor ---
    function solveNearestNeighbor(cities) {
        var n = cities.length;
        var visited = new Array(n);
        for (var i = 0; i < n; i++) visited[i] = false;
        var tour = [0];
        visited[0] = true;
        var steps = [];
        var statesExplored = 0;

        var t0 = performance.now();

        for (var step = 1; step < n; step++) {
            var current = tour[tour.length - 1];
            var bestNext = -1, bestD = Infinity;
            var candidates = [];

            for (var j = 0; j < n; j++) {
                if (!visited[j]) {
                    var d = dist(cities[current], cities[j]);
                    candidates.push({ city: j, dist: d });
                    statesExplored++;
                    if (d < bestD) { bestD = d; bestNext = j; }
                }
            }

            steps.push({
                type: 'choose',
                tourSoFar: tour.slice(),
                current: current,
                candidates: candidates,
                chosen: bestNext,
                chosenDist: bestD,
                states: statesExplored
            });

            visited[bestNext] = true;
            tour.push(bestNext);
        }

        var elapsed = performance.now() - t0;
        var totalDist = tourDistance(tour, cities);

        steps.push({
            type: 'complete',
            tour: tour.slice(),
            distance: totalDist,
            states: statesExplored
        });

        return {
            tour: tour,
            distance: totalDist,
            time: elapsed,
            states: statesExplored,
            steps: steps
        };
    }

    // --- 2-Opt ---
    function solve2Opt(cities) {
        // Start from nearest-neighbor solution
        var nnResult = solveNearestNeighbor(cities);
        var tour = nnResult.tour.slice();
        var n = tour.length;
        var bestDist = nnResult.distance;
        var steps = [];
        var statesExplored = 0;
        var improved = true;

        steps.push({
            type: 'initial',
            tour: tour.slice(),
            distance: bestDist,
            states: 0
        });

        var t0 = performance.now();

        while (improved) {
            improved = false;
            for (var i = 0; i < n - 1; i++) {
                for (var j = i + 2; j < n; j++) {
                    if (i === 0 && j === n - 1) continue;
                    statesExplored++;

                    var a = tour[i], b = tour[i + 1];
                    var c = tour[j], d = tour[(j + 1) % n];

                    var oldEdges = dist(cities[a], cities[b]) + dist(cities[c], cities[d]);
                    var newEdges = dist(cities[a], cities[c]) + dist(cities[b], cities[d]);

                    if (newEdges < oldEdges - 1e-10) {
                        // Reverse segment between i+1 and j
                        var newTour = tour.slice();
                        var left = i + 1, right = j;
                        while (left < right) {
                            var tmp = newTour[left]; newTour[left] = newTour[right]; newTour[right] = tmp;
                            left++; right--;
                        }
                        var newDist = tourDistance(newTour, cities);

                        steps.push({
                            type: 'swap',
                            oldTour: tour.slice(),
                            newTour: newTour.slice(),
                            removedEdges: [[a, b], [c, d]],
                            addedEdges: [[a, c], [b, d]],
                            oldDist: bestDist,
                            newDist: newDist,
                            i: i, j: j,
                            states: statesExplored
                        });

                        tour = newTour;
                        bestDist = newDist;
                        improved = true;
                    }
                }
            }
        }

        var elapsed = performance.now() - t0;

        steps.push({
            type: 'complete',
            tour: tour.slice(),
            distance: bestDist,
            states: statesExplored
        });

        return {
            tour: tour,
            distance: bestDist,
            time: elapsed + nnResult.time,
            states: statesExplored + nnResult.states,
            steps: steps
        };
    }

    // --- A* Search ---
    function solveAStar(cities) {
        var n = cities.length;
        var fullMask = (1 << n) - 1;
        var steps = [];
        var statesExplored = 0;

        // Precompute distances
        var D = [];
        for (var i = 0; i < n; i++) {
            D[i] = [];
            for (var j = 0; j < n; j++) {
                D[i][j] = dist(cities[i], cities[j]);
            }
        }

        // MST heuristic with cache
        var mstCache = {};

        function heuristic(current, mask) {
            // unvisited cities
            var unvisited = [];
            for (var i = 0; i < n; i++) {
                if (!(mask & (1 << i))) unvisited.push(i);
            }
            if (unvisited.length === 0) return D[current][0]; // just return to start

            var cacheKey = mask;
            var mst;
            if (mstCache[cacheKey] !== undefined) {
                mst = mstCache[cacheKey];
            } else {
                mst = mstCost(unvisited, cities);
                mstCache[cacheKey] = mst;
            }

            // min edge from current to any unvisited
            var minToCurrent = Infinity;
            for (var j = 0; j < unvisited.length; j++) {
                var d = D[current][unvisited[j]];
                if (d < minToCurrent) minToCurrent = d;
            }

            // min edge from any unvisited back to start
            var minToStart = Infinity;
            for (var j = 0; j < unvisited.length; j++) {
                var d = D[unvisited[j]][0];
                if (d < minToStart) minToStart = d;
            }

            return mst + minToCurrent + minToStart;
        }

        var t0 = performance.now();

        // State: { f, g, city, mask, path }
        var open = new MinHeap(function (a, b) { return a.f - b.f; });
        var startH = heuristic(0, 1);
        open.push({ f: startH, g: 0, city: 0, mask: 1, path: [0] });

        // Best g for (city, mask) — pruning
        var best = {};
        best['0_1'] = 0;

        var result = null;
        var nextSample = 1; // sample at 1, 2, 4, 8, ... then every 200 after 200

        while (open.size() > 0) {
            var node = open.pop();
            statesExplored++;

            var pathForStep = node.path.slice();

            // Record step for animation — sample logarithmically at start, then linearly
            var shouldRecord = (statesExplored <= 50) ||
                (statesExplored === nextSample) ||
                (node.mask === fullMask) ||
                (statesExplored % 200 === 0);
            if (statesExplored === nextSample && nextSample < 200) nextSample *= 2;

            if (shouldRecord) {
                steps.push({
                    type: 'expand',
                    path: pathForStep,
                    g: node.g,
                    f: node.f,
                    states: statesExplored,
                    mask: node.mask
                });
            }

            // Goal check
            if (node.mask === fullMask) {
                var totalDist = node.g + D[node.city][0];
                var finalTour = node.path.slice();

                steps.push({
                    type: 'solution',
                    tour: finalTour,
                    distance: totalDist,
                    states: statesExplored
                });

                result = {
                    tour: finalTour,
                    distance: totalDist,
                    states: statesExplored
                };
                break;
            }

            // Expand
            for (var next = 0; next < n; next++) {
                if (node.mask & (1 << next)) continue;

                var newG = node.g + D[node.city][next];
                var newMask = node.mask | (1 << next);
                var key = next + '_' + newMask;

                if (best[key] !== undefined && best[key] <= newG) continue;
                best[key] = newG;

                var h = heuristic(next, newMask);
                var newPath = node.path.slice();
                newPath.push(next);

                open.push({
                    f: newG + h,
                    g: newG,
                    city: next,
                    mask: newMask,
                    path: newPath
                });
            }
        }

        var elapsed = performance.now() - t0;

        if (!result) {
            return { tour: [], distance: Infinity, time: elapsed, states: statesExplored, steps: steps };
        }

        return {
            tour: result.tour,
            distance: result.distance,
            time: elapsed,
            states: result.states,
            steps: steps
        };
    }

    // ========================================================================
    // City generation
    // ========================================================================
    function addRandomCities(count) {
        var w = canvas.width - PADDING * 2;
        var h = canvas.height - PADDING * 2;
        for (var i = 0; i < count; i++) {
            cities.push({
                x: PADDING + Math.random() * w,
                y: PADDING + Math.random() * h
            });
        }
        onCitiesChanged();
    }

    function addCircleCities(count) {
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
        var r = Math.min(canvas.width, canvas.height) * 0.35;
        cities = [];
        for (var i = 0; i < count; i++) {
            var angle = (2 * Math.PI * i) / count;
            cities.push({
                x: cx + r * Math.cos(angle),
                y: cy + r * Math.sin(angle)
            });
        }
        onCitiesChanged();
    }

    function addClusterCities(clustersCount, perCluster) {
        var w = canvas.width - PADDING * 4;
        var h = canvas.height - PADDING * 4;
        cities = [];
        for (var c = 0; c < clustersCount; c++) {
            var cx = PADDING * 2 + Math.random() * w;
            var cy = PADDING * 2 + Math.random() * h;
            var spread = 40 + Math.random() * 40;
            for (var i = 0; i < perCluster; i++) {
                cities.push({
                    x: cx + (Math.random() - 0.5) * spread * 2,
                    y: cy + (Math.random() - 0.5) * spread * 2
                });
            }
        }
        onCitiesChanged();
    }

    function clearCities() {
        cities = [];
        results = {};
        currentAlgo = null;
        stopPlaying();
        elLegend.classList.add('hidden');
        elStepControls.classList.add('hidden');
        onCitiesChanged();
    }

    function onCitiesChanged() {
        elCityCount.textContent = cities.length;
        results = {};
        currentAlgo = null;
        stopPlaying();
        elLegend.classList.add('hidden');
        elStepControls.classList.add('hidden');
        draw();
    }

    // ========================================================================
    // Canvas click — add city
    // ========================================================================
    canvas.addEventListener('click', function (e) {
        if (comparing) return;
        // Don't add if clicking on UI elements
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        // Check if click is in control panel or legend area
        var panel = document.getElementById('control-panel');
        var pr = panel.getBoundingClientRect();
        if (e.clientX >= pr.left && e.clientX <= pr.right && e.clientY >= pr.top && e.clientY <= pr.bottom) return;

        if (!elLegend.classList.contains('hidden')) {
            var lr = elLegend.getBoundingClientRect();
            if (e.clientX >= lr.left && e.clientX <= lr.right && e.clientY >= lr.top && e.clientY <= lr.bottom) return;
        }

        cities.push({ x: x, y: y });
        onCitiesChanged();
    });

    // ========================================================================
    // Run an algorithm
    // ========================================================================
    function runAlgorithm(algoKey) {
        if (cities.length < 3) return;

        var n = cities.length;
        if (algoKey === 'bruteforce' && n > 10) {
            alert('Brute Force is limited to 10 cities (currently ' + n + '). It would take too long for more.');
            return;
        }
        if (algoKey === 'astar' && n > 15) {
            alert('A* Search is limited to 15 cities (currently ' + n + '). Memory usage grows exponentially beyond that.');
            return;
        }

        var btn = document.querySelector('[data-algo="' + algoKey + '"]');
        if (btn) btn.classList.add('running');

        // Use setTimeout to let the UI update before heavy computation
        setTimeout(function () {
            var result;
            switch (algoKey) {
                case 'bruteforce': result = solveBruteForce(cities); break;
                case 'nearest':    result = solveNearestNeighbor(cities); break;
                case 'twoopt':     result = solve2Opt(cities); break;
                case 'astar':      result = solveAStar(cities); break;
            }

            results[algoKey] = result;
            currentAlgo = algoKey;
            stepIndex = result.steps.length - 1; // show final result

            if (btn) btn.classList.remove('running');

            updateLegend();
            updateStepControls();
            draw();
        }, 30);
    }

    function runCompareAll() {
        if (cities.length < 3) return;
        comparing = true;
        results = {};

        var algos = ['bruteforce', 'nearest', 'twoopt', 'astar'];
        var n = cities.length;

        // Filter out infeasible
        var feasible = algos.filter(function (a) {
            if (a === 'bruteforce' && n > 10) return false;
            if (a === 'astar' && n > 15) return false;
            return true;
        });

        var idx = 0;

        function runNext() {
            if (idx >= feasible.length) {
                comparing = false;
                if (feasible.length > 0) {
                    currentAlgo = feasible[feasible.length - 1];
                    stepIndex = results[currentAlgo].steps.length - 1;
                }
                updateLegend();
                updateStepControls();
                draw();
                return;
            }

            var algoKey = feasible[idx];
            var btn = document.querySelector('[data-algo="' + algoKey + '"]');
            if (btn) btn.classList.add('running');

            setTimeout(function () {
                var result;
                switch (algoKey) {
                    case 'bruteforce': result = solveBruteForce(cities); break;
                    case 'nearest':    result = solveNearestNeighbor(cities); break;
                    case 'twoopt':     result = solve2Opt(cities); break;
                    case 'astar':      result = solveAStar(cities); break;
                }
                results[algoKey] = result;
                if (btn) btn.classList.remove('running');

                currentAlgo = algoKey;
                stepIndex = result.steps.length - 1;
                updateLegend();
                draw();

                idx++;
                runNext();
            }, 50);
        }

        runNext();
    }

    // ========================================================================
    // Legend
    // ========================================================================
    function updateLegend() {
        elLegendBody.innerHTML = '';
        var keys = Object.keys(results);
        if (keys.length === 0) {
            elLegend.classList.add('hidden');
            return;
        }
        elLegend.classList.remove('hidden');

        // Find optimal distance
        var optDist = Infinity;
        for (var i = 0; i < keys.length; i++) {
            if (results[keys[i]].distance < optDist) optDist = results[keys[i]].distance;
        }

        var algoOrder = ['bruteforce', 'nearest', 'twoopt', 'astar'];
        for (var a = 0; a < algoOrder.length; a++) {
            var key = algoOrder[a];
            if (!results[key]) continue;
            var r = results[key];

            var tr = document.createElement('tr');
            if (key === currentAlgo) tr.className = 'legend-row-active';

            var isOptimal = Math.abs(r.distance - optDist) < 0.01;

            tr.innerHTML =
                '<td class="swatch-cell"><span class="legend-swatch" style="background:' + COLORS[key] + '"></span></td>' +
                '<td>' + ALGO_NAMES[key] + '</td>' +
                '<td>' + ALGO_COMPLEXITY[key] + '</td>' +
                '<td class="legend-distance' + (isOptimal ? ' legend-optimal' : '') + '">' +
                    r.distance.toFixed(1) + (isOptimal ? ' *' : '') + '</td>' +
                '<td>' + r.time.toFixed(1) + ' ms</td>' +
                '<td class="legend-states">' + r.states.toLocaleString() + '</td>';

            // Click to switch animation to this algo
            (function (k) {
                tr.style.cursor = 'pointer';
                tr.addEventListener('click', function () {
                    currentAlgo = k;
                    stepIndex = results[k].steps.length - 1;
                    updateStepControls();
                    updateLegend();
                    draw();
                });
            })(key);

            elLegendBody.appendChild(tr);
        }
    }

    // ========================================================================
    // Step controls
    // ========================================================================
    function updateStepControls() {
        if (!currentAlgo || !results[currentAlgo]) {
            elStepControls.classList.add('hidden');
            return;
        }

        elStepControls.classList.remove('hidden');
        var steps = results[currentAlgo].steps;
        elStepCurrent.textContent = stepIndex + 1;
        elStepTotal.textContent = steps.length;

        // Populate algo selector
        elAlgoSelect.innerHTML = '';
        var algoOrder = ['bruteforce', 'nearest', 'twoopt', 'astar'];
        for (var i = 0; i < algoOrder.length; i++) {
            var key = algoOrder[i];
            if (!results[key]) continue;
            var opt = document.createElement('option');
            opt.value = key;
            opt.textContent = ALGO_NAMES[key];
            if (key === currentAlgo) opt.selected = true;
            elAlgoSelect.appendChild(opt);
        }

        elBtnPlay.innerHTML = playing ? '&#10074;&#10074; Pause' : '&#9654; Play';
    }

    function stepPrev() {
        if (!currentAlgo || !results[currentAlgo]) return;
        stopPlaying();
        if (stepIndex > 0) stepIndex--;
        updateStepControls();
        draw();
    }

    function stepNext() {
        if (!currentAlgo || !results[currentAlgo]) return;
        var maxStep = results[currentAlgo].steps.length - 1;
        if (stepIndex < maxStep) {
            stepIndex++;
        } else {
            stopPlaying();
        }
        updateStepControls();
        draw();
    }

    function togglePlay() {
        if (playing) {
            stopPlaying();
        } else {
            if (!currentAlgo || !results[currentAlgo]) return;
            // If at end, restart
            if (stepIndex >= results[currentAlgo].steps.length - 1) {
                stepIndex = 0;
            }
            playing = true;
            updateStepControls();
            scheduleNextStep();
        }
    }

    function scheduleNextStep() {
        if (!playing) return;
        playTimer = setTimeout(function () {
            stepNext();
            if (playing) scheduleNextStep();
        }, getSpeed());
    }

    function stopPlaying() {
        playing = false;
        if (playTimer) { clearTimeout(playTimer); playTimer = null; }
        updateStepControls();
    }

    elAlgoSelect.addEventListener('change', function () {
        var val = elAlgoSelect.value;
        if (results[val]) {
            stopPlaying();
            currentAlgo = val;
            stepIndex = results[val].steps.length - 1;
            updateStepControls();
            updateLegend();
            draw();
        }
    });

    // ========================================================================
    // Drawing
    // ========================================================================
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background grid
        drawGrid();

        // If we have an active algo with steps, draw the animation frame
        if (currentAlgo && results[currentAlgo] && results[currentAlgo].steps.length > 0) {
            drawAlgoStep();
        }

        // Draw all completed tours faintly (in compare mode)
        if (Object.keys(results).length > 1) {
            var algoOrder = ['bruteforce', 'nearest', 'twoopt', 'astar'];
            for (var a = 0; a < algoOrder.length; a++) {
                var key = algoOrder[a];
                if (!results[key] || key === currentAlgo) continue;
                drawTour(results[key].tour, COLORS[key], 0.2, 1);
            }
        }

        // Draw cities on top
        drawCities();
    }

    function drawGrid() {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        var spacing = 50;
        for (var x = 0; x < canvas.width; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (var y = 0; y < canvas.height; y += spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    }

    function drawCities() {
        for (var i = 0; i < cities.length; i++) {
            var c = cities[i];
            // Outer glow
            ctx.beginPath();
            ctx.arc(c.x, c.y, CITY_RADIUS + 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(248, 250, 252, 0.1)';
            ctx.fill();
            // City dot
            ctx.beginPath();
            ctx.arc(c.x, c.y, CITY_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = '#f8fafc';
            ctx.fill();
            // Label
            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(i.toString(), c.x, c.y - CITY_RADIUS - 5);
        }
    }

    function drawTour(tour, color, alpha, lineWidth) {
        if (!tour || tour.length < 2) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth || 2;
        ctx.beginPath();
        ctx.moveTo(cities[tour[0]].x, cities[tour[0]].y);
        for (var i = 1; i < tour.length; i++) {
            ctx.lineTo(cities[tour[i]].x, cities[tour[i]].y);
        }
        ctx.lineTo(cities[tour[0]].x, cities[tour[0]].y);
        ctx.stroke();
        ctx.restore();
    }

    function drawEdge(a, b, color, alpha, lineWidth, dashed) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth || 2;
        if (dashed) ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(cities[a].x, cities[a].y);
        ctx.lineTo(cities[b].x, cities[b].y);
        ctx.stroke();
        if (dashed) ctx.setLineDash([]);
        ctx.restore();
    }

    function drawPath(path, color, alpha, lineWidth) {
        if (!path || path.length < 2) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth || 2;
        ctx.beginPath();
        ctx.moveTo(cities[path[0]].x, cities[path[0]].y);
        for (var i = 1; i < path.length; i++) {
            ctx.lineTo(cities[path[i]].x, cities[path[i]].y);
        }
        ctx.stroke();
        ctx.restore();
    }

    function highlightCity(idx, color) {
        ctx.beginPath();
        ctx.arc(cities[idx].x, cities[idx].y, CITY_RADIUS + 4, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // ========================================================================
    // Draw algorithm-specific step
    // ========================================================================
    function drawAlgoStep() {
        var algo = currentAlgo;
        var step = results[algo].steps[stepIndex];
        if (!step) return;
        var color = COLORS[algo];

        switch (algo) {
            case 'bruteforce':
                drawBruteForceStep(step, color);
                break;
            case 'nearest':
                drawNearestStep(step, color);
                break;
            case 'twoopt':
                drawTwoOptStep(step, color);
                break;
            case 'astar':
                drawAStarStep(step, color);
                break;
        }

        // States explored counter
        if (step.states !== undefined) {
            drawStatesCounter(step.states, color);
        }
    }

    function drawStatesCounter(states, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('States explored: ' + states.toLocaleString(), 20, canvas.height - 60);
        ctx.restore();
    }

    function drawBruteForceStep(step, color) {
        if (step.type === 'eval') {
            // Draw current tour being evaluated (faint)
            drawTour(step.tour, color, 0.25, 1);
            // Draw best tour found so far (bright)
            if (step.bestTour) {
                drawTour(step.bestTour, color, 0.9, 2.5);
            }
            // If this is a new best, flash it
            if (step.isBest) {
                drawTour(step.tour, '#ffffff', 0.6, 3);
            }
            // Show distance
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '13px system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Current: ' + step.distance.toFixed(1) + '  Best: ' + step.bestDist.toFixed(1), 20, canvas.height - 80);
            ctx.restore();
        }
    }

    function drawNearestStep(step, color) {
        if (step.type === 'choose') {
            // Draw tour so far
            drawPath(step.tourSoFar, color, 0.9, 2.5);
            // Draw candidate edges as dashed
            for (var i = 0; i < step.candidates.length; i++) {
                var c = step.candidates[i];
                var isChosen = c.city === step.chosen;
                drawEdge(step.current, c.city, isChosen ? color : '#475569', isChosen ? 0.9 : 0.3, isChosen ? 2.5 : 1, !isChosen);
            }
            // Highlight chosen city
            highlightCity(step.chosen, color);
        } else if (step.type === 'complete') {
            drawTour(step.tour, color, 0.9, 2.5);
        }
    }

    function drawTwoOptStep(step, color) {
        if (step.type === 'initial') {
            drawTour(step.tour, color, 0.6, 1.5);
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '13px system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Initial (NN): ' + step.distance.toFixed(1), 20, canvas.height - 80);
            ctx.restore();
        } else if (step.type === 'swap') {
            // Draw old tour faintly
            drawTour(step.oldTour, '#475569', 0.3, 1);
            // Draw new tour
            drawTour(step.newTour, color, 0.9, 2.5);
            // Highlight removed edges in red
            for (var i = 0; i < step.removedEdges.length; i++) {
                var e = step.removedEdges[i];
                drawEdge(e[0], e[1], '#ef4444', 0.7, 2, true);
            }
            // Highlight added edges in green
            for (var i = 0; i < step.addedEdges.length; i++) {
                var e = step.addedEdges[i];
                drawEdge(e[0], e[1], '#10b981', 0.9, 2.5, false);
            }
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '13px system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Distance: ' + step.oldDist.toFixed(1) + ' \u2192 ' + step.newDist.toFixed(1), 20, canvas.height - 80);
            ctx.restore();
        } else if (step.type === 'complete') {
            drawTour(step.tour, color, 0.9, 2.5);
        }
    }

    function drawAStarStep(step, color) {
        if (step.type === 'expand') {
            // Draw current partial path
            drawPath(step.path, color, 0.9, 2.5);

            // Dashed line from last city in path to start (return edge estimate)
            if (step.path.length > 1) {
                var last = step.path[step.path.length - 1];
                drawEdge(last, 0, color, 0.3, 1, true);
            }

            // Highlight frontier: unvisited cities with dashed lines from last
            var last = step.path[step.path.length - 1];
            for (var i = 0; i < cities.length; i++) {
                if (!(step.mask & (1 << i))) {
                    drawEdge(last, i, color, 0.15, 1, true);
                }
            }

            // Show g and f values
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '13px system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('g=' + step.g.toFixed(1) + '  f=' + step.f.toFixed(1), 20, canvas.height - 80);
            ctx.restore();
        } else if (step.type === 'solution') {
            drawTour(step.tour, color, 0.9, 2.5);
        }
    }

    // ========================================================================
    // Button event handlers
    // ========================================================================
    document.getElementById('btn-add6').addEventListener('click', function () { addRandomCities(6); });
    document.getElementById('btn-add10').addEventListener('click', function () { addRandomCities(10); });
    document.getElementById('btn-add15').addEventListener('click', function () { addRandomCities(15); });
    document.getElementById('btn-add25').addEventListener('click', function () { addRandomCities(25); });
    document.getElementById('btn-circle').addEventListener('click', function () { addCircleCities(12); });
    document.getElementById('btn-clusters').addEventListener('click', function () { addClusterCities(3, 5); });
    document.getElementById('btn-clear').addEventListener('click', clearCities);

    document.getElementById('btn-bruteforce').addEventListener('click', function () { runAlgorithm('bruteforce'); });
    document.getElementById('btn-nearest').addEventListener('click', function () { runAlgorithm('nearest'); });
    document.getElementById('btn-twoopt').addEventListener('click', function () { runAlgorithm('twoopt'); });
    document.getElementById('btn-astar').addEventListener('click', function () { runAlgorithm('astar'); });
    document.getElementById('btn-compare').addEventListener('click', runCompareAll);

    document.getElementById('btn-prev').addEventListener('click', stepPrev);
    document.getElementById('btn-next').addEventListener('click', stepNext);
    document.getElementById('btn-play').addEventListener('click', togglePlay);

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') stepPrev();
        else if (e.key === 'ArrowRight') stepNext();
        else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    });

})();
