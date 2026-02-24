/*
 * GradientCarousel – React adaptation of clementgrellier/gradientslider
 * 3D infinite carousel with reactive canvas-based background gradients.
 * Converted from vanilla JS → React component.
 *
 * Props:
 *   products  – array of { _id, name, image, price/finalPrice }
 *   onSelect  – (product) => void  — called when a card is clicked
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import './GradientCarousel.css';

// ── Configuration ──
const FRICTION = 0.88;
const WHEEL_SENS = 0.6;
const DRAG_SENS = 1.0;

const MAX_ROTATION = 28;
const MAX_DEPTH = 140;
const MIN_SCALE = 0.92;
const SCALE_RANGE = 0.1;
const GAP = 28;

// ── Helpers ──
function mod(n, m) { return ((n % m) + m) % m; }

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max === min) { h = 0; s = 0; }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360; h /= 360;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function fallbackFromIndex(idx) {
    // dark-themed fallback palette (deep purples / golds)
    const h = (idx * 37 + 260) % 360;
    const s = 0.45;
    return { c1: hslToRgb(h, s, 0.25), c2: hslToRgb(h, s, 0.40) };
}

function extractColors(img, idx) {
    try {
        const MAX = 48;
        const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        const tw = ratio >= 1 ? MAX : Math.max(16, Math.round(MAX * ratio));
        const th = ratio >= 1 ? Math.max(16, Math.round(MAX / ratio)) : MAX;
        const canvas = document.createElement('canvas');
        canvas.width = tw; canvas.height = th;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, tw, th);
        const data = ctx.getImageData(0, 0, tw, th).data;

        const H_BINS = 36, S_BINS = 5, SIZE = H_BINS * S_BINS;
        const wSum = new Float32Array(SIZE);
        const rSum = new Float32Array(SIZE);
        const gSum = new Float32Array(SIZE);
        const bSum = new Float32Array(SIZE);

        for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3] / 255;
            if (a < 0.05) continue;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const [h, s, l] = rgbToHsl(r, g, b);
            if (l < 0.1 || l > 0.92 || s < 0.08) continue;
            const w = a * (s * s) * (1 - Math.abs(l - 0.5) * 0.6);
            const hi = Math.max(0, Math.min(H_BINS - 1, Math.floor((h / 360) * H_BINS)));
            const si = Math.max(0, Math.min(S_BINS - 1, Math.floor(s * S_BINS)));
            const bidx = hi * S_BINS + si;
            wSum[bidx] += w; rSum[bidx] += r * w; gSum[bidx] += g * w; bSum[bidx] += b * w;
        }

        let pIdx = -1, pW = 0;
        for (let i = 0; i < SIZE; i++) { if (wSum[i] > pW) { pW = wSum[i]; pIdx = i; } }
        if (pIdx < 0 || pW <= 0) return fallbackFromIndex(idx);

        const pHue = Math.floor(pIdx / S_BINS) * (360 / H_BINS);
        let sIdx = -1, sW = 0;
        for (let i = 0; i < SIZE; i++) {
            const w = wSum[i]; if (w <= 0) continue;
            const h = Math.floor(i / S_BINS) * (360 / H_BINS);
            let dh = Math.abs(h - pHue); dh = Math.min(dh, 360 - dh);
            if (dh >= 25 && w > sW) { sW = w; sIdx = i; }
        }

        const avgRGB = (idx) => {
            const w = wSum[idx] || 1e-6;
            return [Math.round(rSum[idx] / w), Math.round(gSum[idx] / w), Math.round(bSum[idx] / w)];
        };

        const [pr, pg, pb] = avgRGB(pIdx);
        let [h1, s1] = rgbToHsl(pr, pg, pb);
        s1 = Math.max(0.45, Math.min(1, s1 * 1.15));
        const c1 = hslToRgb(h1, s1, 0.5);

        let c2;
        if (sIdx >= 0 && sW >= pW * 0.6) {
            const [sr, sg, sb] = avgRGB(sIdx);
            let [h2, s2] = rgbToHsl(sr, sg, sb);
            s2 = Math.max(0.45, Math.min(1, s2 * 1.05));
            c2 = hslToRgb(h2, s2, 0.72);
        } else {
            c2 = hslToRgb(h1, s1, 0.72);
        }
        return { c1, c2 };
    } catch {
        return fallbackFromIndex(idx);
    }
}

// ───────────── Component ─────────────
export default function GradientCarousel({ products = [], onSelect }) {
    const stageRef = useRef(null);
    const cardsRef = useRef(null);
    const canvasRef = useRef(null);

    const [loaded, setLoaded] = useState(false);

    // All mutable state lives in a single ref to avoid re-renders
    const state = useRef({
        items: [],         // { el, x }
        positions: null,   // Float32Array
        activeIndex: -1,
        CARD_W: 300, CARD_H: 400, STEP: 328, TRACK: 0,
        SCROLL_X: 0, vX: 0,
        VW_HALF: window.innerWidth * 0.5,
        gradPalette: [],
        gradCurrent: { r1: 217, g1: 214, b1: 232, r2: 207, g2: 201, b2: 230 },
        bgFastUntil: 0,
        rafId: null, bgRAF: null,
        lastTime: 0, lastBgDraw: 0,
        dragging: false, lastX: 0, lastT: 0, lastDelta: 0,
        isEntering: true,
        mounted: true,
    });

    // ── Transform helpers ──
    const computeTransform = useCallback((screenX) => {
        const norm = Math.max(-1, Math.min(1, screenX / state.current.VW_HALF));
        const absNorm = Math.abs(norm);
        const invNorm = 1 - absNorm;
        const ry = -norm * MAX_ROTATION;
        const tz = invNorm * MAX_DEPTH;
        const scale = MIN_SCALE + invNorm * SCALE_RANGE;
        return { norm, absNorm, invNorm, ry, tz, scale };
    }, []);

    const transformForScreenX = useCallback((screenX) => {
        const { ry, tz, scale } = computeTransform(screenX);
        return {
            transform: `translate3d(${screenX}px,-50%,${tz}px) rotateY(${ry}deg) scale(${scale})`,
            z: tz,
        };
    }, [computeTransform]);

    // ── Gradient drawing ──
    const drawBackground = useCallback(() => {
        const s = state.current;
        if (!s.mounted) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { alpha: false });
        if (!canvas || !ctx) return;

        const now = performance.now();
        const minInterval = now < s.bgFastUntil ? 16 : 33;
        if (now - s.lastBgDraw < minInterval) {
            s.bgRAF = requestAnimationFrame(drawBackground);
            return;
        }
        s.lastBgDraw = now;

        const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const tw = Math.floor(w * dpr);
        const th = Math.floor(h * dpr);
        if (canvas.width !== tw || canvas.height !== th) {
            canvas.width = tw; canvas.height = th;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        // Lavender-tinted base
        ctx.fillStyle = '#ddd9ec';
        ctx.fillRect(0, 0, w, h);

        const time = now * 0.0002;
        const cx = w * 0.5, cy = h * 0.5;
        const a1 = Math.min(w, h) * 0.35;
        const a2 = Math.min(w, h) * 0.28;

        const x1 = cx + Math.cos(time) * a1;
        const y1 = cy + Math.sin(time * 0.8) * a1 * 0.4;
        const x2 = cx + Math.cos(-time * 0.9 + 1.2) * a2;
        const y2 = cy + Math.sin(-time * 0.7 + 0.7) * a2 * 0.5;

        const r1 = Math.max(w, h) * 0.75;
        const r2 = Math.max(w, h) * 0.65;
        const gc = s.gradCurrent;

        const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
        g1.addColorStop(0, `rgba(${gc.r1},${gc.g1},${gc.b1},0.85)`);
        g1.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);

        const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
        g2.addColorStop(0, `rgba(${gc.r2},${gc.g2},${gc.b2},0.70)`);
        g2.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);

        s.bgRAF = requestAnimationFrame(drawBackground);
    }, []);

    // ── Set active gradient ──
    const setActiveGradient = useCallback((idx) => {
        const s = state.current;
        if (idx < 0 || idx >= s.items.length || idx === s.activeIndex) return;
        s.activeIndex = idx;
        const pal = s.gradPalette[idx] || { c1: [217, 214, 232], c2: [207, 201, 230] };
        const to = { r1: pal.c1[0], g1: pal.c1[1], b1: pal.c1[2], r2: pal.c2[0], g2: pal.c2[1], b2: pal.c2[2] };
        s.bgFastUntil = performance.now() + 800;

        // Smooth transition without GSAP
        const from = { ...s.gradCurrent };
        const start = performance.now();
        const duration = 450;
        function animate() {
            if (!s.mounted) return;
            const t = Math.min(1, (performance.now() - start) / duration);
            const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
            s.gradCurrent.r1 = from.r1 + (to.r1 - from.r1) * ease;
            s.gradCurrent.g1 = from.g1 + (to.g1 - from.g1) * ease;
            s.gradCurrent.b1 = from.b1 + (to.b1 - from.b1) * ease;
            s.gradCurrent.r2 = from.r2 + (to.r2 - from.r2) * ease;
            s.gradCurrent.g2 = from.g2 + (to.g2 - from.g2) * ease;
            s.gradCurrent.b2 = from.b2 + (to.b2 - from.b2) * ease;
            if (t < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }, []);

    // ── Update transforms ──
    const updateTransforms = useCallback(() => {
        const s = state.current;
        const half = s.TRACK / 2;
        let closestIdx = -1, closestDist = Infinity;

        for (let i = 0; i < s.items.length; i++) {
            let pos = s.items[i].x - s.SCROLL_X;
            if (pos < -half) pos += s.TRACK;
            if (pos > half) pos -= s.TRACK;
            s.positions[i] = pos;
            const dist = Math.abs(pos);
            if (dist < closestDist) { closestDist = dist; closestIdx = i; }
        }

        const prevIdx = (closestIdx - 1 + s.items.length) % s.items.length;
        const nextIdx = (closestIdx + 1) % s.items.length;

        for (let i = 0; i < s.items.length; i++) {
            const it = s.items[i];
            const pos = s.positions[i];
            const norm = Math.max(-1, Math.min(1, pos / s.VW_HALF));
            const { transform, z } = transformForScreenX(pos);
            it.el.style.transform = transform;
            it.el.style.zIndex = String(1000 + Math.round(z));
            const isCore = i === closestIdx || i === prevIdx || i === nextIdx;
            const blur = isCore ? 0 : 2 * Math.pow(Math.abs(norm), 1.1);
            it.el.style.filter = `blur(${blur.toFixed(2)}px)`;
        }

        if (closestIdx !== s.activeIndex) {
            setActiveGradient(closestIdx);
        }
    }, [transformForScreenX, setActiveGradient]);

    // ── Animation tick ──
    const tick = useCallback((t) => {
        const s = state.current;
        if (!s.mounted) return;
        const dt = s.lastTime ? (t - s.lastTime) / 1000 : 0;
        s.lastTime = t;
        s.SCROLL_X = mod(s.SCROLL_X + s.vX * dt, s.TRACK);
        const decay = Math.pow(FRICTION, dt * 60);
        s.vX *= decay;
        if (Math.abs(s.vX) < 0.02) s.vX = 0;
        updateTransforms();
        s.rafId = requestAnimationFrame(tick);
    }, [updateTransforms]);

    // ── Init ──
    useEffect(() => {
        const s = state.current;
        s.mounted = true;
        if (!products.length) return;

        const stage = stageRef.current;
        const cardsRoot = cardsRef.current;
        if (!stage || !cardsRoot) return;

        // Create cards
        cardsRoot.innerHTML = '';
        s.items = [];
        const fragment = document.createDocumentFragment();

        products.forEach((product, i) => {
            const card = document.createElement('article');
            card.className = 'gc-card';
            card.style.willChange = 'transform';

            const img = new Image();
            img.className = 'gc-card__img';
            img.decoding = 'async';
            img.loading = 'eager';
            img.fetchPriority = 'high';
            img.draggable = false;
            img.src = product.image || '';
            img.alt = product.name || '';

            // Info overlay
            const info = document.createElement('div');
            info.className = 'gc-card__info';
            const pName = document.createElement('p');
            pName.className = 'gc-card__name';
            pName.textContent = product.name || '';
            const pPrice = document.createElement('p');
            pPrice.className = 'gc-card__price';
            pPrice.textContent = `₹${(product.finalPrice || product.price || 0).toLocaleString()}`;
            info.appendChild(pName);
            info.appendChild(pPrice);

            card.appendChild(img);
            card.appendChild(info);
            fragment.appendChild(card);

            // Click handler
            card.addEventListener('click', () => {
                if (onSelect) onSelect(product);
            });

            s.items.push({ el: card, x: i * (300 + GAP) });
        });

        cardsRoot.appendChild(fragment);

        // Measure
        const measure = () => {
            const sample = s.items[0]?.el;
            if (!sample) return;
            const r = sample.getBoundingClientRect();
            s.CARD_W = r.width || 300;
            s.CARD_H = r.height || 400;
            s.STEP = s.CARD_W + GAP;
            s.TRACK = s.items.length * s.STEP;
            s.items.forEach((it, i) => { it.x = i * s.STEP; });
            s.positions = new Float32Array(s.items.length);
        };
        measure();
        s.VW_HALF = window.innerWidth * 0.5;
        s.SCROLL_X = 0;
        s.vX = 0;
        s.activeIndex = -1;
        updateTransforms();
        stage.classList.add('carousel-mode');

        // Wait for images to load
        const waitForImages = () => {
            const promises = s.items.map((it) => {
                const img = it.el.querySelector('img');
                if (!img || img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                });
            });
            return Promise.all(promises);
        };

        const boot = async () => {
            await waitForImages();

            // Decode images
            await Promise.allSettled(s.items.map((it) => {
                const img = it.el.querySelector('img');
                if (img && typeof img.decode === 'function') return img.decode().catch(() => { });
                return Promise.resolve();
            }));

            // Build palette
            s.gradPalette = s.items.map((it, i) => {
                const img = it.el.querySelector('img');
                return extractColors(img, i);
            });

            // Set initial gradient
            const half = s.TRACK / 2;
            let closestIdx = 0, closestDist = Infinity;
            for (let i = 0; i < s.items.length; i++) {
                let pos = s.items[i].x - s.SCROLL_X;
                if (pos < -half) pos += s.TRACK;
                if (pos > half) pos -= s.TRACK;
                if (Math.abs(pos) < closestDist) { closestDist = Math.abs(pos); closestIdx = i; }
            }
            setActiveGradient(closestIdx);

            // Start background animation
            drawBackground();
            await new Promise(r => setTimeout(r, 80));

            // Entry animation — fade cards in with stagger
            const viewportWidth = window.innerWidth;
            const visibleCards = [];
            for (let i = 0; i < s.items.length; i++) {
                let pos = s.items[i].x - s.SCROLL_X;
                if (pos < -half) pos += s.TRACK;
                if (pos > half) pos -= s.TRACK;
                if (Math.abs(pos) < viewportWidth * 0.6) {
                    visibleCards.push({ item: s.items[i], screenX: pos, index: i });
                }
            }
            visibleCards.sort((a, b) => a.screenX - b.screenX);

            // Animate entry
            for (const vc of visibleCards) {
                vc.item.el.style.opacity = '0';
            }
            await new Promise(r => requestAnimationFrame(r));

            for (let k = 0; k < visibleCards.length; k++) {
                const vc = visibleCards[k];
                const { ry, tz, scale: baseScale } = computeTransform(vc.screenX);
                const startScale = 0.92;
                const startY = 40;
                const dur = 600; // ms
                const startTime = performance.now();

                await new Promise((resolve) => {
                    function step() {
                        if (!s.mounted) { resolve(); return; }
                        const t = Math.min(1, (performance.now() - startTime) / dur);
                        const ease = 1 - Math.pow(1 - t, 3);
                        const currentScale = startScale + (baseScale - startScale) * ease;
                        const currentY = startY * (1 - ease);
                        vc.item.el.style.opacity = ease.toFixed(3);
                        if (t >= 0.999) {
                            const { transform } = transformForScreenX(vc.screenX);
                            vc.item.el.style.transform = transform;
                        } else {
                            vc.item.el.style.transform =
                                `translate3d(${vc.screenX}px,-50%,${tz}px) rotateY(${ry}deg) scale(${currentScale}) translateY(${currentY}px)`;
                        }
                        if (t < 1) requestAnimationFrame(step);
                        else resolve();
                    }
                    // Stagger by 50ms per card
                    setTimeout(() => requestAnimationFrame(step), k * 50);
                });
            }

            // Make all cards visible
            s.items.forEach(it => { it.el.style.opacity = '1'; });

            s.isEntering = false;
            setLoaded(true);

            // Start main loop
            s.lastTime = 0;
            s.rafId = requestAnimationFrame(tick);
        };

        boot();

        // ── Event listeners ──
        const onWheel = (e) => {
            if (s.isEntering) return;
            // Only drive carousel on horizontal-dominant scroll
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                s.vX += e.deltaX * WHEEL_SENS * 20;
            }
            // Vertical scroll passes through naturally (passive listener)
        };

        const onPointerDown = (e) => {
            if (s.isEntering) return;
            s.dragStartX = e.clientX;
            s.dragStartY = e.clientY;
            s.dragLocked = null; // null = undecided, 'h' = horizontal, 'v' = vertical
            s.dragging = true;
            s.lastX = e.clientX;
            s.lastT = performance.now();
            s.lastDelta = 0;
            stage.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e) => {
            if (!s.dragging) return;

            // Decide drag axis on first significant movement
            if (!s.dragLocked) {
                const dx = Math.abs(e.clientX - s.dragStartX);
                const dy = Math.abs(e.clientY - s.dragStartY);
                if (dx < 4 && dy < 4) return; // too small to decide
                s.dragLocked = dx >= dy ? 'h' : 'v';
                if (s.dragLocked === 'h') stage.classList.add('dragging');
            }

            // Vertical drag — release capture so the page scrolls normally
            if (s.dragLocked === 'v') {
                s.dragging = false;
                try { stage.releasePointerCapture(e.pointerId); } catch { }
                stage.classList.remove('dragging');
                return;
            }

            // Horizontal drag — move carousel
            const now = performance.now();
            const dx = e.clientX - s.lastX;
            const dt = Math.max(1, now - s.lastT) / 1000;
            s.SCROLL_X = mod(s.SCROLL_X - dx * DRAG_SENS, s.TRACK);
            s.lastDelta = dx / dt;
            s.lastX = e.clientX;
            s.lastT = now;
        };

        const onPointerUp = (e) => {
            if (!s.dragging) return;
            s.dragging = false;
            try { stage.releasePointerCapture(e.pointerId); } catch { }
            if (s.dragLocked === 'h') s.vX = -s.lastDelta * DRAG_SENS;
            stage.classList.remove('dragging');
        };

        const onDragStart = (e) => e.preventDefault();

        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const prevStep = s.STEP || 1;
                const ratio = s.SCROLL_X / (s.items.length * prevStep);
                measure();
                s.VW_HALF = window.innerWidth * 0.5;
                s.SCROLL_X = mod(ratio * s.TRACK, s.TRACK);
                updateTransforms();
            }, 80);
        };

        const onVisibility = () => {
            if (document.hidden) {
                if (s.rafId) cancelAnimationFrame(s.rafId);
                if (s.bgRAF) cancelAnimationFrame(s.bgRAF);
                s.rafId = null; s.bgRAF = null;
            } else {
                if (!s.isEntering) {
                    s.lastTime = 0;
                    s.rafId = requestAnimationFrame(tick);
                }
                drawBackground();
            }
        };

        stage.addEventListener('wheel', onWheel, { passive: true });
        stage.addEventListener('dragstart', onDragStart);
        stage.addEventListener('pointerdown', onPointerDown);
        stage.addEventListener('pointermove', onPointerMove);
        stage.addEventListener('pointerup', onPointerUp);
        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            s.mounted = false;
            if (s.rafId) cancelAnimationFrame(s.rafId);
            if (s.bgRAF) cancelAnimationFrame(s.bgRAF);
            stage.removeEventListener('wheel', onWheel);
            stage.removeEventListener('dragstart', onDragStart);
            stage.removeEventListener('pointerdown', onPointerDown);
            stage.removeEventListener('pointermove', onPointerMove);
            stage.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);
            clearTimeout(resizeTimer);
        };
    }, [products, onSelect, computeTransform, transformForScreenX, updateTransforms, setActiveGradient, tick, drawBackground]);

    return (
        <div ref={stageRef} className="gc-stage" aria-live="polite">
            <div
                className={`gc-loader ${loaded ? 'gc-loader--hide' : ''}`}
                aria-label="Loading carousel"
            >
                <div className="gc-loader__ring" aria-hidden="true" />
            </div>
            <canvas ref={canvasRef} className="gc-bg" aria-hidden="true" />
            <section ref={cardsRef} className="gc-cards" aria-label="Product showcase carousel" />
        </div>
    );
}
