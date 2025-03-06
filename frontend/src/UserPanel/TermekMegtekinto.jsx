import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./TermekMegtekinto.css";

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

        
            // Ellenőrzés: Logoljuk a küldött adatokat
            console.log("Elküldött adatok:", {
                termekId: product.termekID,
                nev: product.termekNev,
                meret: product.meret,
                mennyiseg: 1,
                ar: product.ar,
                kep: product.kep,
                anyag: product.anyag || "N/A"
            });
        
    
        axios.post("http://localhost:8081/kosar/termek", {
            termekId: product.termekID,      // Termék azonosítója
            nev: product.termekNev,    // Termék neve
            ar: product.ar,            // Termék ára
            meret: product.meret,      // Termék mérete
            anyag: product.anyag || "N/A", // Ha az anyag nincs megadva, akkor "N/A"
            kep: product.kep,          // Termék képe
            mennyiseg: 1               // Alapértelmezett mennyiség
        }, { withCredentials: true })
        .then((res) => {
            console.log("Termék hozzáadva a kosárhoz:", res.data);
            
        })
        .catch((err) => console.error("Hiba a termék kosárba helyezésekor:", err));
    };
    

    if (!product) {
        return <div className="loading-container"><h3>Termék betöltése...</h3></div>;
    }

    return (
        <div className="termek-container">
            <div className="termek-tartalom">
                
                {/* Kép külön dobozban */}
                <img className="termek-kep-box"
                    src={`http://localhost:8081/kepek/${product.kep}`} 
                    alt={product.termekNev} 
                />
                
                {/* Termék információ külön dobozban */}
                <div className="termek-info-box">
                    <h2 className="termek-nev">{product.termekNev}</h2>
                    <h5 className="termek-ar"> {product.ar} Ft</h5>
                    <p className="termek-meret">
                    <strong>Méret:</strong> {product.kategoriaNev === "gyűrű" ? ` (${product.meret} mm)` : `(${product.meret} cm)`}</p>
                    <p className="termek-keszlet"> {product.keszlet > 0 ? `Raktáron (${product.keszlet} db)` : "Nincs raktáron"}</p>
                    <p className="termek-leiras"> {product.leiras}</p>
                    
                    {/* Kosárba gomb - kattintásra elküldi az adatokat a backendnek */}
                    <button className="kosarba-gomb" disabled={product.keszlet <= 0} onClick={handleAddToCart}>Kosárba</button>
                </div>
            </div>
        </div>
    );
}

export default TermekMegtekinto;
