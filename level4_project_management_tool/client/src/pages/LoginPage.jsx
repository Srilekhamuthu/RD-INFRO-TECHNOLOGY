import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        role
      }
    }
  }
`;

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loginUser] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: form });
      const { token, user } = data.login;

      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role);

      alert(`🎉 Welcome ${user.username} (${user.role})!`);
      navigate('/dashboard');
    } catch (err) {
      alert('❌ Login failed: ' + err.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={formBox}>
        <h2 style={title}>🔐 Login</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            placeholder="📧 Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="🔒 Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
        <p style={footerText}>
          New here?{" "}
          <span onClick={() => navigate("/register")} style={linkText}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

// 🎨 Styles
const pageStyle = {
  background: 'linear-gradient(to bottom right, #e0f4ff, #ffddee, #d7ffe0, #fff6c2)',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Poppins, sans-serif',
};

const formBox = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  width: '400px',
  textAlign: 'center',
};

const title = {
  marginBottom: '20px',
  color: '#333',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#5e60ce',
  color: '#fff',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const footerText = {
  marginTop: '15px',
  color: '#555',
};

const linkText = {
  color: '#5e60ce',
  cursor: 'pointer',
  textDecoration: 'underline',
};

export default LoginPage;
