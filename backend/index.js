import express from "express";
import mysql from "mysql";
import cors from "cors";
//import bcrypt from 'bcrypt';
const salt = 10;
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cookieParser());
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        methods: ["POST, GET, PUT, DELETE"],
        credentials: true
    }
));
app.use(express.json());
app.use("/kepek", express.static(path.join(__dirname, "kepek")));

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
    const sql = "SELECT * FROM admin";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

// Adminlistához admin hozzáadása
app.post('/adminlist/admin', (req, res) => {
    const sql = "INSERT INTO admin (`nev`,`email`,`jelszo`,`szulev`,`lakhely`,`cim`,`adoszam`,`telszam`) VALUES (?)";
    const values = [req.body.nev, req.body.email, req.body.jelszo, req.body.szulev, req.body.lakhely, req.body.cim, req.body.adoszam, req.body.telszam];

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

// Adminlista admin szerkesztése lista
app.get('/adminlist/edit/:id', (req, res) => {
    const sql = "SELECT * FROM admin WHERE ID = ?";
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
    const sql = "UPDATE admin SET `nev`=?, `email`=?, `jelszo`=?, `szulev`=?, `lakhely`=?, `cim`=?, `adoszam`=?, `telszam`=?  WHERE id=?";
    const id = req.params.id;
    db.query(sql, [req.body.nev, req.body.email, req.body.jelszo, req.body.szulev, req.body.lakhely, req.body.cim, req.body.adoszam, req.body.telszam, id], (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

//Adminlista admin törlése
app.delete('/adminlist/delete/:id', (req, res) => {
    const sql = "DELETE FROM admin WHERE id=?"
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
})

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json("Token nem egyezik")
    } else {
        jwt.verify(token, "jwtSecretKey", (err, decoded) => {
            if(err) {
                res.json("Nincs hitelesítve");
            } else {
                req.nev = decoded.nev;
                next();
            }
        })
    }
}
app.get('/', verifyAdmin ,(req, res) => {
    return res.json({Status: "Success", nev: req.nev})
})


//Admin bejelentkezés
app.post('/login', (req,res) => {
    const sql ="SELECT * FROM admin WHERE `email` = ? AND `jelszo` = ?"
    db.query(sql, [req.body.email, req.body.jelszo], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            const nev = data[0].nev;
            const token = jwt.sign({nev}, "jwtSecretKey", {expiresIn: '1d'});
            res.cookie('token', token);
            return res.json({Status: "Success"})
        } else {
            return res.json("Faile");
        }
    }) 
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"})
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Terméklistához termék hozzáadása
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "./kepek")
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage})


app.post('/productlist/product',upload.single('file'), (req, res) => {
    const sql = "INSERT INTO termekek (`nev`,`ar`,`suly`,`anyag`,`leiras`,`meret`,`kategoria`,`kep`) VALUES (?)";
    const values = [req.body.nev,
                    req.body.ar,
                    req.body.suly,
                    req.body.anyag,
                    req.body.leiras,
                    req.body.meret,
                    req.body.kategoria,
                    req.file.filename];

                    db.query(sql, [values], (err, result) => {
                        if (err) {
                            console.error("SQL Hiba:", err);
                            return res.status(500).json({ Error: "Hiba a feltöltés során", Details: err.sqlMessage });
                        }
                        return res.json({ Status: "Success", InsertedID: result.insertId });
                    });
});

// TermékLista lekérése az adatbázisból
app.get('/productlist/', (req, res) => {
    const sql = "SELECT * FROM termekek";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});







// Szerver indítása
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port}`);
});
