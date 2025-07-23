import React, { useState } from 'react';
import axios from 'axios';

function AdminUploadPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image_url: '',
    description: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/products/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`✅ "${res.data.name}" uploaded successfully`);
      setFormData({
        name: '',
        category: '',
        price: '',
        image_url: '',
        description: '',
      });
    } catch (err) {
      setMessage('❌ Upload failed. Only admin can upload products.');
      console.error('Upload error:', err);
    }
  };

  const styles = {
    wrapper: {
      padding: '30px',
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(to right, #e0f7fa, #ffe0f0)',
      minHeight: '100vh',
    },
    formBox: {
      background: 'white',
      padding: '30px',
      borderRadius: '16px',
      maxWidth: '500px',
      margin: 'auto',
      boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '10px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
    button: {
      padding: '12px 20px',
      backgroundColor: '#6c5ce7',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    message: {
      marginTop: '20px',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formBox}>
        <h2>➕ Upload Product (Admin)</h2>
        <form onSubmit={handleUpload}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="image_url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <button type="submit" style={styles.button}>Upload</button>
        </form>
        {message && <div style={styles.message}>{message}</div>}
      </div>
    </div>
  );
}

export default AdminUploadPage;
