import db from "../config/database.js"

export const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM termekek ORDER BY id DESC"
    db.query(sql, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM termekek WHERE ID = ?"
    db.query(sql, [id], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const getProductDetails = (id) => {
  return new Promise((resolve, reject) => {
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
            WHERE termekek.id = ?`

    db.query(sql, [id], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const getProduct3D = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT haromD FROM termekek WHERE id = ?"
    db.query(sql, [id], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const createProduct = (productData, files) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO termekek (`nev`, `ar`, `suly`, `anyag`, `leiras`, `meret`, `kategoriaID`, `kep`, `keszlet`, `haromD`) VALUES (?)"

    const values = [
      productData.nev,
      productData.ar,
      productData.suly,
      productData.anyag,
      productData.leiras,
      productData.meret,
      productData.kategoria,
      files["kep"] ? files["kep"][0].filename : null,
      productData.keszlet,
      files["haromD"] ? files["haromD"][0].filename : null,
    ]

    db.query(sql, [values], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const updateProduct = (id, productData, files, oldFiles) => {
  return new Promise((resolve, reject) => {
    // Új fájlok mentése (ha vannak), különben marad a régi
    const newKep = files["kep"] ? files["kep"][0].filename : productData.regikep
    const newHaromD = files["haromD"] ? files["haromD"][0].filename : productData.regiharomD

    const sqlUpdate =
      "UPDATE termekek SET `nev` = ?, `ar` = ?, `suly` = ?, `anyag` = ?, `leiras` = ?, `meret` = ?, `kategoriaID` = ?, `kep` = ?, `keszlet` = ?, `haromD` = ? WHERE id = ?"

    db.query(
      sqlUpdate,
      [
        productData.nev,
        productData.ar,
        productData.suly,
        productData.anyag,
        productData.leiras,
        productData.meret,
        productData.kategoria,
        newKep,
        productData.keszlet,
        newHaromD,
        id,
      ],
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      },
    )
  })
}

export const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    // Először lekérdezzük a fájl nevét
    const sqlSelect = "SELECT kep, haromD FROM termekek WHERE id = ?"
    db.query(sqlSelect, [id], (err, result) => {
      if (err) reject(err)

      // Most töröljük az adatbázisból a rekordot
      const sqlDelete = "DELETE FROM termekek WHERE id=?"
      db.query(sqlDelete, [id], (err, deleteResult) => {
        if (err) reject(err)
        resolve({ fileData: result, deleteResult })
      })
    })
  })
}

export const getCategories = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, nev FROM kategoria"
    db.query(sql, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const getProductsByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM termekek WHERE kategoriaID = ?"
    db.query(sql, [categoryId], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const updateProductStock = (productId, quantity) => {
  return new Promise((resolve, reject) => {
    const updateQuery = `
            UPDATE termekek 
            SET keszlet = CASE 
                WHEN keszlet >= ? THEN keszlet - ? 
                ELSE 0 
            END 
            WHERE id = ?
        `
    db.query(updateQuery, [quantity, quantity, productId], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

