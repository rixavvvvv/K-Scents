import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  const cs = {
    page: { minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 120, paddingBottom: 80 },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 40px' },
    header: { textAlign: 'center', marginBottom: 48 },
    title: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 },
    sub: { color: 'var(--text-muted)', fontSize: '0.95rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' },
    card: { background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', padding: 32, overflow: 'hidden' },
  };

  if (items.length === 0) {
    return (
      <div style={cs.page}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(139,105,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', border: '1px solid rgba(196,151,59,0.15)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.5 }}>Explore our handcrafted attar collection and find the perfect fragrance for you.</p>
          <Link to="/products" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, #8B6914, #D4A853)', color: '#0D0B08', borderRadius: 50, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.3s', boxShadow: '0 8px 24px rgba(139,105,20,0.3)' }}>
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={cs.page}>
      <div style={cs.container}>
        <div style={cs.header}>
          <p style={{ fontFamily: 'var(--font-accent)', color: '#D4A853', fontSize: '0.85rem', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Your Selection</p>
          <h1 style={cs.title}>Shopping Cart</h1>
          <p style={cs.sub}>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div style={cs.grid}>
          {/* Items */}
          <div style={cs.card}>
            {items.map((item, idx) => (
              <div key={item.id} style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: idx < items.length - 1 ? '1px solid var(--border-color)' : 'none', alignItems: 'center' }}>
                <img src={item.image || 'https://images.unsplash.com/photo-1594035910387-fea081ac66e0?w=200'} alt={item.name}
                  style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 16, border: '1px solid var(--border-color)' }}
                  onClick={() => navigate(`/products/${item.id}`)}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 4, cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${item.id}`)}>
                    {item.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</p>
                  <span style={{ fontFamily: 'var(--font-heading)', color: '#D4A853', fontWeight: 600, fontSize: '1rem' }}>₹{(typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(30,25,18,0.5)', borderRadius: 10, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 36, height: 36, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1rem', cursor: 'pointer' }}>−</button>
                  <span style={{ width: 36, textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 36, height: 36, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1rem', cursor: 'pointer' }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background 0.2s', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(183,110,121,0.1)'; e.currentTarget.style.color = '#B76E79'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
              <Link to="/products" style={{ color: '#D4A853', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} style={{ background: 'none', border: '1px solid rgba(183,110,121,0.3)', color: '#B76E79', padding: '8px 20px', borderRadius: 50, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(183,110,121,0.1)'; e.target.style.borderColor = 'rgba(183,110,121,0.5)'; }}
                onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.borderColor = 'rgba(183,110,121,0.3)'; }}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div style={{ ...cs.card, position: 'sticky', top: 120 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              Order Summary
            </h2>

            {/* Coupon */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                  style={{ flex: 1, padding: '10px 16px', background: 'rgba(30,25,18,0.5)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', fontFamily: 'var(--font-body)' }} />
                <button onClick={() => { if (!couponCode.trim()) return; setCouponMsg({ type: 'info', text: 'Coupon validation coming soon' }); }}
                  style={{ padding: '10px 18px', background: 'rgba(139,105,20,0.1)', border: '1px solid rgba(196,151,59,0.2)', borderRadius: 10, color: '#D4A853', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  Apply
                </button>
              </div>
              {couponMsg && <p style={{ fontSize: '0.8rem', marginTop: 8, color: couponMsg.type === 'error' ? '#B76E79' : '#D4A853' }}>{couponMsg.text}</p>}
            </div>

            {/* Lines */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ color: shipping === 0 ? '#4CAF50' : 'var(--text-primary)', fontWeight: 500 }}>
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Free shipping on orders above ₹500
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--border-color)', marginBottom: 24 }}>
              <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-heading)', color: '#D4A853', fontSize: '1.3rem', fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button onClick={() => navigate('/checkout')} style={{
              width: '100%', padding: '16px', borderRadius: 14, border: 'none', fontSize: '1rem', fontWeight: 600,
              background: 'linear-gradient(135deg, #8B6914, #D4A853)', color: '#0D0B08', cursor: 'pointer',
              transition: 'all 0.3s', boxShadow: '0 8px 24px rgba(139,105,20,0.3)', letterSpacing: 0.5,
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 32px rgba(139,105,20,0.4)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 24px rgba(139,105,20,0.3)'; }}>
              Proceed to Checkout
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
              {['🔒 Secure', '🌿 Natural', '↩️ Returns'].map((t, i) => (
                <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;