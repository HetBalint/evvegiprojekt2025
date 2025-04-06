import express from "express"
import * as UserController from "../controllers/userController.js"
import { verifyUser } from "../middleware/auth.js"

const router = express.Router()

// User authentication routes
router.post("/login", UserController.loginUser)
router.get("/logout", UserController.logoutUser)
router.get("/user", verifyUser, UserController.getUserInfo)

// User management routes (admin access)
router.get("/admin/userlist", UserController.getAllUsers)
router.post("/admin/userlist/user", UserController.createUser)
router.get("/user/profile", verifyUser, UserController.getUserInfo)
router.put("/user/update", verifyUser, UserController.updateCurrentUser)

export default router

