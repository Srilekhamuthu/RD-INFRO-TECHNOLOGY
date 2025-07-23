import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [login] = useMutation(LOGIN);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      localStorage.setItem('token', data.login.token);
      const role = data.login.user.role;

      setShowSuccess(true);

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'member') {
          navigate('/member');
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  if (showSuccess) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.checkmark}>✅</div>
        <h2 style={styles.successMessage}>Login Successful!</h2>
        <p style={styles.confetti}>🎉 Welcome back!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>
        <p style={styles.subtitle}>Access your workspace</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.footerText}>
          Don’t have an account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(135deg, #ffb5a7, #a0e7e5, #cdb4db, #b5ead7)',
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
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#555',
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
    outline: 'none',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#0072ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
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
  successContainer: {
    height: '100vh',
    background: 'linear-gradient(to right, #d4fc79, #96e6a1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins, sans-serif',
    color: '#333',
    textAlign: 'center',
  },
  checkmark: {
    fontSize: '5rem',
    marginBottom: '1rem',
  },
  successMessage: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  confetti: {
    fontSize: '1.5rem',
  },
};

export default LoginPage;
