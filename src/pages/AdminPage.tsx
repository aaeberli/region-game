import React, { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';

const AdminPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }
  return <AdminPanel onLogout={() => setAuthenticated(false)} />;
};

export default AdminPage;
