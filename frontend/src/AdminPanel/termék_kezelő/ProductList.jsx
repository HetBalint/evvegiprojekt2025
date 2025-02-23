import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./ProductList.css"; 

function ProductList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8081/admin/productlist/") 
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
            .delete(`http://localhost:8081/admin/productlist/delete/${id}`) 
            .then(() => {
                setData(data.filter(product => product.id !== id));
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-left">Termék kezelő</h3>
                <Link to="/admin/pcreate" className="btn btn-primary shadow-sm"><FontAwesomeIcon icon={faPlus} /></Link>
            </div>


            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Név</th>
                            <th>Kategoria</th>
                            <th>Anyag</th>
                            <th>Súly</th>
                            <th>Méret</th>
                            <th>Ár</th>
                            <th>Leírás</th>
                            <th>Kép</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.nev}</td>
                                    <td>{product.kategoria}</td>
                                    <td>{product.anyag}</td>
                                    <td>{product.suly}</td>
                                    <td>{product.meret}</td>
                                    <td>{product.ar}</td>
                                    <td>{product.leiras}</td>
                                    <td><img src={`http://localhost:8081/kepek/${product.kep}`} alt="Termék kép" width="80" />
                                    </td>
                                    <td>
                                        <Link to={`/admin/pedit/${product.id}`} className="btn btn-warning btn-sm me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">
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

export default ProductList;
