"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa"
import "./MenuBar.css"
import UserLogin from "./UserLogin"
import UserRegistration from "./UserRegistration"
import "bootstrap/dist/js/bootstrap.bundle.min"

function MenuBar() {
  const [auth, setAuth] = useState(false)
  const [nev, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation() // Get current location

  // Check if current page is the cart page
  const isCartPage = location.pathname === "/kosar"

  const getUserData = () => {
    axios
      .get("http://localhost:8081/user", { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true)
          setName(res.data.nev)
          setEmail(res.data.email)
        } else {
          setAuth(false)
        }
      })
      .catch(() => setAuth(false))
  }

  useEffect(() => {
    getUserData()
  }, [])

  const fetchCartCount = () => {
    axios
      .get("http://localhost:8081/kosar", { withCredentials: true })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCartCount(res.data.reduce((acc, item) => acc + item.dbszam, 0))
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchCartCount()
    const interval = setInterval(fetchCartCount, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout", { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(false)
          navigate("/home")
        }
      })
      .catch((err) => console.log("Kijelentkezési hiba:", err))
  }

  const handleNavLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light container-fluid px-4">
          <Link className="navbar-brand fw-bold" to="/home">
            <img className="logo" src="/logo(fekete).svg" alt="Logo" /> Crystal Heaven
          </Link>
          <button
            className={`navbar-toggler ${menuOpen ? "open" : ""}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav">
           
            <ul className="navbar-nav w-100">
              <li className="nav-item">
                <Link to="/gyuru" onClick={handleNavLinkClick} className="mobile-nav-link">
                  Gyűrű
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/nyaklanc" onClick={handleNavLinkClick} className="mobile-nav-link">
                  Nyaklánc
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/karlanc" onClick={handleNavLinkClick} className="mobile-nav-link">
                  Karlánc
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/fulbevalo" onClick={handleNavLinkClick} className="mobile-nav-link">
                  Fülbevaló
                </Link>
              </li>
            </ul>

            {/* Mobile profile section in hamburger menu - moved fully left */}
            <div className="d-lg-none w-100 mt-3 border-top pt-3">
              <div className="user-mobile-section ps-0">
                {auth ? (
                  <>
                    <div className="d-flex align-items-center mb-2">
                      <FaUser size={20} className="me-2" />
                      <div>
                        <p className="mb-0 fw-bold">Üdv, {nev}!</p>
                        <p className="mb-0 small text-muted">{email}</p>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <Link to="#" className="mb-2 text-decoration-none mobile-profile-link" onClick={handleNavLinkClick}>
                        Fiók
                      </Link>
                      <Link to="/rendelesek" className="mb-2 text-decoration-none mobile-profile-link" onClick={handleNavLinkClick}>
                        Rendeléseim
                      </Link>
                      <button className="btn-outline-danger btn-sm mobile-logout-btn" onClick={handleLogout}>
                        Kilépés
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex mb-2">
                      <FaUser size={20} className="me-2" />
                      <p className="mb-0">Vendég vagy!</p>
                    </div>
                    
                    <div className="d-flex  align-items-start">
                      <button
                        className="btn-login btn-primary btn-sm mb-2"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowLoginModal(true)
                          handleNavLinkClick()
                        }}
                      >
                        Bejelentkezés
                      </button>
                      <button
                        className="btn-regist btn-outline-primary btn-sm mb-2"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowRegisterModal(true)
                          handleNavLinkClick()
                        }}
                      >
                        Regisztráció
                      </button>
                      </div>
                      
                    
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Desktop cart icon */}
          <Link to="/kosar" className="d-none d-lg-block me-3 text-dark position-relative">
            <FaShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Desktop profile dropdown - hidden on mobile */}
          <div className="dropdown d-none d-lg-block">
            <div className="user dropbtn">
              <FaUser size={24} />
            </div>
            <div className="dropdown-content">
              {auth ? (
                <>
                  <p className="greeting">Üdv, {nev}!</p>
                  <p className="email">{email}</p>
                  <Link to="#" onClick={handleNavLinkClick}>
                    Fiók
                  </Link>
                  <Link to="/rendelesek" onClick={handleNavLinkClick}>
                    Rendeléseim
                  </Link>
                  <button className="logout" onClick={handleLogout}>
                    Kilépés
                  </button>
                </>
              ) : (
                <>
                  <p className="greeting">Vendég vagy!</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowLoginModal(true)
                      handleNavLinkClick()
                    }}
                  >
                    Bejelentkezés
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowRegisterModal(true)
                      handleNavLinkClick()
                    }}
                  >
                    Regisztráció
                  </a>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Floating cart bubble - only visible on mobile and when NOT on the cart page */}
      {!isCartPage && (
        <div className="floating-cart d-lg-none">
          <Link to="/kosar" className="cart-bubble-link">
            <FaShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-bubble-badge">{cartCount}</span>}
          </Link>
        </div>
      )}

      <UserLogin
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false)
          getUserData()
          window.location.reload()
        }}
      />

      <UserRegistration
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </>
  )
}

export default MenuBar