import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});

  const featuredProducts = [
    {
      id: 1,
      name: "Ocean Breeze",
      price: "₹1,200",
      description: "Fresh aquatic notes with citrus undertones",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=400&fit=crop",
      category: "Fresh"
    },
    {
      id: 2,
      name: "Rose Garden",
      price: "₹1,500",
      description: "Romantic floral blend with rose petals",
      image: "https://images.unsplash.com/photo-1592945403244-b3faa12c5c0b?w=300&h=400&fit=crop",
      category: "Floral"
    },
    {
      id: 3,
      name: "Mystic Woods",
      price: "₹1,800",
      description: "Earthy sandalwood with vanilla notes",
      image: "https://images.unsplash.com/photo-1615639164213-aab04da93c7c?w=300&h=400&fit=crop",
      category: "Woody"
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    
    // Show success feedback
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    
    // Remove success feedback after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div style={{ 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', 
      backgroundColor: '#0a0a0a',
      margin: 0,
      padding: 0,
      width: '100%',
      overflowX: 'hidden',
      color: '#ffffff'
    }}>
      {/* Hero Section */}
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          position: "relative",
          width: "100%",
          margin: 0,
          padding: 0,
          overflow: "hidden"
        }}
      >
        {/* Animated background elements */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: "150px",
          height: "150px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse"
        }}></div>
        
        <div style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: "80px 60px",
          borderRadius: "30px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          maxWidth: "900px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          position: "relative",
          zIndex: 2
        }}>
          <div style={{
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
            borderRadius: "30px",
            zIndex: -1,
            opacity: 0.3,
            animation: "borderGlow 3s ease-in-out infinite alternate"
          }}></div>
          
          <h1 style={{ 
            fontSize: "6rem", 
            marginBottom: "30px", 
            fontWeight: "800",
            letterSpacing: "4px",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            background: "linear-gradient(45deg, #fff, #f0f0f0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            K-Scents
          </h1>
          <p style={{ 
            fontSize: "1.6rem", 
            marginBottom: "50px", 
            maxWidth: "800px",
            lineHeight: "1.8",
            opacity: "0.95",
            fontWeight: "300"
          }}>
            Discover the essence of Kannauj. Premium perfumes crafted with tradition and innovation.
          </p>
          <button style={{
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            color: "white",
            border: "none",
            padding: "25px 60px",
            fontSize: "1.3rem",
            borderRadius: "50px",
            cursor: "pointer",
            transition: "all 0.4s ease",
            fontWeight: "600",
            boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-5px) scale(1.05)";
            e.target.style.boxShadow = "0 20px 45px rgba(102, 126, 234, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)";
          }}
          onClick={() => navigate('/products')}
          >
            <span style={{ position: "relative", zIndex: 2 }}>Explore Collection</span>
            <div style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              transition: "left 0.5s ease"
            }}></div>
          </button>
        </div>
      </div>

      {/* Featured Products Section */}
      <div style={{ 
        padding: "120px 0", 
        width: "100%",
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
        margin: 0,
        boxSizing: "border-box"
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px"
        }}>
          <h2 style={{ 
            textAlign: "center", 
            fontSize: "4rem", 
            marginBottom: "20px",
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: "3px",
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Featured Fragrances
          </h2>
          <p style={{
            textAlign: "center",
            fontSize: "1.2rem",
            color: "#888",
            marginBottom: "80px",
            fontWeight: "300"
          }}>
            Handpicked collection of our finest fragrances
          </p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "40px",
            width: "100%"
          }}>
            {featuredProducts.map((product, index) => (
              <div key={product.id} style={{
                textAlign: "center",
                transition: "all 0.5s ease",
                cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "25px",
                padding: "40px 30px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(10px)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-20px) scale(1.02)";
                e.target.style.boxShadow = "0 30px 60px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
              }}
              >
                {/* Category Badge */}
                <div style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  backgroundColor: "rgba(102, 126, 234, 0.8)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  backdropFilter: "blur(10px)"
                }}>
                  {product.category}
                </div>
                
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "20px",
                    marginBottom: "30px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                  }}
                />
                <h3 style={{ 
                  fontSize: "1.8rem", 
                  marginBottom: "15px",
                  color: "#ffffff",
                  fontWeight: "600"
                }}>
                  {product.name}
                </h3>
                <p style={{ 
                  fontSize: "1.1rem", 
                  color: "#aaa", 
                  marginBottom: "25px",
                  lineHeight: "1.6"
                }}>
                  {product.description}
                </p>
                <p style={{ 
                  fontSize: "1.6rem", 
                  color: "#667eea", 
                  marginBottom: "30px",
                  fontWeight: "700"
                }}>
                  {product.price}
                </p>
                <button style={{
                  background: addedItems[product.id] 
                    ? "linear-gradient(45deg, #28a745, #20c997)" 
                    : "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  padding: "18px 40px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)"
                }}
                onMouseEnter={(e) => {
                  if (!addedItems[product.id]) {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!addedItems[product.id]) {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.3)";
                  }
                }}
                onClick={() => handleAddToCart(product)}
                >
                  {addedItems[product.id] ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
          
          {/* More Products Button */}
          <div style={{
            textAlign: "center",
            marginTop: "80px"
          }}>
            <button style={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              padding: "20px 50px",
              fontSize: "1.2rem",
              borderRadius: "30px",
              cursor: "pointer",
              transition: "all 0.4s ease",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "2px",
              boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-5px) scale(1.05)";
              e.target.style.boxShadow = "0 20px 45px rgba(102, 126, 234, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)";
            }}
            onClick={() => navigate('/products')}
            >
              View All Products
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        padding: "120px 0",
        textAlign: "center",
        color: "white",
        width: "100%",
        margin: 0,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 40px", 
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2
        }}>
          <h2 style={{ 
            fontSize: "4rem", 
            marginBottom: "50px", 
            fontWeight: "700",
            letterSpacing: "3px",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}>
            The Fragrance of Kannauj
          </h2>
          <p style={{ 
            fontSize: "1.4rem", 
            lineHeight: "2", 
            width: "100%",
            margin: "0 auto",
            opacity: "0.95",
            fontWeight: "300",
            maxWidth: "800px"
          }}>
            For centuries, Kannauj has been the perfume capital of India. Our fragrances 
            are crafted using traditional methods passed down through generations, 
            combined with modern techniques to create timeless scents that tell your story.
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes borderGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

export default Home;
