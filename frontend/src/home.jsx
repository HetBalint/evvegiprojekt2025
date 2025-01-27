import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";


function Home() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8081/")
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Felhasználó kezelő</h1>
            <div className='d-flex justify-content-end'>
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
                        {data.map((user, index) => (
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.nev}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Link to={`/edit/${user.id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                                    <button className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Home;
