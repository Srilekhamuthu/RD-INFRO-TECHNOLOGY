import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedAddress = localStorage.getItem('deliveryAddress') || '';
    const savedPhone = localStorage.getItem('phoneNumber') || '';
    setAddress(savedAddress);
    setPhone(savedPhone);

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    const userId = parseInt(localStorage.getItem('user_id'));
    if (!userId) {
      alert('User not logged in. Please login again.');
      navigate('/login');
      return;
    }

    const order = {
      user_id: userId,
      products: cartItems,
      total_amount: getTotal(),
      address,
      phone,
      payment_method: paymentMethod,
      delivery_date: new Date().toISOString().slice(0, 10),
      delivery_time: '10:00 AM',
    };

    try {
      await axios.post('http://localhost:5000/api/orders', order);
      alert('✅ Order placed successfully!');
      localStorage.removeItem('cart');
      navigate('/orders');
    } catch (err) {
      console.error('❌ Error placing order:', err);
      alert('❌ Failed to place order');
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(to right, #ffe0f0, #d7efff)',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
    },
    box: {
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto',
    },
    section: { marginBottom: '20px' },
    label: { fontWeight: 'bold' },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#6c5ce7',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#333',
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '10px',
    },
    radioItem: { marginBottom: '10px' },
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <div style={styles.title}>🧾 Confirm & Pay</div>

        <div style={styles.section}>
          <div><span style={styles.label}>Address:</span> {address}</div>
          <div><span style={styles.label}>Phone:</span> {phone}</div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Select Payment Method</div>
          <div style={styles.radioGroup}>
            {['COD', 'UPI', 'Card'].map((method) => (
              <label style={styles.radioItem} key={method}>
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {method === 'COD' && ' Cash on Delivery (COD)'}
                {method === 'UPI' && ' UPI'}
                {method === 'Card' && ' Debit / Credit Card'}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Total Amount: ₹{getTotal()}</div>
        </div>

        <button style={styles.button} onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
