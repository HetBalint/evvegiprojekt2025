import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Validation from './LoginValidation';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AdminLogin() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        jelszo: ''
    });

    axios.defaults.withCredentials = true;
    const [errors, setErrors] = useState({});
    
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
                    navigate('/admin/');
                } else {
                    alert("Nincs felhasználó regisztrálva");
                }
            } catch (err) {
                console.error("Hiba történt a bejelentkezés során:", err);
            }
        }
    };

    const handleAuth = () => {
        axios.get('http://localhost:8081/admin/', {
            headers: {
                'access-token' : localStorage.getItem("token")
            }
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Admin Bejelentkezés</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="email" 
                            placeholder="Add meg az email címed"
                            value={values.email} 
                            onChange={handleInput}
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="jelszo" className="form-label">Jelszó</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            name="jelszo" 
                            placeholder="Add meg a jelszavad" 
                            value={values.jelszo} 
                            onChange={handleInput}
                        />
                        {errors.jelszo && <span className='text-danger'>{errors.jelszo}</span>}
                    </div>
                    <button onClick={handleAuth}  type="submit" className="btn btn-dark w-100">Bejelentkezés</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
