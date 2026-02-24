/*
 * FloatingPetals — Dark-themed ambient floating particles
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingPetals({ count = 12 }) {
    const petals = Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 8,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        dur: 8 + Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
        color: i % 3 === 0
            ? 'rgba(212,175,55,0.25)'
            : i % 3 === 1
                ? 'rgba(123,111,197,0.2)'
                : 'rgba(255,255,255,0.08)',
    }));

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
            {petals.map(p => (
                <motion.div
                    key={p.id}
                    initial={{ y: '110%', x: `${p.x}vw`, opacity: 0, rotate: 0 }}
                    animate={{ y: '-10%', opacity: [0, 0.8, 0.6, 0], rotate: 360, x: `${p.x + p.drift}vw` }}
                    transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        background: p.color,
                        filter: `blur(${p.size > 8 ? 2 : 0}px)`,
                    }}
                />
            ))}
        </div>
    );
}
