import * as OrderModel from "../models/orderModel.js"
import * as CartModel from "../models/cartModel.js"
import * as ProductModel from "../models/productModel.js"

export const createOrder = async (req, res) => {
  try {
    

    const vasarloId = req.id
    const items = req.body.items
    const totalPrice = req.body.total

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "A kosár üres!" })
    }

    
    const orderResult = await OrderModel.createOrder(vasarloId, totalPrice)
    const rendelesId = orderResult.insertId
   

    const orderItems = items.map((item) => [
      rendelesId,
      item.termekID,
      item.dbszam,
      item.termekAr,
      item.dbszam * item.termekAr,
    ])

    await OrderModel.addOrderItems(orderItems)

    const frissitesek = items.map((item) => {
      return ProductModel.updateProductStock(item.termekID, item.dbszam)
    })

    await Promise.all(frissitesek)

    await CartModel.clearCart()

    console.log("Rendelés és készlet frissítve!")
    return res.json({ message: "Rendelés sikeres!" })
  } catch (err) {
    console.error("Rendelés hiba:", err)
    return res.status(500).json({ error: "Rendelés feldolgozási hiba" })
  }
}

export const getUserOrders = async (req, res) => {
  try {
    const vasarloId = req.id

    const rendelesek = await OrderModel.getUserOrders(vasarloId)

   
    if (rendelesek.length === 0) {
      return res.json([])
    }

    const rendelesIds = rendelesek.map((r) => r.id)

   
    const tetelek = await OrderModel.getOrderItems(rendelesIds)

    
    const rendelesekWithTetelek = rendelesek.map((r) => ({
      ...r,
      tetelek: tetelek.filter((t) => t.rendeles_id === r.id),
    }))

    res.json(rendelesekWithTetelek)
  } catch (err) {
    console.error("Hiba a rendelesek lekerese soran:", err)
    return res.status(500).json({ message: "Hiba a rendelesek lekérésekor!" })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    
    const rendelesek = await OrderModel.getAllOrders()

    if (rendelesek.length === 0) {
      return res.json([])
    }


    const rendelesIds = rendelesek.map((r) => r.id)

    const tetelek = await OrderModel.getOrderItems(rendelesIds)

    const rendelesekWithTetelek = rendelesek.map((r) => ({
      ...r,
      tetelek: tetelek.filter((t) => t.rendeles_id === r.id),
    }))

    res.json(rendelesekWithTetelek)
  } catch (err) {
    console.error("Hiba a rendelesek lekerese soran:", err)
    return res.status(500).json({ message: "Hiba a rendelesek lekérésekor!" })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { statusz } = req.body

    await OrderModel.updateOrderStatus(id, statusz)
    res.json({ message: "Statusz sikeresen frissítve!" })
  } catch (err) {
    console.error("Hiba a rendelés statusz frissítésekor:", err)
    return res.status(500).json({ error: "Statusz frissítési hiba" })
  }
}

