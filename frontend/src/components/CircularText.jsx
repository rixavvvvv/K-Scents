/*
 * CircularText — Rotating text ring (dark themed)
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function CircularText({ text = 'K-SCENTS · LUXURY FRAGRANCES · ', size = 140, color = 'rgba(212,175,55,0.35)' }) {
    const chars = text.split('');
    const deg = 360 / chars.length;

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ width: size, height: size, position: 'relative' }}
        >
            {chars.map((char, i) => (
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        fontSize: size * 0.075,
                        fontFamily: 'var(--font-accent)',
                        color,
                        letterSpacing: 2,
                        transformOrigin: `0 ${size / 2}px`,
                        transform: `rotate(${deg * i}deg)`,
                    }}
                >
                    {char}
                </span>
            ))}
        </motion.div>
    );
}
