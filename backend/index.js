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
app.use("/3D", express.static(path.join(__dirname, "3D")));

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
// Adminlista szerkesztett admin frissítése
app.put('/admin/adminlist/update/:id', (req, res) => {
    const sql = "UPDATE admin SET `nev`=?, `email`=?, `jelszo`=?, `szulev`=?, `lakhely`=?, `cim`=?, `adoszam`=?, `telszam`=? WHERE id=?";
    const id = req.params.id;
    
    // Ellenőrzés a beérkező adatokra
    if (!req.body.nev || !req.body.email || !req.body.jelszo || !req.body.szulev || !req.body.lakhely || !req.body.cim || !req.body.adoszam || !req.body.telszam) {
        return res.status(400).json({ Message: "Hiányzó mezők az űrlapban!" });
    }

    db.query(sql, [
        req.body.nev,
        req.body.email,
        req.body.jelszo,
        req.body.szulev,
        req.body.lakhely,
        req.body.cim,
        req.body.adoszam,
        req.body.telszam,
        id
    ], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ Message: "Hiba van a szerverben!", Error: err });
        }
        return res.json({ Message: "Sikeres frissítés!", result });
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

// Admin bejelentkezés és JWT generálás
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
                sameSite: "lax",
                path: "/",
            });

            return res.json({ Status: "Success" });
        } else {
            return res.json("Failed");
        }
    });
});

//Admin kijelentkezés
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

//Kép és 3D hozzáadása
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "kep") {
            cb(null, "./kepek"); // Kép mentése a "kepek" mappába
        } else if (file.fieldname === "haromD") {
            cb(null, "./3D"); // 3D fájl mentése a "3D" mappába
        } else {
            cb(new Error("Invalid file fieldname")); // Hiba, ha más mezőnevet használ
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

// Egyetlen `upload` middleware, ami több fájlt is kezel
const upload = multer({ storage });



//Termék hozzáadása
app.post('/admin/productlist/product', upload.fields([
    { name: 'kep', maxCount: 1 },
    { name: 'haromD', maxCount: 1 }
]), (req, res) => {
    const sql = "INSERT INTO termekek (`nev`, `ar`, `suly`, `anyag`, `leiras`, `meret`, `kategoriaID`, `kep`, `keszlet`, `haromD`) VALUES (?)";

    const values = [
        req.body.nev,
        req.body.ar,
        req.body.suly,
        req.body.anyag,
        req.body.leiras,
        req.body.meret,
        req.body.kategoria,
        req.files['kep'] ? req.files['kep'][0].filename : null,  // Kép mentése
        req.body.keszlet,
        req.files['haromD'] ? req.files['haromD'][0].filename : null  // 3D fájl mentése
    ];

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("SQL Hiba:", err);
            return res.status(500).json({ Error: "Hiba a feltöltés során", Details: err.sqlMessage });
        }
        return res.json({ Status: "Success", InsertedID: result.insertId });
    });
});


                  

//Termék kategóriák lekérése
app.get('/admin/kategoriak/', (req, res) => {
    const sql = "SELECT id, nev FROM kategoria";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Hiba van a szerverben!" });
        return res.json(result);
    });
});
  






// TermékLista lekérése az adatbázisból
app.get('/admin/productlist/', (req, res) => {
    const sql = "SELECT * FROM termekek ORDER BY id DESC";
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



// Terméklista szerkesztett termék frissítése (Kép + 3D fájl támogatás)
app.put('/admin/productlist/update/:id', upload.fields([
    { name: 'kep', maxCount: 1 },
    { name: 'haromD', maxCount: 1 }
]), (req, res) => {
    const sqlSelect = "SELECT kep, haromD FROM termekek WHERE id = ?";

    // Először lekérdezzük az adatbázisból a régi fájlok nevét
    db.query(sqlSelect, [req.params.id], (err, result) => {
        if (err) {
            console.error("SQL Hiba:", err);
            return res.status(500).json({ Message: "Hiba a lekérdezés során", Error: err.sqlMessage });
        }

        // Ha van eredmény, lekérjük a meglévő fájlok neveit
        const oldKep = result.length > 0 ? result[0].kep : null;
        const oldHaromD = result.length > 0 ? result[0].haromD : null;

        // Új fájlok mentése (ha vannak), különben marad a régi
        const newKep = req.files['kep'] ? req.files['kep'][0].filename : req.body.regikep;
        const newHaromD = req.files['haromD'] ? req.files['haromD'][0].filename : req.body.regiharomD;

        // Ha van új kép, töröljük a régit
        if (req.files['kep'] && oldKep) {
            const filePath = path.join(__dirname, 'kepek', oldKep);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Kép törlés hiba:", err);
            });
        }

        // Ha van új 3D fájl, töröljük a régit
        if (req.files['haromD'] && oldHaromD) {
            const filePath3D = path.join(__dirname, '3D', oldHaromD);
            fs.unlink(filePath3D, (err) => {
                if (err) console.error("3D fájl törlés hiba:", err);
            });
        }

        // Frissítjük az adatbázist az új vagy régi fájlokkal
        const sqlUpdate = "UPDATE termekek SET `nev` = ?, `ar` = ?, `suly` = ?, `anyag` = ?, `leiras` = ?, `meret` = ?, `kategoriaID` = ?, `kep` = ?, `keszlet` = ?, `haromD` = ? WHERE id = ?";

        db.query(sqlUpdate, [
            req.body.nev,
            req.body.ar,
            req.body.suly,
            req.body.anyag,
            req.body.leiras,
            req.body.meret,
            req.body.kategoria,
            newKep,      // Kép (új vagy régi)
            req.body.keszlet,
            newHaromD,   // 3D fájl (új vagy régi)
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



// Minden rendelés lekérdezése admin oldalra
app.get("/rendeleskezeles", (req, res) => {
    const rendelesekQuery = `
      SELECT * FROM rendelesek
      ORDER BY ido DESC
    `;
  
    db.query(rendelesekQuery, (err, rendelesek) => {
      if (err) {
        console.error("Hiba a rendelesek lekerese soran:", err);
        return res.status(500).json({ message: "Hiba a rendelesek lekérésekor!" });
      }
  
      if (rendelesek.length === 0) {
        return res.json([]);
      }
  
      const rendelesIds = rendelesek.map(r => r.id);
  
      const tetelekQuery = `
        SELECT rt.*, t.nev AS termekNev FROM rendeles_tetelek rt
        JOIN termekek t ON rt.termek_id = t.id
        WHERE rt.rendeles_id IN (?)
      `;
  
      db.query(tetelekQuery, [rendelesIds], (err, tetelek) => {
        if (err) {
          console.error("Hiba a rendeles_tetelek lekerese soran:", err);
          return res.status(500).json({ message: "Hiba a rendeles tételek lekérésekor!" });
        }
  
        const rendelesekWithTetelek = rendelesek.map(r => ({
          ...r,
          tetelek: tetelek.filter(t => t.rendeles_id === r.id)
        }));
  
        res.json(rendelesekWithTetelek);
      });
    });
  });
  
  // Rendelés statusz frissítése
  app.put("/admin/rendelesek/frissit/:id", (req, res) => {
    const { id } = req.params;
    const { statusz } = req.body;
  
    const updateQuery = "UPDATE rendelesek SET statusz = ? WHERE id = ?";
    db.query(updateQuery, [statusz, id], (err, result) => {
      if (err) {
        console.error("Hiba a rendelés statusz frissítésekor:", err);
        return res.status(500).json({ error: "Statusz frissítési hiba" });
      }
  
      res.json({ message: "Statusz sikeresen frissítve!" });
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
        
        req.id = decoded.id
        req.nev = decoded.nev;
        req.email = decoded.email;
        req.usertel = decoded.usertel;
        next();
    });
};




//User bejelentkezés
app.post('/user/login', (req, res) => {
    const sql = "SELECT * FROM vasarlok WHERE `email` = ? AND `jelszo` = ?";
    db.query(sql, [req.body.email, req.body.jelszo], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            const { id, nev, email, usertel } = data[0]; // 🔥 Hozzáadjuk az emailt és telefonszámot is
            const token = jwt.sign({ id, nev, email, usertel }, "userSecretKey", { expiresIn: '1d' });

            res.cookie('userToken', token, {
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


// User kijelentkezés
app.get('/user/logout', (req, res) => {
    res.cookie('userToken', '', {
        httpOnly: true,
        secure: false, //  Ha HTTPS-t használsz, állítsd "true"-ra
        sameSite: "lax",
        expires: new Date(0), //  A süti azonnali lejárata
        path: "/",
    });

    res.clearCookie('userToken'); //  A süti biztos törlése
    return res.json({ Status: "Success" });
});

app.get('/user', verifyUser ,(req, res) => {
    return res.json({Status: "Success", id: req.id, nev: req.nev, email: req.email, usertel: req.usertel})
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




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
            termekek.keszlet,
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


// Kosárhoz adás végpont
app.post("/kosar/termek", (req, res) => {
    const { termekId, nev, meret, mennyiseg, ar, kep, anyag } = req.body;

    if (!termekId || !nev || !meret || !mennyiseg || !ar || !kep || !anyag) {
        return res.status(400).json({ error: "Minden mező kötelező!" });
    }

    // Végösszeg kiszámítása (ár * darabszám)
    const vegosszeg = ar * mennyiseg;

    // SQL INSERT lekérdezés
    const sql = `
        INSERT INTO kosar (termekID, termekNev, termekMeret, dbszam, termekAr, termekKep, vegosszeg, termekAnyag) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [termekId, nev, meret, mennyiseg, ar, kep, vegosszeg, anyag];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Hiba a termék kosárba helyezésekor:", err);
            return res.status(500).json({ error: "Szerverhiba a termék kosárba helyezésekor." });
        }
        res.json({ message: "Termék sikeresen hozzáadva a kosárhoz!", termekId: result.insertId });
    });
});



// Kosár lekérdezése (GET)
app.get("/kosar", (req, res) => {
    const sql = `
        SELECT 
            k.termekID, 
            k.termekNev, 
            k.termekMeret, 
            k.dbszam, 
            k.termekAr, 
            k.termekKep, 
            k.vegosszeg, 
            k.termekAnyag,
            t.keszlet
        FROM kosar k
        JOIN termekek t ON k.termekID = t.id
    `;
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Hiba a kosár lekérdezésekor:", err);
            return res.status(500).json({ error: "Hiba történt a kosár lekérdezésekor" });
        }
        res.json(result);
    });
});



//Kosárból termék törlése
app.delete('/kosar/delete/:id', (req, res) => {
    const sql = "DELETE FROM kosar WHERE termekID = ?";
    const id = req.params.id;
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Hiba a termék törlésekor:", err);
            return res.status(500).json({ message: "Hiba van a szerverben!" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "A termék nem található a kosárban!" });
        }

        return res.json({ message: "Termék sikeresen törölve a kosárból!" });
    });
});

//Kosárban a termék darabszámának növelése vagy csökkentése és mentése az adatbázisba
app.put("/kosar/update/:id", (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    let query = "";
    if (action === "increase") {
        query = "UPDATE kosar SET dbszam = dbszam + 1 WHERE termekID = ?";
    } else if (action === "decrease") {
        query = "UPDATE kosar SET dbszam = GREATEST(dbszam - 1, 1) WHERE termekID = ?";
    } else {
        return res.status(400).json({ error: "Érvénytelen művelet!" });
    }

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba a frissítés során!" });
        res.json({ message: "Mennyiség frissítve!", updatedId: id });
    });
});


//3D megjelenítése a termékmegtekintőbe
app.get('/termek/:id/3D', (req, res) => {
    const sql = "SELECT haromD FROM termekek WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Hiba a 3D fájl lekérésekor:", err);
            return res.status(500).json({ error: "Hiba a szerveren!" });
        }

        if (result.length > 0 && result[0].haromD) {
            return res.json({ haromD: `http://localhost:8081/3D/${result[0].haromD}` }); // 🔹 Küldjük az elérési útvonalat
        } else {
            return res.status(404).json({ error: "Nincs 3D fájl!" });
        }
    });
});


// Rendelés leadása (készletfrissítéssel)
app.post("/rendeles", verifyUser, (req, res) => {
    console.log("📩 Bejövő rendelés érkezett!");

    const vasarloId = req.id;
    const items = req.body.items;
    const totalPrice = req.body.total;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "A kosár üres!" });
    }

    const insertOrderQuery = `
        INSERT INTO rendelesek (statusz, osszeg, ido, vasarlo_id)
        VALUES (?, ?, NOW(), ?)
    `;

    db.query(insertOrderQuery, ["feldolgozás alatt", totalPrice, vasarloId], (err, result) => {
        if (err) {
            console.error("❌ Rendelés beszúrási hiba:", err);
            return res.status(500).json({ error: "Rendelés beszúrási hiba" });
        }

        const rendelesId = result.insertId;
        console.log("📝 Rendelés ID:", rendelesId);

        const orderItems = items.map(item => [
            rendelesId,
            item.termekID,
            item.dbszam,
            item.termekAr,
            item.dbszam * item.termekAr
        ]);

        const insertItemsQuery = `
            INSERT INTO rendeles_tetelek (rendeles_id, termek_id, dbszam, termekAr, vegosszeg)
            VALUES ?
        `;

        db.query(insertItemsQuery, [orderItems], (err) => {
            if (err) {
                console.error("❌ Tételek beszúrási hiba:", err);
                return res.status(500).json({ error: "Tételek beszúrási hiba" });
            }

            // Készlet frissítés minden termékre
            const frissitesek = items.map(item => {
                return new Promise((resolve, reject) => {
                    const updateQuery = `
                        UPDATE termekek 
                        SET keszlet = CASE 
                            WHEN keszlet >= ? THEN keszlet - ? 
                            ELSE 0 
                        END 
                        WHERE id = ?
                    `;
                    db.query(updateQuery, [item.dbszam, item.dbszam, item.termekID], (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            });

            Promise.all(frissitesek)
                .then(() => {
                    // Kosár ürítése
                    db.query("DELETE FROM kosar", (err) => {
                        if (err) {
                            console.error("❌ Kosár törlés hiba:", err);
                            return res.status(500).json({ error: "Kosár törlés hiba" });
                        }

                        console.log("✅ Rendelés és készlet frissítve!");
                        return res.json({ message: "Rendelés sikeres!" });
                    });
                })
                .catch(err => {
                    console.error("❌ Készletfrissítés hiba:", err);
                    return res.status(500).json({ error: "Készletfrissítési hiba" });
                });
        });
    });
});


// Rendelések lekérdezése (egy adott felhasználóhoz)
app.get("/rendelesek", verifyUser, (req, res) => {
    const vasarloId = req.id;
  
    const rendelesekQuery = `
      SELECT * FROM rendelesek
      WHERE vasarlo_id = ?
      ORDER BY ido DESC
    `;
  
    db.query(rendelesekQuery, [vasarloId], (err, rendelesek) => {
      if (err) {
        console.error("Hiba a rendelesek lekerese soran:", err);
        return res.status(500).json({ message: "Hiba a rendelesek lekérésekor!" });
      }
  
      // Ha nincs rendelés
      if (rendelesek.length === 0) {
        return res.json([]);
      }
  
      // Rendelések ID-k kigyűjtése
      const rendelesIds = rendelesek.map(r => r.id);
  
      // Tételek lekérdezése
      const tetelekQuery = `
        SELECT rt.*, t.nev AS termekNev FROM rendeles_tetelek rt
        JOIN termekek t ON rt.termek_id = t.id
        WHERE rt.rendeles_id IN (?)
      `;
  
      db.query(tetelekQuery, [rendelesIds], (err, tetelek) => {
        if (err) {
          console.error("Hiba a rendeles_tetelek lekerese soran:", err);
          return res.status(500).json({ message: "Hiba a rendeles tételek lekérésekor!" });
        }
  
        // Rendelésekhez hozzákapcsoljuk a tételeket
        const rendelesekWithTetelek = rendelesek.map(r => ({
          ...r,
          tetelek: tetelek.filter(t => t.rendeles_id === r.id)
        }));
  
        res.json(rendelesekWithTetelek);
      });
    });
  });



// Szerver indítása
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port}`);
});
