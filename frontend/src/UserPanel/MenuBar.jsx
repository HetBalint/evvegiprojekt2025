import React from 'react'
import { FaShoppingCart, FaUser } from 'react-icons/fa';


function MenuBar() {
  return (
        
          <header className="bg-white shadow-sm sticky-top">
            <nav className="navbar navbar-expand-lg navbar-light container-fluid px-4">
              <a className="navbar-brand fw-bold" href="#">Crystal Heaven</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item"><a className="nav-link" href="#">Főoldal</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Gyűrű</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Nyaklánc</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Karlánc</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Fülbevaló</a></li>
                </ul>
              </div>
              <div className="d-flex align-items-center">
                <a href="#cart" className="me-3 text-dark"><FaShoppingCart size={24} /></a>
                <a href="#profile" className="text-dark"><FaUser size={24} /></a>
              </div>
            </nav>
          </header>
  )
}

export default MenuBar