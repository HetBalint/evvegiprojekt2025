import express from "express"
import * as CartController from "../controllers/cartController.js"

const router = express.Router()

router.post("/kosar/termek", CartController.addToCart)
router.get("/kosar", CartController.getCart)
router.delete("/kosar/delete/:id", CartController.removeFromCart)
router.put("/kosar/update/:id", CartController.updateCartItemQuantity)

export default router

