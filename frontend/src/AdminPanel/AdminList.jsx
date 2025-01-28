import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function AdminList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8081/")
            .then((res) => {
                console.log("API válasz:", res.data); // Debugging
                const responseData = Array.isArray(res.data) ? res.data : [];
                setData(responseData);
            })
            .catch((err) => {
                console.error("Hiba történt az API hívás során:", err);
                setData([]); // Biztonsági üres tömb
            });
    }, []);

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8081/delete/${id}`)
            .then(() => {
                setData(data.filter(user => user.id !== id)); // Adat frissítése
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Felhasználó kezelő</h1>
            <div className="d-flex justify-content-end">
                <Link to="/create" className="btn btn-success">Create +</Link>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.id}</td>
                                    <td>{user.nev}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Link to={`/edit/${user.id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                                        <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Nincsenek adatok</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminList;
