import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders/admin/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('❌ Admin fetch error:', err);
        setError('Failed to load orders. Only admins can view this page.');
      }
    };

    fetchAdminOrders();
  }, []);

  const styles = {
    wrapper: {
      padding: '30px',
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(to right, #e0f7fa, #ffe0f0)',
      minHeight: '100vh',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    th: {
      background: '#6c5ce7',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    heading: {
      textAlign: 'center',
      fontSize: '1.8rem',
      marginBottom: '20px',
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>📊 Admin Panel - All Orders</h2>
      {error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Delivery</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td style={styles.td}>{order.order_id}</td>
                <td style={styles.td}>{order.user_name}</td>
                <td style={styles.td}>{order.email}</td>
                <td style={styles.td}>₹{order.total_amount}</td>
                <td style={styles.td}>{order.payment_method}</td>
                <td style={styles.td}>{order.delivery_address}</td>
                <td style={styles.td}>{order.phone_number}</td>
                <td style={styles.td}>{order.status}</td>
                <td style={styles.td}>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;
