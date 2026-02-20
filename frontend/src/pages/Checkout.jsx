import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';

function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: address, 2: review, 3: confirm
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '',
  });
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [error, setError] = useState('');

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, paddingTop: 100 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Please sign in to checkout</h2>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(76,175,80,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(76,175,80,0.3)' }}>
            <span style={{ fontSize: 36 }}>✓</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.8rem', marginBottom: 12 }}>Order Placed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.6 }}>Thank you for your purchase. Your handcrafted attars will be prepared with care.</p>
          <p style={{ color: '#D4A853', fontSize: '0.85rem', marginBottom: 32 }}>Order ID: #{orderPlaced?.slice(-8).toUpperCase()}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => navigate('/orders')} style={{ padding: '12px 28px', borderRadius: 50, background: 'linear-gradient(135deg, #8B6914, #D4A853)', color: '#0D0B08', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
              View Orders
            </button>
            <button onClick={() => navigate('/products')} style={{ padding: '12px 28px', borderRadius: 50, background: 'none', border: '1px solid rgba(196,151,59,0.3)', color: '#D4A853', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0,
          image: item.image,
        })),
        shippingAddress: address,
        totalAmount: total,
        paymentMethod: 'cod',
      };
      const result = await ordersAPI.create(orderData);
      setOrderPlaced(result._id || result.order?._id || 'confirmed');
      clearCart();
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', background: 'rgba(30,25,18,0.5)',
    border: '1px solid var(--border-color)', borderRadius: 12,
    color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'var(--font-body)', transition: 'border-color 0.3s', boxSizing: 'border-box',
  };

  const isAddressValid = address.fullName && address.phone && address.street && address.city && address.state && address.pincode;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 600, color: 'var(--text-primary)' }}>Checkout</h1>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 40 }}>
          {['Shipping', 'Review', 'Confirm'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 600,
                background: step > i + 1 ? 'rgba(76,175,80,0.2)' : step === i + 1 ? 'linear-gradient(135deg, #8B6914, #D4A853)' : 'rgba(30,25,18,0.5)',
                color: step > i + 1 ? '#4CAF50' : step === i + 1 ? '#0D0B08' : 'var(--text-muted)',
                border: step > i + 1 ? '1px solid rgba(76,175,80,0.3)' : step === i + 1 ? 'none' : '1px solid var(--border-color)',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ color: step >= i + 1 ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.85rem', marginRight: 20 }}>{s}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(183,110,121,0.1)', color: '#B76E79', padding: '12px 20px', borderRadius: 12, marginBottom: 24, fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(183,110,121,0.2)' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Main Content */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', padding: 32 }}>
            {step === 1 && (
              <>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: 24 }}>Shipping Address</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Full Name *</label>
                    <input type="text" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Phone Number *</label>
                    <input type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Street Address *</label>
                    <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>City *</label>
                    <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>State *</label>
                    <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Pincode *</label>
                    <input type="text" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} style={inputStyle} />
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!isAddressValid}
                  style={{ marginTop: 28, padding: '14px 36px', borderRadius: 12, border: 'none', fontSize: '0.95rem', fontWeight: 600, cursor: isAddressValid ? 'pointer' : 'not-allowed', background: isAddressValid ? 'linear-gradient(135deg, #8B6914, #D4A853)' : 'rgba(139,105,20,0.2)', color: isAddressValid ? '#0D0B08' : 'var(--text-muted)', transition: 'all 0.3s' }}>
                  Continue to Review
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: 24 }}>Review Order</h2>
                <div style={{ marginBottom: 24, padding: 16, background: 'rgba(30,25,18,0.5)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#D4A853', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 8 }}>Shipping to</span>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {address.fullName}<br/>{address.street}<br/>{address.city}, {address.state} - {address.pincode}<br/>Phone: {address.phone}
                  </p>
                  <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#D4A853', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, marginTop: 8, textDecoration: 'underline' }}>Edit</button>
                </div>

                {items.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: idx < items.length - 1 ? '1px solid var(--border-color)' : 'none', alignItems: 'center' }}>
                    <img src={item.image || 'https://images.unsplash.com/photo-1594035910387-fea081ac66e0?w=100'} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Qty: {item.quantity}</span>
                    </div>
                    <span style={{ color: '#D4A853', fontWeight: 600 }}>₹{((typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0) * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                  <button onClick={() => setStep(1)} style={{ padding: '14px 28px', borderRadius: 12, background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Back
                  </button>
                  <button onClick={() => setStep(3)} style={{ padding: '14px 36px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #8B6914, #D4A853)', color: '#0D0B08', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 }}>
                    Proceed to Payment
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: 24 }}>Payment Method</h2>
                <div style={{ padding: 20, background: 'rgba(139,105,20,0.08)', borderRadius: 14, border: '1px solid rgba(196,151,59,0.2)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4A853' }} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>Cash on Delivery</span>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pay when your order arrives</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 28, lineHeight: 1.5 }}>
                  Online payment (UPI, Cards, Net Banking) coming soon. Currently, we accept Cash on Delivery only.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(2)} style={{ padding: '14px 28px', borderRadius: 12, background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={placing}
                    style={{ flex: 1, padding: '16px', borderRadius: 12, border: 'none', fontSize: '1rem', fontWeight: 600, cursor: placing ? 'not-allowed' : 'pointer', background: placing ? 'rgba(139,105,20,0.3)' : 'linear-gradient(135deg, #8B6914, #D4A853)', color: placing ? 'var(--text-muted)' : '#0D0B08', transition: 'all 0.3s', boxShadow: placing ? 'none' : '0 8px 24px rgba(139,105,20,0.3)' }}>
                    {placing ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Summary sidebar */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', padding: 24, position: 'sticky', top: 120 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border-color)' }}>
              Summary ({items.length} item{items.length !== 1 ? 's' : ''})
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ color: 'var(--text-primary)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ color: shipping === 0 ? '#4CAF50' : 'var(--text-primary)' }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid var(--border-color)', marginTop: 10 }}>
              <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-heading)', color: '#D4A853', fontWeight: 600, fontSize: '1.15rem' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
