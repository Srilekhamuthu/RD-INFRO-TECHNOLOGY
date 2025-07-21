import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EntrancePage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Welcome to Project Manager 🌟</h1>
        <p style={styles.quote}>
          “Let’s turn plans into progress.” 
        </p>
        <button onClick={() => setShowModal(true)} style={styles.growButton}>
          Let’s Grow Together 🚀
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalBox}>
            <h2>Get Started</h2>
            <p>Please choose an option:</p>
            <div style={styles.buttonRow}>
              <button onClick={() => navigate('/login')} style={styles.modalButton}>Login</button>
              <button onClick={() => navigate('/register')} style={styles.modalButton}>Register</button>
            </div>
            <button onClick={() => setShowModal(false)} style={styles.closeButton}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', // dark blue modern theme
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    position: 'relative',
    textAlign: 'center',
    padding: '1rem',
  },
  overlay: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  quote: {
    fontSize: '1.2rem',
    marginBottom: '2.5rem',
    opacity: 0.85,
  },
  growButton: {
    padding: '1rem 2.5rem',
    fontSize: '1.2rem',
    background: 'linear-gradient(to right, #00c6ff, #0072ff)',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0px 4px 15px rgba(0, 114, 255, 0.5)',
    transition: 'transform 0.2s ease-in-out',
  },

  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBox: {
    backgroundColor: '#fff',
    color: '#333',
    padding: '2rem',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 0 25px rgba(0,0,0,0.3)',
    position: 'relative',
    textAlign: 'center',
    animation: 'scaleIn 0.3s ease',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  modalButton: {
    backgroundColor: '#0072ff',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#777',
    cursor: 'pointer',
  },
};

export default EntrancePage;
