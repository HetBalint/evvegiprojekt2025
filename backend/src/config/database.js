import mysql from "mysql2"

const db = mysql.createConnection({
  host: "mysql", 
  user: "root",
  password: "root",
  database: "evvegiprojekt2025",
});





export default db