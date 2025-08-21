import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // You can add a toast notification here
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px 20px',
        color: '#666'
      }}>
        <h2>Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          padding: '40px'
        }}>
          {/* Product Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '300',
              color: '#333',
              marginBottom: '10px'
            }}>
              {product.name}
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              {product.description}
            </p>

            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#007bff',
              marginBottom: '30px'
            }}>
              ₹{product.price}
            </div>

            <div style={{
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px',
              display: 'inline-block'
            }}>
              <strong>Category:</strong> {product.category}
            </div>

            {product.stock > 0 ? (
              <div style={{
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '5px',
                display: 'inline-block'
              }}>
                <strong>In Stock:</strong> {product.stock} units
              </div>
            ) : (
              <div style={{
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '5px',
                display: 'inline-block'
              }}>
                <strong>Out of Stock</strong>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Quantity:
              </label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  width: '100px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                padding: '15px 30px',
                backgroundColor: product.stock > 0 ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1.1rem',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                marginRight: '15px',
                transition: 'background-color 0.3s'
              }}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '15px 30px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;