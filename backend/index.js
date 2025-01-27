import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'evvegiprojekt2025',
});

// Alapértelmezett végpont
app.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

// Felhasználó hozzáadása
app.post('/users', (req, res) => {
    const sql = "INSERT INTO users (`nev`,`email`) VALUES (?)";
    const values = [req.body.nev, req.body.email];

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

// Felhasználó szerkesztése
app.get('/edit/:id', (req, res) => {
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

app.put('/update/:id', (req, res) => {
    const sql = "UPDATE users SET `nev`=?, `email`=?  WHERE id=?";
    const id = req.params.id;
    db.query(sql, [req.body.nev, req.body.email, id], (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});



// Szerver indítása
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port}`);
});
