import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import './UserLogin.css';

function UserRegistration() {
  const [values, setValues] = useState({
    nev: '',
    email: '',
    jelszo: '',
    usertel: ''
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    
    axios.post('http://localhost:8081/admin/userlist/user', values)
      .then(res => {
        console.log(res);
        navigate(`/user/login`)
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="hatter">
    <div className='wrapper'>
                    <form onSubmit={handleSubmit}>
                        <h1>Regisztráció</h1>
                        <div className="input-box">
                        <input 
                                type="text" 
                                className="form-control" 
                                name="nev" 
                                placeholder="Add meg a neved"
                                onChange={e => setValues({ ...values, nev: e.target.value })}
                            />
                            
                        </div>
                        <div className="input-box">
                        <input 
                                type="email" 
                                className="form-control" 
                                name="email" 
                                placeholder="Add meg az email-címed"  
                                onChange={e => setValues({ ...values, email: e.target.value })}
                            />
                            
                        </div>

                        <div className="input-box">
                        <input 
                                type="password" 
                                className="form-control" 
                                name="jelszo" 
                                placeholder="Adj meg egy jelszót"  
                                onChange={e => setValues({ ...values, jelszo: e.target.value })}
                            />
                            
                        </div>

                        <div className="input-box">
                        <input 
                                type="tel" 
                                className="form-control" 
                                name="usertel" 
                                placeholder="Add meg a telefonszámod"  
                                onChange={e => setValues({ ...values, usertel: e.target.value })}
                            />
                            
                        </div>
        
                        <button  type="submit">Regisztráció</button>
        
                    </form>
        
                </div>
                </div>
  );
}

export default UserRegistration;
