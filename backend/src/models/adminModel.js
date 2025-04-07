import db from "../config/database.js"

export const getAllAdmins = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM admin"
    db.query(sql, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const getAdminById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM admin WHERE ID = ?"
    db.query(sql, [id], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const createAdmin = (adminData) => {
  return new Promise((resolve, reject) => {
    const formattedDate = new Date(adminData.szulev).toISOString().slice(0, 10)

    const sql = "INSERT INTO admin (`nev`,`email`,`jelszo`,`szulev`,`lakhely`,`cim`,`adoszam`,`telszam`) VALUES (?)"
    const values = [
      adminData.nev,
      adminData.email,
      adminData.jelszo,
      formattedDate,
      adminData.lakhely,
      adminData.cim,
      adminData.adoszam,
      adminData.telszam,
    ]

    db.query(sql, [values], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const updateAdmin = (id, adminData) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE admin SET `nev`=?, `email`=?, `jelszo`=?, `szulev`=?, `lakhely`=?, `cim`=?, `adoszam`=?, `telszam`=? WHERE id=?"

    db.query(
      sql,
      [
        adminData.nev,
        adminData.email,
        adminData.jelszo,
        adminData.szulev,
        adminData.lakhely,
        adminData.cim,
        adminData.adoszam,
        adminData.telszam,
        id,
      ],
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      },
    )
  })
}

export const deleteAdmin = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM admin WHERE id=?"
    db.query(sql, [id], ( result) => {
      if (err) reject()
      resolve(result)
    })
  })
}

export const loginAdmin = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM admin WHERE email = ?";
    db.query(sql, [email], (err, result) => {
      if (err) reject(err);
      resolve(result); // Visszaadjuk a lekérdezett adatokat (pl. jelszóval együtt)
    });
  });
};

