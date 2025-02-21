import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHome.css';

function AdminHome() {
    const [auth, setAuth] = useState(false);
    const [nev, setName] = useState('');
    const navigate = useNavigate(); // React Router hook az átirányításhoz

    useEffect(() => {
        axios.get('http://localhost:8081')
        .then(res => {
            if (res.data.Status === "Success") {
                setAuth(true);
                setName(res.data.nev);
            } else {
                setAuth(false);
                navigate('/login'); // Ha nem sikerül az auth, átirányítás a loginra
            }
        })
        .catch(err => {
            console.log(err);
            setAuth(false);
            navigate('/login'); // Hiba esetén is átirányítás
        });
    }, [navigate]);

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
        .then(res => {
            if (res.data.Status === "Success") {
                navigate('/login'); // Kijelentkezés után login oldalra dob
            } else {
                alert("Hiba a kijelentkezéskor!");
            }
        })
        .catch(err => console.log(err));
    };

    if (!auth) {
        return null; // UI nem jelenik meg, amíg az átirányítás folyamatban van
    }

    return (
        <div className="sidebar">
            <h5>Crystal Heaven - Admin Panel</h5>
    

        <ul>
            <li><Link to="/adminlist">Felhasználó kezelő</Link></li>
            <li><Link to="/productlist">Termék kezelő</Link></li>
        </ul>
            <span className="greeting">Üdv, {nev}!</span>
            <Link to="/login" className="logout-link" onClick={handleLogout}>Kilépés</Link>
        </div>

    );
}

export default AdminHome;
