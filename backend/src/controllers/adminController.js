import jwt from "jsonwebtoken"
import * as AdminModel from "../models/adminModel.js"

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.getAllAdmins()
    return res.json(admins)
  } catch (err) {
    console.error(err)
    return res.json({ Message: "Hiba van a szerverben!" })
  }
}

export const getAdminById = async (req, res) => {
  try {
    const id = req.params.id
    const admin = await AdminModel.getAdminById(id)
    return res.json(admin)
  } catch (err) {
    console.error("Database error:", err)
    return res.json({ Message: "Hiba van a szerverben!" })
  }
}

export const createAdmin = async (req, res) => {
  try {
    const result = await AdminModel.createAdmin(req.body)
    return res.json(result)
  } catch (err) {
    console.error("SQL Hiba:", err)
    return res.json(err)
  }
}

export const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id

    // Ellenőrzés a beérkező adatokra
    if (
      !req.body.nev ||
      !req.body.email ||
      !req.body.jelszo ||
      !req.body.szulev ||
      !req.body.lakhely ||
      !req.body.cim ||
      !req.body.adoszam ||
      !req.body.telszam
    ) {
      return res.status(400).json({ Message: "Hiányzó mezők az űrlapban!" })
    }

    const result = await AdminModel.updateAdmin(id, req.body)
    return res.json({ Message: "Sikeres frissítés!", result })
  } catch (err) {
    console.error("Database error:", err)
    return res.status(500).json({ Message: "Hiba van a szerverben!", Error: err })
  }
}

export const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id
    const result = await AdminModel.deleteAdmin(id)
    return res.json(result)
  } catch (err) {
    return res.json({ Message: "Hiba van a szerverben!" })
  }
}

export const loginAdmin = async (req, res) => {
  try {
    const data = await AdminModel.loginAdmin(req.body.email, req.body.jelszo)

    if (data.length > 0) {
      const nev = data[0].nev
      const token = jwt.sign({ nev }, "adminSecretKey", { expiresIn: "1d" })

      // Beállítjuk a HTTP-only JWT sütit adminok számára
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: false, // Ha HTTPS-t használsz, állítsd true-ra
        sameSite: "lax",
        path: "/",
      })

      return res.json({ Status: "Success" })
    } else {
      return res.json("Failed")
    }
  } catch (err) {
    return res.json("Error")
  }
}

export const logoutAdmin = (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    secure: false, // Ha HTTPS-t használsz, állítsd "true"-ra
    sameSite: "lax",
    expires: new Date(0), // A süti azonnali lejárata
  })

  res.clearCookie("adminToken") // A süti biztos törlése
  return res.json({ Status: "Success" })
}

export const checkAdmin = (req, res) => {
  return res.json({ Status: "Success", nev: req.nev })
}

