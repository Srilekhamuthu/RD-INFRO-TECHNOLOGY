import React from 'react';
import AdminDashboard from './admin/AdminDashboard';
import MemberDashboard from './member/MemberDashboard';

function CommonDashboardPage({ role }) {
  if (role === 'admin') {
    return <AdminDashboard />;
  } else if (role === 'member') {
    return <MemberDashboard />;
  } else {
    return <div style={{ padding: '2rem' }}>🔒 Unauthorized Role</div>;
  }
}

export default CommonDashboardPage;
