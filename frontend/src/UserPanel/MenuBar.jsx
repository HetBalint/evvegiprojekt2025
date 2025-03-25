import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import './MenuBar.css';
import UserLogin from './UserLogin';
import UserRegistration from './UserRegistration';

function MenuBar() {
  const [auth, setAuth] = useState(false);
  const [nev, setName] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  const getUserData = () => {
    axios.get('http://localhost:8081/user', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.nev);
        } else {
          setAuth(false);
        }
      })
      .catch(() => {
        setAuth(false);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const fetchCartCount = () => {
    axios.get('http://localhost:8081/kosar', { withCredentials: true })
      .then(res => {
        if (Array.isArray(res.data)) {
          setCartCount(res.data.reduce((acc, item) => acc + item.dbszam, 0));
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(false);
          navigate('/home');
        }
      })
      .catch(err => console.log("Kijelentkezési hiba:", err));
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light container-fluid px-4">
          <img className='logo' src='/logo(fekete).svg' alt='Logo' />
          <Link className="navbar-brand fw-bold" to="/home">Crystal Heaven</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link to="/gyuru">Gyűrű</Link></li>
              <li className="nav-item"><Link to="/nyaklanc">Nyaklánc</Link></li>
              <li className="nav-item"><Link to="/karlanc">Karlánc</Link></li>
              <li className="nav-item"><Link to="/fulbevalo">Fülbevaló</Link></li>
            </ul>
          </div>
          <div className="d-flex align-items-center">
            <Link to="/kosar" className="me-3 text-dark position-relative">
              <FaShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <div className="dropdown" style={{ float: "right" }}>
              <div className="user dropbtn"><FaUser size={24} /></div>
              <div className="dropdown-content">
                {auth ? (
                  <>
                    <p className="greeting">Üdv, {nev}!</p>
                    <Link to="#">Fiók</Link>
                    <Link to="/rendelesek">Rendeléseim</Link>
                    <button className="logout" onClick={handleLogout}>Kilépés</button>
                  </>
                ) : (
                  <>
                    <p className="greeting">Vendég vagy!</p>
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowLoginModal(true); }}>Bejelentkezés</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowRegisterModal(true); }}>Regisztráció</a>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* 🔽 MODÁL BEJELENTKEZÉS */}
      <UserLogin
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          getUserData(); // újra lekérdezi a felhasználót
          window.location.reload();
        }}
      />

      {/* 🔽 MODÁL REGISZTRÁCIÓ */}
      <UserRegistration
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true); // sikeres regisztráció után megnyitja a bejelentkezést
        }}
      />
    </>
  );
}

export default MenuBar;
