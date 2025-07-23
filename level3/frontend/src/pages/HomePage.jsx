import React, { useState, useEffect } from 'react';

function HomePage() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ use state for admin

  useEffect(() => {
    setAddress(localStorage.getItem('deliveryAddress') || '');
    setPhone(localStorage.getItem('phoneNumber') || '');

    // ✅ Set admin flag from localStorage
    const adminFlag = localStorage.getItem('is_admin') === 'true';
    setIsAdmin(adminFlag);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    localStorage.setItem('cart', JSON.stringify([...existingCart, product]));
    alert(`${product.name} added to cart!`);
  };

  const handleSaveDeliveryInfo = () => {
    localStorage.setItem('deliveryAddress', address);
    localStorage.setItem('phoneNumber', phone);
    alert('✅ Delivery information saved!');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || product.category === selectedCategory)
  );

  const styles = {
    page: {
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(135deg, #ffdde1, #d4fcf9, #e0c3fc, #ffe4b5)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      minHeight: '100vh',
      padding: '20px',
    },
    keyframes: `
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#ffffffcc',
      padding: '12px 20px',
      borderRadius: '16px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    navLeft: { display: 'flex', gap: '20px' },
    navRight: { display: 'flex', gap: '20px' },
    navButton: {
      background: 'linear-gradient(to right, #a18cd1, #fbc2eb)',
      padding: '10px 18px',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 'bold',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    formSection: {
      background: '#ffffffcc',
      padding: '20px',
      borderRadius: '16px',
      marginBottom: '20px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
    input: {
      padding: '10px',
      margin: '5px 0',
      width: '100%',
      borderRadius: '10px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
    saveBtn: {
      padding: '10px 20px',
      backgroundColor: '#00b894',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginTop: '10px',
    },
    searchRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
    },
    productCard: {
      background: '#ffffffdd',
      padding: '15px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    productImage: {
      height: '150px',
      objectFit: 'contain',
      marginBottom: '10px',
    },
    productName: { fontWeight: 'bold', fontSize: '1.1rem' },
    addButton: {
      marginTop: '10px',
      padding: '10px 15px',
      backgroundColor: '#6c5ce7',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
  };

  return (
    <>
      <style>{styles.keyframes}</style>
      <div style={styles.page}>
        {/* Navbar */}
        <div style={styles.nav}>
          <div style={styles.navLeft}>
            <a href="/home" style={styles.navButton}>🏠 Home</a>
            <a href="/orders" style={styles.navButton}>📦 My Orders</a>
          </div>
          <div style={styles.navRight}>
            {isAdmin && (
              <a href="/admin/upload" style={styles.navButton}>➕ Add Product</a>
            )}
            <a href="/cart" style={styles.navButton}>🛒 Cart</a>
            <a
              href="/"
              style={styles.navButton}
              onClick={() => localStorage.clear()}
            >
              🚪 Logout
            </a>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={styles.formSection}>
          <h3>Delivery Information</h3>
          <input
            type="text"
            placeholder="Enter delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
          <button style={styles.saveBtn} onClick={handleSaveDeliveryInfo}>
            Save Delivery Info
          </button>
        </div>

        {/* Search & Category Filter */}
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.input}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Grocery">Grocery</option>
            <option value="Stationery">Stationery</option>
          </select>
        </div>

        {/* Product Grid */}
        <div style={styles.productGrid}>
          {filteredProducts.map(product => (
            <div key={product.id} style={styles.productCard}>
              <img
                src={product.image_url || 'https://via.placeholder.com/150'}
                alt={product.name}
                style={styles.productImage}
              />
              <div style={styles.productName}>{product.name}</div>
              <p>₹{product.price}</p>
              <button
                style={styles.addButton}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;
