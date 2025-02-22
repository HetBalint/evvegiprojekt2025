import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function AdminCreate() {
  const [values, setValues] = useState({
    nev: '',
    email: '',
    szulev: '',
    lakhely: '',
    cim: '',
    adoszam: '',
    telszam: ''
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    
    axios.post('http://localhost:8081/adminlist/admin', values)
      .then(res => {
        console.log(res);
        navigate(`/adminlist`)
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Felhasználó hozzáadása</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nev" className="form-label">Név</label>
                <input
                  type="text"
                  id="nev"
                  placeholder="Írd be a nevet"
                  className="form-control"
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
                  onChange={e => setValues({ ...values, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="jelszo" className="form-label">Jelszó</label>
                <input
                  type="password"
                  id="jelszo"
                  placeholder="Írj be egy jelszót!"
                  className="form-control"
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
                  onChange={e => setValues({ ...values, cim: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="adoszam" className="form-label">Adószám</label>
                <input
                  type="text"
                  id="adoszam"
                  placeholder="Írd be az adószámod!"
                  className="form-control"
                  onChange={e => setValues({ ...values, adoszam: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telszam" className="form-label">Telefonszám</label>
                <input
                  type="tel"
                  id="telszam"
                  placeholder="Írd be a telefonszámod!"
                  className="form-control"
                  onChange={e => setValues({ ...values, telszam: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Rögzítés</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreate;
