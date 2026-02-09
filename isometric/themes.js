/* ───────────────────────────────────────────────────────
   themes.js — Theme definitions + CSS property applicator
   Sounder palette from Charlotte
   ─────────────────────────────────────────────────────── */

(function () {
    'use strict';

    const themes = {
        dark: {
            name: 'Dark',
            bg: '#232324',
            surface: '#2D2B2E',
            surfaceAlt: '#383639',
            canvasBg: '#1A1A1B',
            primary: '#7200CB',
            primaryLight: '#9B3FE8',
            secondary: '#F000D2',
            secondaryLight: '#F54DE2',
            tertiary: '#21D6C6',
            tertiaryLight: '#4DE8DB',
            text: '#E8E6E9',
            textDim: '#A09DA2',
            textMuted: '#6E6B70',
            border: '#444246',
            borderLight: '#5A585C',
            btnBg: '#383639',
            btnHover: '#4A484C',
            btnActive: '#7200CB',
            shadow: 'rgba(0,0,0,0.4)',
            glassFill: 'rgba(45,43,46,0.7)',
            glassBorder: 'rgba(255,255,255,0.1)',
            glassGlow: 'rgba(114,0,203,0.08)',
            // Tile palette
            tileGround: '#4A4848',
            tileGrass: '#2D8B57',
            tileWater: '#2176AE',
            tileStone: '#7A7876',
            tileBuilding: '#8B6914',
            tileAccent: '#7200CB',
            tileSide1: 0.15,   // left face darken factor
            tileSide2: 0.30,   // right face darken factor
            gridLine: 'rgba(255,255,255,0.08)',
            hoverFill: 'rgba(33,214,198,0.25)',
            hoverStroke: '#21D6C6',
            selectFill: 'rgba(114,0,203,0.25)',
            selectStroke: '#9B3FE8',
        },
        light: {
            name: 'Light',
            bg: '#F0F0F2',
            surface: '#FFFFFF',
            surfaceAlt: '#E8E8EA',
            canvasBg: '#E4E4E6',
            primary: '#7200CB',
            primaryLight: '#9B3FE8',
            secondary: '#F000D2',
            secondaryLight: '#F54DE2',
            tertiary: '#1AAB9E',
            tertiaryLight: '#21D6C6',
            text: '#232324',
            textDim: '#5A585C',
            textMuted: '#8A888C',
            border: '#D0CED2',
            borderLight: '#E0DEE2',
            btnBg: '#E8E8EA',
            btnHover: '#D8D6DA',
            btnActive: '#7200CB',
            shadow: 'rgba(0,0,0,0.12)',
            glassFill: 'rgba(255,255,255,0.75)',
            glassBorder: 'rgba(0,0,0,0.08)',
            glassGlow: 'rgba(114,0,203,0.05)',
            // Tile palette
            tileGround: '#C8C6C4',
            tileGrass: '#4CAF6E',
            tileWater: '#42A5D8',
            tileStone: '#9E9C9A',
            tileBuilding: '#C49B28',
            tileAccent: '#9B3FE8',
            tileSide1: 0.12,
            tileSide2: 0.24,
            gridLine: 'rgba(0,0,0,0.06)',
            hoverFill: 'rgba(26,171,158,0.2)',
            hoverStroke: '#1AAB9E',
            selectFill: 'rgba(114,0,203,0.18)',
            selectStroke: '#7200CB',
        }
    };

    let current = 'dark';
    const listeners = [];

    function apply(themeName) {
        const t = themes[themeName];
        if (!t) return;
        current = themeName;
        const root = document.documentElement.style;
        root.setProperty('--bg', t.bg);
        root.setProperty('--surface', t.surface);
        root.setProperty('--surface-alt', t.surfaceAlt);
        root.setProperty('--canvas-bg', t.canvasBg);
        root.setProperty('--primary', t.primary);
        root.setProperty('--primary-light', t.primaryLight);
        root.setProperty('--secondary', t.secondary);
        root.setProperty('--secondary-light', t.secondaryLight);
        root.setProperty('--tertiary', t.tertiary);
        root.setProperty('--tertiary-light', t.tertiaryLight);
        root.setProperty('--text', t.text);
        root.setProperty('--text-dim', t.textDim);
        root.setProperty('--text-muted', t.textMuted);
        root.setProperty('--border', t.border);
        root.setProperty('--border-light', t.borderLight);
        root.setProperty('--btn-bg', t.btnBg);
        root.setProperty('--btn-hover', t.btnHover);
        root.setProperty('--btn-active', t.btnActive);
        root.setProperty('--shadow', t.shadow);
        root.setProperty('--glass-fill', t.glassFill);
        root.setProperty('--glass-border', t.glassBorder);
        root.setProperty('--glass-glow', t.glassGlow);
        listeners.forEach(fn => fn(t, themeName));
    }

    window.IsoThemes = {
        themes,
        get current() { return current; },
        get theme() { return themes[current]; },
        apply,
        onChange(fn) { listeners.push(fn); },
    };
})();
