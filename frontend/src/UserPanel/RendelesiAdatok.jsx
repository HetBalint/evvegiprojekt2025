import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RendelesiAdatok.css";
import CheckoutProgress from "./checkout-progress";
import { Link } from "react-router-dom";

function RendelesiAdatok() {
    const [nev, setName] = useState('');
    const [email, setEmail] = useState('');
    const [usertel, setTel] = useState('');
  

  
        useEffect(() => {
            axios.get('http://localhost:8081/user', { withCredentials: true })
              .then(res => {
                if (res.data.Status === "Success") {
                  setName(res.data.nev);
                  setEmail(res.data.email);
                  setTel(res.data.usertel);

                }
              })
              
          });

    return (
        <div className="adatok-container">
            <CheckoutProgress currentStep={2} />
            <div className="order-summary">
                <h2>Megrendelő adatai</h2>
                <p><strong>Név:</strong> {nev}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Telefon:</strong> {usertel}</p>
                
                <Link to={`/kosar`} className="kosar-btn">Kosár</Link>
                <Link to={`/rendeles`} className="leadas-btn">Rendelés áttekintése</Link>
            </div>
        </div>
    );
}

export default RendelesiAdatok;
