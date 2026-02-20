import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, ordersAPI, authAPI } from '../services/api';

/* ───────── colour helpers ───────── */
const statusColor = (s) => {
  const map = {
    pending: '#D4A853', processing: '#5B9BD5', shipped: '#6C9BCF',
    delivered: '#6B9B6B', cancelled: '#B76E79',
    active: '#6B9B6B', 'low stock': '#D4A853', 'out of stock': '#B76E79',
  };
  return map[(s || '').toLowerCase()] || '#94a3b8';
};

/* ───────── tiny reusable badge ───────── */
const Badge = ({ status }) => {
  const c = statusColor(status);
  return (
    <span style={{
      padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: `${c}18`, color: c, border: `1px solid ${c}40`,
      textTransform: 'capitalize', letterSpacing: '.3px',
    }}>{status}</span>
  );
};

/* ===================================================================== */
function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  /* ── data state ── */
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  /* ── product form state ── */
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: 'perfumes',
    image: '', stock: '', brand: 'K-Scents', discount_percentage: 0,
  });

  /* ── order detail modal ── */
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ───────── flash message helper ───────── */
  const flash = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3500);
  }, []);

  /* ───────── data fetching ───────── */
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        ordersAPI.getAll({ limit: 100 }),
        authAPI.getAllUsers({ limit: 100 }),
      ]);
      setProducts(prodRes.products || prodRes || []);
      setOrders(orderRes.orders || []);
      setCustomers(userRes.users || []);
      if (orderRes.stats) setStats(orderRes.stats);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      flash(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [flash]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  /* redirect non-admin */
  useEffect(() => { if (user && !user.isAdmin) navigate('/'); }, [user, navigate]);

  /* ───────── PRODUCT CRUD ───────── */
  const openProductForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name, description: product.description || '',
        price: product.price, category: product.category,
        image: product.image || '', stock: product.stock ?? '',
        brand: product.brand || 'K-Scents',
        discount_percentage: product.discount_percentage || 0,
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', category: 'perfumes', image: '', stock: '', brand: 'K-Scents', discount_percentage: 0 });
    }
    setShowProductForm(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock), discount_percentage: Number(productForm.discount_percentage) };
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, payload);
        flash('Product updated successfully');
      } else {
        await productsAPI.create(payload);
        flash('Product created successfully');
      }
      setShowProductForm(false);
      fetchDashboard();
    } catch (err) {
      flash(err.message || 'Failed to save product', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      flash('Product deleted');
      fetchDashboard();
    } catch (err) {
      flash(err.message || 'Failed to delete product', 'error');
    }
  };

  /* ───────── ORDER STATUS UPDATE ───────── */
  const updateOrderStatus = async (id, newStatus) => {
    try {
      await ordersAPI.updateStatus(id, newStatus);
      flash(`Order status updated to ${newStatus}`);
      fetchDashboard();
    } catch (err) {
      flash(err.message || 'Failed to update status', 'error');
    }
  };

  /* ───────── filtered lists ───────── */
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOrders = orders.filter(o =>
    o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const totalCustomers = customers.length;

  /* ───────── stat cards data ───────── */
  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '◆', accent: '#D4A853' },
    { label: 'Total Orders', value: stats.totalOrders || orders.length, icon: '◈', accent: '#C4973B' },
    { label: 'Products', value: totalProducts, icon: '❖', accent: '#8B6914' },
    { label: 'Customers', value: totalCustomers, icon: '✦', accent: '#B76E79' },
  ];

  /* ================= STYLES ================= */
  const S = {
    page: { minHeight: '100vh', background: '#0D0B08', fontFamily: "'Inter', sans-serif", color: '#F5F0E8', padding: '100px 24px 40px' },
    wrapper: { maxWidth: 1280, margin: '0 auto' },
    header: { background: 'rgba(30,25,18,.55)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,168,83,.12)', borderRadius: 20, padding: '32px 36px', marginBottom: 28 },
    title: { fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", background: 'linear-gradient(135deg,#D4A853,#8B6914)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 6px' },
    subtitle: { color: '#A69474', fontSize: 14, margin: 0 },
    tabs: { display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' },
    tab: (active) => ({
      padding: '10px 22px', borderRadius: 10, border: active ? '1px solid #D4A853' : '1px solid rgba(212,168,83,.15)',
      background: active ? 'linear-gradient(135deg,#8B6914,#D4A853)' : 'rgba(30,25,18,.5)',
      color: active ? '#0D0B08' : '#A69474', cursor: 'pointer', fontSize: 13, fontWeight: 600,
      transition: 'all .25s', letterSpacing: '.4px',
    }),
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18, marginBottom: 28 },
    statCard: (accent) => ({
      background: 'rgba(30,25,18,.55)', backdropFilter: 'blur(20px)', border: `1px solid ${accent}25`,
      borderRadius: 16, padding: '24px 28px', transition: 'all .3s',
    }),
    card: { background: 'rgba(30,25,18,.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,168,83,.1)', borderRadius: 16, padding: 28, marginBottom: 22 },
    searchBar: {
      width: '100%', maxWidth: 380, padding: '11px 18px', background: 'rgba(30,25,18,.6)',
      border: '1px solid rgba(212,168,83,.18)', borderRadius: 10, color: '#F5F0E8', fontSize: 13,
    },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: 16 },
    th: { padding: '14px 16px', textAlign: 'left', borderBottom: '1px solid rgba(212,168,83,.12)', fontWeight: 600, fontSize: 12, color: '#A69474', letterSpacing: '.5px', textTransform: 'uppercase' },
    td: { padding: '14px 16px', borderBottom: '1px solid rgba(212,168,83,.06)', fontSize: 13 },
    btnPrimary: { padding: '10px 22px', background: 'linear-gradient(135deg,#8B6914,#D4A853)', border: 'none', borderRadius: 10, color: '#0D0B08', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all .25s' },
    btnDanger: { padding: '8px 16px', background: 'rgba(183,110,121,.15)', border: '1px solid rgba(183,110,121,.3)', borderRadius: 8, color: '#B76E79', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all .25s' },
    btnGhost: { padding: '8px 16px', background: 'rgba(212,168,83,.08)', border: '1px solid rgba(212,168,83,.2)', borderRadius: 8, color: '#D4A853', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all .25s' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: '#1E1912', border: '1px solid rgba(212,168,83,.15)', borderRadius: 20, padding: 36, width: '90%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto' },
    input: { width: '100%', padding: '11px 14px', background: 'rgba(30,25,18,.7)', border: '1px solid rgba(212,168,83,.18)', borderRadius: 8, color: '#F5F0E8', fontSize: 13, boxSizing: 'border-box' },
    select: { width: '100%', padding: '11px 14px', background: '#1A1610', border: '1px solid rgba(212,168,83,.18)', borderRadius: 8, color: '#F5F0E8', fontSize: 13, boxSizing: 'border-box' },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#A69474', marginBottom: 6, letterSpacing: '.4px' },
    formGroup: { marginBottom: 18 },
    messageBar: (type) => ({
      position: 'fixed', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 2000,
      padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600, animation: 'fadeInUp .3s',
      background: type === 'error' ? 'rgba(183,110,121,.9)' : 'rgba(139,105,20,.9)',
      color: '#FFF', border: type === 'error' ? '1px solid #B76E79' : '1px solid #D4A853',
    }),
  };

  /* ───────── skeleton loader ───────── */
  const Skeleton = () => (
    <div style={{ ...S.statsGrid }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ ...S.statCard('#D4A853'), height: 110, background: 'rgba(30,25,18,.4)' }}>
          <div style={{ width: '60%', height: 14, background: 'rgba(212,168,83,.08)', borderRadius: 6, marginBottom: 12 }} />
          <div style={{ width: '40%', height: 28, background: 'rgba(212,168,83,.08)', borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );

  /* ================================================================= */
  return (
    <div style={S.page}>
      <div style={S.wrapper}>
        {/* Flash messages */}
        {message.text && <div style={S.messageBar(message.type)}>{message.text}</div>}

        {/* ───── HEADER ───── */}
        <div style={S.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={S.title}>Admin Dashboard</h1>
              <p style={S.subtitle}>Manage your K-Scents heritage store</p>
            </div>
            <Link to="/" style={{ ...S.btnGhost, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px' }}>
              ← Back to Store
            </Link>
          </div>
          <div style={S.tabs}>
            {['overview', 'products', 'orders', 'customers'].map(tab => (
              <button key={tab} style={S.tab(activeTab === tab)} onClick={() => { setActiveTab(tab); setSearchTerm(''); }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ───── LOADING ───── */}
        {loading && <Skeleton />}

        {/* ═══════════════════ OVERVIEW ═══════════════════ */}
        {!loading && activeTab === 'overview' && (
          <>
            <div style={S.statsGrid}>
              {statCards.map((s, i) => (
                <div key={i} style={S.statCard(s.accent)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#A69474', fontSize: 12, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.label}</p>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, fontFamily: "'Playfair Display',serif" }}>{s.value}</h3>
                    </div>
                    <span style={{ fontSize: 28, color: s.accent, opacity: .45 }}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 28 }}>
              <div style={{ ...S.card, padding: '18px 22px', textAlign: 'center' }}>
                <p style={{ color: '#D4A853', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>{stats.pendingOrders || 0}</p>
                <p style={{ color: '#A69474', fontSize: 12, margin: 0, textTransform: 'uppercase', letterSpacing: '.4px' }}>Pending Orders</p>
              </div>
              <div style={{ ...S.card, padding: '18px 22px', textAlign: 'center' }}>
                <p style={{ color: '#6B9B6B', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>{stats.completedOrders || 0}</p>
                <p style={{ color: '#A69474', fontSize: 12, margin: 0, textTransform: 'uppercase', letterSpacing: '.4px' }}>Completed</p>
              </div>
              <div style={{ ...S.card, padding: '18px 22px', textAlign: 'center' }}>
                <p style={{ color: '#B76E79', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
                  {products.filter(p => (p.stock || 0) <= 5 && (p.stock || 0) > 0).length}
                </p>
                <p style={{ color: '#A69474', fontSize: 12, margin: 0, textTransform: 'uppercase', letterSpacing: '.4px' }}>Low Stock Items</p>
              </div>
            </div>

            {/* Recent orders */}
            <div style={S.card}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 16px', fontFamily: "'Playfair Display',serif" }}>Recent Orders</h2>
              {orders.length === 0 ? (
                <p style={{ color: '#A69474', fontSize: 14 }}>No orders yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Order ID</th>
                        <th style={S.th}>Customer</th>
                        <th style={S.th}>Items</th>
                        <th style={S.th}>Total</th>
                        <th style={S.th}>Status</th>
                        <th style={S.th}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 8).map(o => (
                        <tr key={o._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(o)}>
                          <td style={S.td}>#{o._id?.slice(-6)}</td>
                          <td style={S.td}>{o.user?.name || 'N/A'}</td>
                          <td style={S.td}>{o.items?.length || 0}</td>
                          <td style={S.td}>₹{(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                          <td style={S.td}><Badge status={o.status} /></td>
                          <td style={S.td}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Low stock alert */}
            {products.filter(p => (p.stock || 0) <= 5 && (p.stock || 0) > 0).length > 0 && (
              <div style={{ ...S.card, borderColor: 'rgba(183,110,121,.2)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 16px', fontFamily: "'Playfair Display',serif", color: '#B76E79' }}>⚠ Low Stock Alert</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {products.filter(p => (p.stock || 0) <= 5 && (p.stock || 0) > 0).map(p => (
                    <div key={p._id} style={{ background: 'rgba(183,110,121,.08)', border: '1px solid rgba(183,110,121,.15)', borderRadius: 10, padding: '12px 18px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: '#B76E79', margin: 0 }}>Only {p.stock} left</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════ PRODUCTS ═══════════════════ */}
        {!loading && activeTab === 'products' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, fontFamily: "'Playfair Display',serif" }}>Product Management ({filteredProducts.length})</h2>
              <button style={S.btnPrimary} onClick={() => openProductForm()}>+ Add Product</button>
            </div>

            <input type="text" placeholder="Search products…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={S.searchBar} />

            {filteredProducts.length === 0 ? (
              <p style={{ color: '#A69474', fontSize: 14, marginTop: 20 }}>No products found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Product</th>
                      <th style={S.th}>Category</th>
                      <th style={S.th}>Price</th>
                      <th style={S.th}>Stock</th>
                      <th style={S.th}>Status</th>
                      <th style={S.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => {
                      const stockStatus = (p.stock || 0) <= 0 ? 'Out of Stock' : (p.stock || 0) <= 5 ? 'Low Stock' : 'Active';
                      return (
                        <tr key={p._id}>
                          <td style={S.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#1A1610' }} onError={e => { e.target.style.display = 'none'; }} />
                              <span style={{ fontWeight: 500 }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ ...S.td, textTransform: 'capitalize' }}>{p.category}</td>
                          <td style={S.td}>
                            ₹{p.price?.toLocaleString('en-IN')}
                            {p.discount_percentage > 0 && <span style={{ color: '#6B9B6B', fontSize: 11, marginLeft: 6 }}>-{p.discount_percentage}%</span>}
                          </td>
                          <td style={S.td}>{p.stock ?? '–'}</td>
                          <td style={S.td}><Badge status={stockStatus} /></td>
                          <td style={S.td}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button style={S.btnGhost} onClick={() => openProductForm(p)}>Edit</button>
                              <button style={S.btnDanger} onClick={() => deleteProduct(p._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ ORDERS ═══════════════════ */}
        {!loading && activeTab === 'orders' && (
          <div style={S.card}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 20px', fontFamily: "'Playfair Display',serif" }}>Order Management ({filteredOrders.length})</h2>

            <input type="text" placeholder="Search by order ID or customer…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={S.searchBar} />

            {filteredOrders.length === 0 ? (
              <p style={{ color: '#A69474', fontSize: 14, marginTop: 20 }}>No orders found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Order ID</th>
                      <th style={S.th}>Customer</th>
                      <th style={S.th}>Items</th>
                      <th style={S.th}>Total</th>
                      <th style={S.th}>Status</th>
                      <th style={S.th}>Date</th>
                      <th style={S.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o._id}>
                        <td style={S.td}>#{o._id?.slice(-6)}</td>
                        <td style={S.td}>{o.user?.name || 'N/A'}<br /><span style={{ color: '#A69474', fontSize: 11 }}>{o.user?.email}</span></td>
                        <td style={S.td}>{o.items?.length || 0}</td>
                        <td style={S.td}>₹{(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td style={S.td}><Badge status={o.status} /></td>
                        <td style={S.td}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                        <td style={S.td}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <select
                              value={o.status}
                              onChange={e => updateOrderStatus(o._id, e.target.value)}
                              style={{ ...S.select, width: 'auto', padding: '6px 10px', fontSize: 12 }}
                            >
                              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                            <button style={S.btnGhost} onClick={() => setSelectedOrder(o)}>View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ CUSTOMERS ═══════════════════ */}
        {!loading && activeTab === 'customers' && (
          <div style={S.card}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 20px', fontFamily: "'Playfair Display',serif" }}>Customer Management ({filteredCustomers.length})</h2>

            <input type="text" placeholder="Search by name or email…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={S.searchBar} />

            {filteredCustomers.length === 0 ? (
              <p style={{ color: '#A69474', fontSize: 14, marginTop: 20 }}>No customers found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Customer</th>
                      <th style={S.th}>Email</th>
                      <th style={S.th}>Role</th>
                      <th style={S.th}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(c => (
                      <tr key={c._id}>
                        <td style={S.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'linear-gradient(135deg,#8B6914,#D4A853)', color: '#0D0B08', fontWeight: 700, fontSize: 14,
                            }}>
                              {c.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span style={{ fontWeight: 500 }}>{c.name}</span>
                          </div>
                        </td>
                        <td style={S.td}>{c.email}</td>
                        <td style={S.td}>
                          <Badge status={c.isAdmin ? 'admin' : 'customer'} />
                        </td>
                        <td style={S.td}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════ PRODUCT FORM MODAL ═══════ */}
        {showProductForm && (
          <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowProductForm(false)}>
            <div style={S.modal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, fontFamily: "'Playfair Display',serif" }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowProductForm(false)} style={{ background: 'none', border: 'none', color: '#A69474', cursor: 'pointer', fontSize: 22 }}>✕</button>
              </div>

              <form onSubmit={saveProduct}>
                <div style={S.formGroup}>
                  <label style={S.label}>Product Name *</label>
                  <input style={S.input} required value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Gulab Attar" />
                </div>

                <div style={S.formGroup}>
                  <label style={S.label}>Description *</label>
                  <textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} required value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description…" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={S.formGroup}>
                    <label style={S.label}>Price (₹) *</label>
                    <input style={S.input} type="number" min="0" required value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.label}>Stock *</label>
                    <input style={S.input} type="number" min="0" required value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={S.formGroup}>
                    <label style={S.label}>Category *</label>
                    <select style={S.select} value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}>
                      {['perfumes', 'candles', 'diffusers', 'soaps', 'gift-sets', 'accessories'].map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.label}>Discount %</label>
                    <input style={S.input} type="number" min="0" max="100" value={productForm.discount_percentage} onChange={e => setProductForm(f => ({ ...f, discount_percentage: e.target.value }))} />
                  </div>
                </div>

                <div style={S.formGroup}>
                  <label style={S.label}>Image URL *</label>
                  <input style={S.input} required value={productForm.image} onChange={e => setProductForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" />
                </div>

                <div style={S.formGroup}>
                  <label style={S.label}>Brand</label>
                  <input style={S.input} value={productForm.brand} onChange={e => setProductForm(f => ({ ...f, brand: e.target.value }))} />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" style={{ ...S.btnPrimary, flex: 1, padding: '13px 0' }}>
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button type="button" style={{ ...S.btnGhost, flex: .6, padding: '13px 0' }} onClick={() => setShowProductForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════ ORDER DETAIL MODAL ═══════ */}
        {selectedOrder && (
          <div style={S.overlay} onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}>
            <div style={S.modal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, fontFamily: "'Playfair Display',serif" }}>
                  Order #{selectedOrder._id?.slice(-6)}
                </h2>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#A69474', cursor: 'pointer', fontSize: 22 }}>✕</button>
              </div>

              <div style={{ marginBottom: 18 }}>
                <p style={{ color: '#A69474', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px' }}>Customer</p>
                <p style={{ fontSize: 14, margin: 0 }}>{selectedOrder.user?.name || 'N/A'} — {selectedOrder.user?.email || ''}</p>
              </div>

              <div style={{ marginBottom: 18 }}>
                <p style={{ color: '#A69474', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px' }}>Status</p>
                <Badge status={selectedOrder.status} />
              </div>

              {selectedOrder.shippingAddress && (
                <div style={{ marginBottom: 18 }}>
                  <p style={{ color: '#A69474', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px' }}>Shipping Address</p>
                  <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                    {selectedOrder.shippingAddress.fullName && <>{selectedOrder.shippingAddress.fullName}<br /></>}
                    {selectedOrder.shippingAddress.street && <>{selectedOrder.shippingAddress.street}<br /></>}
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}
                    {selectedOrder.shippingAddress.phone && <><br />Ph: {selectedOrder.shippingAddress.phone}</>}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: 18 }}>
                <p style={{ color: '#A69474', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>Items</p>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(212,168,83,.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {item.image && <img src={item.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />}
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{item.name}</p>
                        <p style={{ fontSize: 11, color: '#A69474', margin: 0 }}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid rgba(212,168,83,.15)' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#D4A853' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>

              <div style={{ marginTop: 16 }}>
                <p style={{ color: '#A69474', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>Update Status</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={selectedOrder.status}
                    onChange={e => { updateOrderStatus(selectedOrder._id, e.target.value); setSelectedOrder({ ...selectedOrder, status: e.target.value }); }}
                    style={{ ...S.select, width: 'auto', padding: '8px 14px' }}
                  >
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;