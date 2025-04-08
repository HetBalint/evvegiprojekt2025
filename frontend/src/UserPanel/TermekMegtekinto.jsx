import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Product3D from "./Product3D";
import "./TermekMegtekinto.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function TermekMegtekinto() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/termek/${id}`)
            .then(res => {
                if (res.data.length > 0) {
                    setProduct(res.data[0]);
                }
            })
            .catch(err => console.error("Hiba a termék lekérdezésekor:", err));
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        axios.post("http://localhost:8081/kosar/termek", {
            termekId: product.termekID,
            nev: product.termekNev,
            ar: product.ar,
            meret: product.meret,
            anyag: product.anyag || "N/A",
            kep: product.kep,
            mennyiseg: 1
        }, { withCredentials: true })
        .then((res) => console.log("Termék hozzáadva a kosárhoz:", res.data))
        .catch((err) => console.error("Hiba a termék kosárba helyezésekor:", err));
    };

    if (!product) {
        return <div className="loading-container"><h3>Termék betöltése...</h3></div>;
    }

    return (
        <div>
        <div className="termek-container">
            <div className="termek-tartalom">
                <img className="termek-kep-box"
                    src={`http://localhost:8081/kepek/${product.kep}`} 
                    alt={product.termekNev} 
                />
                
                <div className="termek-info-box">
                    <h2 className="termek-nev">{product.termekNev}</h2>
                    <h5 className="termek-ar"> {product.ar} Ft</h5>
                    <p className="termek-meret">
                    <strong>Méret:</strong> {product.kategoriaNev === "gyűrű" ? ` (${product.meret} mm)` : `(${product.meret} cm)`}</p>
                    <p className="termek-keszlet"> {product.keszlet > 0 ? `Raktáron (${product.keszlet} db)` : "Nincs raktáron"}</p>
                    <p className="termek-leiras"> {product.leiras}</p>
                    
                    <button className="kosarba-gomb" disabled={product.keszlet <= 0} onClick={handleAddToCart}>Kosárba</button>
                </div>
            </div>
            
            <div className="model-container">
                <Product3D productId={id} />
            </div>
           
        </div>
                                            <footer className="footer">
                                                                        <div className="footer-links">
                                                                          <a href="/rolunk">Rólunk</a>
                                                                          <a href="/kapcsolat">Kapcsolat</a>
                                                                          <a href="/adatvedelem">Adatvédelmi irányelvek</a>
                                                                          <a href="/felhasznalasifeltetelek">Felhasználási feltételek</a>
                                                                        </div>
                                                                
                                                                        <div className="contact-info">
                                                                          <p><strong>Kapcsolat:</strong> info@crystalheaven.com</p>
                                                                          <p><strong>Telefon:</strong> +36 1 234 5678</p>
                                                                        </div>
                                                                
                                                                        <div className="social-media">
                                                                          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                                                            <FaFacebook />
                                                                          </a>
                                                                          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                                                            <FaInstagram />
                                                                          </a>
                                                                          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                                                            <FaTwitter />
                                                                          </a>
                                                                          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                                                            <FaLinkedin />
                                                                          </a>
                                                                        </div>
                                                                
                                                                        <div className="footer-bottom">
                                                                          <p>&copy; 2025 Crystal Heaven. Minden jog fenntartva.</p>
                                                                        </div>
                                                                      </footer>
        </div>
    );
}

export default TermekMegtekinto;