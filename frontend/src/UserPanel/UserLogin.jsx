import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Validation from './LoginValidation';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './UserLogin.css';

const UserLogin = () => {

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
                const res = await axios.post('http://localhost:8081/user/login', values);
                if (res.data.Status === "Success") {
                    navigate('/');
                } else {
                    alert("Nincs felhasználó regisztrálva");
                }
            } catch (err) {
                console.error("Hiba történt a bejelentkezés során:", err);
            }
        }
    };

    const handleAuth = () => {
        axios.get('http://localhost:8081/user', {
            headers: {
                'access-token' : localStorage.getItem("token")
            }
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
    
        return (
            <div className="hatter">
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Bejelentkezés</h1>
                    <div className="input-box">
                    <input 
                            type="text" 
                            className="form-control" 
                            name="email" 
                            placeholder="Add meg az email címed"
                            value={values.email} 
                            onChange={handleInput}
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                    <input 
                            type="password" 
                            className="form-control" 
                            name="jelszo" 
                            placeholder="Add meg a jelszavad" 
                            value={values.jelszo} 
                            onChange={handleInput}
                        />
                        {errors.jelszo && <span className='text-danger'>{errors.jelszo}</span>}
                        <FaLock className="icon" />
                    </div>
    
    
                    <div className="remember-forgot">
                        
                        <a href="#">Elfelejtette a jelszavát?</a>
                    </div>
    
                    <button onClick={handleAuth} type="submit">Bejelentkezés</button>
    
                    <div className="register-link">
                        <p>Nincs még fiókod? <a href="/user/registration">Regisztráció</a></p>
                    </div>
    
                </form>
    
            </div>
            </div>
        );
};

export default UserLogin;

