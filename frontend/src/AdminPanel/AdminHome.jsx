import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminHome.css';

function AdminHome() {
    const [auth, setAuth] = useState(false);
    const [nev, setName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8081')
        .then(res => {
            if(res.data.Status === "Success") {
                setAuth(true);
                setName(res.data.nev);
            } else {
                setAuth(false);
                setMessage(res.data.Message);
            }
        })
        .catch(err => console.log(err));
    }, []);

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
        .then(res => {
            if(res.data.Status === "Success") {
                window.location.reload(true);
            } else {
                alert("Hiba a kijelentkezéskor!");
            }
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="admin-container">
            {/* Top bar menü sáv */}
            <div className="top-bar">
                <h4>Crystal Heaven - Admin Panel</h4> {/* Vagy bármilyen más szöveg */}
                <div className="top-bar-actions">
                    <span className="greeting">Üdv, {nev}!</span>
                    <Link to="/login" className="logout-link" onClick={handleLogout}>Kilépés</Link>
                </div>
            </div>

            {auth ? (
                <div className="sidebar">
                    <ul>
                        <li><Link to="/adminlist">Felhasználó kezelő</Link></li>
                        <li><Link to="/dashboard">#</Link></li>
                    </ul>
                </div>
            ) : (
                <div className="not-authenticated">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export default AdminHome;
