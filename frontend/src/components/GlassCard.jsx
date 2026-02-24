/*
 * GlassCard — Reusable glass morphism card with hover glow
 * Wraps children in a frosted dark glass container.
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({
    children,
    style = {},
    hover = true,
    padding = 32,
    radius = 22,
    delay = 0,
    className = '',
    onClick,
    ...props
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
            whileHover={
                hover
                    ? {
                        y: -6,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(123,111,197,0.1)',
                        borderColor: 'rgba(255,255,255,0.18)',
                    }
                    : undefined
            }
            onClick={onClick}
            className={className}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: radius,
                padding,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                cursor: onClick ? 'pointer' : 'default',
                ...style,
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
