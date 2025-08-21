import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

function Products() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  // Categories based on database schema
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'perfumes', name: 'Perfumes' },
    { id: 'candles', name: 'Candles' },
    { id: 'diffusers', name: 'Diffusers' },
    { id: 'soaps', name: 'Soaps' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '0 20px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '300',
          color: '#333',
          marginBottom: '20px'
        }}>
          Our Collection
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Discover our complete range of premium fragrances
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 40px',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}>
          {/* Search Bar */}
          <div style={{
            width: '100%',
            maxWidth: '500px'
          }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 20px',
                fontSize: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '25px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {/* Category Filters */}
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedCategory === category.id ? '#667eea' : '#fff',
                  color: selectedCategory === category.id ? '#fff' : '#333',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            Loading products...
          </h3>
          <p>Please wait while we fetch our collection</p>
        </div>
      )}

      {error && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#dc3545'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            Error loading products
          </h3>
          <p>{error}</p>
        </div>
      )}

      {/* Products Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {!loading && !error && filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
              No products found
            </h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {filteredProducts.map((product) => (
              <div key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '20px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-10px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '15px'
                  }}
                />
                <h3 style={{
                  fontSize: '1.3rem',
                  marginBottom: '10px',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  {product.name}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  marginBottom: '15px',
                  lineHeight: '1.4'
                }}>
                  {product.description}
                </p>
                <p style={{
                  fontSize: '1.2rem',
                  color: '#667eea',
                  marginBottom: '15px',
                  fontWeight: '700'
                }}>
                  ₹{product.price}
                </p>
                <button style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '10px 25px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase'
                }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#5a6fd8';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#667eea';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;