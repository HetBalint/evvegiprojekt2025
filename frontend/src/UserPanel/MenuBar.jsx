import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import './MenuBar.css';

function MenuBar() {
  const [auth, setAuth] = useState(false);
  const [nev, setName] = useState('');
  const [cartCount, setCartCount] = useState(0); // Kosár darabszám
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/user', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.nev);
        } else {
          setAuth(false);
          navigate('/user/login');
        }
      })
      .catch(err => {
        console.log(err);
        setAuth(false);
        navigate('/user/login');
      });
  }, [navigate]);

  const fetchCartCount = () => {
    axios.get('http://localhost:8081/kosar', { withCredentials: true })
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setCartCount(res.data.reduce((acc, item) => acc + item.dbszam, 0));
        }
      })
      .catch(err => console.log("Kosár lekérdezési hiba:", err));
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchCartCount, 1000); 
    return () => clearInterval(interval);
  }, []);



  const handleLogout = () => {
    axios.get('http://localhost:8081/user/logout', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          localStorage.removeItem("userToken");
          setAuth(false);
          navigate('/user/login');
        }
      })
      .catch(err => console.log("Kijelentkezési hiba:", err));
  };

  if (!auth) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light container-fluid px-4">
        <img className='logo' src='/logo(fekete).svg' alt='Logo' />
        <a className="navbar-brand fw-bold" href="/home">Crystal Heaven</a>
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
            <a className="user dropbtn"><FaUser size={24} /></a>
            <div className="dropdown-content">
              <p className="greeting">Üdv, {nev}!</p>
              <a href="#">Fiók</a>
              <a href="#">Rendeléseim</a>
              <a to="/user/login" className="logout" onClick={handleLogout}>Kilépés</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default MenuBar;