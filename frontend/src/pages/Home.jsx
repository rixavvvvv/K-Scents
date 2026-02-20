import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../services/api';

// ─── Inline styles as JS objects for a rich, Kannauj-heritage theme ───
const s = {
  page: { fontFamily: "var(--font-body)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", overflowX: "hidden" },

  // Hero
  hero: { position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden" },
  heroBg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(139,105,20,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(183,110,121,0.08) 0%, transparent 50%), var(--bg-primary)", zIndex: 0 },
  heroOverlay: { position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12, zIndex: 0 },
  heroContent: { position: "relative", zIndex: 2, maxWidth: 900, padding: "0 24px" },
  heroTagline: { fontFamily: "var(--font-accent)", fontSize: "1.1rem", color: "var(--color-accent)", letterSpacing: 6, textTransform: "uppercase", marginBottom: 24 },
  heroTitle: { fontFamily: "var(--font-heading)", fontSize: "clamp(3rem, 8vw, 6.5rem)", fontWeight: 600, lineHeight: 1.05, marginBottom: 28, background: "linear-gradient(135deg, #F5EDE0, #D4A853, #C4973B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  heroDesc: { fontSize: "clamp(1rem, 2vw, 1.35rem)", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 48px", lineHeight: 1.8, fontWeight: 300 },
  heroBtns: { display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" },
  btnGold: { display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 48px", background: "linear-gradient(135deg, #8B6914, #D4A853)", color: "#0D0B08", border: "none", borderRadius: 50, fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 8px 32px rgba(139,105,20,0.3)", letterSpacing: 1 },
  btnOutline: { display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 48px", background: "transparent", color: "var(--color-accent)", border: "1.5px solid rgba(196,151,59,0.4)", borderRadius: 50, fontSize: "1.1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.3s ease" },
  heroParticle: (top, left, size, delay) => ({ position: "absolute", top, left, width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%)", animation: `float ${6 + delay}s ease-in-out infinite`, animationDelay: `${delay}s`, zIndex: 1 }),

  // Heritage section
  heritage: { padding: "120px 0", background: "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)", position: "relative" },
  heritageGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1300, margin: "0 auto", padding: "0 40px" },
  heritageImgWrap: { position: "relative", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" },
  heritageImg: { width: "100%", height: 550, objectFit: "cover" },
  heritageImgOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 30px 30px", background: "linear-gradient(transparent, rgba(13,11,8,0.9))" },
  heritageTag: { fontFamily: "var(--font-accent)", fontSize: "0.9rem", color: "var(--color-accent)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 },
  heritageTitle: { fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 600, lineHeight: 1.15, marginBottom: 24, color: "var(--text-primary)" },
  heritageText: { fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: 20 },
  heritageHighlight: { color: "var(--color-accent)", fontWeight: 500 },

  // Features strip
  features: { padding: "80px 0", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40, maxWidth: 1300, margin: "0 auto", padding: "0 40px", textAlign: "center" },
  featureIcon: { fontSize: "2.5rem", marginBottom: 16, filter: "grayscale(0.2)" },
  featureTitle: { fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: 8 },
  featureDesc: { fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 },

  // Section header
  secHeader: { textAlign: "center", marginBottom: 64 },
  secTag: { fontFamily: "var(--font-accent)", fontSize: "0.9rem", color: "var(--color-accent)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 },
  secTitle: { fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" },
  secDesc: { fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 },

  // Product card
  prodSection: { padding: "120px 0", background: "var(--bg-primary)" },
  prodGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32, maxWidth: 1300, margin: "0 auto", padding: "0 40px" },
  prodCard: { background: "rgba(30,25,18,0.5)", borderRadius: 20, border: "1px solid rgba(196,151,59,0.1)", overflow: "hidden", transition: "all 0.4s ease", cursor: "pointer", backdropFilter: "blur(10px)" },
  prodImg: { width: "100%", height: 320, objectFit: "cover", transition: "transform 0.5s ease" },
  prodBody: { padding: "24px 28px 28px" },
  prodCategory: { fontFamily: "var(--font-accent)", fontSize: "0.8rem", color: "var(--color-accent)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 },
  prodName: { fontFamily: "var(--font-heading)", fontSize: "1.35rem", color: "var(--text-primary)", marginBottom: 8 },
  prodDesc: { fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  prodFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  prodPrice: { fontSize: "1.3rem", fontWeight: 700, color: "var(--color-accent)" },
  prodBtn: { padding: "10px 24px", background: "linear-gradient(135deg, #8B6914, #D4A853)", color: "#0D0B08", border: "none", borderRadius: 50, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease" },

  // CTA
  cta: { padding: "120px 0", background: "radial-gradient(ellipse at center, rgba(139,105,20,0.12) 0%, transparent 70%), var(--bg-secondary)", textAlign: "center" },
  ctaTitle: { fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, marginBottom: 20, color: "var(--text-primary)" },
  ctaDesc: { fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.8 },

  // Footer
  footer: { padding: "80px 0 40px", borderTop: "1px solid var(--border-color)", background: "var(--bg-primary)" },
  footerGrid: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, maxWidth: 1300, margin: "0 auto", padding: "0 40px" },
  footerBrand: { fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "var(--color-accent)", marginBottom: 16 },
  footerText: { fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 },
  footerHeading: { fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 20 },
  footerLink: { display: "block", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 12, transition: "color 0.2s", cursor: "pointer", textDecoration: "none" },
  footerBottom: { borderTop: "1px solid var(--border-color)", marginTop: 60, paddingTop: 30, textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: 1300, margin: "60px auto 0", padding: "30px 40px 0" },
};

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const fallbackProducts = [
    { _id: "1", name: "Gulab Attar", price: 1200, category: "perfumes", description: "Pure rose attar distilled in brass deg using traditional Kannauj hydro-distillation.", image: "https://images.unsplash.com/photo-1594035910387-fbd1a83b0f1b?w=600&q=80" },
    { _id: "2", name: "Mitti Attar", price: 1500, category: "perfumes", description: "The essence of first rain on parched earth — Kannauj's most beloved signature scent.", image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80" },
    { _id: "3", name: "Shamama Blend", price: 2800, category: "perfumes", description: "A complex blend of 40+ botanicals. An opulent warm fragrance for special occasions.", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80" },
    { _id: "4", name: "Kewda Attar", price: 1800, category: "perfumes", description: "Extracted from pandanus flowers — sweet, green, and intensely tropical.", image: "https://images.unsplash.com/photo-1592945403244-b3faa12c5c0b?w=600&q=80" },
    { _id: "5", name: "Oudh Royale", price: 4500, category: "perfumes", description: "Premium agarwood oud sourced from aged trees, aged in sandalwood oil.", image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80" },
    { _id: "6", name: "Hina Attar", price: 2200, category: "perfumes", description: "A nightly blooming fragrance crafted from mehendi & sandalwood base.", image: "https://images.unsplash.com/photo-1615639164213-aab04da93c7c?w=600&q=80" },
  ];

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product._id]: false })), 2000);
  };

  const features = [
    { icon: "🏺", title: "Kannauj Heritage", desc: "800+ year legacy of traditional hydro-distillation from the perfume capital of India" },
    { icon: "🌿", title: "100% Natural", desc: "Pure botanical ingredients — no synthetic chemicals, parabens, or artificial fragrances" },
    { icon: "🌙", title: "Handcrafted Attars", desc: "Each batch distilled in copper degs, aged in camel-leather bottles for months" },
    { icon: "🚚", title: "Pan-India Delivery", desc: "Secure packaging with temperature control to preserve fragrance integrity" },
  ];

  return (
    <div style={s.page}>
      {/* ===== HERO ===== */}
      <section style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroOverlay} />
        <div style={s.heroParticle("10%", "15%", "180px", 0)} />
        <div style={s.heroParticle("60%", "75%", "120px", 2)} />
        <div style={s.heroParticle("30%", "85%", "90px", 4)} />

        <div style={s.heroContent}>
          <p style={{ ...s.heroTagline, animation: "fadeInUp 0.8s ease forwards", opacity: 0, animationDelay: "0.2s", animationFillMode: "forwards" }}>
            Est. Kannauj · Since Generations
          </p>
          <h1 style={{ ...s.heroTitle, animation: "fadeInUp 0.8s ease forwards", opacity: 0, animationDelay: "0.4s", animationFillMode: "forwards" }}>
            The Art of<br />Natural Fragrance
          </h1>
          <p style={{ ...s.heroDesc, animation: "fadeInUp 0.8s ease forwards", opacity: 0, animationDelay: "0.6s", animationFillMode: "forwards" }}>
            Authentic attars and natural fragrances from Kannauj — India's perfume capital.
            Crafted through centuries-old <em>deg-bhapka</em> distillation, each drop carries the soul of tradition.
          </p>
          <div style={{ ...s.heroBtns, animation: "fadeInUp 0.8s ease forwards", opacity: 0, animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <button style={s.btnGold} onClick={() => navigate('/products')}
              onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 12px 40px rgba(139,105,20,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(139,105,20,0.3)"; }}>
              Explore Collection
            </button>
            <button style={s.btnOutline} onClick={() => document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={e => { e.target.style.background = "rgba(196,151,59,0.1)"; e.target.style.borderColor = "var(--color-accent)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(196,151,59,0.4)"; }}>
              Our Heritage
            </button>
          </div>
        </div>
      </section>

      {/* ===== FEATURES STRIP ===== */}
      <section style={s.features}>
        <div style={{ ...s.featuresGrid, ...(window.innerWidth < 768 ? { gridTemplateColumns: "repeat(2, 1fr)" } : {}) }}>
          {features.map((f, i) => (
            <div key={i}>
              <div style={s.featureIcon}>{f.icon}</div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HERITAGE / ABOUT ===== */}
      <section id="heritage" style={s.heritage}>
        <div style={{ ...s.heritageGrid, ...(window.innerWidth < 900 ? { gridTemplateColumns: "1fr", gap: 40 } : {}) }}>
          <div style={s.heritageImgWrap}>
            <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80" alt="Kannauj Attar Distillation" style={s.heritageImg} />
            <div style={s.heritageImgOverlay}>
              <p style={{ fontFamily: "var(--font-accent)", fontSize: "1.3rem", color: "var(--color-accent)" }}>
                "Where earth meets essence"
              </p>
            </div>
          </div>
          <div>
            <p style={s.heritageTag}>✦ Our Story ✦</p>
            <h2 style={s.heritageTitle}>
              Born in Kannauj,<br />Perfume Capital of India
            </h2>
            <p style={s.heritageText}>
              For over <span style={s.heritageHighlight}>800 years</span>, the city of Kannauj in Uttar Pradesh has been the beating heart of India's fragrance tradition. Our attars are crafted using the ancient <span style={s.heritageHighlight}>deg-bhapka</span> method — hydro-distillation in copper stills with sandalwood oil as the base.
            </p>
            <p style={s.heritageText}>
              Unlike synthetic perfumes, our <span style={s.heritageHighlight}>natural attars</span> contain zero alcohol  and zero chemicals. Every drop is a living legacy — from <span style={s.heritageHighlight}>Gulab</span> (rose) and <span style={s.heritageHighlight}>Mitti</span> (petrichor) to the regal <span style={s.heritageHighlight}>Shamama</span> and precious <span style={s.heritageHighlight}>Oudh</span>.
            </p>
            <p style={s.heritageText}>
              K-Scents bridges tradition and modernity, bringing authentic Kannauj fragrances to connoisseurs worldwide — sustainably sourced, ethically crafted.
            </p>
            <button style={{ ...s.btnGold, marginTop: 8 }} onClick={() => navigate('/products')}
              onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}>
              Shop Attars →
            </button>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section style={s.prodSection}>
        <div style={s.secHeader}>
          <p style={s.secTag}>✦ Curated Selection ✦</p>
          <h2 style={s.secTitle}>Featured Fragrances</h2>
          <p style={s.secDesc}>Handpicked attars and natural perfumes from our master distillers</p>
        </div>
        <div style={s.prodGrid}>
          {(featuredProducts.length ? featuredProducts : fallbackProducts).slice(0, 6).map((product) => (
            <div key={product._id} style={{ ...s.prodCard, ...(hoveredCard === product._id ? { transform: "translateY(-8px)", boxShadow: "0 20px 48px rgba(0,0,0,0.4)", borderColor: "rgba(196,151,59,0.25)" } : {}) }}
              onMouseEnter={() => setHoveredCard(product._id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(`/products/${product._id}`)}>
              <div style={{ overflow: "hidden" }}>
                <img src={product.image} alt={product.name} style={{ ...s.prodImg, ...(hoveredCard === product._id ? { transform: "scale(1.05)" } : {}) }} />
              </div>
              <div style={s.prodBody}>
                <p style={s.prodCategory}>{product.category}</p>
                <h3 style={s.prodName}>{product.name}</h3>
                <p style={s.prodDesc}>{product.description}</p>
                <div style={s.prodFooter}>
                  <span style={s.prodPrice}>₹{(product.finalPrice || product.price || 0).toLocaleString()}</span>
                  <button style={{ ...s.prodBtn, ...(addedItems[product._id] ? { background: "linear-gradient(135deg, #5B7B5A, #7A9E79)" } : {}) }}
                    onClick={(e) => handleAddToCart(e, product)}
                    onMouseEnter={e => { if (!addedItems[product._id]) e.target.style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}>
                    {addedItems[product._id] ? "✓ Added" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 64 }}>
          <button style={s.btnGold} onClick={() => navigate('/products')}
            onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}>
            View All Products →
          </button>
        </div>
      </section>

      {/* ===== ATTAR KNOWLEDGE ===== */}
      <section style={{ padding: "100px 0", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 40px" }}>
          <div style={s.secHeader}>
            <p style={s.secTag}>✦ The Attar Guide ✦</p>
            <h2 style={s.secTitle}>Understanding Natural Attars</h2>
            <p style={s.secDesc}>What makes Kannauj attars different from commercial perfumes</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {[
              { title: "Deg-Bhapka Method", desc: "Flowers are distilled in copper degs (stills). The vapors travel through bamboo pipes (bhapka) and condense into sandalwood oil, which acts as the base carrier.", icon: "🏺" },
              { title: "Zero Alcohol", desc: "Unlike Western perfumes that use 60-80% alcohol, attars are oil-based. They bond with skin chemistry, evolving throughout the day for a truly personal scent.", icon: "🍃" },
              { title: "Aged to Perfection", desc: "Premium attars are aged in camel-leather bottles (kuppi) for months to years. This maturation deepens and enriches the fragrance profile.", icon: "⏳" },
              { title: "Sustainable & Ethical", desc: "We source flowers from local farmers in Kannauj, supporting traditional agricultural practices and preserving centuries-old livelihood systems.", icon: "🌱" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(30,25,18,0.5)", borderRadius: 20, padding: "36px 28px", border: "1px solid var(--border-color)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(196,151,59,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={s.cta}>
        <h2 style={s.ctaTitle}>Experience the Soul of Kannauj</h2>
        <p style={s.ctaDesc}>
          Each fragrance tells a story — of monsoon rains on warm earth, of rose gardens at dawn,
          of ancient oud forests. Discover your signature attar.
        </p>
        <button style={s.btnGold} onClick={() => navigate('/products')}
          onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 12px 40px rgba(139,105,20,0.4)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(139,105,20,0.3)"; }}>
          Shop Now →
        </button>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={s.footer}>
        <div style={{ ...s.footerGrid, ...(window.innerWidth < 768 ? { gridTemplateColumns: "1fr 1fr" } : {}) }}>
          <div>
            <h3 style={s.footerBrand}>K-Scents</h3>
            <p style={s.footerText}>
              Authentic attars and natural fragrances from the perfume capital of India — Kannauj.
              Handcrafted with centuries-old tradition.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              📍 Kannauj, Uttar Pradesh, India
            </p>
          </div>
          <div>
            <h4 style={s.footerHeading}>Quick Links</h4>
            <a href="/" style={s.footerLink}>Home</a>
            <a href="/products" style={s.footerLink}>Shop</a>
            <a href="/cart" style={s.footerLink}>Cart</a>
            <a href="/wishlist" style={s.footerLink}>Wishlist</a>
          </div>
          <div>
            <h4 style={s.footerHeading}>Categories</h4>
            <a href="/products?category=perfumes" style={s.footerLink}>Attars & Perfumes</a>
            <a href="/products?category=candles" style={s.footerLink}>Scented Candles</a>
            <a href="/products?category=diffusers" style={s.footerLink}>Diffusers</a>
            <a href="/products?category=gift-sets" style={s.footerLink}>Gift Sets</a>
          </div>
          <div>
            <h4 style={s.footerHeading}>Support</h4>
            <a href="#" style={s.footerLink}>Contact Us</a>
            <a href="#" style={s.footerLink}>Shipping Info</a>
            <a href="#" style={s.footerLink}>Returns & Exchanges</a>
            <a href="#" style={s.footerLink}>FAQ</a>
          </div>
        </div>
        <div style={s.footerBottom}>
          <p>© {new Date().getFullYear()} K-Scents · Heritage of Kannauj · All rights reserved</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
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
