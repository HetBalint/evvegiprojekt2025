import express from "express";
import * as ProductController from "../controllers/productController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Public product routes
router.get("/termek/:id", ProductController.getProductDetails);
router.get("/termek/:id/3D", ProductController.getProduct3D);
router.get("/gyuruk", (req, res) => ProductController.getProductsByCategory(req, res, 1));
router.get("/nyaklancok", (req, res) => ProductController.getProductsByCategory(req, res, 2));
router.get("/karlancok", (req, res) => ProductController.getProductsByCategory(req, res, 3));
router.get("/fulbevalok", (req, res) => ProductController.getProductsByCategory(req, res, 4));

// Admin product management routes
router.get("/admin/productlist", ProductController.getAllProducts);
router.get("/admin/productlist/pedit/:id", ProductController.getProductById);
router.post(
  "/admin/productlist/product",
  upload.fields([
    { name: "kep", maxCount: 1 },
    { name: "haromD", maxCount: 1 },
  ]),
  ProductController.createProduct
);
router.put(
  "/admin/productlist/update/:id",
  upload.fields([
    { name: "kep", maxCount: 1 },
    { name: "haromD", maxCount: 1 },
  ]),
  ProductController.updateProduct
);
router.delete("/admin/productlist/delete/:id", ProductController.deleteProduct);

// Categories
router.get("/admin/kategoriak", ProductController.getCategories);

export default router;
