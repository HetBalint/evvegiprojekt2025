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
import UserLogin from './UserPanel/UserLogin.jsx';
import UserRegistration from './UserPanel/UserRegistration.jsx';
import GyuruOldal from './UserPanel/GyuruOldal.jsx';
import NyaklancOldal from './UserPanel/NyaklancOldal.jsx';
import KarlancOldal from './UserPanel/KarlancOldal.jsx';
import FulbevaloOldal from './UserPanel/FulbevaloOldal.jsx';
import TermekMegtekinto from './UserPanel/TermekMegtekinto.jsx';
import Kosar from './UserPanel/Kosar.jsx';
import RendelesVeglegesito from './UserPanel/RendelesVeglegesito.jsx';
import RendelesiAdatok from './UserPanel/RendelesiAdatok.jsx';
import LeadottRendeles from './UserPanel/LeadottRendeles.jsx';
import Rendelesek from './UserPanel/Renedelesek.jsx';
import RendelesKezelo from './AdminPanel/rendelés_kezelő/RendelesKezelo.jsx';










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
          <Route path="orders" element={<RendelesKezelo/>} />

        </Route>

        {/* Felhasználói felület */}
        

        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/*" element={<UserLayout />}>
          <Route path="login" element={<UserLogin />} />
          <Route path="registration" element={<UserRegistration />} />
          <Route index path="home" element={<UserHome />} />
          <Route index path="gyuru" element={<GyuruOldal />} />
          
          <Route index path="nyaklanc" element={<NyaklancOldal />} />
          <Route index path="karlanc" element={<KarlancOldal />} />
          <Route index path="fulbevalo" element={<FulbevaloOldal />} />
          <Route index path="termek/:id" element={<TermekMegtekinto />} />
          <Route index path="kosar" element={<Kosar />} />
          <Route index path="rendeles" element={<RendelesVeglegesito />} />
          <Route index path="adatok" element={<RendelesiAdatok />} />
          <Route index path="leadva" element={<LeadottRendeles />} />
          <Route index path="rendelesek" element={<Rendelesek />} />
          {/* Ide jönnek majd a user oldalak */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
