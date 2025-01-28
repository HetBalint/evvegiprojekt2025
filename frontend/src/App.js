import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminList from './AdminPanel/AdminList'; // Helyes import útvonal
import 'bootstrap/dist/css/bootstrap.min.css'
import AdminCreate from './AdminPanel/AdminCreate'
import AdminUpdate from './AdminPanel/AdminUpdate'






const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminList />} />
        <Route path="/create" element={<AdminCreate />} />
        <Route path="/edit/:id" element={<AdminUpdate />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
