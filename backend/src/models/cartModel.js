import db from "../config/database.js"

export const addToCart = (cartItem) => {
  return new Promise((resolve, reject) => {
    const { termekId, nev, meret, mennyiseg, ar, kep, anyag } = cartItem;
    const vegosszeg = ar * mennyiseg;

    // Ellenőrizzük, hogy van-e már ilyen termék a kosárban
    const checkSql = `SELECT dbszam FROM kosar WHERE termekID = ?`;

    db.query(checkSql, [termekId], (err, results) => {
      if (err) return reject(err);

      if (results.length > 0) {
        // Ha már bent van, növeljük a dbszámot
        const updateSql = `UPDATE kosar SET dbszam = dbszam + ?, vegosszeg = vegosszeg + ? WHERE termekID = ?`;
        db.query(updateSql, [mennyiseg, vegosszeg, termekId], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      } else {
        // Ha nincs bent, újként adjuk hozzá
        const insertSql = `
          INSERT INTO kosar (termekID, termekNev, termekMeret, dbszam, termekAr, termekKep, vegosszeg, termekAnyag) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [termekId, nev, meret, mennyiseg, ar, kep, vegosszeg, anyag];

        db.query(insertSql, values, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      }
    });
  });
};


export const getCart = () => {
  return new Promise((resolve, reject) => {
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
        `

    db.query(sql, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const removeFromCart = (productId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM kosar WHERE termekID = ?"

    db.query(sql, [productId], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const updateCartItemQuantity = (productId, action) => {
  return new Promise((resolve, reject) => {
    let query = ""
    if (action === "increase") {
      query = "UPDATE kosar SET dbszam = dbszam + 1 WHERE termekID = ?"
    } else if (action === "decrease") {
      query = "UPDATE kosar SET dbszam = GREATEST(dbszam - 1, 1) WHERE termekID = ?"
    } else {
      reject(new Error("Érvénytelen művelet!"))
      return
    }

    db.query(query, [productId], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const clearCart = () => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM kosar", (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

