import db from "../config/database.js"

export const createOrder = (vasarloId, totalPrice) => {
  return new Promise((resolve, reject) => {
    const insertOrderQuery = `
            INSERT INTO rendelesek (statusz, osszeg, ido, vasarlo_id)
            VALUES (?, ?, NOW(), ?)
        `

    db.query(insertOrderQuery, ["feldolgozás alatt", totalPrice, vasarloId], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const addOrderItems = (orderItems) => {
  return new Promise((resolve, reject) => {
    const insertItemsQuery = `
            INSERT INTO rendeles_tetelek (rendeles_id, termek_id, dbszam, termekAr, vegosszeg)
            VALUES ?
        `

    db.query(insertItemsQuery, [orderItems], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

export const getUserOrders = (userId) => {
  return new Promise((resolve, reject) => {
    const rendelesekQuery = `
            SELECT * FROM rendelesek
            WHERE vasarlo_id = ?
            ORDER BY ido DESC
        `

    db.query(rendelesekQuery, [userId], (err, rendelesek) => {
      if (err) reject(err)
      resolve(rendelesek)
    })
  })
}

export const getOrderItems = (orderIds) => {
  return new Promise((resolve, reject) => {
    const tetelekQuery = `
            SELECT rt.*, t.nev AS termekNev FROM rendeles_tetelek rt
            JOIN termekek t ON rt.termek_id = t.id
            WHERE rt.rendeles_id IN (?)
        `

    db.query(tetelekQuery, [orderIds], (err, tetelek) => {
      if (err) reject(err)
      resolve(tetelek)
    })
  })
}

export const getAllOrders = () => {
  return new Promise((resolve, reject) => {
    const rendelesekQuery = `
            SELECT r.*, v.nev AS vasarloNev
            FROM rendelesek r
            JOIN vasarlok v ON r.vasarlo_id = v.id
            ORDER BY r.ido DESC
        `

    db.query(rendelesekQuery, (err, rendelesek) => {
      if (err) reject(err)
      resolve(rendelesek)
    })
  })
}

export const updateOrderStatus = (orderId, status) => {
  return new Promise((resolve, reject) => {
    const updateQuery = "UPDATE rendelesek SET statusz = ? WHERE id = ?"
    db.query(updateQuery, [status, orderId], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

