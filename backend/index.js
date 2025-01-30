import express from "express";
import mysql from "mysql";
import cors from "cors";
//import bcrypt from 'bcrypt';
const salt = 10;

const app = express();
app.use(cors());
app.use(express.json());


//Adatbázis kapcsolat
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'evvegiprojekt2025',
});


//AdminPanel

// Adminlista lekérése az adatbázisból
app.get('/adminlist/', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

// Adminlistához admin hozzáadása
app.post('/adminlist/users', (req, res) => {
    const sql = "INSERT INTO users (`nev`,`email`,`jelszo`) VALUES (?)";
    const values = [req.body.nev, req.body.email, req.body.jelszo];

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

// Adminlista admin szerkesztése lista
app.get('/adminlist/edit/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE ID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ Message: "Hiba van a szerverben!" });
        }
        return res.json(result);
    });
});

//Adminlista szerkesztett admin frissítése
app.put('/adminlist/update/:id', (req, res) => {
    const sql = "UPDATE users SET `nev`=?, `email`=?, `jelszo`=?  WHERE id=?";
    const id = req.params.id;
    db.query(sql, [req.body.nev, req.body.email, id], (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

//Adminlista admin törlése
app.delete('/adminlist/delete/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id=?"
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
})

//Admin bejelentkezés
app.post('/login', (req,res) => {
    const sql ="SELECT * FROM users WHERE `email` = ? AND `jelszo` = ?"
    db.query(sql, [req.body.email, req.body.jelszo], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Faile");
        }
    }) 
})

// Szerver indítása
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port}`);
});
