import * as ProductModel from "../models/productModel.js";
import { deleteFile } from "../utils/fileHelper.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAllProducts();
    return res.json(products);
  } catch (err) {
    console.error("Szerverhiba:", err);
    return res.status(500).json({ Message: "Hiba van a szerverben!" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.getProductById(id);
    return res.json(product);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ Message: "Hiba van a szerverben!" });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.getProductDetails(id);
    return res.json(product);
  } catch (err) {
    console.error("Hiba történt a termék lekérdezésekor:", err);
    return res.status(500).json({ message: "Hiba a szerveren!", error: err.sqlMessage });
  }
};

export const getProduct3D = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await ProductModel.getProduct3D(id);

    if (result.length > 0 && result[0].haromD) {
      return res.json({ haromD: `http://localhost:8081/3D/${result[0].haromD}` });
    } else {
      return res.json({haromD: null});
    }
  } catch (err) {
    console.error("Hiba a 3D fájl lekérésekor:", err);
    return res.status(500).json({ error: "Hiba a szerveren!" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const result = await ProductModel.createProduct(req.body, req.files);
    return res.json({ Status: "Success", InsertedID: result.insertId });
  } catch (err) {
    console.error("SQL Hiba:", err);
    return res.status(500).json({ Error: "Hiba a feltöltés során", Details: err.sqlMessage });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const oldProduct = await ProductModel.getProductById(req.params.id);
    const oldKep = oldProduct.length > 0 ? oldProduct[0].kep : null;
    const oldHaromD = oldProduct.length > 0 ? oldProduct[0].haromD : null;

    if (req.files["kep"] && oldKep) {
      try {
        await deleteFile(oldKep, "kepek");
      } catch (err) {
        console.error("Kép törlés hiba:", err);
      }
    }

    if (req.files["haromD"] && oldHaromD) {
      try {
        await deleteFile(oldHaromD, "3D");
      } catch (err) {
        console.error("3D fájl törlés hiba:", err);
      }
    }

    const result = await ProductModel.updateProduct(req.params.id, req.body, req.files, { oldKep, oldHaromD });
    return res.json({ Message: "Sikeres frissítés!", Data: result });
  } catch (err) {
    console.error("SQL Hiba:", err);
    return res.status(500).json({ Message: "Hiba a frissítés során", Error: err.sqlMessage });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { fileData, deleteResult } = await ProductModel.deleteProduct(id);

    if (fileData.length > 0) {
      if (fileData[0].kep) {
        try {
          await deleteFile(fileData[0].kep, "kepek");
        } catch (err) {
          console.error("Fájl törlés hiba:", err);
        }
      }

      if (fileData[0].haromD) {
        try {
          await deleteFile(fileData[0].haromD, "3D");
        } catch (err) {
          console.error("3D fájl törlés hiba:", err);
        }
      }
    }

    return res.json({ Message: "Termék és fájlok törölve!" });
  } catch (err) {
    console.error("SQL hiba:", err);
    return res.status(500).json({ Message: "Hiba a termék törlésében!" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await ProductModel.getCategories();
    return res.json(categories);
  } catch (err) {
    console.error("Hiba történt a kategória lekérdezésekor:", err);
    return res.status(500).json({ Message: "Hiba van a szerverben!" });
  }
};

export const getProductsByCategory = async (req, res, categoryId) => {
  try {
    const products = await ProductModel.getProductsByCategory(categoryId);
    return res.json(products);
  } catch (err) {
    console.error("Hiba történt a kategória lekérdezésekor:", err);
    return res.status(500).json({ Message: "Hiba van a szerverben!" });
  }
};
