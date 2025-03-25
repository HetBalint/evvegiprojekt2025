import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import hatter from '../UserPanel/hatter.jpg';
import './UserHome.css';
import ekszerkeszites from '../UserPanel/ékszerkeszites.jpg'

function UserHome() {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100">
      {/* Banner */}
      <section className="position-relative text-center text-white" 
        style={{ backgroundImage: `url(${hatter})`, backgroundSize: 'cover', backgroundPosition: 'center center', height: '250px' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="position-absolute top-50 start-50 translate-middle">
          <h1 className="display-4 fw-bold">Időtlen elegancia</h1>
          <p className="lead">Fedezze fel a szenvedéllyel és precízen megalkotott gyönyörű ékszereket.</p>
        </div>
      </section>

      




        

      {/* Navigation Cards */}
      <section className="container my-5 ">
        <div className="row">
          {[
            { name: "Gyűrűk", image: "/hatterkepek/gyuru.jpg", path: "gyuru" },
            { name: "Nyakláncok", image: "/hatterkepek/nyaklanc.jpg", path: "nyaklanc" },
            { name: "Karkötők", image: "/hatterkepek/karlanc.jpg", path: "karlanc" },
            { name: "Fülbevalók", image: "/hatterkepek/fulbevalo.jpg", path: "fulbevalo" }
          ].map((category, index) => (
            <div key={index} className="col-md-3">
              <div className="category-card" 
                   style={{ backgroundImage: `url(${category.image})` }}
                   onClick={() => navigate(`/${category.path}`)}>
                <div className="overlay-home">
                  <h4>{category.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ekszerkeszites position-relative text-center text-white" 
        style={{ backgroundImage: `url(${ekszerkeszites})`, backgroundSize: 'cover', backgroundPosition: 'center center', height: '500px' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="position-absolute top-50 start-50 translate-middle">
          <h1 className="display-4 fw-bold">Egyedi, kézzel készült ékszerek</h1>
          
        </div>
      </section>

    </div>
  );
}

export default UserHome;
