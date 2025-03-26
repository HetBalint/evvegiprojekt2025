import * as CartModel from "../models/cartModel.js"

export const addToCart = async (req, res) => {
  try {
    const { termekId, nev, meret, mennyiseg, ar, kep, anyag } = req.body

    if (!termekId || !nev || !meret || !mennyiseg || !ar || !kep || !anyag) {
      return res.status(400).json({ error: "Minden mező kötelező!" })
    }

    const result = await CartModel.addToCart(req.body)
    res.json({ message: "Termék sikeresen hozzáadva a kosárhoz!", termekId: result.insertId })
  } catch (err) {
    console.error("Hiba a termék kosárba helyezésekor:", err)
    return res.status(500).json({ error: "Szerverhiba a termék kosárba helyezésekor." })
  }
}

export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.getCart()
    res.json(cart)
  } catch (err) {
    console.error("Hiba a kosár lekérdezésekor:", err)
    return res.status(500).json({ error: "Hiba történt a kosár lekérdezésekor" })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const id = req.params.id
    const result = await CartModel.removeFromCart(id)

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "A termék nem található a kosárban!" })
    }

    return res.json({ message: "Termék sikeresen törölve a kosárból!" })
  } catch (err) {
    console.error("Hiba a termék törlésekor:", err)
    return res.status(500).json({ message: "Hiba van a szerverben!" })
  }
}

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { id } = req.params
    const { action } = req.body

    if (action !== "increase" && action !== "decrease") {
      return res.status(400).json({ error: "Érvénytelen művelet!" })
    }

    const result = await CartModel.updateCartItemQuantity(id, action)
    res.json({ message: "Mennyiség frissítve!", updatedId: id })
  } catch (err) {
    return res.status(500).json({ error: "Hiba a frissítés során!" })
  }
}

