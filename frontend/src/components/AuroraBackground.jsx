/* 
 * AuroraBackground — Animated floating gradient blobs + dark base
 * Creates the immersive dark aurora atmosphere for the entire app.
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* Aurora blob configuration */
const BLOBS = [
    { color: 'rgba(123, 111, 197, 0.12)', size: '45vmax', x: '15%', y: '10%', dur: 22 },
    { color: 'rgba(90, 70, 180, 0.08)', size: '35vmax', x: '70%', y: '60%', dur: 28 },
    { color: 'rgba(212, 175, 55, 0.06)', size: '30vmax', x: '80%', y: '15%', dur: 25 },
    { color: 'rgba(60, 50, 140, 0.10)', size: '50vmax', x: '40%', y: '80%', dur: 30 },
    { color: 'rgba(232, 196, 74, 0.04)', size: '28vmax', x: '25%', y: '50%', dur: 20 },
];

export default function AuroraBackground() {
    const blobs = useMemo(() => BLOBS, []);

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0a0a14 0%, #0d0d22 30%, #12102a 60%, #0a0a14 100%)',
                pointerEvents: 'none',
            }}
        >
            {/* Aurora blobs */}
            {blobs.map((blob, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [0, 80, -40, 60, 0],
                        y: [0, -50, 30, -30, 0],
                        scale: [1, 1.15, 0.9, 1.08, 1],
                    }}
                    transition={{
                        duration: blob.dur,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        position: 'absolute',
                        left: blob.x,
                        top: blob.y,
                        width: blob.size,
                        height: blob.size,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                        willChange: 'transform',
                    }}
                />
            ))}

            {/* Subtle grid pattern */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
                    backgroundSize: '80px 80px',
                    opacity: 0.5,
                }}
            />
        </div>
    );
}
