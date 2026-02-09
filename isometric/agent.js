/* ───────────────────────────────────────────────────────
   agent.js — Chat UI, command parser, Web Speech API
   ─────────────────────────────────────────────────────── */

(function () {
    'use strict';

    const messagesEl = document.getElementById('chat-messages');
    const inputEl = document.getElementById('chat-input');
    const micBtn = document.getElementById('mic-btn');
    const themeSelect = document.getElementById('theme-select');

    // ─── Message Display ────────────────────────────────

    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = 'msg ' + (type || 'agent');
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function reply(text) { addMessage(text, 'agent'); }
    function error(text) { addMessage(text, 'error'); }

    // ─── Command Parser ─────────────────────────────────

    const GS = () => IsoEngine.GridState;

    const commands = [
        {
            pattern: /^place\s+(\w+)\s+at\s+(-?\d+)\s*,\s*(-?\d+)$/i,
            fn(m) {
                const type = m[1].toLowerCase();
                const col = parseInt(m[2]), row = parseInt(m[3]);
                GS().setTile(col, row, type, 0);
                return `Placed ${type} at ${col},${row}`;
            }
        },
        {
            pattern: /^fill\s+(\w+)\s+from\s+(-?\d+)\s*,\s*(-?\d+)\s+to\s+(-?\d+)\s*,\s*(-?\d+)$/i,
            fn(m) {
                const type = m[1].toLowerCase();
                const c1 = parseInt(m[2]), r1 = parseInt(m[3]);
                const c2 = parseInt(m[4]), r2 = parseInt(m[5]);
                GS().fillArea(c1, r1, c2, r2, type);
                const count = (Math.abs(c2 - c1) + 1) * (Math.abs(r2 - r1) + 1);
                return `Filled ${count} tiles with ${type} from ${c1},${r1} to ${c2},${r2}`;
            }
        },
        {
            pattern: /^raise\s+(-?\d+)\s*,\s*(-?\d+)\s+by\s+(\d+)$/i,
            fn(m) {
                const col = parseInt(m[1]), row = parseInt(m[2]), n = parseInt(m[3]);
                const tile = GS().getTile(col, row);
                if (!tile) return `No tile at ${col},${row}`;
                tile.elevation += n;
                GS().notify();
                return `Raised ${col},${row} to elevation ${tile.elevation}`;
            }
        },
        {
            pattern: /^lower\s+(-?\d+)\s*,\s*(-?\d+)\s+by\s+(\d+)$/i,
            fn(m) {
                const col = parseInt(m[1]), row = parseInt(m[2]), n = parseInt(m[3]);
                const tile = GS().getTile(col, row);
                if (!tile) return `No tile at ${col},${row}`;
                tile.elevation = Math.max(0, tile.elevation - n);
                GS().notify();
                return `Lowered ${col},${row} to elevation ${tile.elevation}`;
            }
        },
        {
            pattern: /^clear\s+all$/i,
            fn() {
                GS().clearAll();
                return 'Grid cleared';
            }
        },
        {
            pattern: /^clear\s+(-?\d+)\s*,\s*(-?\d+)$/i,
            fn(m) {
                const col = parseInt(m[1]), row = parseInt(m[2]);
                GS().removeTile(col, row);
                return `Cleared tile at ${col},${row}`;
            }
        },
        {
            pattern: /^label\s+(-?\d+)\s*,\s*(-?\d+)\s+(.+)$/i,
            fn(m) {
                const col = parseInt(m[1]), row = parseInt(m[2]), text = m[3].trim();
                GS().setEntity(col, row, text);
                return `Labeled ${col},${row}: "${text}"`;
            }
        },
        {
            pattern: /^select\s+row\s+(-?\d+)$/i,
            fn(m) {
                const row = parseInt(m[1]);
                GS().selection.clear();
                GS().tiles.forEach((t, key) => { if (t.row === row) GS().selection.add(key); });
                GS().notify();
                return `Selected row ${row} (${GS().selection.size} tiles)`;
            }
        },
        {
            pattern: /^select\s+col\s+(-?\d+)$/i,
            fn(m) {
                const col = parseInt(m[1]);
                GS().selection.clear();
                GS().tiles.forEach((t, key) => { if (t.col === col) GS().selection.add(key); });
                GS().notify();
                return `Selected col ${col} (${GS().selection.size} tiles)`;
            }
        },
        {
            pattern: /^paint\s+selection\s+(\w+)$/i,
            fn(m) {
                const type = m[1].toLowerCase();
                let count = 0;
                GS().selection.forEach(key => {
                    const t = GS().tiles.get(key);
                    if (t) { t.type = type; count++; }
                });
                GS().notify();
                return `Painted ${count} selected tiles to ${type}`;
            }
        },
        {
            pattern: /^set\s+theme\s+(dark|light)$/i,
            fn(m) {
                const name = m[1].toLowerCase();
                IsoThemes.apply(name);
                themeSelect.value = name;
                return `Theme set to ${name}`;
            }
        },
        {
            pattern: /^zoom\s+to\s+fit$/i,
            fn() {
                IsoEngine.zoomToFit();
                return 'Zoomed to fit';
            }
        },
        {
            pattern: /^resize\s+(\d+)$/i,
            fn(m) {
                const n = parseInt(m[1]);
                if (n < 1 || n > 64) return 'Grid size must be 1–64';
                IsoEngine.resize(n);
                return `Grid resized to ${n}×${n}`;
            }
        },
        {
            pattern: /^export$/i,
            fn() {
                IsoEngine.exportJSON();
                return 'Exported grid as JSON';
            }
        },
        {
            pattern: /^perspective\s+(\w+)$/i,
            fn(m) {
                const mode = m[1].toLowerCase();
                if (IsoEngine.PERSPECTIVE_MODES[mode]) {
                    IsoEngine.perspectiveMode = mode;
                    return `Perspective mode: ${IsoEngine.PERSPECTIVE_MODES[mode].name}`;
                }
                const modes = Object.keys(IsoEngine.PERSPECTIVE_MODES).join(', ');
                return `Unknown mode. Available: ${modes}`;
            }
        },
        {
            pattern: /^coords\s+(on|off)$/i,
            fn(m) {
                IsoEngine.showCoords = m[1].toLowerCase() === 'on';
                return `Coordinate labels ${IsoEngine.showCoords ? 'on' : 'off'}`;
            }
        },
        {
            pattern: /^grid\s+(on|off)$/i,
            fn(m) {
                IsoEngine.showGridLines = m[1].toLowerCase() === 'on';
                return `Grid lines ${IsoEngine.showGridLines ? 'on' : 'off'}`;
            }
        },
        {
            pattern: /^demo$/i,
            fn() {
                runDemo();
                return 'Running demo scene...';
            }
        },
        {
            pattern: /^help$/i,
            fn() {
                return [
                    'Commands:',
                    '  place <type> at <col>,<row>',
                    '  fill <type> from <c1>,<r1> to <c2>,<r2>',
                    '  raise <col>,<row> by <n>',
                    '  lower <col>,<row> by <n>',
                    '  clear all | clear <col>,<row>',
                    '  label <col>,<row> <text>',
                    '  select row <n> | select col <n>',
                    '  paint selection <type>',
                    '  set theme <dark|light>',
                    '  perspective <mode>',
                    '  coords on|off | grid on|off',
                    '  zoom to fit | resize <n>',
                    '  export | demo | help',
                    '',
                    'Types: ground, grass, water, stone, building, accent',
                    'Modes: none, cube, gradient, tricolor, checkerCube, penrose, spectrum',
                    '',
                    'Keys: V=select P=place E=elevate B=paint X=erase M=measure',
                    '      F=fit G=grid C=coords /=cycle perspective Esc=deselect',
                ].join('\n');
            }
        }
    ];

    function processCommand(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        addMessage(trimmed, 'user');

        for (const cmd of commands) {
            const m = trimmed.match(cmd.pattern);
            if (m) {
                try {
                    const result = cmd.fn(m);
                    reply(result);
                } catch (err) {
                    error('Error: ' + err.message);
                }
                return;
            }
        }

        error('Unknown command. Type "help" for available commands.');
    }

    // ─── Demo Scene ─────────────────────────────────────

    function runDemo() {
        const gs = GS();
        gs.clearAll();
        gs.gridSize = 16;

        // Base terrain
        for (let c = 0; c < 16; c++)
            for (let r = 0; r < 16; r++)
                gs.tiles.set(c + ',' + r, { col: c, row: r, type: 'grass', elevation: 0, color: null });

        // Water feature
        for (let c = 2; c <= 5; c++)
            for (let r = 8; r <= 11; r++)
                gs.tiles.set(c + ',' + r, { col: c, row: r, type: 'water', elevation: 0, color: null });

        // Stone path
        for (let i = 0; i < 16; i++) {
            gs.tiles.set(i + ',7', { col: i, row: 7, type: 'stone', elevation: 0, color: null });
        }

        // Buildings
        const buildings = [[10, 2], [11, 2], [10, 3], [11, 3], [12, 5], [13, 5], [12, 6], [13, 6]];
        buildings.forEach(([c, r]) => {
            gs.tiles.set(c + ',' + r, { col: c, row: r, type: 'building', elevation: 2, color: null });
        });

        // Tower
        gs.tiles.set('7,3', { col: 7, row: 3, type: 'accent', elevation: 4, color: null });

        // Hills
        [[3, 3, 1], [4, 3, 2], [4, 4, 1], [13, 12, 1], [13, 13, 2], [14, 13, 1]].forEach(([c, r, e]) => {
            const t = gs.tiles.get(c + ',' + r);
            if (t) t.elevation = e;
        });

        // Labels
        gs.entities.set('7,3', { col: 7, row: 3, label: 'Tower', color: null });
        gs.entities.set('10,2', { col: 10, row: 2, label: 'Market', color: null });
        gs.entities.set('3,9', { col: 3, row: 9, label: 'Lake', color: null });

        gs.notify();
        IsoEngine.zoomToFit();
    }

    // ─── Chat Input ─────────────────────────────────────

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(inputEl.value);
            inputEl.value = '';
        }
    });

    // ─── Theme Selector ─────────────────────────────────

    themeSelect.addEventListener('change', () => {
        IsoThemes.apply(themeSelect.value);
    });

    // ─── Web Speech API ─────────────────────────────────

    let recognition = null;
    let isRecording = false;

    function initSpeech() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            micBtn.disabled = true;
            micBtn.title = 'Speech not supported in this browser';
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputEl.value = transcript;
            processCommand(transcript);
            inputEl.value = '';
        };

        recognition.onerror = (event) => {
            if (event.error !== 'no-speech') {
                error('Speech error: ' + event.error);
            }
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
        };

        micBtn.addEventListener('click', () => {
            if (isRecording) {
                recognition.stop();
                stopRecording();
            } else {
                startRecording();
            }
        });
    }

    function startRecording() {
        isRecording = true;
        micBtn.classList.add('recording');
        try {
            recognition.start();
        } catch (e) {
            stopRecording();
        }
    }

    function stopRecording() {
        isRecording = false;
        micBtn.classList.remove('recording');
    }

    // ─── Init ───────────────────────────────────────────

    initSpeech();
    reply('Isometric Grid Builder ready. Type "help" for commands or "demo" for a sample scene.');

    // ─── Public API ─────────────────────────────────────

    window.IsoAgent = {
        processCommand,
        addMessage,
        reply,
        error,
    };
})();
