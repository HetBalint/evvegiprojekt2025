import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Product.css";

function ProductCreate({ setShowModal }) {
  const [values, setValues] = useState({
    ar: "",
    suly: "",
    anyag: "",
    leiras: "",
    meret: "",
    nev: "",
    kategoria: "",
    kep: null,
    keszlet: "",
    haromD: null,
  });

  const [kategoriak, setKategoriak] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/admin/kategoriak")
      .then((response) => setKategoriak(response.data))
      .catch((error) =>
        console.error("Hiba a kategóriák lekérési során:", error)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    axios
      .post("http://localhost:8081/admin/productlist/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setShowModal(false);
        navigate("/admin/productlist");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form className="row g-4">
      <div className="col-md-6">
        <label className="form-label">Név</label>
        <input
          type="text"
          name="nev"
          className="form-control"
          placeholder="Írd be a nevet"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Kategória</label>
        <select
          name="kategoria"
          className="form-control"
          required
          onChange={handleChange}
        >
          <option value="">Válassz kategóriát</option>
          {kategoriak.map((kat) => (
            <option key={kat.id} value={kat.id}>
              {kat.nev}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label">Anyag</label>
        <select name="anyag" className="form-control" onChange={handleChange}>
          <option value="">Válassz anyagot!</option>
          <option value="sárgaarany">Sárga arany</option>
          <option value="fehérarany">Fehér arany</option>
          <option value="vörösarany">Vörös arany</option>
          <option value="ezüst">Ezüst</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label">Súly</label>
        <input
          type="text"
          name="suly"
          className="form-control"
          placeholder="Írd be a súlyát"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Ár</label>
        <input
          type="text"
          name="ar"
          className="form-control"
          placeholder="Írd be az árát"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Készlet</label>
        <input
          type="text"
          name="keszlet"
          className="form-control"
          placeholder="Hány db van raktáron?"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Méret</label>
        <input
          type="text"
          name="meret"
          className="form-control"
          placeholder="Írd be a méretet (pl. 52, 18cm, stb.)"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Kép</label>
        <input
          type="file"
          name="kep"
          className="form-control"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">3D fájl</label>
        <input
          type="file"
          name="haromD"
          className="form-control"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-12">
        <label className="form-label">Leírás</label>
        <textarea
          name="leiras"
          className="form-control"
          placeholder="Írd be a termék leírását"
          rows="3"
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="col-md-12 text-end">
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Mégse
        </Button>
        <Button variant="dark" className="ms-2" onClick={handleSubmit}>
          Mentés
        </Button>
      </div>
    </form>
  );
}

export default ProductCreate;
