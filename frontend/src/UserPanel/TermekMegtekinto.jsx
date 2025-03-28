import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Product3D from "./Product3D";
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
            
            {/* Product3D megjelenítése a termékleírás alatt */}
            <div className="model-container">
                <Product3D productId={id} />
            </div>
        </div>
    );
}

export default TermekMegtekinto;
