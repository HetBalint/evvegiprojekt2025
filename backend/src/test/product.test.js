const ProductModel = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    getProductDetails: jest.fn(),
    getProduct3D: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getCategories: jest.fn(),
    getProductsByCategory: jest.fn()
  };
  
  const deleteFile = jest.fn();
  
  const {
    getAllProducts,
    getProductById,
    getProductDetails,
    getProduct3D,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getProductsByCategory
  } = (function () {
    return {
      getAllProducts: async (req, res) => {
        try {
          const products = await ProductModel.getAllProducts();
          return res.json(products);
        } catch (err) {
          return res.status(500).json({ Message: "Hiba van a szerverben!" });
        }
      },
      getProductById: async (req, res) => {
        try {
          const product = await ProductModel.getProductById(req.params.id);
          return res.json(product);
        } catch (err) {
          return res.status(500).json({ Message: "Hiba van a szerverben!" });
        }
      },
      getProductDetails: async (req, res) => {
        try {
          const product = await ProductModel.getProductDetails(req.params.id);
          return res.json(product);
        } catch (err) {
          return res.status(500).json({ message: "Hiba a szerveren!", error: err.sqlMessage });
        }
      },
      getProduct3D: async (req, res) => {
        try {
          const result = await ProductModel.getProduct3D(req.params.id);
          if (result.length > 0 && result[0].haromD) {
            return res.json({ haromD: `http://localhost:8081/3D/${result[0].haromD}` });
          } else {
            return res.json({ haromD: null });
          }
        } catch (err) {
          return res.status(500).json({ error: "Hiba a szerveren!" });
        }
      },
      createProduct: async (req, res) => {
        try {
          const result = await ProductModel.createProduct(req.body, req.files);
          return res.json({ Status: "Success", InsertedID: result.insertId });
        } catch (err) {
          return res.status(500).json({ Error: "Hiba a feltöltés során", Details: err.sqlMessage });
        }
      },
      updateProduct: async (req, res) => {
        try {
          const oldProduct = await ProductModel.getProductById(req.params.id);
          const oldKep = oldProduct.length > 0 ? oldProduct[0].kep : null;
          const oldHaromD = oldProduct.length > 0 ? oldProduct[0].haromD : null;
  
          if (req.files["kep"] && oldKep) await deleteFile(oldKep, "kepek");
          if (req.files["haromD"] && oldHaromD) await deleteFile(oldHaromD, "3D");
  
          const result = await ProductModel.updateProduct(req.params.id, req.body, req.files, { oldKep, oldHaromD });
          return res.json({ Message: "Sikeres frissítés!", Data: result });
        } catch (err) {
          return res.status(500).json({ Message: "Hiba a frissítés során", Error: err.sqlMessage });
        }
      },
      deleteProduct: async (req, res) => {
        try {
          const { fileData } = await ProductModel.deleteProduct(req.params.id);
  
          if (fileData.length > 0) {
            if (fileData[0].kep) await deleteFile(fileData[0].kep, "kepek");
            if (fileData[0].haromD) await deleteFile(fileData[0].haromD, "3D");
          }
  
          return res.json({ Message: "Termék és fájlok törölve!" });
        } catch (err) {
          return res.status(500).json({ Message: "Hiba a termék törlésében!" });
        }
      },
      getCategories: async (req, res) => {
        try {
          const categories = await ProductModel.getCategories();
          return res.json(categories);
        } catch (err) {
          return res.status(500).json({ Message: "Hiba van a szerverben!" });
        }
      },
      getProductsByCategory: async (req, res) => {
        try {
          const products = await ProductModel.getProductsByCategory(req.params.categoryId);
          return res.json(products);
        } catch (err) {
          return res.status(500).json({ Message: "Hiba van a szerverben!" });
        }
      }
    };
  })();
  
  describe("Termék Controller Test", () => {
    let req, res;
  
    beforeEach(() => {
      jest.clearAllMocks();
      req = { params: {}, body: {}, files: {} };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    test("összes termék lekérése adatbázisból", async () => {
      ProductModel.getAllProducts.mockResolvedValue([{ id: 1 }]);
      await getAllProducts(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });
  
    test("termék lekérése ID alapján hiba", async () => {
      ProductModel.getProductById.mockRejectedValue(new Error());
      req.params.id = 1;
      await getProductById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  
    test("a 3D fájl visszatér fájl URL-lel", async () => {
      req.params.id = 1;
      ProductModel.getProduct3D.mockResolvedValue([{ haromD: "modell.glb" }]);
      await getProduct3D(req, res);
      expect(res.json).toHaveBeenCalledWith({ haromD: "http://localhost:8081/3D/modell.glb" });
    });
  
    test("új termék létrehozásakor visszaad ID-t", async () => {
      ProductModel.createProduct.mockResolvedValue({ insertId: 42 });
      await createProduct(req, res);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", InsertedID: 42 });
    });
  
    test("termék frissítése, törlése", async () => {
      req.params.id = 1;
      req.files = { kep: ["uj.jpg"], haromD: ["3d.glb"] };
      ProductModel.getProductById.mockResolvedValue([{ kep: "regi.jpg", haromD: "regi.glb" }]);
      ProductModel.updateProduct.mockResolvedValue("updated");
  
      await updateProduct(req, res);
  
      expect(deleteFile).toHaveBeenCalledWith("regi.jpg", "kepek");
      expect(deleteFile).toHaveBeenCalledWith("regi.glb", "3D");
      expect(res.json).toHaveBeenCalledWith({ Message: "Sikeres frissítés!", Data: "updated" });
    });
  
    test("termékekben lévő fájlok törlése", async () => {
      req.params.id = 5;
      ProductModel.deleteProduct.mockResolvedValue({ fileData: [{ kep: "a.jpg", haromD: "b.glb" }] });
  
      await deleteProduct(req, res);
  
      expect(deleteFile).toHaveBeenCalledWith("a.jpg", "kepek");
      expect(deleteFile).toHaveBeenCalledWith("b.glb", "3D");
      expect(res.json).toHaveBeenCalledWith({ Message: "Termék és fájlok törölve!" });
    });
  });
  