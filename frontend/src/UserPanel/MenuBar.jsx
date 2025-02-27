import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';


function MenuBar() {
  const [auth, setAuth] = useState(false);
    const [nev, setName] = useState('');
    const navigate = useNavigate(); // React Router hook az átirányításhoz

    useEffect(() => {
      axios.get('http://localhost:8081/user', { withCredentials: true })
      .then(res => {
          if (res.data.Status === "Success") {
              setAuth(true);
              setName(res.data.nev);
          } else {
              setAuth(false);
              navigate('/user/login'); // Ha nem sikerül az auth, átirányítás a loginra
          }
      })
      .catch(err => {
          console.log(err);
          setAuth(false);
          navigate('/user/login'); // Hiba esetén is átirányítás
      });
  }, [navigate]);
  

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
        .then(res => {
            if (res.data.Status === "Success") {
                navigate('/user/login'); // Kijelentkezés után login oldalra dob
            } else {
                alert("Hiba a kijelentkezéskor!");
            }
        })
        .catch(err => console.log(err));
    };

    if (!auth) {
        return null; // UI nem jelenik meg, amíg az átirányítás folyamatban van
    }


  return (
        
          <header className="bg-white shadow-sm sticky-top">
            <nav className="navbar navbar-expand-lg navbar-light container-fluid px-4">
              <a className="navbar-brand fw-bold" href="#">Crystal Heaven</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item"><a className="nav-link" href="#">Főoldal</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Gyűrű</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Nyaklánc</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Karlánc</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Fülbevaló</a></li>
                </ul>
              </div>
              <div className="d-flex align-items-center">
              <span className="greeting">Üdv, {nev}!</span>
                <a href="#cart" className="me-3 text-dark"><FaShoppingCart size={24} /></a>
                <a href="#profile" className="text-dark"><FaUser size={24} /></a>
              </div>
            </nav>
          </header>
  )
}

export default MenuBar