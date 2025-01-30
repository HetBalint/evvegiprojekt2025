import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function AdminCreate() {
  const [values, setValues] = useState({
    nev: '',
    email: ''
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/adminlist/users', values)
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
              <button type="submit" className="btn btn-primary w-100">Rögzítés</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreate;
