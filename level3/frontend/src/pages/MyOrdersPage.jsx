import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token'); // ✅ get JWT

    try {
      const res = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ include token
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = (id) => {
    setOrderToCancel(id);
    setShowPopup(true);
  };

  const confirmCancel = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/cancel/${orderToCancel}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
      setShowPopup(false);
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  const handleRemove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/orders/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      padding: '30px',
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(to right, #e0f7fa, #ffe0f0)',
    },
    card: {
      background: 'white',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      marginBottom: '20px',
    },
    cancelled: {
      textDecoration: 'line-through',
      opacity: 0.6,
    },
    button: {
      padding: '8px 16px',
      marginTop: '10px',
      marginRight: '10px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    cancelBtn: {
      backgroundColor: '#ff6f61',
      color: 'white',
    },
    removeBtn: {
      backgroundColor: '#636e72',
      color: 'white',
    },
    popup: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupBox: {
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    },
    productItem: {
      paddingLeft: '20px',
      fontSize: '0.95rem',
      marginBottom: '5px',
    },
  };

  return (
    <div style={styles.page}>
      <h2>📦 My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            ...styles.card,
            ...(order.is_cancelled ? styles.cancelled : {}),
          }}
        >
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Total:</strong> ₹{order.total_amount}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Delivery:</strong> {order.delivery_date?.slice(0, 10)} at {order.delivery_time}</p>

          <p><strong>Items:</strong></p>
          {Array.isArray(order.products) ? (
            order.products.map((item, i) => (
              <div key={i} style={styles.productItem}>
                • {item.name} - ₹{item.price}
              </div>
            ))
          ) : (
            <div>No items found</div>
          )}

          <p><strong>Status:</strong> {order.is_cancelled ? '❌ Cancelled' : '✅ Confirmed'}</p>

          {!order.is_cancelled && (
            <button
              style={{ ...styles.button, ...styles.cancelBtn }}
              onClick={() => handleCancel(order.id)}
            >
              Cancel Order
            </button>
          )}

          {order.is_cancelled && (
            <button
              style={{ ...styles.button, ...styles.removeBtn }}
              onClick={() => handleRemove(order.id)}
            >
              Remove Order
            </button>
          )}
        </div>
      ))}

      {showPopup && (
        <div style={styles.popup}>
          <div style={styles.popupBox}>
            <p>Are you sure you want to cancel this order?</p>
            <button
              style={{ ...styles.button, ...styles.cancelBtn }}
              onClick={confirmCancel}
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
