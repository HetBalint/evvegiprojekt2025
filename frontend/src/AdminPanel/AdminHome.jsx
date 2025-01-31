import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


function AdminHome() {
    const [auth, setAuth] = useState(false)
    const [nev, setName] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8081')
        .then(res => {
            if(res.data.Status === "Success") {
                setAuth(true);
                setName(res.data.nev);
            } else {
                setAuth(false)
                setMessage(res.data.Message);
            }
        })
    }, [])

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
        .then(res => {
            if(res.data.Status === "Success") {
                window.location.reload(true);
            } else {
                alert("error");
            }
            
        }).catch(err => console.log(err)) 
    }


  return (
    <div>
        {
            auth ?
            <div>
                <h3>Hitelesítve vagy {nev}</h3>
                <Link to="/login" className='btn btn-danger' onClick={handleLogout}>Kilépés</Link>
            </div>
            :
            <div>
            </div>
        }
    </div>
  )
}

export default AdminHome