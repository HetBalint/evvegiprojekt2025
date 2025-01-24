import express from "express"
import mysql from "mysql"
import cors from "cors"



const app = express()
app.use(cors());

app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'evvegiprojekt2025',
})

app.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result)=>{
        if(err) return res.json({Message: "Hiba van a szerverben!"})
            return res.json(result);
    })
})



const port = process.env.PORT || 8081

app.listen(port,()=>{
    console.log(`A szerver fut a http://localhost:${port}`)
})