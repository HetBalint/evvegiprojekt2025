import express from "express"

const app = express()

app.get("/",(req,res)=>{
    res.send("A szerver fut")
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`A szerver fut a http://localhost:${port}`)
})