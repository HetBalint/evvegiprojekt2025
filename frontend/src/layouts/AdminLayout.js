import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHome from '../AdminPanel/home/AdminHome';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <AdminHome /> {/* Sidebar */}
      <div style={{ marginLeft: '50px', padding: '20px', width: '100%' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
