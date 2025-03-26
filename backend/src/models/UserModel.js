import db from "../config/database.js"

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM vasarlok"
    db.query(sql, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO vasarlok (`nev`,`email`,`jelszo`,`usertel`) VALUES (?)"
    const values = [userData.nev, userData.email, userData.jelszo, userData.usertel]

    db.query(sql, [values], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM vasarlok WHERE `email` = ? AND `jelszo` = ?"
    db.query(sql, [email, password], (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

