/*
 * Login — Dark glass modal with frosted overlay
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, color: '#f0eef6', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'var(--font-body)', transition: 'all 0.3s',
    boxSizing: 'border-box', backdropFilter: 'blur(10px)',
};

export default function Login({ onClose, switchToSignup }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error, clearError } = useAuth();

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); if (error) clearError(); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { await login(formData.email, formData.password); onClose(); } catch { }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10000, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    background: 'rgba(15, 15, 30, 0.85)',
                    backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                    padding: '48px 40px', borderRadius: 28, width: 420, maxWidth: '92vw',
                    position: 'relative', border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>✕</button>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 600, background: 'linear-gradient(135deg, #d4af37, #f0d060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>K-Scents</span>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: 8, fontWeight: 500 }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>Sign in to continue your fragrance journey</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(220,100,120,0.1)', color: '#dc6478', padding: '12px 16px', borderRadius: 14, marginBottom: 20, fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(220,100,120,0.15)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div style={{ marginBottom: 28 }}>
                        <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                                style={{ ...inputStyle, paddingRight: 44 }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: 16, borderRadius: 14, border: 'none', fontSize: '1rem', fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        background: loading ? 'rgba(123,111,197,0.2)' : 'linear-gradient(135deg, #d4af37, #e8c44a)',
                        color: loading ? 'var(--text-muted)' : '#0a0a14', transition: 'all 0.3s', marginBottom: 20,
                        boxShadow: loading ? 'none' : '0 8px 24px rgba(212,175,55,0.2)',
                    }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Don't have an account?{' '}
                    <button onClick={switchToSignup} style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'underline' }}>
                        Create one
                    </button>
                </p>
            </motion.div>
        </motion.div>
    );
}
