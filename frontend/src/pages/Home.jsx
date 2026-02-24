import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../services/api';
import HeroScene from '../components/HeroScene';
import FloatingPetals from '../components/FloatingPetals';
import GradientCarousel from '../components/GradientCarousel';
import { WaveSection, RippleButton } from '../components/WaterEffects';

/* ─── Dark Glassmorphism Styles ─── */
const s = {
    page: {
        fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)',
        overflowX: 'hidden',
        position: 'relative',
    },

    hero: {
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    heroContent: {
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        maxWidth: 1400,
        width: '100%',
        padding: '0 60px',
        gap: 40,
    },

    heroLeft: { zIndex: 10 },

    heroRight: {
        position: 'relative',
        height: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    heroTagline: {
        fontFamily: 'var(--font-accent)',
        fontSize: '1rem',
        color: '#d4af37',
        letterSpacing: 6,
        textTransform: 'uppercase',
        marginBottom: 20,
    },

    heroTitle: {
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2.8rem, 6vw, 5rem)',
        fontWeight: 600,
        lineHeight: 1.05,
        marginBottom: 24,
        color: 'var(--text-primary)',
    },

    heroTitleAccent: {
        display: 'block',
        background: 'linear-gradient(135deg, #d4af37, #f0d060)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },

    heroDesc: {
        fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
        color: 'var(--text-secondary)',
        maxWidth: 520,
        lineHeight: 1.8,
        fontWeight: 300,
        marginBottom: 40,
    },

    heroBtns: { display: 'flex', gap: 16, flexWrap: 'wrap' },

    btnGold: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '16px 44px',
        background: 'linear-gradient(135deg, #d4af37, #e8c44a)',
        color: '#0a0a14',
        border: 'none',
        borderRadius: 50,
        fontSize: '1rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 32px rgba(212,175,55,0.25)',
        letterSpacing: 0.5,
    },

    btnGlass: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '16px 44px',
        background: 'rgba(255,255,255,0.06)',
        color: 'var(--text-primary)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 50,
        fontSize: '1rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    sectionDark: {
        padding: '100px 0',
        position: 'relative',
    },

    sectionAlt: {
        padding: '100px 0',
        background: 'rgba(255,255,255,0.01)',
        position: 'relative',
    },

    secHeader: { textAlign: 'center', marginBottom: 60 },
    secTag: {
        fontFamily: 'var(--font-accent)', fontSize: '0.9rem', color: '#d4af37',
        letterSpacing: 4, textTransform: 'uppercase', marginBottom: 14,
    },
    secTitle: {
        fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)',
    },
    secDesc: {
        fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: 600,
        margin: '0 auto', lineHeight: 1.7,
    },

    featuresGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
        maxWidth: 1300, margin: '0 auto', padding: '0 40px', textAlign: 'center',
    },
    featureCard: {
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: '36px 24px',
        transition: 'all 0.3s ease',
    },
    featureIcon: { fontSize: '2.5rem', marginBottom: 16 },
    featureTitle: {
        fontFamily: 'var(--font-heading)', fontSize: '1.1rem',
        color: 'var(--text-primary)', marginBottom: 8,
    },
    featureDesc: { fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 },

    heritageGrid: {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 70,
        alignItems: 'center', maxWidth: 1300, margin: '0 auto', padding: '0 40px',
    },
    heritageImgWrap: {
        position: 'relative', borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.06)',
    },
    heritageImg: { width: '100%', height: 500, objectFit: 'cover' },
    heritageImgOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '40px 30px 30px',
        background: 'linear-gradient(transparent, rgba(10,10,20,0.85))',
    },
    heritageTag: {
        fontFamily: 'var(--font-accent)', fontSize: '0.9rem', color: '#d4af37',
        letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16,
    },
    heritageTitle: {
        fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 600, lineHeight: 1.15, marginBottom: 24, color: 'var(--text-primary)',
    },
    heritageText: {
        fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 20,
    },
    heritageHighlight: { color: '#d4af37', fontWeight: 600 },

    cta: {
        padding: '120px 0',
        textAlign: 'center',
        position: 'relative',
    },
    ctaTitle: {
        fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 600, marginBottom: 20, color: 'var(--text-primary)',
    },
    ctaDesc: {
        fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 600,
        margin: '0 auto 40px', lineHeight: 1.8,
    },

    footer: {
        padding: '80px 0 40px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    footerGrid: {
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 50,
        maxWidth: 1300, margin: '0 auto', padding: '0 40px',
    },
    footerBrand: {
        fontFamily: 'var(--font-heading)', fontSize: '1.8rem',
        background: 'linear-gradient(135deg, #d4af37, #f0d060)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: 16,
    },
    footerText: {
        fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20,
    },
    footerHeading: {
        fontFamily: 'var(--font-heading)', fontSize: '1.1rem',
        color: 'var(--text-primary)', marginBottom: 20,
    },
    footerLink: {
        display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)',
        marginBottom: 12, transition: 'color 0.2s', cursor: 'pointer', textDecoration: 'none',
    },
    footerBottom: {
        borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 60,
        paddingTop: 30, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)',
        maxWidth: 1300, margin: '60px auto 0', padding: '30px 40px 0',
    },
};

function Home() {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);

    const fallbackProducts = [
        { _id: "1", name: "Gulab Attar", price: 1200, category: "perfumes", description: "Pure rose attar distilled in brass deg using traditional Kannauj hydro-distillation.", image: "https://images.unsplash.com/photo-1594035910387-fbd1a83b0f1b?w=600&q=80" },
        { _id: "2", name: "Mitti Attar", price: 1500, category: "perfumes", description: "The essence of first rain on parched earth — Kannauj's most beloved signature scent.", image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80" },
        { _id: "3", name: "Shamama Blend", price: 2800, category: "perfumes", description: "A complex blend of 40+ botanicals. An opulent warm fragrance for special occasions.", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80" },
        { _id: "4", name: "Kewda Attar", price: 1800, category: "perfumes", description: "Extracted from pandanus flowers — sweet, green, and intensely tropical.", image: "https://images.unsplash.com/photo-1592945403244-b3faa12c5c0b?w=600&q=80" },
        { _id: "5", name: "Oudh Royale", price: 4500, category: "perfumes", description: "Premium agarwood oud sourced from aged trees, aged in sandalwood oil.", image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80" },
        { _id: "6", name: "Hina Attar", price: 2200, category: "perfumes", description: "A nightly blooming fragrance crafted from mehendi & sandalwood base.", image: "https://images.unsplash.com/photo-1615639164213-aab04da93c7c?w=600&q=80" },
    ];

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await productsAPI.getAll({ limit: 6 });
                const data = res.products || res;
                setFeaturedProducts(Array.isArray(data) && data.length ? data : fallbackProducts);
            } catch {
                setFeaturedProducts(fallbackProducts);
            }
        };
        fetchFeatured();
    }, []);

    const features = [
        { icon: "🏺", title: "Heritage Craft", desc: "800+ year legacy of traditional hydro-distillation from Kannauj" },
        { icon: "🌿", title: "100% Natural", desc: "Pure botanical ingredients — no synthetic chemicals or parabens" },
        { icon: "🌙", title: "Handcrafted Attars", desc: "Each batch distilled in copper degs, aged for months" },
        { icon: "🚚", title: "Premium Delivery", desc: "Secure packaging with temperature control for fragrance integrity" },
    ];

    return (
        <div style={s.page}>
            <div className="grain-overlay" />
            <div className="vignette-overlay" />

            {/* ===== HERO ===== */}
            <section style={s.hero}>
                <div style={s.heroContent}>
                    <motion.div
                        style={s.heroLeft}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <p style={s.heroTagline}>✦ Premium Luxury Fragrance ✦</p>
                        <h1 style={s.heroTitle}>
                            The Art of
                            <span style={s.heroTitleAccent}>Natural Scent</span>
                        </h1>
                        <p style={s.heroDesc}>
                            Discover a curated collection of luxury fragrances — each drop a masterpiece
                            of nature, bottled with elegance and timeless sophistication.
                        </p>
                        <div style={s.heroBtns}>
                            <button style={s.btnGold} onClick={() => navigate('/products')}
                                onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 12px 40px rgba(212,175,55,0.35)'; }}
                                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(212,175,55,0.25)'; }}>
                                Explore Collection
                            </button>
                            <button style={s.btnGlass} onClick={() => document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' })}
                                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(212,175,55,0.2)'; }}
                                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                                Our Story
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        style={s.heroRight}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <HeroScene />
                    </motion.div>
                </div>
            </section>

            <WaveSection color="rgba(212,175,55,0.06)" />

            {/* ===== FEATURES STRIP ===== */}
            <section style={{ ...s.sectionDark, padding: '80px 0' }}>
                <div style={{
                    ...s.featuresGrid,
                    ...(typeof window !== 'undefined' && window.innerWidth < 768 ? { gridTemplateColumns: 'repeat(2, 1fr)' } : {}),
                }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            style={s.featureCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.3)', borderColor: 'rgba(212,175,55,0.15)' }}
                        >
                            <div style={s.featureIcon}>{f.icon}</div>
                            <h3 style={s.featureTitle}>{f.title}</h3>
                            <p style={s.featureDesc}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <WaveSection color="rgba(123,111,197,0.05)" flip />

            {/* ===== HERITAGE ===== */}
            <section id="heritage" style={s.sectionAlt}>
                <div style={{
                    ...s.heritageGrid,
                    ...(typeof window !== 'undefined' && window.innerWidth < 900 ? { gridTemplateColumns: '1fr', gap: 40 } : {}),
                }}>
                    <motion.div
                        style={s.heritageImgWrap}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80" alt="Kannauj Attar Distillation" style={s.heritageImg} />
                        <div style={s.heritageImgOverlay}>
                            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '1.3rem', color: 'rgba(255,255,255,0.8)' }}>
                                "Where earth meets essence"
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <p style={s.heritageTag}>✦ Our Story ✦</p>
                        <h2 style={s.heritageTitle}>
                            Born in Kannauj,<br />Perfume Capital of India
                        </h2>
                        <p style={s.heritageText}>
                            For over <span style={s.heritageHighlight}>800 years</span>, the city of Kannauj in Uttar Pradesh has been the beating heart of India's fragrance tradition. Our attars are crafted using the ancient <span style={s.heritageHighlight}>deg-bhapka</span> method — hydro-distillation in copper stills with sandalwood oil as the base.
                        </p>
                        <p style={s.heritageText}>
                            Unlike synthetic perfumes, our <span style={s.heritageHighlight}>natural attars</span> contain zero alcohol and zero chemicals. Every drop is a living legacy — from <span style={s.heritageHighlight}>Gulab</span> (rose) and <span style={s.heritageHighlight}>Mitti</span> (petrichor) to the regal <span style={s.heritageHighlight}>Shamama</span>.
                        </p>
                        <button style={{ ...s.btnGold, marginTop: 8 }} onClick={() => navigate('/products')}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}>
                            Shop Attars →
                        </button>
                    </motion.div>
                </div>
            </section>

            <WaveSection color="rgba(212,175,55,0.04)" />

            {/* ===== FEATURED PRODUCTS — 3D Carousel ===== */}
            <section style={{ ...s.sectionDark, padding: '80px 0 100px' }}>
                <div style={s.secHeader}>
                    <p style={s.secTag}>✦ Curated Selection ✦</p>
                    <h2 style={s.secTitle}>Featured Fragrances</h2>
                    <p style={s.secDesc}>Drag, scroll, or swipe to explore — click a card to view details</p>
                </div>

                <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
                    <GradientCarousel
                        products={(featuredProducts.length ? featuredProducts : fallbackProducts).slice(0, 10)}
                        onSelect={(product) => navigate(`/products/${product._id}`)}
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: 48 }}>
                    <button style={s.btnGold} onClick={() => navigate('/products')}
                        onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}>
                        View All Products →
                    </button>
                </div>
            </section>

            {/* ===== ATTAR KNOWLEDGE ===== */}
            <section style={s.sectionAlt}>
                <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 40px' }}>
                    <div style={s.secHeader}>
                        <p style={s.secTag}>✦ The Attar Guide ✦</p>
                        <h2 style={s.secTitle}>Understanding Natural Attars</h2>
                        <p style={s.secDesc}>What makes Kannauj attars different from commercial perfumes</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
                        {[
                            { title: 'Deg-Bhapka Method', desc: 'Flowers are distilled in copper degs. The vapors travel through bamboo pipes and condense into sandalwood oil as the base carrier.', icon: '🏺' },
                            { title: 'Zero Alcohol', desc: 'Unlike Western perfumes that use 60-80% alcohol, attars are oil-based. They bond with skin chemistry for a truly personal scent.', icon: '🍃' },
                            { title: 'Aged to Perfection', desc: 'Premium attars are aged in camel-leather bottles (kuppi) for months to years, deepening the fragrance profile.', icon: '⏳' },
                            { title: 'Sustainable & Ethical', desc: 'We source flowers from local farmers in Kannauj, supporting traditional agricultural practices and preserving livelihoods.', icon: '🌱' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: 20, padding: '36px 28px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{item.icon}</div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 12 }}>{item.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <WaveSection color="rgba(123,111,197,0.04)" flip />

            {/* ===== CTA ===== */}
            <section style={s.cta}>
                <FloatingPetals count={8} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ position: 'relative', zIndex: 5 }}
                >
                    <h2 style={s.ctaTitle}>Experience Luxury Redefined</h2>
                    <p style={s.ctaDesc}>
                        Each fragrance tells a story — of monsoon rains on warm earth, of rose gardens at dawn,
                        of ancient oud forests. Discover your signature attar.
                    </p>
                    <button style={s.btnGold} onClick={() => navigate('/products')}
                        onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 12px 40px rgba(212,175,55,0.35)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(212,175,55,0.25)'; }}>
                        Shop Now →
                    </button>
                </motion.div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer style={s.footer}>
                <div style={{
                    ...s.footerGrid,
                    ...(typeof window !== 'undefined' && window.innerWidth < 768 ? { gridTemplateColumns: '1fr 1fr' } : {}),
                }}>
                    <div>
                        <h3 style={s.footerBrand}>K-Scents</h3>
                        <p style={s.footerText}>
                            Authentic attars and luxury natural fragrances from the perfume capital of India —
                            Kannauj. Handcrafted with centuries-old tradition.
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            📍 Kannauj, Uttar Pradesh, India
                        </p>
                    </div>
                    <div>
                        <h4 style={s.footerHeading}>Quick Links</h4>
                        <a href="/" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Home</a>
                        <a href="/products" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Shop</a>
                        <a href="/cart" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Cart</a>
                        <a href="/wishlist" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Wishlist</a>
                    </div>
                    <div>
                        <h4 style={s.footerHeading}>Categories</h4>
                        <a href="/products?category=perfumes" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Attars & Perfumes</a>
                        <a href="/products?category=candles" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Scented Candles</a>
                        <a href="/products?category=diffusers" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Diffusers</a>
                        <a href="/products?category=gift-sets" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Gift Sets</a>
                    </div>
                    <div>
                        <h4 style={s.footerHeading}>Support</h4>
                        <a href="#" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Contact Us</a>
                        <a href="#" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Shipping Info</a>
                        <a href="#" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Returns & Exchanges</a>
                        <a href="#" style={s.footerLink} onMouseEnter={e => e.target.style.color = '#d4af37'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>FAQ</a>
                    </div>
                </div>
                <div style={s.footerBottom}>
                    <p>© {new Date().getFullYear()} K-Scents · Luxury Fragrances · All rights reserved</p>
                </div>
            </footer>

            <style>{`
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          footer > div[style*="grid-template-columns: 2fr"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
        </div>
    );
}

export default Home;
