import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('✅ Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error('❌ Registration error:', err);
      alert('❌ Registration failed. Please check your details.');
    }
  };

  const styles = {
    outerWrapper: {
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(-45deg, #ffe29f, #ffa07a, #b5ead7, #ffb3c1)',
      backgroundSize: '400% 400%',
      animation: 'animatedBG 12s ease infinite',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
    },
    formBox: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '40px 50px',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '90%',
    },
    heading: {
      color: '#333',
      marginBottom: '25px',
      fontSize: '28px',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem',
      marginTop: '10px',
    },
    link: {
      marginTop: '15px',
      fontSize: '0.9rem',
    },
    anchor: {
      color: '#28a745',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
    keyframes: `
      @keyframes animatedBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
  };

  return (
    <>
      <style>{styles.keyframes}</style>
      <div style={styles.outerWrapper}>
        <div style={styles.formBox}>
          <h2 style={styles.heading}>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" style={styles.button}>Register</button>
          </form>
          <p style={styles.link}>
            Already have an account? <a href="/login" style={styles.anchor}>Login here</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
