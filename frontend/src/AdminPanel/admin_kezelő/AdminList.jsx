import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import AdminCreate from "./AdminCreate";
import AdminUpdate from "./AdminUpdate";

function AdminList() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:8081/admin/adminlist/")
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
            .delete(`http://localhost:8081/admin/adminlist/delete/${id}`)
            .then(() => {
                setData(data.filter(user => user.id !== id));
            })
            
    };

    const handleEditClick = (id) => {
        setSelectedAdminId(id);
        setShowEditModal(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const filteredData = data.filter(admin =>
        admin.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.telszam.includes(searchTerm)
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-left">Felhasználó kezelő</h3>
                <button className="btn btn-primary shadow-sm" onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Keresés név, email vagy telefonszám alapján..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Név</th>
                            <th>Email</th>
                            <th>Születési idő</th>
                            <th>Lakhely</th>
                            <th>Cím</th>
                            <th>Adószám</th>
                            <th>Telefonszám</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((admin) => (
                                <tr key={admin.id}>
                                    <td>{admin.id}</td>
                                    <td>{admin.nev}</td>
                                    <td>{admin.email}</td>   
                                    <td>{formatDate(admin.szulev)}</td>
                                    <td>{admin.lakhely}</td>
                                    <td>{admin.cim}</td>
                                    <td>{admin.adoszam}</td>
                                    <td>{admin.telszam}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(admin.id)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDelete(admin.id)} className="btn btn-danger btn-sm">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">Nincsenek megfelelő találatok</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <AdminCreate showModal={showModal} setShowModal={setShowModal} />
            <AdminUpdate showModal={showEditModal} setShowModal={setShowEditModal} adminId={selectedAdminId} />
        </div>
    );
}

export default AdminList;
