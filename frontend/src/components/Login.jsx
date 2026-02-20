import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%', padding: '14px 16px', background: 'rgba(30,25,18,0.5)',
  border: '1px solid var(--border-color)', borderRadius: 12,
  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
  fontFamily: 'var(--font-body)', transition: 'border-color 0.3s', boxSizing: 'border-box',
};

function Login({ onClose, switchToSignup }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      onClose();
    } catch (err) { /* handled by context */ }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#1E1912', padding: '48px 40px', borderRadius: 24, width: 420, maxWidth: '92vw', position: 'relative', border: '1px solid rgba(196,151,59,0.12)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', animation: 'scaleIn 0.3s ease' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 600, background: 'linear-gradient(135deg, #D4A853, #C4973B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>K-Scents</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: 8, fontWeight: 500 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>Sign in to continue your fragrance journey</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(183,110,121,0.1)', color: '#B76E79', padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(183,110,121,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(196,151,59,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.target.style.borderColor = 'rgba(196,151,59,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 16, borderRadius: 12, border: 'none', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? 'rgba(139,105,20,0.3)' : 'linear-gradient(135deg, #8B6914, #D4A853)',
            color: loading ? 'var(--text-muted)' : '#0D0B08', transition: 'all 0.3s', marginBottom: 20,
            boxShadow: loading ? 'none' : '0 8px 24px rgba(139,105,20,0.3)',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Don't have an account?{' '}
          <button onClick={switchToSignup} style={{ background: 'none', border: 'none', color: '#D4A853', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'underline' }}>
            Create one
          </button>
        </p>
      </div>
      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}

export default Login;