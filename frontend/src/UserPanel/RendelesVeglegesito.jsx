import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RendelesVeglegesito.css";
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
        <div className="rendeles-container">
            <CheckoutProgress currentStep={2} />
            {cartItems.length === 0 ? (
                <p className="empty-cart">A kosár üres.</p>
            ) : (
                <div className="order-summary">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Kép</th>
                                <th>Termék neve</th>
                                <th>Anyag</th>
                                <th>Méret</th>
                                <th>Darabszám</th>
                                <th>Egységár</th>
                                <th>Összeg</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(product => (
                                <tr key={product.termekID}>
                                    <td>
                                        <img src={`http://localhost:8081/kepek/${product.termekKep}`} alt={product.termekNev} className="product-img" />
                                    </td>
                                    <td>{product.termekNev}</td>
                                    <td>{product.termekAnyag}</td>
                                    <td>{product.termekMeret}</td>
                                    <td>{product.dbszam} db</td>
                                    <td>{product.termekAr} Ft</td>
                                    <td>{product.dbszam * product.termekAr} Ft</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 className="total-price">Összesen: {totalPrice} Ft</h3>
                    <Link to={`/kosar`} className="kosar-btn">Kosár</Link>
                    <Link to={`/rendeles`} className="leadas-btn">Rendelés leadása</Link>
                </div>
            )}
        </div>
    );
}

export default RendelesVeglegesito;
