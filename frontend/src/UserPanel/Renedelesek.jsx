import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Rendelesek.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function Rendelesek() {
    const [rendelesek, setRendelesek] = useState([]);
    const [expandedRendelesId, setExpandedRendelesId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8081/rendelesek", { withCredentials: true })
            .then(res => {
                setRendelesek(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    const toggleExpand = (id) => {
        setExpandedRendelesId(prev => (prev === id ? null : id));
    };

    return (
        <div className="rendelesek-container">
            <h1>Rendeléseim</h1>
            {rendelesek.length === 0 ? (
                <p>Nincs leadott rendelésed.</p>
            ) : (
                rendelesek.map(rendeles => (
                    <div key={rendeles.id} className="rendeles-card">
                        <div className="rendeles-header" onClick={() => toggleExpand(rendeles.id)}>
                            <div>
                                <strong>Rendelés azonosító:</strong> #{rendeles.id} <br />
                                <strong>Rendelés dátuma:</strong> {new Date(rendeles.ido).toLocaleString()} <br />
                                <strong>Státusz:</strong>{" "}
                                <span
    className={`rendeles-statusz`}
    style={{
        color:
            rendeles.statusz === "feldolgozás alatt"
                ? "#8b8b8b"
                : rendeles.statusz === "szállítás alatt"
                ? "#c3c600"
                : rendeles.statusz === "átvehető"
                ? "#0dc200"
                : "black"
    }}
>
    {rendeles.statusz}
</span>


                                <br /><strong>Összeg:</strong> {rendeles.osszeg} Ft
                            </div>
                            <div className="arrow-icon">
                                {expandedRendelesId === rendeles.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </div>
                        </div>

                        {expandedRendelesId === rendeles.id && (
                            <div className="rendeles-tetelek">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Termék neve</th>
                                            <th>Mennyiség</th>
                                            <th>Egységár</th>
                                            <th>Összeg</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rendeles.tetelek.map((tetel, index) => (
                                            <tr key={index}>
                                                <td>{tetel.termekNev}</td>
                                                <td>{tetel.dbszam} db</td>
                                                <td>{tetel.termekAr} Ft</td>
                                                <td>{tetel.vegosszeg} Ft</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Rendelesek;