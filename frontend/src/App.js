import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminList from './AdminPanel/AdminList';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminCreate from './AdminPanel/AdminCreate';
import AdminUpdate from './AdminPanel/AdminUpdate';
import AdminLogin from './AdminPanel/AdminLogin';
import AdminHome from './AdminPanel/AdminHome';
import ProductCreate from './AdminPanel/ProductCreate';
import ProductList from './AdminPanel/ProductList';




const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login külön jelenik meg */}
        <Route path="/login" element={<AdminLogin />} />
        {/* Minden más oldal az AdminHome belsejében töltődik be */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

const MainLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <AdminHome /> {/* Sidebar és navigáció mindig látható */}
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <Routes>
          <Route path="/adminlist" element={<AdminList />} />
          <Route path="/create" element={<AdminCreate />} />
          <Route path="/edit/:id" element={<AdminUpdate />} />
          <Route path="/pcreate" element={<ProductCreate />} />
          <Route path="/productlist" element={<ProductList />} />
        </Routes>
      </div>
    </div>
  );
};



export default App;
