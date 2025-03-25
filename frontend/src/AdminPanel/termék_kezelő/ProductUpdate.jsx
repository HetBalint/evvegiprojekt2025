import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    .then(res => {
      console.log(res);
      navigate('/admin/productlist');
    })
    .catch(err => console.log(err));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Termék módosítása</h2>
            <form onSubmit={handleUpdate} className="row g-4">
              <div className="col-md-6">
                <label htmlFor="nev" className="form-label">Név</label>
                <input type="text" id="nev" className="form-control" placeholder="Írd be a nevet"
                  value={values.nev} onChange={e => setValues({ ...values, nev: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="kategoria" className="form-label">Kategória</label>
                <select id="kategoria" className="form-control" value={values.kategoria}
                  onChange={e => setValues({ ...values, kategoria: e.target.value })} required>
                  <option value="">Válassz kategóriát</option>
                  {kategoriak.map(kat => (
                    <option key={kat.id} value={kat.id}>{kat.nev}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="anyag" className="form-label">Anyag</label>
                <select id="anyag" className="form-control" value={values.anyag}
                  onChange={e => setValues({ ...values, anyag: e.target.value })}>
                  <option>Válassz anyagot!</option>
                  <option value="sárgaarany">Sárga arany</option>
                  <option value="fehérarany">Fehér arany</option>
                  <option value="vörösarany">Vörös arany</option>
                  <option value="ezüst">Ezüst</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="suly" className="form-label">Súly</label>
                <input type="text" id="suly" className="form-control" placeholder="Írd be a súlyát"
                  value={values.suly} onChange={e => setValues({ ...values, suly: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="meret" className="form-label">Méret</label>
                <input type="text" id="meret" className="form-control" placeholder="Írd be a méretet"
                  value={values.meret} onChange={e => setValues({ ...values, meret: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="ar" className="form-label">Ár</label>
                <input type="text" id="ar" className="form-control" placeholder="Írd be az árát"
                  value={values.ar} onChange={e => setValues({ ...values, ar: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="keszlet" className="form-label">Készlet</label>
                <input type="text" id="keszlet" className="form-control" placeholder="Hány darab van készleten?"
                  value={values.keszlet} onChange={e => setValues({ ...values, keszlet: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="leiras" className="form-label">Leírás</label>
                <input type="text" id="leiras" className="form-control" placeholder="Írj egy termék leírást"
                  value={values.leiras} onChange={e => setValues({ ...values, leiras: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="kep" className="form-label">Kép</label>
                <input type="text" className="form-control mb-2" disabled
                  value={values.kep ? values.kep.name || values.kep : "Nincs kép"} />
                <input type="file" id="kep" className="form-control"
                  onChange={e => setValues({ ...values, kep: e.target.files[0] })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="haromD" className="form-label">3D fájl</label>
                <input type="text" className="form-control mb-2" disabled
                  value={values.haromD ? values.haromD.name || values.haromD : "Nincs 3D fájl"} />
                <input type="file" id="haromD" className="form-control" accept=".stl,.obj,.glb,.gltf"
                  onChange={e => setValues({ ...values, haromD: e.target.files[0] })} />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-dark w-100">Mentés</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdate;