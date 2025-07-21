import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
    register(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
    }
  }
`;

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'member' });
  const [register] = useMutation(REGISTER);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ variables: formData });
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Create Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
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
            style={styles.select}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(135deg, #b2f7ef, #ffd6a5, #d9b8ff, #fdfd96)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#fff',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#0072ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  footerText: {
    marginTop: '1rem',
    fontSize: '0.95rem',
    color: '#333',
  },
  link: {
    color: '#0072ff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default RegisterPage;
