
import axios from 'axios';
import React, { useEffect } from 'react';




function Home() {
    useEffect(()=> {
    axios.get('http://localhost:3000/')
    .then(res => console.log(res))
    .catch(err => console.log(err));
},[])
    return (
        <></>
    )
}

export default Home