import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Product.css';

function ProductUpdate({ id, setShowModal }) {
  const [values, setValues] = useState({
    ar: '',
    suly: '',
    anyag: '',
    leiras: '',
    meret: '',
    nev: '',
    kategoria: '',
    kep: '',
    keszlet: '',
    haromD: ''
  });

  const [kategoriak, setKategoriak] = useState([]);

  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:8081/admin/productlist/pedit/${id}`)
      .then(res => {
        if (res.data.length > 0) {
          setValues({
            nev: res.data[0].nev,
            ar: res.data[0].ar,
            suly: res.data[0].suly,
            anyag: res.data[0].anyag,
            leiras: res.data[0].leiras,
            meret: res.data[0].meret,
            kategoria: res.data[0].kategoriaID,
            kep: res.data[0].kep,
            keszlet: res.data[0].keszlet,
            haromD: res.data[0].haromD
          });
        }
      })
      .catch(err => console.error('Error fetching data:', err));

    axios.get("http://localhost:8081/admin/kategoriak")
      .then(response => setKategoriak(response.data))
      .catch(error => console.error("Hiba a kategóriák lekérési során:", error));
  }, [id]);

  const handleUpdate = (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key === 'kep' && !(val instanceof File)) {
        formData.append("regikep", val);
      } else if (key === 'haromD' && !(val instanceof File)) {
        formData.append("regiharomD", val);
      } else {
        formData.append(key, val);
      }
    });

    axios.put(`http://localhost:8081/admin/productlist/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      setShowModal(false);
      window.location.reload();
    })
    .catch(err => console.log(err));
  };

  return (
    <form onSubmit={handleUpdate} className="row g-4">
      <div className="col-md-6">
        <label className="form-label">Név</label>
        <input
          type="text"
          className="form-control"
          value={values.nev}
          onChange={e => setValues({ ...values, nev: e.target.value })}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Kategória</label>
        <select
          className="form-control"
          value={values.kategoria}
          onChange={e => setValues({ ...values, kategoria: e.target.value })}
        >
          <option value="">Válassz kategóriát</option>
          {kategoriak.map(kat => (
            <option key={kat.id} value={kat.id}>{kat.nev}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">Ár</label>
        <input
          type="text"
          className="form-control"
          value={values.ar}
          onChange={e => setValues({ ...values, ar: e.target.value })}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Súly</label>
        <input
          type="text"
          className="form-control"
          value={values.suly}
          onChange={e => setValues({ ...values, suly: e.target.value })}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Anyag</label>
        <input
          type="text"
          className="form-control"
          value={values.anyag}
          onChange={e => setValues({ ...values, anyag: e.target.value })}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Méret</label>
        <input
          type="text"
          className="form-control"
          value={values.meret}
          onChange={e => setValues({ ...values, meret: e.target.value })}
        />
      </div>
      
      <div className="col-md-6">
        <label className="form-label">Készlet</label>
        <input
          type="number"
          className="form-control"
          value={values.keszlet}
          onChange={e => setValues({ ...values, keszlet: e.target.value })}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Kép</label>
        <input
          type="file"
          className="form-control"
          onChange={e => setValues({ ...values, kep: e.target.files[0] })}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">3D Modell</label>
        <input
          type="file"
          className="form-control"
          onChange={e => setValues({ ...values, haromD: e.target.files[0] })}
        />
      </div>
      <div className="col-md-12">
        <label className="form-label">Leírás</label>
        <textarea
          className="form-control"
          value={values.leiras}
          onChange={e => setValues({ ...values, leiras: e.target.value })}
        />
      </div>
      <div className="col-12 text-end">
        <Button variant="secondary" onClick={() => setShowModal(false)}>Mégse</Button>
        <Button variant="dark" type="submit" className="ms-2">Mentés</Button>
      </div>
    </form>
  );
}

export default ProductUpdate;