import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import './RendelesKezelo.css';

function RendelesKezelo() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8081/rendeleskezeles", { withCredentials: true })
            .then((res) => {
                setOrders(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Hiba történt a rendelések lekérésekor:", err);
                setOrders([]);
            });
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleStatusChange = (rendelesId, newStatus) => {
        axios.put(`http://localhost:8081/admin/rendelesek/frissit/${rendelesId}`, { statusz: newStatus }, { withCredentials: true })
            .then(() => {
                setOrders(prev => prev.map(order => order.id === rendelesId ? { ...order, statusz: newStatus } : order));
            })
            .catch(err => console.error("Státusz frissítési hiba:", err));
    };

    const filteredOrders = orders.filter(order =>
        order.statusz.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.osszeg.toString().includes(searchTerm)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "feldolgozás alatt": return "#8b8b8b";
            case "szállítás alatt": return "#c3c600";
            case "átvehető": return "#0dc200";
            default: return "black";
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-left">Rendelés kezelő</h3>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Keresés rendelések között..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Összeg</th>
                            <th>Dátum</th>
                            <th>Státusz</th>
                            <th>Tételek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.osszeg} Ft</td>
                                    <td>{new Date(order.ido).toLocaleString()}</td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={order.statusz}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{ color: getStatusColor(order.statusz) }}
                                        >
                                            <option value="feldolgozás alatt">feldolgozás alatt</option>
                                            <option value="szállítás alatt">szállítás alatt</option>
                                            <option value="átvehető">átvehető</option>
                                        </select>
                                    </td>
                                    <td>
                                        <ul>
                                            {order.tetelek.map((item, index) => (
                                                <li key={index}>{item.termekNev} - {item.dbszam} db - {item.termekAr} Ft</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Nincsenek rendelések</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RendelesKezelo;
