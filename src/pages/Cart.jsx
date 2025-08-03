import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Calculate total
    const total = getCartTotal();
    
    // Show checkout confirmation
    const confirmed = window.confirm(
      `Proceed to checkout?\n\nTotal: ₹${total.toLocaleString()}\nItems: ${items.length}\n\nThis will redirect you to the checkout page.`
    );
    
    if (confirmed) {
      // For now, we'll just show a success message
      // In the future, this will redirect to a checkout page
      alert(`Order placed successfully!\n\nTotal: ₹${total.toLocaleString()}\nItems: ${items.length}\n\nThank you for your purchase!`);
      
      // Clear the cart after successful checkout
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        padding: '40px 20px',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '25px',
          padding: '80px 40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            fontSize: '5rem',
            marginBottom: '30px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            🛒
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            color: '#ffffff',
            marginBottom: '20px',
            fontWeight: '700',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your cart is empty
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#888',
            marginBottom: '40px',
            fontWeight: '300'
          }}>
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products" style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            textDecoration: 'none',
            padding: '18px 40px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.05)';
            e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
          }}
          >
            Start Shopping
          </Link>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      padding: '40px 20px',
      color: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            color: '#ffffff',
            marginBottom: '15px',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '2px'
          }}>
            Shopping Cart
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#888',
            fontWeight: '300'
          }}>
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Cart Items */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '25px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            {items.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '25px 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                gap: '25px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.02)';
                e.target.style.borderRadius = '15px';
                e.target.style.padding = '25px 15px';
                e.target.style.margin = '0 -15px';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderRadius = '0';
                e.target.style.padding = '25px 0';
                e.target.style.margin = '0';
              }}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}
                />
                <div style={{
                  flex: 1
                }}>
                  <h3 style={{
                    fontSize: '1.4rem',
                    color: '#ffffff',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#aaa',
                    marginBottom: '12px',
                    fontWeight: '300'
                  }}>
                    {item.description}
                  </p>
                  <p style={{
                    fontSize: '1.3rem',
                    color: '#667eea',
                    fontWeight: '700'
                  }}>
                    {item.price}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    style={{
                      width: '35px',
                      height: '35px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    minWidth: '40px',
                    textAlign: 'center',
                    color: '#fff'
                  }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    style={{
                      width: '35px',
                      height: '35px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  style={{
                    backgroundColor: 'rgba(220, 53, 69, 0.8)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(220, 53, 69, 1)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(220, 53, 69, 0.8)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <div style={{
              marginTop: '30px',
              textAlign: 'right'
            }}>
              <button
                onClick={clearCart}
                style={{
                  backgroundColor: 'rgba(108, 117, 125, 0.8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(108, 117, 125, 1)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(108, 117, 125, 0.8)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '25px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: '120px'
          }}>
            <h2 style={{
              fontSize: '2rem',
              color: '#ffffff',
              marginBottom: '30px',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Order Summary
            </h2>
            
            <div style={{
              marginBottom: '30px'
            }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  fontSize: '1rem',
                  color: '#aaa',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span style={{ color: '#667eea', fontWeight: '600' }}>{item.price}</span>
                </div>
              ))}
            </div>
            
            <div style={{
              borderTop: '2px solid rgba(255,255,255,0.1)',
              paddingTop: '25px',
              marginBottom: '35px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                <span>Total:</span>
                <span style={{ color: '#667eea' }}>₹{getCartTotal().toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '18px',
                borderRadius: '15px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;