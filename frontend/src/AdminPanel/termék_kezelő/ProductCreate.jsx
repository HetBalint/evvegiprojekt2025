import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function ProductCreate() {
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
    haromD: '',
  });

  const [kategoriak, setKategoriak] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8081/admin/kategoriak")
      .then(response => setKategoriak(response.data))
      .catch(error => console.error("Hiba a kategóriák lekérési során:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(values).forEach(key => formData.append(key, values[key]));

    axios
      .post("http://localhost:8081/admin/productlist/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        navigate("/admin/productlist");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Új termék hozzáadása</h2>
            <form onSubmit={handleSubmit} className="row g-4">
              <div className="col-md-6">
                <label htmlFor="nev" className="form-label">Név</label>
                <input type="text" id="nev" className="form-control" placeholder="Írd be a nevet"
                  onChange={e => setValues({ ...values, nev: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="kategoria" className="form-label">Kategória</label>
                <select id="kategoria" className="form-control" required
                  value={values.kategoria} onChange={e => setValues({ ...values, kategoria: e.target.value })}>
                  <option value="">Válassz kategóriát</option>
                  {kategoriak.map(kat => (
                    <option key={kat.id} value={kat.id}>{kat.nev}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="anyag" className="form-label">Anyag</label>
                <select id="anyag" className="form-control"
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
                  onChange={e => setValues({ ...values, suly: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="meret" className="form-label">Méret</label>
                <input type="text" id="meret" className="form-control" placeholder="Írd be a méretet"
                  onChange={e => setValues({ ...values, meret: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="ar" className="form-label">Ár</label>
                <input type="text" id="ar" className="form-control" placeholder="Írd be az árát"
                  onChange={e => setValues({ ...values, ar: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="keszlet" className="form-label">Készlet</label>
                <input type="text" id="keszlet" className="form-control" placeholder="Hány db van raktáron?"
                  onChange={e => setValues({ ...values, keszlet: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="leiras" className="form-label">Leírás</label>
                <input type="text" id="leiras" className="form-control" placeholder="Írj egy termék leírást"
                  onChange={e => setValues({ ...values, leiras: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="kep" className="form-label">Kép</label>
                <input type="file" id="kep" className="form-control"
                  onChange={e => setValues({ ...values, kep: e.target.files[0] })} />
              </div>

              <div className="col-md-6">
                <label htmlFor="haromD" className="form-label">3D fájl</label>
                <input type="file" id="haromD" className="form-control"
                  onChange={e => setValues({ ...values, haromD: e.target.files[0] })} />
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

export default ProductCreate;
