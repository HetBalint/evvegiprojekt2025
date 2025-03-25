import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function AdminCreate() {
  const [values, setValues] = useState({
    nev: '',
    email: '',
    jelszo: '',
    szulev: '',
    lakhely: '',
    cim: '',
    adoszam: '',
    telszam: ''
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/admin/adminlist/admin', values)
      .then(res => {
        console.log(res);
        navigate(`/admin/adminlist`);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Felhasználó hozzáadása</h2>
            <form onSubmit={handleSubmit} className="row g-4">
              <div className="col-md-6">
                <label htmlFor="nev" className="form-label">Név</label>
                <input type="text" id="nev" className="form-control" placeholder="Írd be a nevet"
                  onChange={e => setValues({ ...values, nev: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" className="form-control" placeholder="Írd be az email címet"
                  onChange={e => setValues({ ...values, email: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="jelszo" className="form-label">Jelszó</label>
                <input type="password" id="jelszo" className="form-control" placeholder="Írj be egy jelszót!"
                  onChange={e => setValues({ ...values, jelszo: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="szulev" className="form-label">Születési idő</label>
                <input type="date" id="szulev" className="form-control"
                  onChange={e => setValues({ ...values, szulev: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="lakhely" className="form-label">Lakhely</label>
                <input type="text" id="lakhely" className="form-control" placeholder="Írd be a lakhelyed!"
                  onChange={e => setValues({ ...values, lakhely: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="cim" className="form-label">Cím</label>
                <input type="text" id="cim" className="form-control" placeholder="Írd be a címed!"
                  onChange={e => setValues({ ...values, cim: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="adoszam" className="form-label">Adószám</label>
                <input type="text" id="adoszam" className="form-control" placeholder="Írd be az adószámod!"
                  onChange={e => setValues({ ...values, adoszam: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="telszam" className="form-label">Telefonszám</label>
                <input type="text" id="telszam" className="form-control" placeholder="Írd be a telefonszámod!"
                  onChange={e => setValues({ ...values, telszam: e.target.value })} />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-dark w-100">Rögzítés</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreate;
