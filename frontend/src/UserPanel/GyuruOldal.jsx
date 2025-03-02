import React from 'react'
import gyuru_banner from '../UserPanel/gyuru_banner.jpg'

function GyuruOldal() {
  return (
    <div className="bg-light min-vh-100">
          {/* Banner */}
          <section className="position-relative text-center text-white" 
            style={{ backgroundImage: `url(${gyuru_banner})`, backgroundSize: 'cover', backgroundPosition: 'top center', height: '250px' }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
            <div className="position-absolute top-50 start-50 translate-middle">
              <h1 className="display-4 fw-bold">Gyűrűk</h1>
              
            </div>
          </section>
          </div>
  )
}

export default GyuruOldal