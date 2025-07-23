import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartWithQuantity = storedCart.map(item => ({ ...item, quantity: 1 }));
    setCartItems(cartWithQuantity);
  }, []);

  const updateLocalStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    updateLocalStorage(updated);
  };

  const changeQuantity = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 1 ? newQty : 1 };
      }
      return item;
    });
    setCartItems(updated);
    updateLocalStorage(updated);
  };

  const getTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const proceedToPayment = () => {
    navigate('/payment');
  };

  const continueShopping = () => {
    navigate('/home');
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(to right, #ffe0f0, #d7efff)',
      padding: '30px',
      fontFamily: 'Segoe UI, sans-serif',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '30px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333',
    },
    card: {
      background: 'white',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      marginBottom: '15px',
    },
    productName: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    qtyControls: {
      marginTop: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    qtyButton: {
      padding: '6px 12px',
      borderRadius: '50%',
      background: 'linear-gradient(to bottom right, #f8e1f4, #cde9f6)',
      color: '#333',
      border: '2px solid #a29bfe',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1.1rem',
    },
    quantity: {
      fontSize: '1rem',
      fontWeight: 'bold',
      minWidth: '30px',
      textAlign: 'center',
    },
    removeBtn: {
      marginTop: '10px',
      background: 'linear-gradient(to right, #ff6f61, #ff9999)',
      border: 'none',
      padding: '10px 15px',
      color: 'white',
      borderRadius: '30px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(255, 111, 97, 0.3)',
      transition: 'background 0.3s ease',
    },
    total: {
      marginTop: '30px',
      fontSize: '1.3rem',
      fontWeight: 'bold',
      textAlign: 'right',
    },
    proceedBtn: {
      marginTop: '20px',
      background: 'linear-gradient(to right, #00b894, #55efc4)',
      border: 'none',
      padding: '12px 25px',
      color: 'white',
      borderRadius: '30px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      float: 'right',
      marginLeft: '10px',
      boxShadow: '0 4px 12px rgba(0, 184, 148, 0.3)',
      transition: 'transform 0.2s ease',
    },
    continueBtn: {
      marginTop: '20px',
      background: 'linear-gradient(to right, #6c5ce7, #a29bfe)',
      border: 'none',
      padding: '12px 25px',
      color: 'white',
      borderRadius: '30px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      float: 'right',
      boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)',
      transition: 'transform 0.2s ease',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px',
    },
  };

  return (
    <>
      <style>{`
        button:hover {
          transform: scale(1.05);
        }
      `}</style>

      <div style={styles.page}>
        <h2 style={styles.title}>🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.productName}>{item.name}</div>
              <div>Price: ₹{item.price}</div>
              <div style={styles.qtyControls}>
                <button style={styles.qtyButton} onClick={() => changeQuantity(item.id, -1)}>-</button>
                <span style={styles.quantity}>{item.quantity}</span>
                <button style={styles.qtyButton} onClick={() => changeQuantity(item.id, 1)}>+</button>
              </div>
              <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))
        )}

        {cartItems.length > 0 && (
          <>
            <div style={styles.total}>Total: ₹{getTotal()}</div>
            <div style={styles.buttonGroup}>
              <button style={styles.continueBtn} onClick={continueShopping}>
                ⬅️ Continue Shopping
              </button>
              <button style={styles.proceedBtn} onClick={proceedToPayment}>
                Proceed to Payment ➡️
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartPage;
