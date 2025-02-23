import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminList from './AdminPanel/admin_kezelő/AdminList';
import AdminCreate from './AdminPanel/admin_kezelő/AdminCreate';
import AdminUpdate from './AdminPanel/admin_kezelő/AdminUpdate';
import AdminLogin from './AdminPanel/admin_kezelő/AdminLogin';
import ProductCreate from './AdminPanel/termék_kezelő/ProductCreate';
import ProductList from './AdminPanel/termék_kezelő/ProductList';
import ProductUpdate from './AdminPanel/termék_kezelő/ProductUpdate';
import UserHome from './UserPanel/UserHome.jsx';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin bejelentkezés külön */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin felület */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="adminlist" element={<AdminList />} />
          <Route path="create" element={<AdminCreate />} />
          <Route path="edit/:id" element={<AdminUpdate />} />
          <Route path="pcreate" element={<ProductCreate />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="pedit/:id" element={<ProductUpdate />} />
        </Route>

        {/* Felhasználói felület */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/*" element={<UserLayout />}>
          <Route index path="home" element={<UserHome />} />
          {/* Ide jönnek majd a user oldalak */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
