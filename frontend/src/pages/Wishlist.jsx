import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { wishlistAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

function Wishlist() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistAPI.get();
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      await wishlistAPI.remove(productId);
      setItems(prev => prev.filter(item => (item._id || item.product?._id) !== productId));
    } catch (err) {
      console.error('Error removing:', err);
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, paddingTop: 100 }}>
        <div style={{ fontSize: 48 }}>💜</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Sign in to view your wishlist</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 400, textAlign: 'center' }}>Create an account to save your favourite fragrances.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--font-accent)', color: '#d4af37', fontSize: '0.85rem', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Saved Items</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 600, color: 'var(--text-primary)' }}>My Wishlist</h1>
        </motion.div>

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', borderRadius: 20, height: 360, border: '1px solid rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 32 }}>♡</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: 8 }}>No saved items yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Browse our collection and save your favourite fragrances</p>
            <Link to="/products" style={{ display: 'inline-block', padding: '12px 32px', background: 'linear-gradient(135deg, #d4af37, #e8c44a)', color: '#0a0a14', borderRadius: 50, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              Explore Collection
            </Link>
          </motion.div>
        )}

        {!loading && items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            <AnimatePresence>
              {items.map((item, idx) => {
                const product = item.product || item;
                return (
                  <motion.div key={product._id} layout initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s' }}>
                    <div style={{ position: 'relative', height: 220, background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }} onClick={() => navigate(`/products/${product._id}`)}>
                      <img src={product.image || 'https://images.unsplash.com/photo-1594035910387-fea081ac66e0?w=400'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={(e) => { e.stopPropagation(); handleRemove(product._id); }} disabled={removing === product._id}
                        style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(220,100,120,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', color: '#dc6478', fontSize: 16, transition: 'all 0.3s' }}>
                        ✕
                      </button>
                    </div>
                    <div style={{ padding: 20 }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 8, cursor: 'pointer' }} onClick={() => navigate(`/products/${product._id}`)}>
                        {product.name}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', color: '#d4af37', fontSize: '1.1rem', fontWeight: 600 }}>₹{product.price?.toLocaleString('en-IN')}</span>
                        <button onClick={() => handleAddToCart(product)} style={{ padding: '8px 20px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg, #d4af37, #e8c44a)', color: '#0a0a14', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
