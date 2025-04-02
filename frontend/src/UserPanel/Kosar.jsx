"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Kosar.css"
import { Link } from "react-router-dom"
import CheckoutProgress from "./checkout-progress"

function Kosar() {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:8081/kosar", { withCredentials: true })
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setCartItems(res.data)
        }
      })
      .catch((err) => console.error("Hiba a kosár lekérdezésekor:", err))
  }, [])

  

  const mennyisegnoveles = (id) => {
    const product = cartItems.find(p => p.termekID === id);
    if (product && product.keszlet && product.dbszam >= product.keszlet) {
      alert("Nem tudsz többet hozzáadni, mint amennyi a készleten van!");
      return;
    }

    axios
      .put(`http://localhost:8081/kosar/update/${id}`, { action: "increase" }, { withCredentials: true })
      .then((res) => {
        setCartItems(
          cartItems.map((product) => (product.termekID === id ? { ...product, dbszam: product.dbszam + 1 } : product)),
        )
      })
      .catch((err) => console.error("Hiba a mennyiség növelésekor:", err))
  }

  const mennyisegcsokkentes = (id) => {
    axios
      .put(`http://localhost:8081/kosar/update/${id}`, { action: "decrease" }, { withCredentials: true })
      .then((res) => {
        setCartItems(
          cartItems.map((product) =>
            product.termekID === id && product.dbszam > 1 ? { ...product, dbszam: product.dbszam - 1 } : product,
          ),
        )
      })
      .catch((err) => console.error("Hiba a mennyiség csökkentésekor:", err))
  }

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8081/kosar/delete/${id}`)
      .then(() => {
        setCartItems(cartItems.filter((product) => product.termekID !== id))
      })
      .catch((err) => console.log(err))
  }

  const totalPrice = cartItems.reduce((acc, product) => acc + product.dbszam * product.termekAr, 0)

  return (
    <div>
      <div className="kosar-container">
        <CheckoutProgress currentStep={1} />
        {cartItems.length === 0 ? (
          <p className="empty-cart">A kosár üres.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((product) => (
              <div key={product.termekID} className="cart-item">
                <img
                  src={`http://localhost:8081/kepek/${product.termekKep}`}
                  alt={product.termekNev}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h3 className="termeknev">{product.termekNev}</h3>
                  <p>{product.termekAnyag}</p>
                  <p className="meret">Méret: {product.termekMeret}</p>
                  <div className="quantity-controls">
                    <button className="dbcsokkento" onClick={() => mennyisegcsokkentes(product.termekID)}>
                      -
                    </button>
                    <span className="dbszam">{product.dbszam}</span>
                    <button className="dbnovelo" onClick={() => mennyisegnoveles(product.termekID)}>
                      +
                    </button>
                    <button className="torles" onClick={() => handleDelete(product.termekID)}>
                      Termék törlése
                    </button>
                  </div>
                </div>
                <p className="ar">{product.termekAr} Ft</p>
              </div>
            ))}
            <h3 className="total-price">Összesen: {totalPrice} Ft</h3>
            <Link to={`/adatok`} className="checkout-btn">
              Tovább a megrendeléshez
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Kosar
