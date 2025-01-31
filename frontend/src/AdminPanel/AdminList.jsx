import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./AdminList.css"; // Hozzáadott saját CSS

function AdminList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8081/adminlist/") 
            .then((res) => {
                console.log("API válasz:", res.data);
                const responseData = Array.isArray(res.data) ? res.data : [];
                setData(responseData);
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

    return (
        <div className="container mt-5">
            <h3 className="text-left mb-4">Felhasználó kezelő</h3>
            <div className="d-flex justify-content-end mb-4">
                <Link to="/create" className="btn btn-primary btn-lg shadow-sm">Create New User</Link>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Név</th>
                            <th>Email</th>
                            <th>Jelszó</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((admin) => (
                                <tr key={admin.id}>
                                    <td>{admin.id}</td>
                                    <td>{admin.nev}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.jelszo}</td>
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
                                <td colSpan="5" className="text-center">Nincsenek adatok</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminList;
