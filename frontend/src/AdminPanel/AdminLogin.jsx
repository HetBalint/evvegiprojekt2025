import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminLogin() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit =(event) => {
        event.preventDefault();
        
    }


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Admin Bejelentkezés</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" name="email" placeholder="Add meg az emailcímed" 
            onChange={handleInput}/>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Jelszó</label>
            <input type="password" className="form-control" name="password" placeholder="Add meg a jelszavad" 
            onChange={handleInput}/>
          </div>
          <button type="submit" className="btn btn-success w-100">Bejelentkezés</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
