import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RendelesiAdatok.css";
import CheckoutProgress from "./checkout-progress";
import { Link } from "react-router-dom";

function RendelesVeglegesito() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8081/kosar", { withCredentials: true })
            .then(res => {
                if (res.data && Array.isArray(res.data)) {
                    setCartItems(res.data);
                }
            })
            .catch(err => console.error("Hiba a kosár lekérdezésekor:", err));
    }, []);

    const totalPrice = cartItems.reduce((acc, product) => acc + product.dbszam * product.termekAr, 0);

    const handleOrderSubmit = () => {
        axios.post("http://localhost:8081/rendeles", { items: cartItems, total: totalPrice }, { withCredentials: true })
            .then(res => {
                console.log("✅ Rendelés sikeresen elküldve:", res.data);
                alert("Rendelés sikeresen leadva!");
                setCartItems([]); 
            })
            .catch(err => console.error("Hiba a rendelés véglegesítésekor:", err));
    };

    return (
        <div className="adatok-container">
            <CheckoutProgress currentStep={2} />
            {cartItems.length === 0 ? (
                <p className="empty-cart">A kosár üres.</p>
            ) : (
                <div className="order-summary">
                    
                    
                    <Link to={`/kosar`} className="kosar-btn">Kosár</Link>
                    <Link to={`/rendeles`} className="leadas-btn">Rendelés áttekintése</Link>
                </div>
            )}
        </div>
    );
}

export default RendelesVeglegesito;
