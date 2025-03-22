import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaGem, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './AdminHome.css';

function AdminHome() {
    const [auth, setAuth] = useState(false);
    const [nev, setName] = useState('');
    const [showUserInfo, setShowUserInfo] = useState(false);
    const userInfoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/admin', { withCredentials: true })
            .then(res => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setName(res.data.nev);
                } else {
                    setAuth(false);
                    navigate('/admin/login');
                }
            })
            .catch(err => {
                console.log(err);
                setAuth(false);
                navigate('/admin/login');
            });
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userInfoRef.current && !userInfoRef.current.contains(event.target)) {
                setShowUserInfo(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout', { withCredentials: true })
            .then(res => {
                if (res.data.Status === "Success") {
                    localStorage.removeItem("adminToken");
                    setAuth(false);
                    navigate('/admin/login');
                }
            })
            .catch(err => console.log("Kijelentkezési hiba:", err));
    };

    const toggleUserInfo = (e) => {
        e.stopPropagation();
        setShowUserInfo(prev => !prev);
    };

    useEffect(() => {
        const handleDocumentClick = () => setShowUserInfo(false);
        if (showUserInfo) {
            document.addEventListener("click", handleDocumentClick);
        }
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [showUserInfo]);

    if (!auth) return null;

    return (
        <div className="sidebar">
            <img className='logo' src="/logonevvel(fekete).svg" alt="Logo" />

            <ul>
                <li><Link to="/admin/adminlist"><FaUsers /></Link></li>
                <li><Link to="/admin/productlist"><FaGem /></Link></li>
            </ul>

            <div className="sidebar-footer">
                <div className="user-icon-wrapper" ref={userInfoRef}>
                    <div className="user-icon" onClick={toggleUserInfo}>
                        <FaUser />
                    </div>
                    <div className={`user-info ${showUserInfo ? 'visible' : ''}`} onClick={e => e.stopPropagation()}>
                        <span className="greeting">Üdv, {nev}!</span>
                        <Link className="logout-link" onClick={handleLogout}>
                            <FaSignOutAlt />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
