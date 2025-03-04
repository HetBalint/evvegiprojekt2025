import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import gyuru_banner from "../UserPanel/gyuru_banner.jpg";
import "../UserPanel/GyuruOldal.css";

function GyuruOldal() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8081/gyuruk") 
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
                style={{ backgroundImage: `url(${gyuru_banner})` }}>
                <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                <div className="banner-content position-absolute top-50 start-50 translate-middle">
                    <h1 className="display-4 fw-bold">Gyűrűk</h1>
                </div>
            </section>

            {/* Terméklista */}
            <div className="container mt-4">
               
                <div className="row">
                    {data.length > 0 ? (
                        data.map((product) => (
                            <div key={product.id} className="col-md-3 mb-2s">
                                <div className="card gyuru-card">
                                    <img src={`http://localhost:8081/kepek/${product.kep}`} className="card-img-top" alt={product.nev} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.nev}</h5>
                                        <p className="card-text">{product.ar} Ft</p>
                                        <Link to={`/gyuru/${product.id}`} className="btn btn-primary">Részletek</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center w-100">Nincsenek elérhető gyűrűk</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GyuruOldal;