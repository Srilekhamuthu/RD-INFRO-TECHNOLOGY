import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EntrancePage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Inject animation style only after mount
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes growFadeIn {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div style={pageStyle}>
      <h1 style={mainText}>💻 Welcome Developer!</h1>
      <p style={subText}>
        Start building your dream project with organized tasks & clear goals.
      </p>

      <button onClick={() => setShowModal(true)} style={growBtn}>
        🌱 Grow Together
      </button>

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>🌱 Grow Together</h2>
            <button onClick={() => navigate('/login')} style={modalBtn}>Login</button>
            <button onClick={() => navigate('/register')} style={modalBtn}>Register</button>
            <button onClick={() => setShowModal(false)} style={closeBtn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 Styles
const pageStyle = {
  background: 'linear-gradient(to top right, #fff1eb, #ace0f9, #f3ffe3, #ffe2f0)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Poppins, sans-serif',
  padding: '20px',
};

const mainText = {
  fontSize: '2.5rem',
  color: '#333',
  marginBottom: '10px',
};

const subText = {
  fontSize: '1.2rem',
  color: '#555',
  marginBottom: '30px',
  textAlign: 'center',
};

const growBtn = {
  padding: '12px 24px',
  fontSize: '1.1rem',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  transition: 'transform 0.2s',
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalBox = {
  background: '#fff',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
  animation: 'growFadeIn 0.5s ease-out',
};

const modalBtn = {
  padding: '10px 20px',
  margin: '10px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#5e60ce',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const closeBtn = {
  marginTop: '15px',
  fontSize: '0.9rem',
  backgroundColor: '#ddd',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default EntrancePage;
