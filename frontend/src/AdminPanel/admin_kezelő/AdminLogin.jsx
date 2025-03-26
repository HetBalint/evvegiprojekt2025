import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Validation from './LoginValidation';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AdminLogin.css';
import hatter from './hatter_admin.jpg';



function AdminLogin() {
    const navigate = useNavigate();
    const [values, setValues] = useState({ email: '', jelszo: '' });
    const [errors, setErrors] = useState({});
    axios.defaults.withCredentials = true;

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await axios.post('http://localhost:8081/admin/login', values);
                if (res.data.Status === "Success") {
                    navigate('/admin/adminlist/');
                } else {
                    alert("Nincs felhasználó regisztrálva");
                }
            } catch (err) {
                console.error("Hiba történt a bejelentkezés során:", err);
            }
        }
    };

    return (
        <div className="background" style={{ backgroundImage: `url(${hatter})` }}>

        <div className="wrapper">
            <h1>Admin Bejelentkezés</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        name="email"
                        placeholder="Email cím"
                        value={values.email}
                        onChange={handleInput}
                    />
                </div>
                {errors.email && <span className="text-danger">{errors.email}</span>}

                <div className="input-box">
                    <input
                        type="password"
                        name="jelszo"
                        placeholder="Jelszó"
                        value={values.jelszo}
                        onChange={handleInput}
                    />
                </div>
                {errors.jelszo && <span className="text-danger">{errors.jelszo}</span>}

                <button type="submit">Bejelentkezés</button>
            </form>
        </div>
        </div>
        
    );
}

export default AdminLogin;
