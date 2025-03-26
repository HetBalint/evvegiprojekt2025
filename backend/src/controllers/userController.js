import jwt from "jsonwebtoken"
import * as UserModel from "../models/userModel.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers()
    return res.json(users)
  } catch (err) {
    return res.json({ Message: "Hiba van a szerverben!" })
  }
}

export const createUser = async (req, res) => {
  try {
    const result = await UserModel.createUser(req.body)
    return res.json(result)
  } catch (err) {
    console.error("SQL Hiba:", err)
    return res.json(err)
  }
}

export const loginUser = async (req, res) => {
  try {
    const data = await UserModel.loginUser(req.body.email, req.body.jelszo)

    if (data.length > 0) {
      const { id, nev, email, usertel } = data[0]
      const token = jwt.sign({ id, nev, email, usertel }, "userSecretKey", { expiresIn: "1d" })

      res.cookie("userToken", token, {
        httpOnly: true,
        secure: false, // Ha HTTPS-t használsz, állítsd true-ra
        sameSite: "lax",
      })

      return res.json({ Status: "Success" })
    } else {
      return res.json("Failed")
    }
  } catch (err) {
    return res.json("Error")
  }
}

export const logoutUser = (req, res) => {
  res.cookie("userToken", "", {
    httpOnly: true,
    secure: false, // Ha HTTPS-t használsz, állítsd "true"-ra
    sameSite: "lax",
    expires: new Date(0), // A süti azonnali lejárata
    path: "/",
  })

  res.clearCookie("userToken") // A süti biztos törlése
  return res.json({ Status: "Success" })
}

export const getUserInfo = (req, res) => {
  return res.json({
    Status: "Success",
    id: req.id,
    nev: req.nev,
    email: req.email,
    usertel: req.usertel,
  })
}

