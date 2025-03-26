import express from "express"
import * as AdminController from "../controllers/adminController.js"
import { verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

// Admin authentication routes
router.post("/login", AdminController.loginAdmin)
router.get("/logout", AdminController.logoutAdmin)
router.get("/", verifyAdmin, AdminController.checkAdmin)

// Admin management routes
router.get("/adminlist", AdminController.getAllAdmins)
router.post("/adminlist/admin", AdminController.createAdmin)
router.get("/adminlist/edit/:id", AdminController.getAdminById)
router.put("/adminlist/update/:id", AdminController.updateAdmin)
router.delete("/adminlist/delete/:id", AdminController.deleteAdmin)

export default router

