import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Signup from './Signup';

function Navbar() {
  const { getCartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const cartItemCount = getCartItemCount();
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setShowUserMenu(false); }, [location]);

  const handleLogout = () => { logout(); setShowUserMenu(false); };
  const switchToSignup = () => { setShowLogin(false); setShowSignup(true); };
  const switchToLogin = () => { setShowSignup(false); setShowLogin(true); };

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: scrolled ? 'rgba(13,11,8,0.95)' : 'rgba(13,11,8,0.6)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderBottom: scrolled ? '1px solid rgba(196,151,59,0.12)' : '1px solid transparent',
    transition: 'all 0.3s ease',
    padding: scrolled ? '10px 0' : '16px 0',
  };

  const linkStyle = (active) => ({
    textDecoration: 'none', color: active ? '#D4A853' : '#B8A98F',
    fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.5px',
    padding: '8px 16px', borderRadius: 8, transition: 'all 0.3s ease',
    fontFamily: 'var(--font-body)',
  });

  return (
    <>
      <nav style={navStyle}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: scrolled ? '1.4rem' : '1.7rem', fontWeight: 600, background: 'linear-gradient(135deg, #D4A853, #C4973B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 2, transition: 'all 0.3s ease' }}>
              K-Scents
            </span>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', borderLeft: '1px solid var(--border-color)', paddingLeft: 12, lineHeight: 1.3 }}>
              Heritage of<br />Kannauj
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Collection' },
              { to: '/wishlist', label: 'Wishlist' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={linkStyle(isActive(link.to))}
                onMouseEnter={e => { e.target.style.color = '#D4A853'; e.target.style.background = 'rgba(212,168,83,0.08)'; }}
                onMouseLeave={e => { e.target.style.color = isActive(link.to) ? '#D4A853' : '#B8A98F'; e.target.style.background = 'transparent'; }}>
                {link.label}
              </Link>
            ))}

            {/* Cart */}
            <Link to="/cart" style={{
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 20px', borderRadius: 50, fontSize: '0.9rem', fontWeight: 500,
              color: '#D4A853', background: 'rgba(139,105,20,0.12)',
              border: '1px solid rgba(196,151,59,0.2)', position: 'relative', transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,105,20,0.2)'; e.currentTarget.style.borderColor = 'rgba(196,151,59,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,105,20,0.12)'; e.currentTarget.style.borderColor = 'rgba(196,151,59,0.2)'; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, background: 'linear-gradient(135deg, #8B6914, #D4A853)', color: '#0D0B08', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                  background: 'linear-gradient(135deg, #8B6914, #D4A853)', border: 'none', color: '#0D0B08',
                  padding: '8px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(139,105,20,0.3)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,105,20,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,105,20,0.3)'; }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(13,11,8,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                    {(user?.name || 'U')[0].toUpperCase()}
                  </span>
                  <span>{user?.name?.split(' ')[0] || 'User'}</span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>▼</span>
                </button>

                {showUserMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#1E1912', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(196,151,59,0.15)', minWidth: 220, overflow: 'hidden', zIndex: 1001, animation: 'scaleIn 0.2s ease' }}>
                    <div style={{ padding: 16, borderBottom: '1px solid rgba(196,151,59,0.1)', background: 'rgba(139,105,20,0.05)' }}>
                      <div style={{ fontWeight: 600, color: '#F5EDE0', fontSize: 14 }}>{user?.name}</div>
                      <div style={{ fontSize: 12, color: '#7A6E5D', marginTop: 2 }}>{user?.email}</div>
                    </div>
                    <Link to="/profile" style={{ display: 'block', padding: '12px 16px', color: '#B8A98F', fontSize: 14, textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.target.style.background = 'rgba(139,105,20,0.1)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>
                      👤 My Profile
                    </Link>
                    <Link to="/orders" style={{ display: 'block', padding: '12px 16px', color: '#B8A98F', fontSize: 14, textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.target.style.background = 'rgba(139,105,20,0.1)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>
                      📦 My Orders
                    </Link>
                    {user?.isAdmin && (
                      <Link to="/admin" style={{ display: 'block', padding: '12px 16px', color: '#D4A853', fontSize: 14, textDecoration: 'none', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.target.style.background = 'rgba(139,105,20,0.1)'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}>
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderTop: '1px solid rgba(196,151,59,0.1)', textAlign: 'left', cursor: 'pointer', fontSize: 14, color: '#B76E79', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.target.style.background = 'rgba(183,110,121,0.1)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button onClick={() => setShowLogin(true)} style={{
                  background: 'transparent', border: '1.5px solid rgba(196,151,59,0.3)', color: '#D4A853',
                  padding: '8px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(139,105,20,0.1)'; e.target.style.borderColor = 'rgba(196,151,59,0.5)'; }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(196,151,59,0.3)'; }}>
                  Sign In
                </button>
                <button onClick={() => setShowSignup(true)} style={{
                  background: 'linear-gradient(135deg, #8B6914, #D4A853)', border: 'none', color: '#0D0B08',
                  padding: '8px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(139,105,20,0.3)',
                }}
                  onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showUserMenu && <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setShowUserMenu(false)} />}
      {showLogin && <Login onClose={() => setShowLogin(false)} switchToSignup={switchToSignup} />}
      {showSignup && <Signup onClose={() => setShowSignup(false)} switchToLogin={switchToLogin} />}

      <style>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(-8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </>
  );
}

export default Navbar;