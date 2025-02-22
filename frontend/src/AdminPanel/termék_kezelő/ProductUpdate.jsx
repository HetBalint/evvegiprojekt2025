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
        kep: ''
    });

    

    useEffect(() => {
        axios.get('http://localhost:8081/productlist/pedit/'+id)
            .then(res => {
                if (res.data.length > 0) {
                    setValues({ nev: res.data[0].nev, ar: res.data[0].ar, suly: res.data[0].suly, anyag: res.data[0].anyag, leiras: res.data[0].leiras, meret: res.data[0].meret, kategoria: res.data[0].kategoria, kep: res.data[0].kep});
                }
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    }, [id]);

    const handleUpdate = (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("nev", values.nev);
        formData.append("ar", values.ar);
        formData.append("suly", values.suly);
        formData.append("anyag", values.anyag);
        formData.append("leiras", values.leiras);
        formData.append("meret", values.meret);
        formData.append("kategoria", values.kategoria);
        
        if (values.kep instanceof File) {
            formData.append("file", values.kep); // Csak ha tényleg van új kép
        } else {
            formData.append("regikep", values.kep); // Ha nincs új kép, akkor a régit küldjük el
        }
        
    
        axios.put(`http://localhost:8081/productlist/update/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then(res => {
            console.log(res);
            navigate('/productlist');
        })
        .catch(err => console.log(err));
    };
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">Termék módosítása</h2>
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
                <label htmlFor="kategoria" className="form-label">Kategória</label>
                <select id="kategoria" value={values.kategoria} onChange={e => setValues({ ...values, kategoria: e.target.value })}>
                <option>Válassz típust!</option>
                    <option value="gyuru">Gyűrű</option>
                    <option value="nyaklanc">Nyaklánc</option>
                    <option value="karlanc">Karlánc</option>
                    <option value="fulbevalo">Fülbevaló</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="anyag" className="form-label">Anyag</label>
                <select id="anyag" value={values.anyag} onChange={e => setValues({ ...values, anyag: e.target.value })}>
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
                  value={values.suly}
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
                  value={values.meret}
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
                  value={values.ar}
                  onChange={e => setValues({ ...values, ar: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="leiras" className="form-label">Leírás</label>
                <input
                  type="text"
                  id="leiras"
                  placeholder="Írj egy termék leírást"
                  className="form-control"
                  value={values.leiras}
                  onChange={e => setValues({ ...values, leiras: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="file" className="form-label">Kép</label>

                {/* Ha van régi kép, akkor az input mezőbe írjuk a fájl nevét */}
                <input
                    type="text"
                    className="form-control mb-2"
                    value={values.kep ? values.kep.name || values.kep : "Nincs kép"}
                    disabled
                />

                <input
                    type="file"
                    id="file"
                    className="form-control"
                    onChange={(e) => {
                        if (e.target.files.length > 0) {
                            setValues({ ...values, kep: e.target.files[0] });
                        }
                    }}
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

export default ProductUpdate;
