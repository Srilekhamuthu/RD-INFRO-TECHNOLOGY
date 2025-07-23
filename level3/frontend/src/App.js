import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EntrancePage from './pages/EntrancePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminUploadPage from './pages/AdminUploadPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntrancePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/admin/upload" element={<AdminUploadPage />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
