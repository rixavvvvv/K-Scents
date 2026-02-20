import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 120, padding: '120px 40px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          <div style={{ height: 500, borderRadius: 24, background: 'linear-gradient(90deg, #1A1510 25%, #2A2218 50%, #1A1510 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div>
            <div style={{ height: 32, width: '60%', borderRadius: 12, background: '#1A1510', marginBottom: 16, animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 20, width: '40%', borderRadius: 8, background: '#1A1510', marginBottom: 32, animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 16, width: '100%', borderRadius: 8, background: '#1A1510', marginBottom: 12, animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 16, width: '90%', borderRadius: 8, background: '#1A1510', marginBottom: 12, animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 16, width: '70%', borderRadius: 8, background: '#1A1510', animation: 'shimmer 1.5s infinite' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: '4rem' }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Product not found</h2>
        <p style={{ color: 'var(--text-muted)' }}>This fragrance may have been removed or the link is incorrect.</p>
        <button onClick={() => navigate('/products')} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #8B6914, #D4A853)', color: '#0D0B08', border: 'none', borderRadius: 50, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
          Browse Collection
        </button>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const stars = product.ratings?.average || 0;
  const reviewCount = product.ratings?.count || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 100 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 40px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Collection</Link>
          <span>›</span>
          <span style={{ color: '#D4A853' }}>{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 40px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
        {/* Image */}
        <div style={{ position: 'sticky', top: 120 }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', background: '#1A1510', border: '1px solid var(--border-color)', position: 'relative' }}>
            <img
              src={product.image || 'https://images.unsplash.com/photo-1594035910387-fea081ac66e0?w=800'}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
            />
            {!imgLoaded && <div style={{ position: 'absolute', inset: 0, background: '#1A1510', animation: 'shimmer 1.5s infinite' }} />}
            {!inStock && (
              <div style={{ position: 'absolute', top: 20, left: 20, padding: '8px 20px', borderRadius: 50, background: 'rgba(139,105,20,0.9)', color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                Sold Out
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span style={{ fontSize: '0.75rem', color: '#D4A853', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 600, marginBottom: 12, display: 'block' }}>
              {product.category}
            </span>
          )}

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Rating */}
          {stars > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: '#D4A853', fontSize: '1rem', opacity: s <= Math.round(stars) ? 1 : 0.3 }}>★</span>)}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stars.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 600, color: '#D4A853' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span style={{ padding: '4px 12px', borderRadius: 50, background: 'rgba(183,110,121,0.15)', color: '#B76E79', fontSize: '0.8rem', fontWeight: 600 }}>
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}>
            {product.description}
          </p>

          {/* Fragrance Notes (if available) */}
          {product.fragrance_notes && (
            <div style={{ marginBottom: 28, padding: 24, background: 'rgba(30,25,18,0.5)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: 16 }}>Fragrance Notes</h3>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {product.fragrance_notes.top?.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#D4A853', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 6 }}>Top</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {product.fragrance_notes.top.map((n, i) => <span key={i} style={{ padding: '4px 12px', borderRadius: 50, background: 'rgba(212,168,83,0.1)', color: '#D4A853', fontSize: '0.8rem', border: '1px solid rgba(212,168,83,0.2)' }}>{n}</span>)}
                    </div>
                  </div>
                )}
                {product.fragrance_notes.middle?.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#B76E79', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 6 }}>Heart</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {product.fragrance_notes.middle.map((n, i) => <span key={i} style={{ padding: '4px 12px', borderRadius: 50, background: 'rgba(183,110,121,0.1)', color: '#B76E79', fontSize: '0.8rem', border: '1px solid rgba(183,110,121,0.2)' }}>{n}</span>)}
                    </div>
                  </div>
                )}
                {product.fragrance_notes.base?.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 6 }}>Base</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {product.fragrance_notes.base.map((n, i) => <span key={i} style={{ padding: '4px 12px', borderRadius: 50, background: 'rgba(184,169,143,0.1)', color: 'var(--text-secondary)', fontSize: '0.8rem', border: '1px solid rgba(184,169,143,0.2)' }}>{n}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stock */}
          <div style={{ marginBottom: 24 }}>
            {inStock ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }} />
                <span style={{ color: '#4CAF50', fontSize: '0.9rem', fontWeight: 500 }}>
                  In Stock {product.stock <= 10 && `— Only ${product.stock} left`}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B76E79' }} />
                <span style={{ color: '#B76E79', fontSize: '0.9rem', fontWeight: 500 }}>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 44, height: 44, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.target.style.background = 'rgba(212,168,83,0.1)'}
                onMouseLeave={e => e.target.style.background = 'none'}>−</button>
              <span style={{ width: 50, textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} style={{ width: 44, height: 44, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.target.style.background = 'rgba(212,168,83,0.1)'}
                onMouseLeave={e => e.target.style.background = 'none'}>+</button>
            </div>

            <button onClick={handleAddToCart} disabled={!inStock} style={{
              flex: 1, padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: '1rem', fontWeight: 600, cursor: inStock ? 'pointer' : 'not-allowed',
              background: added ? 'rgba(76,175,80,0.2)' : inStock ? 'linear-gradient(135deg, #8B6914, #D4A853)' : 'rgba(30,25,18,0.5)',
              color: added ? '#4CAF50' : inStock ? '#0D0B08' : 'var(--text-muted)',
              transition: 'all 0.3s ease', boxShadow: inStock && !added ? '0 8px 24px rgba(139,105,20,0.3)' : 'none',
              border: added ? '1px solid rgba(76,175,80,0.3)' : '1px solid transparent',
            }}>
              {added ? '✓ Added to Cart' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 20, background: 'rgba(30,25,18,0.3)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
            {[
              { icon: '🌿', text: '100% Natural' },
              { icon: '🚚', text: 'Free Shipping 500+' },
              { icon: '↩️', text: '7-Day Returns' },
            ].map((badge, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{badge.icon}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{badge.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;