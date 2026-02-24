import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, paddingTop: 100 }}>
        <div style={{ fontSize: 48 }}>👤</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Sign in to view your profile</h2>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: editing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${editing ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12,
    color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'var(--font-body)', transition: 'all 0.3s', boxSizing: 'border-box',
  };

  const glassCard = {
    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', padding: 32,
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 40px' }}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #a79fd1, #d4af37)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem', color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 600, boxShadow: '0 8px 24px rgba(212,175,55,0.2)' }}>
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{user?.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
          {user?.membershipTier && (
            <span style={{ display: 'inline-block', marginTop: 8, padding: '4px 16px', borderRadius: 50, background: 'rgba(155,143,216,0.08)', color: '#9B8FD8', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(155,143,216,0.15)', textTransform: 'capitalize' }}>
              {user.membershipTier} Member
            </span>
          )}
        </motion.div>

        {message && (
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            style={{
              padding: '12px 20px', borderRadius: 12, marginBottom: 24, fontSize: '0.85rem', textAlign: 'center',
              background: message.type === 'success' ? 'rgba(107,155,107,0.12)' : 'rgba(183,110,121,0.12)',
              color: message.type === 'success' ? '#6B9B6B' : '#dc6478',
              border: `1px solid ${message.type === 'success' ? 'rgba(107,155,107,0.25)' : 'rgba(220,100,120,0.25)'}`
            }}>
            {message.text}
          </motion.div>
        )}

        <motion.div style={glassCard} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Personal Information</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} style={{ padding: '8px 20px', borderRadius: 50, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.3s' }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.04)'}>
                Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setEditing(false); setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }); }}
                  style={{ padding: '8px 20px', borderRadius: 50, background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: '8px 20px', borderRadius: 50, background: 'linear-gradient(135deg, #d4af37, #e8c44a)', border: 'none', color: '#0a0a14', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!editing} style={inputStyle}
                onFocus={e => { if (editing) e.target.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                onBlur={e => e.target.style.borderColor = editing ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</label>
              <input type="email" value={formData.email} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>Phone Number</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} disabled={!editing} placeholder="Add phone number" style={inputStyle}
                onFocus={e => { if (editing) e.target.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                onBlur={e => e.target.style.borderColor = editing ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'} />
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
          {[
            { to: '/orders', icon: '📦', label: 'My Orders' },
            { to: '/wishlist', icon: '♡', label: 'Wishlist' },
            { to: '/cart', icon: '🛒', label: 'Cart' },
          ].map(link => (
            <a key={link.to} href={link.to} style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: '20px 16px', textAlign: 'center', textDecoration: 'none', transition: 'all 0.3s', display: 'block' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{link.icon}</div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{link.label}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
