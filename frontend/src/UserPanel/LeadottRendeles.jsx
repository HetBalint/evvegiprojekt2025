import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeadottRendeles.css";
import { Link } from "react-router-dom";

function LeadottRendeles() {
    

    return (
        <div className="leadva-box">
            <h1>Köszönjük rendelését!</h1>
            <p>Rendelését hamarosan átveheti.</p>
            <Link to={`/home`} className="fooldal">Vissza a főoldalra</Link>
        </div>
        
    );
}

export default LeadottRendeles;
