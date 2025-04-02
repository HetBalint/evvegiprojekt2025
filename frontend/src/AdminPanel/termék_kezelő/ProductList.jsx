import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import ProductCreate from "./ProductCreate";
import ProductUpdate from "./ProductUpdate"; // importáljuk az Update komponenst
import { Modal, Button } from "react-bootstrap";
import "./ProductList.css";

function ProductList() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false); // az Update modál állapota
    const [productIdToUpdate, setProductIdToUpdate] = useState(null); // tároljuk az aktuális termék id-ját

    useEffect(() => {
        axios.get("http://localhost:8081/admin/productlist/")
            .then((res) => {
                setData(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Hiba történt az API hívás során:", err);
                setData([]);
            });
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8081/admin/productlist/delete/${id}`)
            .then(() => {
                setData(data.filter(product => product.id !== id));
            })
            .catch((err) => console.log(err));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter(product =>
        product.nev.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.kategoriaID.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.anyag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.suly.toString().includes(searchTerm) ||
        product.meret.toString().includes(searchTerm) ||
        product.ar.toString().includes(searchTerm) ||
        product.keszlet.toString().includes(searchTerm) ||
        product.leiras.toLowerCase().includes(searchTerm)
    );

    const handleEdit = (id) => {
        setProductIdToUpdate(id); // beállítjuk az id-t az Update modálhoz
        setShowUpdateModal(true); // megjelenítjük az Update modált
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-left">Termék kezelő</h3>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Keresés termékek között..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Név</th>
                            <th>Kategória</th>
                            <th>Anyag</th>
                            <th>Súly</th>
                            <th>Méret</th>
                            <th>Ár</th>
                            <th>Készlet</th>
                            <th>Leírás</th>
                            <th>Kép</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.nev}</td>
                                    <td>{product.kategoriaID}</td>
                                    <td>{product.anyag}</td>
                                    <td>{product.suly}</td>
                                    <td>{product.meret}</td>
                                    <td>{product.ar}</td>
                                    <td style={{ color: product.keszlet === 0 ? 'red' : 'inherit' }}>
                                        {product.keszlet === 0 ? "Nincs raktáron" : product.keszlet}
                                    </td>
                                    <td>{product.leiras}</td>
                                    <td>
                                        <img
                                            className="kiskep"
                                            src={`http://localhost:8081/kepek/${product.kep}`}
                                            alt="Termék kép"
                                            width="80"
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(product.id)} className="btn btn-warning btn-sm me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center">Nincsenek találatok</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Product Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Új termék hozzáadása</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductCreate setShowModal={setShowModal} />
                </Modal.Body>
            </Modal>

            {/* Update Product Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Termék módosítása</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {productIdToUpdate && (
                <ProductUpdate id={productIdToUpdate} setShowModal={setShowUpdateModal} />
                )}
            </Modal.Body>
            </Modal>

        </div>
    );
}

export default ProductList;
