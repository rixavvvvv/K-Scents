/*
 * HeroScene — Dark glassmorphism perfume bottle with animated glow rings
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function HeroScene() {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Glow rings */}
            {[280, 360, 440].map((size, i) => (
                <motion.div
                    key={i}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    style={{
                        position: 'absolute',
                        width: size, height: size,
                        borderRadius: '50%',
                        border: `1px solid rgba(212,175,55,${0.15 - i * 0.03})`,
                        background: `radial-gradient(circle, rgba(212,175,55,${0.04 - i * 0.01}) 0%, transparent 70%)`,
                    }}
                />
            ))}

            {/* Decorative blurred orb */}
            <motion.div
                animate={{ y: [-10, 10, -10], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', width: 200, height: 200, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(123,111,197,0.25) 0%, transparent 70%)',
                    filter: 'blur(40px)', zIndex: 0,
                }}
            />

            {/* Bottle SVG */}
            <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', zIndex: 2 }}
            >
                <svg width="200" height="380" viewBox="0 0 200 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Bottle body */}
                    <defs>
                        <linearGradient id="bottleGrad" x1="50" y1="80" x2="150" y2="360" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                            <stop offset="50%" stopColor="rgba(212,175,55,0.08)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
                        </linearGradient>
                        <linearGradient id="liquidGrad" x1="65" y1="180" x2="135" y2="340" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="rgba(212,175,55,0.3)" />
                            <stop offset="100%" stopColor="rgba(180,140,30,0.15)" />
                        </linearGradient>
                        <linearGradient id="capGrad" x1="75" y1="40" x2="125" y2="90" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="rgba(212,175,55,0.6)" />
                            <stop offset="100%" stopColor="rgba(180,140,30,0.4)" />
                        </linearGradient>
                    </defs>

                    {/* Cap */}
                    <rect x="78" y="20" width="44" height="60" rx="6" fill="url(#capGrad)" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
                    <rect x="85" y="28" width="30" height="4" rx="2" fill="rgba(255,255,255,0.15)" />

                    {/* Neck */}
                    <path d="M88 80 L88 100 Q88 110 78 120 L78 120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <path d="M112 80 L112 100 Q112 110 122 120 L122 120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <rect x="86" y="78" width="28" height="30" rx="4" fill="url(#bottleGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                    {/* Body */}
                    <path d="M78 120 Q60 140 55 170 L55 330 Q55 350 75 355 L125 355 Q145 350 145 330 L145 170 Q140 140 122 120 Z"
                        fill="url(#bottleGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                    {/* Liquid */}
                    <path d="M60 200 Q60 190 100 195 Q140 200 140 200 L140 330 Q140 348 125 352 L75 352 Q60 348 60 330 Z"
                        fill="url(#liquidGrad)" />

                    {/* Glass reflections */}
                    <path d="M70 130 Q68 180 68 280 Q68 320 72 340" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
                    <path d="M80 125 Q76 160 76 250" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />

                    {/* Label area */}
                    <rect x="70" y="230" width="60" height="40" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" />
                    <text x="100" y="250" textAnchor="middle" fill="rgba(212,175,55,0.5)" fontSize="8" fontFamily="serif" letterSpacing="2">K-SCENTS</text>
                    <text x="100" y="262" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5" fontFamily="sans-serif" letterSpacing="1">LUXURY</text>
                </svg>

                {/* Bottom glow */}
                <div style={{
                    position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
                    width: 120, height: 20,
                    background: 'radial-gradient(ellipse, rgba(212,175,55,0.2) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                }} />
            </motion.div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -30 - i * 10, 0],
                        x: [0, (i % 2 === 0 ? 15 : -15), 0],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
                    style={{
                        position: 'absolute',
                        width: 3 + i % 3,
                        height: 3 + i % 3,
                        borderRadius: '50%',
                        background: i % 2 === 0 ? 'rgba(212,175,55,0.5)' : 'rgba(123,111,197,0.4)',
                        top: `${30 + i * 10}%`,
                        left: `${20 + i * 12}%`,
                    }}
                />
            ))}
        </div>
    );
}
