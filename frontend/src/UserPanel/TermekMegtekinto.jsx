import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./TermekMegtekinto.css";

function TermekMegtekinto() {
    const { id } = useParams(); // Termék ID lekérése az URL-ből
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

    if (!product) {
        return <div className="loading-container"><h3>Termék betöltése...</h3></div>;
    }

    return (
        <div className="termek-container">
            <h2 className="termek-nev">{product.termekNev}</h2>
            <div className="termek-tartalom">
                <div className="termek-kep">
                    <img 
                        src={`http://localhost:8081/kepek/${product.kep}`} 
                        alt={product.termekNev} 
                    />
                </div>
                <div className="termek-info">
                    <h4 className="termek-ar">Ár: {product.ar} Ft</h4>
                    <p><strong>Kategória:</strong> {product.kategoriaNev}</p>
                    <p><strong>Anyag:</strong> {product.anyag}</p>
                    <p><strong>Súly:</strong> {product.suly} g</p>
                    <p><strong>Méret:</strong> {product.meret} mm</p>
                    <p><strong>Készlet:</strong> {product.keszlet > 0 ? `Raktáron (${product.keszlet} db)` : "Nincs raktáron"}</p>
                    <p><strong>Leírás:</strong> {product.leiras}</p>
                    <button className="kosarba-gomb">Kosárba rakás</button>
                </div>
            </div>
            
                
                </div>
            
        
    );
}

export default TermekMegtekinto;
