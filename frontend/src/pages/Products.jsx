import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

function Products() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [sortBy, setSortBy] = useState('featured');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedToCart, setAddedToCart] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await productsAPI.getAll();
                setProducts(res.products || res);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { id: 'all', name: 'All Attars', icon: '✦' },
        { id: 'perfumes', name: 'Pure Attars', icon: '🌹' },
        { id: 'candles', name: 'Scented Candles', icon: '🕯️' },
        { id: 'diffusers', name: 'Diffusers', icon: '🌿' },
        { id: 'soaps', name: 'Natural Soaps', icon: '🧼' },
    ];

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
            const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
            return matchCat && matchSearch && matchPrice;
        });
        switch (sortBy) {
            case 'price-low': result.sort((a, b) => a.price - b.price); break;
            case 'price-high': result.sort((a, b) => b.price - a.price); break;
            case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'rating': result.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0)); break;
            default: break;
        }
        return result;
    }, [products, selectedCategory, searchTerm, priceRange, sortBy]);

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        setSearchParams(catId === 'all' ? {} : { category: catId });
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart(product, 1);
        setAddedToCart(product._id);
        setTimeout(() => setAddedToCart(null), 1500);
    };

    const cs = {
        page: { minHeight: '100vh', paddingTop: 120, paddingBottom: 80 },
        container: { maxWidth: 1400, margin: '0 auto', padding: '0 40px' },
        header: { textAlign: 'center', marginBottom: 50 },
        title: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 },
        subtitle: { fontFamily: 'var(--font-accent)', fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 },
        searchInput: {
            width: '100%', maxWidth: 500, padding: '14px 24px 14px 48px', fontSize: '0.95rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 50, color: 'var(--text-primary)', outline: 'none',
            fontFamily: 'var(--font-body)', transition: 'all 0.3s',
            backdropFilter: 'blur(10px)',
        },
        catBtn: (active) => ({
            padding: '10px 22px', fontSize: '0.85rem',
            border: active ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: 50, cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500,
            background: active ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
            color: active ? '#d4af37' : 'var(--text-muted)',
            fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(10px)',
        }),
        sortSelect: {
            padding: '10px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer',
            fontFamily: 'var(--font-body)', outline: 'none',
            backdropFilter: 'blur(10px)',
        },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 },
        card: {
            background: 'rgba(255,255,255,0.04)', borderRadius: 20, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.4s ease',
            position: 'relative', backdropFilter: 'blur(20px)',
        },
        imgWrap: { position: 'relative', overflow: 'hidden', height: 280, background: 'rgba(255,255,255,0.02)' },
        img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' },
        cardBody: { padding: 24 },
        cardName: { fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 },
        cardDesc: { fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
        cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        price: { fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, color: '#d4af37' },
        addBtn: (added) => ({
            padding: '10px 24px', borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
            background: added ? 'rgba(107,155,107,0.15)' : 'linear-gradient(135deg, #d4af37, #e8c44a)',
            color: added ? '#6B9B6B' : '#0a0a14', transition: 'all 0.3s ease',
            ...(added ? { border: '1px solid rgba(107,155,107,0.3)' } : {}),
        }),
        rating: { display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 },
        star: { color: '#d4af37', fontSize: '0.85rem' },
        badge: { position: 'absolute', top: 16, left: 16, padding: '5px 14px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(183,110,121,0.85)', color: '#fff', backdropFilter: 'blur(8px)' },
        stockLow: { position: 'absolute', top: 16, right: 16, padding: '5px 14px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.25)', backdropFilter: 'blur(8px)' },
        emptyState: { textAlign: 'center', padding: '80px 20px' },
        skeleton: { background: 'rgba(255,255,255,0.04)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' },
        skelImg: { height: 280, background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' },
        skelLine: (w) => ({ height: 16, borderRadius: 8, margin: '12px 24px', width: w, background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }),
    };

    return (
        <div style={cs.page}>
            <div style={cs.container}>
                <motion.div style={cs.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <p style={{ fontFamily: 'var(--font-accent)', color: '#d4af37', fontSize: '0.85rem', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>
                        Our Collection
                    </p>
                    <h1 style={cs.title}>Handcrafted Attars & Fragrances</h1>
                    <p style={cs.subtitle}>
                        Every fragrance tells a story of centuries-old deg-bhapka distillation from the heart of Kannauj
                    </p>
                </motion.div>

                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: 500 }}>
                        <svg style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input type="text" placeholder="Search attars, fragrances..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={cs.searchInput}
                            onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} style={cs.catBtn(selectedCategory === cat.id)}>
                            <span>{cat.icon}</span> {cat.name}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
                    </span>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={cs.sortSelect}>
                        <option value="featured">Sort: Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name: A–Z</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>

                {loading && (
                    <div style={cs.grid}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={cs.skeleton}>
                                <div style={cs.skelImg} />
                                <div style={cs.skelLine('60%')} />
                                <div style={cs.skelLine('80%')} />
                                <div style={cs.skelLine('40%')} />
                                <div style={{ height: 24 }} />
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div style={cs.emptyState}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: 8 }}>Unable to load products</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error}</p>
                        <button onClick={() => window.location.reload()} style={{ padding: '10px 28px', borderRadius: 50, background: 'linear-gradient(135deg, #d4af37, #e8c44a)', color: '#0a0a14', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && filteredProducts.length === 0 && (
                    <div style={cs.emptyState}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: 8 }}>No fragrances found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {!loading && !error && filteredProducts.length > 0 && (
                    <div style={cs.grid}>
                        {filteredProducts.map((product, i) => (
                            <motion.div
                                key={product._id}
                                style={cs.card}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                onClick={() => navigate(`/products/${product._id}`)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
                                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)';
                                    const img = e.currentTarget.querySelector('img');
                                    if (img) img.style.transform = 'scale(1.08)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    const img = e.currentTarget.querySelector('img');
                                    if (img) img.style.transform = 'scale(1)';
                                }}
                            >
                                <div style={cs.imgWrap}>
                                    <img src={product.image || 'https://images.unsplash.com/photo-1594035910387-fea081ac66e0?w=600'} alt={product.name} style={cs.img} />
                                    {product.stock <= 5 && product.stock > 0 && <span style={cs.stockLow}>Only {product.stock} left</span>}
                                    {product.stock === 0 && <span style={{ ...cs.badge, background: 'rgba(138,127,184,0.9)' }}>Sold Out</span>}
                                    {product.isOnSale && <span style={cs.badge}>Sale</span>}
                                </div>
                                <div style={cs.cardBody}>
                                    {product.category && (
                                        <span style={{ fontSize: '0.7rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                                            {product.category}
                                        </span>
                                    )}
                                    <h3 style={cs.cardName}>{product.name}</h3>
                                    {product.ratings?.average > 0 && (
                                        <div style={cs.rating}>
                                            {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ ...cs.star, opacity: s <= Math.round(product.ratings.average) ? 1 : 0.3 }}>★</span>)}
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 4 }}>({product.ratings.count || 0})</span>
                                        </div>
                                    )}
                                    <p style={cs.cardDesc}>{product.description}</p>
                                    <div style={cs.cardFooter}>
                                        <span style={cs.price}>₹{product.price?.toLocaleString('en-IN')}</span>
                                        <button
                                            onClick={e => handleAddToCart(e, product)}
                                            disabled={product.stock === 0}
                                            style={{
                                                ...cs.addBtn(addedToCart === product._id),
                                                ...(product.stock === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                                            }}>
                                            {addedToCart === product._id ? '✓ Added' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
