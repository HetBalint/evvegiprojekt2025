import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home'; // Helyes import útvonal

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
