import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHome.css';

function AdminHome() {
    const [auth, setAuth] = useState(false);
    const [nev, setName] = useState('');
    const navigate = useNavigate(); // React Router hook az átirányításhoz

    useEffect(() => {
        axios.get('http://localhost:8081/admin', { withCredentials: true })
        .then(res => {
            if (res.data.Status === "Success") {
                setAuth(true);
                setName(res.data.nev);
            } else {
                setAuth(false);
                navigate('/user/login'); // Ha nem sikerül az auth, átirányítás a loginra
            }
        })
        .catch(err => {
            console.log(err);
            setAuth(false);
            navigate('/admin/login'); // Hiba esetén is átirányítás
        });
    }, [navigate]);
    

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout', { withCredentials: true })
            .then(res => {
                if (res.data.Status === "Success") {
                    localStorage.removeItem("adminToken"); // 🔥 Eltávolítjuk a helyi tárolóból is
                    setAuth(false); // 🔥 Az állapot törlése, hogy az UI is frissüljön
                    navigate('/admin/login'); // 🔥 Átirányítás a login oldalra
                }
            })
            .catch(err => console.log("Kijelentkezési hiba:", err));
    };
    

    if (!auth) {
        return null; // UI nem jelenik meg, amíg az átirányítás folyamatban van
    }

    return (
        <div className="sidebar">
            <h5>Crystal Heaven - Admin Panel</h5>
    

        <ul>
            <li><Link to="/admin/adminlist">Felhasználó kezelő</Link></li>
            <li><Link to="/admin/productlist">Termék kezelő</Link></li>
        </ul>
            <span className="greeting">Üdv, {nev}!</span>
            <Link to="/admin/login" className="logout-link" onClick={handleLogout}>Kilépés</Link>
        </div>

    );
}

export default AdminHome;
