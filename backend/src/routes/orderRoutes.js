import express from "express"
import * as OrderController from "../controllers/orderController.js"
import { verifyUser } from "../middleware/auth.js"

const router = express.Router()

// User order routes
router.post("/rendeles", verifyUser, OrderController.createOrder)
router.get("/rendelesek", verifyUser, OrderController.getUserOrders)

// Admin order management routes
router.get("/rendeleskezeles", OrderController.getAllOrders)
router.put("/admin/rendelesek/frissit/:id", OrderController.updateOrderStatus)

export default router

