import express from "express";
import mysql from "mysql2";
import cors from "cors";
//import bcrypt from 'bcrypt';
const salt = 10;
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from "url";
import fs from 'fs';


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
app.get('/admin/adminlist/', (req, res) => {
    const sql = "SELECT * FROM admin";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

// Adminlistához admin hozzáadása
app.post('/admin/adminlist/admin', (req, res) => {
    // Formázott dátum létrehozása
    const formattedDate = new Date(req.body.szulev).toISOString().slice(0, 10);
    

    // SQL lekérdezés az admin hozzáadására
    const sql = "INSERT INTO admin (`nev`,`email`,`jelszo`,`szulev`,`lakhely`,`cim`,`adoszam`,`telszam`) VALUES (?)";
    const values = [
        req.body.nev, 
        req.body.email, 
        req.body.jelszo, 
        formattedDate,  // Használjuk a formázott dátumot
        req.body.lakhely, 
        req.body.cim, 
        req.body.adoszam, 
        req.body.telszam
    ];

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("SQL Hiba:", err);
            return res.json(err);
        }
        return res.json(result);
    });
});


// Adminlista admin szerkesztése lista
app.get('/admin/adminlist/edit/:id', (req, res) => {
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
app.put('/admin/adminlist/update/:id', (req, res) => {
    const sql = "UPDATE admin SET `nev`=?, `email`=?, `jelszo`=?, `szulev`=?, `lakhely`=?, `cim`=?, `adoszam`=?, `telszam`=?  WHERE id=?";
    const id = req.params.id;
    db.query(sql, [req.body.nev, req.body.email, req.body.jelszo, req.body.szulev, req.body.lakhely, req.body.cim, req.body.adoszam, req.body.telszam, id], (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

//Adminlista admin törlése
app.delete('/admin/adminlist/delete/:id', (req, res) => {
    const sql = "DELETE FROM admin WHERE id=?"
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
})

// Admin autentikáció Middleware
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.adminToken; // 🔥 Admin token elérése a sütiből

    if (!token) {
        return res.status(401).json({ message: "Token nem egyezik" });
    }

    jwt.verify(token, "adminSecretKey", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Nincs hitelesítve" });
        }

        req.nev = decoded.nev;
        next();
    });
};

// 🔥 Admin bejelentkezés és JWT generálás
app.post('/admin/login', (req, res) => {
    const sql = "SELECT * FROM admin WHERE `email` = ? AND `jelszo` = ?";
    db.query(sql, [req.body.email, req.body.jelszo], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            const nev = data[0].nev;
            const token = jwt.sign({ nev }, "adminSecretKey", { expiresIn: '1d' });

            // Beállítjuk a HTTP-only JWT sütit adminok számára
            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: false, // 🔥 Ha HTTPS-t használsz, állítsd true-ra
                sameSite: "lax"
            });

            return res.json({ Status: "Success" });
        } else {
            return res.json("Failed");
        }
    });
});

app.get('/logout', (req, res) => {
    res.cookie('adminToken', '', {
        httpOnly: true,
        secure: false, //  Ha HTTPS-t használsz, állítsd "true"-ra
        sameSite: "lax",
        expires: new Date(0) //  A süti azonnali lejárata
    });

    res.clearCookie('adminToken'); //  A süti biztos törlése
    return res.json({ Status: "Success" });
});

// 🔥 Admin védett végpont - csak bejelentkezett adminok férhetnek hozzá
app.get('/admin', verifyAdmin, (req, res) => {
    return res.json({ Status: "Success", nev: req.nev });
});

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


app.post('/admin/productlist/product',upload.single('file'), (req, res) => {
    const sql = "INSERT INTO termekek (`nev`,`ar`,`suly`,`anyag`,`leiras`,`meret`,`kategoriaID`,`kep`) VALUES (?)";
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


app.get('/admin/kategoriak/', (req, res) => {
    const sql = "SELECT id, nev FROM kategoria";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});
  






// TermékLista lekérése az adatbázisból
app.get('/admin/productlist/', (req, res) => {
    const sql = "SELECT * FROM termekek";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});


// Terméklista termék szerkesztése
app.get('/admin/productlist/pedit/:id', (req, res) => {
    const sql = "SELECT * FROM termekek WHERE ID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ Message: "Hiba van a szerverben!" });
        }
        return res.json(result);
    });
});



// Terméklista szerkesztett termék frissítése
app.put('/admin/productlist/update/:id', upload.single('file'), (req, res) => {
    const sqlSelect = "SELECT kep FROM termekek WHERE id = ?";
    
    // Először lekérdezzük az adatbázisból a régi fájl nevét
    db.query(sqlSelect, [req.params.id], (err, result) => {
        if (err) {
            console.error("SQL Hiba:", err);
            return res.status(500).json({ Message: "Hiba a lekérdezés során", Error: err.sqlMessage });
        }

        const oldFile = result.length > 0 ? result[0].kep : null;
        const newFile = req.file ? req.file.filename : req.body.regikep;

        // Ha van új fájl, töröljük a régit
        if (req.file && oldFile) {
            const filePath = path.join(__dirname, 'kepek', oldFile);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Fájl törlés hiba:", err);
                    return res.status(500).json({ Message: "Hiba a régi fájl törlésénél", Error: err });
                }
                
            });
        }

        // Frissítjük a terméket az új vagy régi képpel
        const sqlUpdate = "UPDATE termekek SET `nev` = ?, `ar` = ?, `suly` = ?, `anyag` = ?, `leiras` = ?, `meret` = ?, `kategoriaID` = ?, `kep` = ? WHERE id=?";
        db.query(sqlUpdate, [
            req.body.nev,
            req.body.ar,
            req.body.suly,
            req.body.anyag,
            req.body.leiras,
            req.body.meret,
            req.body.kategoria,
            newFile,  // Az új fájl vagy a régi fájl
            req.params.id
        ], (err, result) => {
            if (err) {
                console.error("SQL Hiba:", err);
                return res.status(500).json({ Message: "Hiba a frissítés során", Error: err.sqlMessage });
            }
            return res.json({ Message: "Sikeres frissítés!", Data: result });
        });
    });
});


//Terméklista termék törlése
app.delete('/admin/productlist/delete/:id', (req, res) => {
    const id = req.params.id;
    
    // Először lekérdezzük az adatbázisból a fájl nevét
    const sqlSelect = "SELECT kep FROM termekek WHERE id = ?";
    db.query(sqlSelect, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ Message: "Hiba a lekérdezés során!" });
        }
        
        // Ha van fájl neve, töröljük azt
        if (result.length > 0 && result[0].kep) {
            const filePath = path.join(__dirname, 'kepek', result[0].kep); // A fájl elérési útja

            // Próbáljuk meg törölni a fájlt
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Fájl törlés hiba:", err);
                    return res.status(500).json({ Message: "Hiba a fájl törlése során" });
                }
                
            });
        }

        // Most töröljük az adatbázisból a rekordot
        const sqlDelete = "DELETE FROM termekek WHERE id=?";
        db.query(sqlDelete, [id], (err, result) => {
            if (err) {
                console.error("SQL hiba:", err);
                return res.status(500).json({ Message: "Hiba a termék törlésében!" });
            }
            return res.json({ Message: "Termék és kép törölve!" });
        });
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Userlista lekérése az adatbázisból
app.get('/admin/userlist/', (req, res) => {
    const sql = "SELECT * FROM vasarlok";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

// Userlistához user hozzáadása
app.post('/admin/userlist/user', (req, res) => {

    

    // SQL lekérdezés az user hozzáadására
    const sql = "INSERT INTO vasarlok (`nev`,`email`,`jelszo`,`usertel`) VALUES (?)";
    const values = [
        req.body.nev, 
        req.body.email, 
        req.body.jelszo, 
        req.body.usertel
    ];

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("SQL Hiba:", err);
            return res.json(err);
        }
        return res.json(result);
    });
});



// User autentikáció Middleware
const verifyUser = (req, res, next) => {
    const token = req.cookies.userToken; // Ellenőrizzük a sütiből

    if (!token) {
        return res.status(401).json({ message: "Token nem egyezik" });
    } 
    
    jwt.verify(token, "userSecretKey", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Nincs hitelesítve" });
        } 
        
        req.nev = decoded.nev;
        next();
    });
};




//User bejelentkezés
app.post('/user/login', (req, res) => {
    const sql ="SELECT * FROM vasarlok WHERE `email` = ? AND `jelszo` = ?"
    db.query(sql, [req.body.email, req.body.jelszo], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            const nev = data[0].nev;
            const token = jwt.sign({nev}, "userSecretKey", {expiresIn: '1d'});

            // Fontos: HTTP-only cookie beállítása!
            res.cookie('userToken', token, {
                httpOnly: true,
                secure: false,  // Ha HTTPS-t használsz, akkor `true`
                sameSite: "lax"
            });

            return res.json({Status: "Success"});
        } else {
            return res.json("Failed");
        }
    }) 
});

// User kijelentkezés
app.get('/user/logout', (req, res) => {
    res.cookie('userToken', '', {
        httpOnly: true,
        secure: false, //  Ha HTTPS-t használsz, állítsd "true"-ra
        sameSite: "lax",
        expires: new Date(0) //  A süti azonnali lejárata
    });

    res.clearCookie('userToken'); //  A süti biztos törlése
    return res.json({ Status: "Success" });
});

app.get('/user', verifyUser ,(req, res) => {
    return res.json({Status: "Success", nev: req.nev})
})


//Gyűrű oldal gyűrű lista
app.get('/gyuruk', (req, res) => {
    const sql = "SELECT * FROM termekek WHERE kategoriaID = 1";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});


//Nyaklánc oldal nyaklánc lista
app.get('/nyaklancok', (req, res) => {
    const sql = "SELECT * FROM termekek WHERE kategoriaID = 2";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});


//Karlánc oldal karlánc lista
app.get('/karlancok', (req, res) => {
    const sql = "SELECT * FROM termekek WHERE kategoriaID = 3";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});


//Fülbevaló oldal fülbevaló lista
app.get('/fulbevalok', (req, res) => {
    const sql = "SELECT * FROM termekek WHERE kategoriaID = 4";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});

//Kiválasztott termék megtekintése
app.get('/termek/:id', (req, res) => {
    const sql = `
        SELECT 
            termekek.id AS termekID, 
            termekek.nev AS termekNev, 
            termekek.ar, 
            termekek.suly, 
            termekek.anyag, 
            termekek.leiras, 
            termekek.meret, 
            termekek.kep, 
            kategoria.nev AS kategoriaNev
        FROM termekek
        JOIN kategoria ON termekek.kategoriaID = kategoria.id
        WHERE termekek.id = ?`;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Hiba történt a termék lekérdezésekor:", err);
            return res.status(500).json({ message: "Hiba a szerveren!", error: err.sqlMessage });
        }
        return res.json(result);
    });
});





// Szerver indítása
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port}`);
});
