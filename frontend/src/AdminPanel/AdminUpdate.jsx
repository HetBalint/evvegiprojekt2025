import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AdminUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        nev: '',
        email: '',
    });

    useEffect(() => {
        axios.get('http://localhost:8081/edit/'+id)
            .then(res => {
                if (res.data.length > 0) {
                    setValues({ nev: res.data[0].nev, email: res.data[0].email });
                }
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    }, [id]);

    const handleUpdate = (event) => {
        event.preventDefault();
        axios.put('http://localhost:8081/update/'+id, values)
        .then(res => {
            console.log(res)
            navigate('/')
        }).catch(err => console.log(err));
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">Felhasználó módosítása</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label htmlFor="nev" className="form-label">Név</label>
                                <input
                                    type="text"
                                    id="nev"
                                    placeholder="Írd be a nevet"
                                    className="form-control"
                                    value={values.nev}
                                    onChange={e => setValues({ ...values, nev: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Írd be az email címet"
                                    className="form-control"
                                    value={values.email}
                                    onChange={e => setValues({ ...values, email: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Frissítés</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUpdate;
