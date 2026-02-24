import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
    pending: { bg: 'rgba(212,175,55,0.08)', color: '#d4af37', border: 'rgba(212,175,55,0.15)' },
    processing: { bg: 'rgba(123,111,197,0.08)', color: '#9B8FD8', border: 'rgba(123,111,197,0.15)' },
    shipped: { bg: 'rgba(100,160,220,0.08)', color: '#64A0DC', border: 'rgba(100,160,220,0.15)' },
    delivered: { bg: 'rgba(107,155,107,0.08)', color: '#6B9B6B', border: 'rgba(107,155,107,0.15)' },
    cancelled: { bg: 'rgba(220,100,120,0.08)', color: '#dc6478', border: 'rgba(220,100,120,0.15)' },
};

function Orders() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) return;
        (async () => {
            try {
                const data = await ordersAPI.getMyOrders();
                setOrders(Array.isArray(data) ? data : data.orders || []);
            } catch (err) {
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        })();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, paddingTop: 100 }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Please sign in to view orders</h2>
            </div>
        );
    }

    const glassCard = {
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', padding: 24,
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 600, color: 'var(--text-primary)' }}>My Orders</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>Track your fragrance journey</p>
                </motion.div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} style={{ ...glassCard, height: 120, animation: 'pulse 1.5s ease-in-out infinite' }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.05)' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ width: '40%', height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }} />
                                        <div style={{ width: '60%', height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <p style={{ color: '#dc6478', fontSize: '0.95rem' }}>{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📦</div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: 8 }}>No Orders Yet</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>Your order history will appear here</p>
                        <Link to="/products" style={{ color: '#d4af37', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
                            Discover Fragrances →
                        </Link>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {orders.map((order, index) => {
                                const st = statusColors[order.status || order.orderStatus || 'pending'] || statusColors.pending;
                                return (
                                    <motion.div key={order._id} style={glassCard}
                                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.06 }}
                                        whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <div>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Order</span>
                                                <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>#{order._id?.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <span style={{
                                                padding: '6px 16px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
                                                background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                                            }}>
                                                {order.status || order.orderStatus || 'pending'}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                                            {(order.items || order.orderItems || []).slice(0, 4).map((item, i) => (
                                                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '8px 14px 8px 8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <img src={item.image || item.product?.image || 'https://images.unsplash.com/photo-1594035910387-fea081ac66e0?w=80'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                                    <div>
                                                        <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 500, display: 'block', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name || item.product?.name}</span>
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>×{item.quantity}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {(order.items || order.orderItems || []).length > 4 && (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center' }}>+{(order.items || order.orderItems).length - 4} more</span>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                            </span>
                                            <span style={{ color: '#d4af37', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.05rem' }}>
                                                ₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

export default Orders;
