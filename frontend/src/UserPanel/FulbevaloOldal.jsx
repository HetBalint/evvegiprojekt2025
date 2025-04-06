import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import fulbevalo_banner from "../UserPanel/fulbevalo_banner.jpg";
import "../UserPanel/GyuruOldal.css";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa"


function FulbevaloOldal() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        axios
            .get("http://localhost:8081/fulbevalok") 
            .then((res) => {
                console.log("API válasz:", res.data);
                setData(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Hiba történt az API hívás során:", err);
                setData([]);
            });
    }, []);
    
    return (
        <div className="gyuru-container bg-light min-vh-100">
            {/* Banner */}
            <section className="gyuru-banner position-relative text-center text-white"
                 style={{ backgroundImage: `url(${fulbevalo_banner})` }}>
                <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                <div className="banner-content position-absolute top-50 start-50 translate-middle">
                    <h1 className="display-4 fw-bold">Fülbevalók</h1>
                </div>
            </section>
            
            {/* Terméklista */}
            <div className="container mt-4">
                <div className="row">
                    {data.length > 0 ? (
                        data.map((product) => (
                            <div key={product.id} className="col-6 col-md-3 mb-3" onClick={() => navigate(`/termek/${product.id}`)}>
                                <div className="card gyuru-card h-100" style={{ cursor: "pointer" }}>
                                    <img src={`http://localhost:8081/kepek/${product.kep}`} className="card-img-top" alt={product.nev} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.nev}</h5>
                                        <p className="card-text">{product.ar} Ft</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center w-100">Nincsenek elérhető fülbevalók</div>
                    )}
                </div>
            </div>
             {/* Lábléc */}
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
};
    
export default FulbevaloOldal;