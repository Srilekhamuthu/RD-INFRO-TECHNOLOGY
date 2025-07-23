import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // ✅ Save important user data
      localStorage.setItem('user_id', res.data.user.id);
      localStorage.setItem('is_admin', res.data.user.is_admin ? 'true' : 'false'); // ✅ as string
      localStorage.setItem('token', res.data.token); // if you're sending token

      // ✅ Redirect based on role
      if (res.data.user.is_admin) {
        navigate('/admin/upload');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      console.error('❌ Login error:', err);
    }
  };

  const styles = {
    outerWrapper: {
      height: '100vh',
      background: 'linear-gradient(-45deg, #ffb3c1, #bae6fd, #ffe4a7, #c4b5fd)',
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
      backgroundColor: '#ff6f61',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem',
      marginTop: '10px',
    },
    error: { color: 'red', marginTop: '10px' },
    link: {
      marginTop: '15px',
      fontSize: '0.9rem',
    },
    anchor: {
      color: '#ff6f61',
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
          <h2 style={styles.heading}>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" style={styles.button}>Login</button>
            {error && <div style={styles.error}>{error}</div>}
          </form>
          <p style={styles.link}>
            New user? <a href="/register" style={styles.anchor}>Register here</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
