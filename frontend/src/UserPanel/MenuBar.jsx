import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import './MenuBar.css';


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
    axios.get('http://localhost:8081/user/logout', { withCredentials: true })
        .then(res => {
            if (res.data.Status === "Success") {
                localStorage.removeItem("userToken"); // 🔥 Eltávolítjuk a helyi tárolóból is
                setAuth(false); // 🔥 Az állapot törlése, hogy az UI is frissüljön
                navigate('/user/login'); // 🔥 Átirányítás a login oldalra
            }
        })
        .catch(err => console.log("Kijelentkezési hiba:", err));
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
                  <li className="nav-item"><Link to="/home">Főoldal</Link></li>
                  <li className="nav-item"><Link to="/gyuru">Gyűrű</Link></li>
                  <li className="nav-item"><Link to="/nyaklanc">Nyaklánc</Link></li>
                  <li className="nav-item"><Link to="/karlanc">Karlánc</Link></li>
                  <li className="nav-item"><Link to="/fulbevalo">Fülbevaló</Link></li>
                </ul>
              </div>
              <div className="d-flex align-items-center">
             
                <a href="#cart" className=" me-3 text-dark"><FaShoppingCart size={24} /></a>
                <div class="dropdown" style={{float: "right"}}>
                <a className="user" class="dropbtn"><FaUser size={24}/></a>
                <div class="dropdown-content">
                <p className="greeting">Üdv, {nev}!</p>
                <a href="#">Fiók</a>
                <a href="#">Rendeléseim</a>
                <a to="/user/login" className="logout" onClick={handleLogout}>Kilépés</a>
                </div>
              </div>
                </div>
            </nav>
          </header>
  )
}

export default MenuBar