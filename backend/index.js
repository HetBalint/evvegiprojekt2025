import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()
app.use(cors());

app.get("/",(req,res)=>{
    res.send("A szerver fut")
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`A szerver fut a http://localhost:${port}`)
})