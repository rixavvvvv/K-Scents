/*
 * Navbar — Floating dark glass navigation
 * Frosted blur on scroll, animated underlines, magnetic hover.
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Signup from './Signup';

export default function Navbar() {
    const { getCartItemCount } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const cartItemCount = getCartItemCount();
    const [scrolled, setScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setShowUserMenu(false); }, [location]);

    const handleLogout = () => { logout(); setShowUserMenu(false); };
    const isActive = (path) => location.pathname === path;

    const links = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Collection' },
        { to: '/wishlist', label: 'Wishlist' },
    ];

    return (
        <>
            {/* ─── Navbar ─── */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                    background: scrolled ? 'rgba(10, 10, 20, 0.7)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                    transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                    padding: scrolled ? '10px 0' : '18px 0',
                }}
            >
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                            fontFamily: 'var(--font-heading)', fontSize: scrolled ? '1.4rem' : '1.7rem',
                            fontWeight: 600, background: 'linear-gradient(135deg, #d4af37, #f0d060)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            letterSpacing: 3, transition: 'all 0.3s ease',
                        }}>
                            K-Scents
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-accent)', fontSize: '0.7rem',
                            color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase',
                            borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 12, lineHeight: 1.3,
                        }}>
                            Luxury<br />Fragrance
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                style={{
                                    textDecoration: 'none',
                                    color: isActive(link.to) ? '#d4af37' : 'var(--text-secondary)',
                                    fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.5px',
                                    padding: '8px 18px', borderRadius: 10, transition: 'all 0.3s ease',
                                    position: 'relative',
                                }}
                                onMouseEnter={e => {
                                    e.target.style.color = '#d4af37';
                                    e.target.style.background = 'rgba(255,255,255,0.04)';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.color = isActive(link.to) ? '#d4af37' : 'var(--text-secondary)';
                                    e.target.style.background = 'transparent';
                                }}
                            >
                                {link.label}
                                {/* Active underline */}
                                {isActive(link.to) && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        style={{
                                            position: 'absolute', bottom: 2, left: '20%', right: '20%', height: 2,
                                            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                                            borderRadius: 2,
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}

                        {/* Cart */}
                        <Link
                            to="/cart"
                            style={{
                                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 20px', borderRadius: 50, fontSize: '0.9rem', fontWeight: 500,
                                color: '#d4af37',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(10px)',
                                position: 'relative', transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span>Cart</span>
                            {cartItemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        position: 'absolute', top: -6, right: -6,
                                        background: 'linear-gradient(135deg, #d4af37, #e8c44a)',
                                        color: '#0a0a14', borderRadius: '50%', width: 20, height: 20,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.7rem', fontWeight: 700,
                                    }}
                                >
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* ─── Auth Buttons ─── */}
                        {isAuthenticated ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'var(--text-primary)',
                                        padding: '8px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600,
                                        display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                >
                                    <span style={{
                                        width: 24, height: 24, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #d4af37, #e8c44a)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', color: '#0a0a14', fontWeight: 700,
                                    }}>
                                        {(user?.name || 'U')[0].toUpperCase()}
                                    </span>
                                    <span>{user?.name?.split(' ')[0] || 'User'}</span>
                                    <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
                                </button>

                                {/* User dropdown */}
                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            style={{
                                                position: 'absolute', top: '100%', right: 0, marginTop: 8,
                                                background: 'rgba(15, 15, 30, 0.9)',
                                                backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
                                                borderRadius: 18, boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                minWidth: 220, overflow: 'hidden', zIndex: 1001,
                                            }}
                                        >
                                            <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{user?.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                                            </div>
                                            {[
                                                { to: '/profile', icon: '👤', label: 'My Profile' },
                                                { to: '/orders', icon: '📦', label: 'My Orders' },
                                                ...(user?.isAdmin ? [{ to: '/admin', icon: '⚙️', label: 'Admin Panel', accent: true }] : []),
                                            ].map(item => (
                                                <Link
                                                    key={item.to}
                                                    to={item.to}
                                                    style={{
                                                        display: 'block', padding: '12px 16px',
                                                        color: item.accent ? '#d4af37' : 'var(--text-secondary)',
                                                        fontSize: 14, textDecoration: 'none', transition: 'background 0.2s',
                                                    }}
                                                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.04)'}
                                                    onMouseLeave={e => e.target.style.background = 'transparent'}
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    {item.icon} {item.label}
                                                </Link>
                                            ))}
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    width: '100%', padding: '12px 16px', background: 'none', border: 'none',
                                                    borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'left',
                                                    fontSize: 14, color: '#dc6478', transition: 'background 0.2s', cursor: 'pointer',
                                                }}
                                                onMouseEnter={e => e.target.style.background = 'rgba(220,100,120,0.06)'}
                                                onMouseLeave={e => e.target.style.background = 'transparent'}
                                            >
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    style={{
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)', color: 'var(--text-secondary)',
                                        padding: '8px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500,
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = '#f0eef6'; }}
                                    onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.color = 'var(--text-secondary)'; }}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setShowSignup(true)}
                                    style={{
                                        background: 'linear-gradient(135deg, #d4af37, #e8c44a)',
                                        border: 'none', color: '#0a0a14',
                                        padding: '8px 22px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600,
                                        transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(212,175,55,0.2)',
                                    }}
                                    onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 24px rgba(212,175,55,0.3)'; }}
                                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(212,175,55,0.2)'; }}
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Backdrop close for user menu */}
            {showUserMenu && <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setShowUserMenu(false)} />}

            {/* Auth modals */}
            <AnimatePresence>
                {showLogin && <Login onClose={() => setShowLogin(false)} switchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />}
                {showSignup && <Signup onClose={() => setShowSignup(false)} switchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />}
            </AnimatePresence>
        </>
    );
}
