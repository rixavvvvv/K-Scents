/*
 * WaterEffects — Reusable water-inspired visual components
 * - WaveSection: SVG wave separator between sections
 * - RippleButton: Button with liquid ripple on click
 * - WaterRippleCursor: Mouse-follow ripple overlay
 */
import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

/* ─── SVG Wave Section Separator ─── */
export function WaveSection({ flip = false, color = 'rgba(255,255,255,0.03)', height = 80 }) {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                lineHeight: 0,
                transform: flip ? 'rotate(180deg)' : 'none',
                marginTop: flip ? 0 : -1,
                marginBottom: flip ? -1 : 0,
            }}
        >
            <svg
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                style={{ display: 'block', width: '100%', height }}
            >
                <path
                    d="M0,40 C360,100 720,0 1080,60 C1260,80 1380,40 1440,50 L1440,120 L0,120 Z"
                    fill={color}
                />
                <path
                    d="M0,60 C320,20 640,90 960,40 C1200,10 1360,70 1440,30 L1440,120 L0,120 Z"
                    fill={color}
                    opacity="0.5"
                />
            </svg>
        </div>
    );
}

/* ─── Ripple Button — gold CTA with liquid ripple effect ─── */
export function RippleButton({
    children,
    onClick,
    style = {},
    variant = 'gold', // 'gold' | 'glass'
    disabled = false,
    ...props
}) {
    const btnRef = useRef(null);

    const handleClick = useCallback(
        (e) => {
            if (disabled) return;
            /* Create ripple */
            const btn = btnRef.current;
            if (btn) {
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                ripple.style.cssText = `
          position:absolute; border-radius:50%; pointer-events:none;
          width:${size}px; height:${size}px;
          left:${e.clientX - rect.left - size / 2}px;
          top:${e.clientY - rect.top - size / 2}px;
          background: ${variant === 'gold' ? 'rgba(255,255,255,0.3)' : 'rgba(212,175,55,0.2)'};
          transform:scale(0); animation: ripple 0.6s ease-out;
        `;
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            }
            onClick?.(e);
        },
        [onClick, disabled, variant],
    );

    const baseStyle =
        variant === 'gold'
            ? {
                background: 'linear-gradient(135deg, #d4af37, #e8c44a)',
                color: '#0a0a14',
                border: 'none',
                boxShadow: '0 8px 32px rgba(212,175,55,0.2)',
            }
            : {
                background: 'rgba(255,255,255,0.06)',
                color: '#f0eef6',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            };

    return (
        <motion.button
            ref={btnRef}
            onClick={handleClick}
            disabled={disabled}
            whileHover={{ y: -3, boxShadow: variant === 'gold' ? '0 14px 40px rgba(212,175,55,0.3)' : '0 8px 24px rgba(123,111,197,0.15)' }}
            whileTap={{ scale: 0.97 }}
            style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '16px 44px',
                borderRadius: 9999,
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: 0.5,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                opacity: disabled ? 0.5 : 1,
                ...baseStyle,
                ...style,
            }}
            {...props}
        >
            {children}
        </motion.button>
    );
}

/* ─── Water Ripple Background (for hero sections) ─── */
export function WaterRippleCanvas() {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        >
            {/* Animated SVG ripple rings */}
            <svg
                style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', width: '80%', opacity: 0.15 }}
                viewBox="0 0 600 150"
            >
                {[0, 1, 2, 3].map((i) => (
                    <ellipse
                        key={i}
                        cx="300"
                        cy="75"
                        rx={100 + i * 50}
                        ry={15 + i * 6}
                        fill="none"
                        stroke="rgba(123,111,197,0.3)"
                        strokeWidth="0.5"
                    >
                        <animate attributeName="rx" values={`${80 + i * 50};${120 + i * 50};${80 + i * 50}`} dur={`${4 + i}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.15;0.35;0.15" dur={`${4 + i}s`} repeatCount="indefinite" />
                    </ellipse>
                ))}
            </svg>

            {/* Refracted glass distortion layer */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '30%',
                    background: 'linear-gradient(180deg, transparent 0%, rgba(123,111,197,0.04) 40%, rgba(123,111,197,0.08) 100%)',
                    filter: 'blur(2px)',
                    animation: 'waterRipple 6s ease-in-out infinite',
                }}
            />
        </div>
    );
}

export default { WaveSection, RippleButton, WaterRippleCanvas };
