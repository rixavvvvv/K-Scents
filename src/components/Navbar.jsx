import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(20px)',
      padding: scrolled ? '12px 0' : '20px 0',
      zIndex: 1000,
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          textDecoration: 'none',
          color: '#fff',
          fontSize: scrolled ? '1.6rem' : '2rem',
          fontWeight: '800',
          fontFamily: 'Georgia, serif',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '2px'
        }}>
          K-Scents
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            padding: '10px 20px',
            borderRadius: '25px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            Home
          </Link>
          <Link to="/products" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            padding: '10px 20px',
            borderRadius: '25px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            Products
          </Link>
          <Link to="/cart" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '25px',
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          >
            <span style={{ fontSize: '1.2rem' }}>🛒</span>
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span style={{
                backgroundColor: '#667eea',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                animation: 'pulse 2s infinite'
              }}>
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link to="/admin" style={{
            textDecoration: 'none',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            padding: '10px 20px',
            borderRadius: '25px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            Admin
          </Link>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </nav>
  );
}

export default Navbar; 