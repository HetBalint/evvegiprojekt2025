import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RendelesiAdatok.css";
import CheckoutProgress from "./checkout-progress";
import { Link } from "react-router-dom";
import UserLogin from "./UserLogin";
import UserRegistration from "./UserRegistration";

function RendelesiAdatok() {
  const [id, setID] = useState('');
  const [nev, setName] = useState('');
  const [email, setEmail] = useState('');
  const [usertel, setTel] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const fetchUserData = () => {
    axios.get('http://localhost:8081/user', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setID(res.data.id);
          setName(res.data.nev);
          setEmail(res.data.email);
          setTel(res.data.usertel);
          setAuthChecked(true);
        } else {
          setShowLoginModal(true);
        }
      })
      .catch(err => {
        if (err.response?.status !== 401) {
          console.error("Hiba a /user lekérés során:", err);
        }
        setShowLoginModal(true);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!authChecked && !showLoginModal) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="adatok-container">
      <CheckoutProgress currentStep={2} />

      <div className="rendeles-adatok">
        <h2>Megrendelő adatai</h2>
        <p><strong>Név:</strong> {nev}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Telefon:</strong> {usertel}</p>
      </div>

      <div className="info">
        <p>A termékek átvétele csak az üzletben lehetséges.</p>
        <p>A fizetés a termék átvételekor lehetséges.</p>
        <Link to="/kosar" className="kosar-btn">Kosár</Link>
        <Link to="/rendeles" className="leadas-btn">Rendelés áttekintése</Link>
      </div>

      {/* 🔽 Bejelentkezési modál */}
      <UserLogin
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          fetchUserData(); // újratöltés login után
          window.location.reload();
        }}
      />

      {/* 🔽 Regisztrációs modál */}
      <UserRegistration
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true); // reg után nyissa meg a login modált
        }}
      />

      {/* Linkek a vendégeknek, ha közvetlenül látogatják az oldalt */}
      {!authChecked && (
        <div className="text-center mt-4">
          <p>Még nem vagy bejelentkezve!</p>
          <button className="btn btn-light me-2" onClick={() => setShowLoginModal(true)}>Bejelentkezés</button>
          <button className="btn btn-outline-light" onClick={() => setShowRegisterModal(true)}>Regisztráció</button>
        </div>
      )}
    </div>
  );
}

export default RendelesiAdatok;
