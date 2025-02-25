import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import hatter from '../UserPanel/hatter.jpg';



function UserHome() {
  return (
    <div className="bg-light min-vh-100">
      
      
      {/* Banner */}
      <section className="position-relative text-center text-white" 
        style={{ backgroundImage: `url(${hatter})`, backgroundSize: 'cover', backgroundPosition: 'center center', height: '500px' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="position-absolute top-50 start-50 translate-middle">
          <h1 className="display-4 fw-bold">Időtlen elegancia</h1>
          <p className="lead">Fedezze fel a szenvedéllyel és precízen megalkotott gyönyörű ékszereket.</p>
          
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container py-5 text-center">
        <h2 className="fw-bold">Featured Collection</h2>
        <p className="text-muted">A curated selection of our finest pieces.</p>
        {/* Placeholder for product listing */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <img src="https://source.unsplash.com/300x300/?ring" className="card-img-top" alt="Ring" />
              <div className="card-body">
                <h5 className="card-title">Elegant Diamond Ring</h5>
                <p className="card-text">$999.00</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src="https://source.unsplash.com/300x300/?bracelet" className="card-img-top" alt="Bracelet" />
              <div className="card-body">
                <h5 className="card-title">Gold Bracelet</h5>
                <p className="card-text">$499.00</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src="https://source.unsplash.com/300x300/?necklace" className="card-img-top" alt="Necklace" />
              <div className="card-body">
                <h5 className="card-title">Sapphire Necklace</h5>
                <p className="card-text">$1,299.00</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserHome;
