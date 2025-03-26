import mysql from "mysql2"

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "evvegiprojekt2025",
})

export default db