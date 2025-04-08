import "./LeadottRendeles.css";
import { Link } from "react-router-dom";

function LeadottRendeles() {
    

    return (
        <div className="leadva-box">
            <h1>Köszönjük rendelését!</h1>
            <p>Rendelését hamarosan átveheti.</p>
            <img className='logo' src='/logonevvel(fekete).svg' alt='Logo' />
            <Link to={`/home`} className="fooldal">Vissza a főoldalra</Link>
        </div>
        
    );
}

export default LeadottRendeles;