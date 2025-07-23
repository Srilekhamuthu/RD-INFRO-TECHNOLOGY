import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Page Components
import EntrancePage from './pages/EntrancePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPanel from './pages/admin/AdminPanel';
import MemberDashboard from './pages/member/MemberDashboard';
import MemberKanbanBoard from './pages/member/MemberKanbanBoard';
import CommonDashboardPage from './pages/CommonDashboardPage';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Decode JWT to get user role
  const getUserInfo = () => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  const userInfo = getUserInfo();
  const role = userInfo?.role;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      {/* 🔷 Navigation Bar */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>🚀 Project Manager</h2>
        <div>
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate('/dashboard')} style={styles.button}>Dashboard</button>
              {role === 'admin' && (
                <>
                  <button onClick={() => navigate('/admin')} style={styles.button}>Admin</button>
                  <button onClick={() => navigate('/admin-panel')} style={styles.button}>Admin Panel</button>
                </>
              )}
              {role === 'member' && (
                <>
                  <button onClick={() => navigate('/member')} style={styles.button}>My Dashboard</button>
                  <button onClick={() => navigate('/member-kanban')} style={styles.button}>My Tasks</button>
                </>
              )}
              <button onClick={logout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={styles.button}>Login</button>
              <button onClick={() => navigate('/register')} style={styles.button}>Register</button>
            </>
          )}
        </div>
      </nav>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* 🔁 Routes */}
      <Routes>
        <Route path="/" element={<EntrancePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔄 Common Dashboard */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <CommonDashboardPage role={role} /> : <Navigate to="/login" />}
        />

        {/* 👑 Admin Routes */}
        <Route
          path="/admin"
          element={isLoggedIn && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/admin-panel"
          element={isLoggedIn && role === 'admin' ? <AdminPanel /> : <Navigate to="/" />}
        />

        {/* 👨‍💻 Member Routes */}
        <Route
          path="/member"
          element={isLoggedIn && role === 'member' ? <MemberDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/member-kanban"
          element={isLoggedIn && role === 'member' ? <MemberKanbanBoard /> : <Navigate to="/" />}
        />

        {/* 🧭 Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#1f1f1f',
    color: '#fff',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  button: {
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#00bcd4',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default App;
