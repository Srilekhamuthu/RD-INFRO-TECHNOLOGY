import React, { useState } from 'react';
import './EntrancePage.css';

function EntrancePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="entrance-container">
      <h1 className="headline">Welcome to QuickBuy 🛍️</h1>
      <button className="letsbuy-btn" onClick={() => setShowModal(true)}>
        Let’s Buy ✨
      </button>

      {showModal && (
        <div className="modal-overlay fade-in">
          <div className="modal stylish-modal">
            <h2>Start Shopping!</h2>
            <p>Choose an option to get started:</p>
            <div className="modal-buttons">
              <a className="option-btn" href="/login">Login</a>
              <a className="option-btn" href="/register">Register</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EntrancePage;
