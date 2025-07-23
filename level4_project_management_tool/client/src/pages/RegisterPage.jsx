import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
    register(username: $username, email: $email, password: $password, role: $role) {
      id
      username
    }
  }
`;

function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: '' });
  const [registerUser] = useMutation(REGISTER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ variables: form });
      alert('🎉 Registration successful!');
      navigate('/login'); // ✅ Navigate to Login after success
    } catch (err) {
      alert('❌ Registration failed: ' + err.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={formBox}>
        <h2 style={title}>📝 Register</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="👤 Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            style={inputStyle}
          />
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
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
            style={inputStyle}
          >
            <option value="">🎓 Select Role</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
          <button type="submit" style={buttonStyle}>Register</button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={linkStyle}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

// 🎨 Styling
const pageStyle = {
  background: 'linear-gradient(to top left, #fff3e0, #fbeaff, #f6ffde, #dff6ff)',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Poppins, sans-serif',
};

const formBox = {
  backgroundColor: '#ffffffcc',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  width: '100%',
  maxWidth: '400px',
};

const title = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#4a4a4a'
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
  borderRadius: '8px',
  backgroundColor: '#ff6f61',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.3s ease',
};

const linkStyle = {
  color: '#5e60ce',
  cursor: 'pointer',
  fontWeight: 'bold',
  textDecoration: 'underline',
};

export default RegisterPage;
