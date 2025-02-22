import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";


function AdminList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8081/adminlist/") 
            .then((res) => {
                console.log("API válasz:", res.data);
                setData(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Hiba történt az API hívás során:", err);
                setData([]);
            });
    }, []);

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8081/adminlist/delete/${id}`) 
            .then(() => {
                setData(data.filter(user => user.id !== id));
            })
            .catch((err) => console.log(err));
    };

    // Dátum formázása
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-left">Felhasználó kezelő</h3>
                <Link to="/create" className="btn btn-primary shadow-sm">Új felhasználó hozzáadása</Link>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Név</th>
                            <th>Email</th>
                            <th>Jelszó</th>
                            <th>Születési idő</th>
                            <th>Lakhely</th>
                            <th>Cím</th>
                            <th>Adószám</th>
                            <th>Telefonszám</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((admin) => (
                                <tr key={admin.id}>
                                    <td>{admin.id}</td>
                                    <td>{admin.nev}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.jelszo}</td>
                                    <td>{formatDate(admin.szulev)}</td>
                                    <td>{admin.lakhely}</td>
                                    <td>{admin.cim}</td>
                                    <td>{admin.adoszam}</td>
                                    <td>{admin.telszam}</td>
                                    <td>
                                        <Link to={`/edit/${admin.id}`} className="btn btn-warning btn-sm me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button onClick={() => handleDelete(admin.id)} className="btn btn-danger btn-sm">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">Nincsenek adatok</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminList;
