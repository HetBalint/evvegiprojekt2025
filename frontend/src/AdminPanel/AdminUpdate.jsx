import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AdminUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState({
    nev: '',
    email: '',
    szulev: '',
    lakhely: '',
    cim: '',
    adoszam: '',
    telszam: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8081/adminlist/edit/'+id)
            .then(res => {
                if (res.data.length > 0) {
                    setValues({ nev: res.data[0].nev, email: res.data[0].email, jelszo: res.data[0].jelszo, szulev: res.data[0].szulev, lakhely: res.data[0].lakhely, cim: res.data[0].cim, adoszam: res.data[0].adoszam, telszam: res.data[0].telszam});
                }
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    }, [id]);

    const handleUpdate = (event) => {
        event.preventDefault();
        axios.put('http://localhost:8081/adminlist/update/'+id, values)
        .then(res => {
            console.log(res)
            navigate('/adminlist')
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
                            <div className="mb-3">
                                <label htmlFor="jelszo" className="form-label">Jelszó</label>
                                <input
                                    type="password"
                                    id="jelszo"
                                    placeholder="Módosítsd a jelszavad!"
                                    className="form-control"
                                    value={values.jelszo}
                                    onChange={e => setValues({ ...values, jelszo: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                <label htmlFor="szulev" className="form-label">Születési idő</label>
                <input
                  type="date"
                  id="szulev"
                  placeholder="Írd be a születési idődet"
                  className="form-control"
                  value={values.szulev}
                  onChange={e => setValues({ ...values, szulev: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="lakhely" className="form-label">Lakhely</label>
                <input
                  type="text"
                  id="lakhely"
                  placeholder="Írd be a lakhelyed!"
                  className="form-control"
                  value={values.lakhely}
                  onChange={e => setValues({ ...values, lakhely: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cim" className="form-label">Cím</label>
                <input
                  type="text"
                  id="cim"
                  placeholder="Írd be a címed!"
                  className="form-control"
                  value={values.cim}
                  onChange={e => setValues({ ...values, cim: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="adoszam" className="form-label">Adószám</label>
                <input
                  type="number"
                  id="adoszam"
                  placeholder="Írd be az adószámod!"
                  className="form-control"
                  value={values.adoszam}
                  onChange={e => setValues({ ...values, adoszam: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telszam" className="form-label">Telefonszám</label>
                <input
                  type="number"
                  id="telszam"
                  placeholder="Írd be a telefonszámod!"
                  className="form-control"
                  value={values.telszam}
                  onChange={e => setValues({ ...values, telszam: e.target.value })}
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
