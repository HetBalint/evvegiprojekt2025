import React, { useEffect } from "react";
import axios from 'axios'

function Home() {
    const [data, setData] = useState([])
    useEffect(()=> {
        axios.get('http://localhost:8081/')
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }, [])
    return (
        <></>
    )
}

export default Home