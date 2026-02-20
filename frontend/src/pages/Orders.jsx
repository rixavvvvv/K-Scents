import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';

function Orders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, paddingTop: 100 }}>
        <div style={{ fontSize: 48 }}>📦</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Sign in to view your orders</h2>
      </div>
    );
  }

  const statusColors = {
    pending: { bg: 'rgba(212,168,83,0.1)', color: '#D4A853', border: 'rgba(212,168,83,0.2)' },
    processing: { bg: 'rgba(100,149,237,0.1)', color: '#6495ED', border: 'rgba(100,149,237,0.2)' },
    shipped: { bg: 'rgba(100,149,237,0.15)', color: '#6495ED', border: 'rgba(100,149,237,0.3)' },
    delivered: { bg: 'rgba(76,175,80,0.1)', color: '#4CAF50', border: 'rgba(76,175,80,0.2)' },
    cancelled: { bg: 'rgba(183,110,121,0.1)', color: '#B76E79', border: 'rgba(183,110,121,0.2)' },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--font-accent)', color: '#D4A853', fontSize: '0.85rem', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Order History</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 600, color: 'var(--text-primary)' }}>My Orders</h1>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 120, background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(139,105,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(196,151,59,0.15)' }}>
              <span style={{ fontSize: 32 }}>📦</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: 8 }}>No orders yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Start exploring our collection of handcrafted attars</p>
            <Link to="/products" style={{ display: 'inline-block', padding: '12px 32px', background: 'linear-gradient(135deg, #8B6914, #D4A853)', color: '#0D0B08', borderRadius: 50, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              Browse Collection
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => {
              const sc = statusColors[order.status] || statusColors.pending;
              return (
                <div key={order._id} style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', padding: 24, transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Order #{order._id?.slice(-8).toUpperCase()}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <span style={{ padding: '6px 16px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
                    {order.items?.slice(0, 4).map((item, idx) => (
                      <div key={idx} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(30,25,18,0.5)', borderRadius: 12, padding: '8px 14px 8px 8px', border: '1px solid var(--border-color)' }}>
                        <img src={item.product?.image || item.image || 'https://images.unsplash.com/photo-1594035910387-fea081ac66e0?w=100'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block' }}>{item.product?.name || item.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>×{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 4 && <span style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>+{order.items.length - 4} more</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', color: '#D4A853', fontSize: '1.1rem', fontWeight: 600 }}>
                      ₹{(order.totalAmount || order.total)?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
