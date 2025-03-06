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
    keszlet: ''
  });

  const [kategoriak, setKategoriak] = useState([]); // Kategóriák tárolása
  const navigate = useNavigate();

  // Kategóriák betöltése a backendből
  useEffect(() => {
    axios.get("http://localhost:8081/admin/kategoriak")
      .then(response => setKategoriak(response.data))
      .catch(error => console.error("Hiba a kategóriák lekérési során:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("nev", values.nev);
    formData.append("ar", values.ar);
    formData.append("suly", values.suly);
    formData.append("anyag", values.anyag);
    formData.append("leiras", values.leiras);
    formData.append("meret", values.meret);
    formData.append("kategoria", values.kategoria); // ID kerül ide
    formData.append("file", values.kep);
    formData.append("keszlet", values.keszlet);

  
    axios
      .post("http://localhost:8081/admin/productlist/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Új termék hozzáadása</h2>
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

              {/* Dinamikus kategória választó */}
              <div className="mb-3">
                <label htmlFor="kategoria" className="form-label">Kategória</label>
                <select
                  id="kategoria"
                  className="form-control"
                  value={values.kategoria}
                  onChange={e => setValues({ ...values, kategoria: e.target.value })}
                  required
                >
                  <option value="">Válassz kategóriát</option>
                  {kategoriak.map(kat => (
                    <option key={kat.id} value={kat.id}>{kat.nev}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="anyag" className="form-label">Anyag</label>
                <select
                  id="anyag"
                  className="form-control"
                  onChange={e => setValues({ ...values, anyag: e.target.value })}
                >
                  <option>Válassz anyagot!</option>
                  <option value="sárgaarany">Sárga arany</option>
                  <option value="fehérarany">Fehér arany</option>
                  <option value="vörösarany">Vörös arany</option>
                  <option value="ezüst">Ezüst</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="suly" className="form-label">Súly</label>
                <input
                  type="text"
                  id="suly"
                  placeholder="Írd be a súlyát"
                  className="form-control"
                  onChange={e => setValues({ ...values, suly: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="meret" className="form-label">Méret</label>
                <input
                  type="text"
                  id="meret"
                  placeholder="Írd be a méretet"
                  className="form-control"
                  onChange={e => setValues({ ...values, meret: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="ar" className="form-label">Ár</label>
                <input
                  type="text"
                  id="ar"
                  placeholder="Írd be az árát"
                  className="form-control"
                  onChange={e => setValues({ ...values, ar: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="keszlet" className="form-label">Készlet</label>
                <input
                  type="text"
                  id="keszlet"
                  placeholder="Hány db van raktáron?"
                  className="form-control"
                  onChange={e => setValues({ ...values, keszlet: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="leiras" className="form-label">Leírás</label>
                <input
                  type="text"
                  id="leiras"
                  placeholder="Írj egy termék leírást"
                  className="form-control"
                  onChange={e => setValues({ ...values, leiras: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="file" className="form-label">Kép</label>
                <input
                  type="file"
                  id="file"
                  className="form-control"
                  onChange={e => setValues({ ...values, kep: e.target.files[0] })}
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

export default ProductCreate;
