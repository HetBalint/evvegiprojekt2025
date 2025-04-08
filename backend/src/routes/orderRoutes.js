import express from "express"
import * as OrderController from "../controllers/orderController.js"
import { verifyUser } from "../middleware/auth.js"

const router = express.Router()
router.post("/rendeles", verifyUser, OrderController.createOrder)
router.get("/rendelesek", verifyUser, OrderController.getUserOrders)
router.get("/rendeleskezeles", OrderController.getAllOrders)
router.put("/admin/rendelesek/frissit/:id", OrderController.updateOrderStatus)

export default router

