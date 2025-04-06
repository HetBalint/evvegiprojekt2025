import { useState, useEffect } from "react"
import axios from "axios"
import "./Fiók.css"

function Fiok() {
  const [values, setValues] = useState({
    nev: "",
    email: "",
    usertel: "",
  })

  const [message, setMessage] = useState(""); // Hozzáadunk egy state-et az üzenethez

  useEffect(() => {
    axios
      .get(`http://localhost:8081/user/profile`, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setValues(res.data)
        }
      })
      .catch((err) => console.error("Error fetching data:", err))
  }, [])

  const handleUpdate = async (event) => {
    event.preventDefault()
    console.log("Frissített adatok:", values); // Ellenőrizd, hogy a values megfelelő adatokat tartalmaz

    try {
      // A backend a JWT tokenből kinyeri a felhasználó ID-ját
      await axios.put(`http://localhost:8081/user/update`, values, { withCredentials: true });
      
      // Sikeres frissítés esetén
      setMessage("Adatok sikeresen frissítve! Kérjük jelentkezzen be újra a frissített adatok megjelenítéséhez.");
    } catch (error) {
      console.error("Hiba történt a frissítés során:", error.response ? error.response.data : error.message);
      setMessage("Hiba történt a frissítés során!");
    }
  }

  return (
    <div>
      <div className="kosar-container">
        <h5 className="account-title">Felhasználó módosítása</h5>
        <div className="modal-body">
          {message && <div className="alert alert-info">{message}</div>} {/* Üzenet megjelenítése */}

          <form onSubmit={handleUpdate} className="row g-4">
            <div className="col-md-6">
              <label htmlFor="nev" className="form-label">
                Név
              </label>
              <input
                type="text"
                id="nev"
                className="form-control"
                value={values.nev}
                onChange={(e) => setValues({ ...values, nev: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="telszam" className="form-label">
                Telefonszám
              </label>
              <input
                type="text"
                id="usertel"
                className="form-control"
                value={values.usertel}
                onChange={(e) => setValues({ ...values, usertel: e.target.value })}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-dark w-100">
                Frissítés
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Fiok;
