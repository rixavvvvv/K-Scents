import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const stats = [
    { title: 'Total Sales', value: '$12,450', change: '+15%', icon: '💰' },
    { title: 'Orders', value: '1,234', change: '+8%', icon: '📦' },
    { title: 'Products', value: '89', change: '+3%', icon: '🛍️' },
    { title: 'Customers', value: '456', change: '+12%', icon: '👥' }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'John Doe', product: 'Lavender Dream', status: 'Delivered', amount: '$45' },
    { id: '#1235', customer: 'Jane Smith', product: 'Ocean Breeze', status: 'Processing', amount: '$32' },
    { id: '#1236', customer: 'Mike Johnson', product: 'Vanilla Comfort', status: 'Shipped', amount: '$28' },
    { id: '#1237', customer: 'Sarah Wilson', product: 'Rose Garden', status: 'Pending', amount: '$55' }
  ];

  const products = [
    { id: 1, name: 'Lavender Dream', category: 'Floral', price: '$45', stock: 15, status: 'Active' },
    { id: 2, name: 'Ocean Breeze', category: 'Fresh', price: '$32', stock: 8, status: 'Active' },
    { id: 3, name: 'Vanilla Comfort', category: 'Sweet', price: '$28', stock: 22, status: 'Active' },
    { id: 4, name: 'Rose Garden', category: 'Floral', price: '$55', stock: 5, status: 'Low Stock' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#10b981';
      case 'Processing': return '#f59e0b';
      case 'Shipped': return '#3b82f6';
      case 'Pending': return '#ef4444';
      case 'Active': return '#10b981';
      case 'Low Stock': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#f8fafc',
    padding: '20px',
    overflowX: 'hidden'
  };

  const headerStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  };

  const tabStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  };

  const tabButtonStyle = (active) => ({
    padding: '12px 24px',
    background: active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    fontSize: '14px',
    fontWeight: '500',
    ...(active && { boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' })
  });

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const statCardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  };

  const contentCardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  };

  const searchBarStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '14px',
    backdropFilter: 'blur(10px)',
    marginBottom: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thStyle = {
    padding: '16px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontWeight: '600',
    fontSize: '14px',
    color: '#94a3b8'
  };

  const tdStyle = {
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '14px'
  };

  const statusBadgeStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    background: `rgba(${getStatusColor(status).replace('#', '0x')}, 0.1)`,
    color: getStatusColor(status),
    border: `1px solid ${getStatusColor(status)}40`
  });

  const actionButtonStyle = {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    border: 'none',
    borderRadius: '8px',
    color: '#f8fafc',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    marginRight: '8px'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 8px 0'
            }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0' }}>
              Manage your K-Scents store efficiently
            </p>
          </div>
          <Link to="/" style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '12px',
            color: '#f8fafc',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
          }}>
            ← Back to Store
          </Link>
        </div>

        {/* Tabs */}
        <div style={tabStyle}>
          {['overview', 'products', 'orders', 'customers', 'analytics'].map((tab) => (
            <button
              key={tab}
              style={tabButtonStyle(activeTab === tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div style={statsGridStyle}>
            {stats.map((stat, index) => (
              <div key={index} style={statCardStyle} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 8px 0' }}>{stat.title}</p>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 8px 0' }}>{stat.value}</h3>
                    <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>{stat.change}</span>
                  </div>
                  <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={contentCardStyle}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 20px 0' }}>Recent Orders</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={tdStyle}>{order.id}</td>
                    <td style={tdStyle}>{order.customer}</td>
                    <td style={tdStyle}>{order.product}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(order.status)}>{order.status}</span>
                    </td>
                    <td style={tdStyle}>{order.amount}</td>
                    <td style={tdStyle}>
                      <button style={actionButtonStyle}>View</button>
                      <button style={{...actionButtonStyle, background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <div style={contentCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0' }}>Product Management</h2>
            <button style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '12px',
              color: '#f8fafc',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              + Add Product
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchBarStyle}
          />

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={tdStyle}>{product.id}</td>
                  <td style={tdStyle}>{product.name}</td>
                  <td style={tdStyle}>{product.category}</td>
                  <td style={tdStyle}>{product.price}</td>
                  <td style={tdStyle}>{product.stock}</td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(product.status)}>{product.status}</span>
                  </td>
                  <td style={tdStyle}>
                    <button style={actionButtonStyle}>Edit</button>
                    <button style={{...actionButtonStyle, background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={contentCardStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 20px 0' }}>Order Management</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={tdStyle}>{order.id}</td>
                  <td style={tdStyle}>{order.customer}</td>
                  <td style={tdStyle}>{order.product}</td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(order.status)}>{order.status}</span>
                  </td>
                  <td style={tdStyle}>{order.amount}</td>
                  <td style={tdStyle}>
                    <button style={actionButtonStyle}>View</button>
                    <button style={{...actionButtonStyle, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'customers' && (
        <div style={contentCardStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 20px 0' }}>Customer Management</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>
            Customer management features will be implemented here. This section will include customer profiles, 
            order history, and customer analytics.
          </p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={contentCardStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 20px 0' }}>Analytics & Reports</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>
            Analytics dashboard will be implemented here. This section will include sales reports, 
            product performance metrics, and customer insights.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;