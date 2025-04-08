import axios from 'axios';
import React, { useEffect, useState } from 'react';

function AdminUpdate({ showModal, setShowModal, adminId }) {
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

  useEffect(() => {
    if (adminId) {
      axios.get(`http://localhost:8081/admin/adminlist/edit/${adminId}`)
        .then(res => {
          if (res.data.length > 0) {
            setValues(res.data[0]);
          }
        })
        .catch(err => console.error('Error fetching data:', err));
    }
  }, [adminId]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8081/admin/adminlist/update/${adminId}`, values);
      setShowModal(false); 
      window.location.reload();
    } catch (error) {
      console.error('Error updating admin:', error.response ? error.response.data : error.message);
    }
  };

  return showModal ? (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Felhasználó módosítása</h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleUpdate} className="row g-4">
              <div className="col-md-6">
                <label htmlFor="nev" className="form-label">Név</label>
                <input type="text" id="nev" className="form-control" value={values.nev}
                  onChange={e => setValues({ ...values, nev: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" className="form-control" value={values.email}
                  onChange={e => setValues({ ...values, email: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label htmlFor="jelszo" className="form-label">Jelszó</label>
                <input type="password" id="jelszo" className="form-control" value={values.jelszo} placeholder='Adj meg egy új jelszót ha elfelejtetted'
                  onChange={e => setValues({ ...values, jelszo: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label htmlFor="szulev" className="form-label">Születési idő</label>
                <input type="date" id="szulev" className="form-control" value={values.szulev}
                  onChange={e => setValues({ ...values, szulev: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label htmlFor="lakhely" className="form-label">Lakhely</label>
                <input type="text" id="lakhely" className="form-control" value={values.lakhely}
                  onChange={e => setValues({ ...values, lakhely: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label htmlFor="cim" className="form-label">Cím</label>
                <input type="text" id="cim" className="form-control" value={values.cim}
                  onChange={e => setValues({ ...values, cim: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label htmlFor="adoszam" className="form-label">Adószám</label>
                <input type="text" id="adoszam" className="form-control" value={values.adoszam}
                  onChange={e => setValues({ ...values, adoszam: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label htmlFor="telszam" className="form-label">Telefonszám</label>
                <input type="text" id="telszam" className="form-control" value={values.telszam}
                  onChange={e => setValues({ ...values, telszam: e.target.value })} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-dark w-100">Frissítés</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default AdminUpdate;
