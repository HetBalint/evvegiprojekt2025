import { FaUser, FaLock } from "react-icons/fa";
import React, { useState } from "react";
import Validation from './LoginValidation';
import axios from "axios";
import './UserLogin.css';
import UserRegistration from "./UserRegistration";

const UserLogin = ({ show, onClose, onLoginSuccess }) => {
  const [values, setValues] = useState({ email: '', jelszo: '' });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await axios.post('http://localhost:8081/login', values, { withCredentials: true });
        if (res.data.Status === "Success") {
          setAuthError('');
          onLoginSuccess();
        } else {
          setAuthError("Hibás email vagy jelszó");
        }
      } catch (err) {
        console.error("Bejelentkezési hiba:", err);
        setAuthError("Szerverhiba, próbáld újra.");
      }
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal show d-block hatter" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Bejelentkezés</h1>

            <div className="input-box">
              <input
                type="text"
                name="email"
                placeholder="Add meg az email címed"
                value={values.email}
                onChange={handleInput}
              />
              <FaUser className="icon" />
              {errors.email && <span className='text-danger'>{errors.email}</span>}
            </div>

            <div className="input-box">
              <input
                type="password"
                name="jelszo"
                placeholder="Add meg a jelszavad"
                value={values.jelszo}
                onChange={handleInput}
              />
              <FaLock className="icon" />
              {errors.jelszo && <span className='text-danger'>{errors.jelszo}</span>}
            </div>

            {authError && <div className="alert alert-danger">{authError}</div>}

            <div className="remember-forgot">
              <a href="#">Elfelejtette a jelszavát?</a>
            </div>

            <button type="submit">Bejelentkezés</button>

            <div className="register-link">
              <p>Nincs még fiókod? <a href="#" onClick={(e) => {
                e.preventDefault();
                setShowRegisterModal(true);
              }}>Regisztráció</a></p>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-sm btn-light mt-2"
                onClick={onClose}
                style={{ borderRadius: "20px" }}
              >
                Bezárás
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🔽 MODÁL REGISZTRÁCIÓ */}
      <UserRegistration
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setShowRegisterModal(false);
          window.location.reload();
          // regisztráció után maradunk a login modalban
        }}
      />
    </>
  );
};

export default UserLogin;
