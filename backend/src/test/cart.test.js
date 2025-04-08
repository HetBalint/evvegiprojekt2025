const CartModel = {
    addToCart: jest.fn(),
    getCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateCartItemQuantity: jest.fn()
  }
  
  const addToCart = async (req, res) => {
    const { termekId, nev, meret, mennyiseg, ar, kep, anyag } = req.body
    if (!termekId || !nev || !meret || !mennyiseg || !ar || !kep || !anyag) {
      return res.status(400).json({ error: "Minden mező kötelező!" })
    }
    try {
      const result = await CartModel.addToCart(req.body)
      res.json({ message: "Termék sikeresen hozzáadva a kosárhoz!", termekId: result.insertId })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Szerverhiba a termék kosárba helyezésekor." })
    }
  }
  
  const getCart = async (req, res) => {
    try {
      const result = await CartModel.getCart()
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Hiba történt a kosár lekérdezésekor" })
    }
  }
  
  const removeFromCart = async (req, res) => {
    try {
      const result = await CartModel.removeFromCart(req.params.id)
      if (result.affectedRows > 0) {
        res.json({ message: "Termék sikeresen törölve a kosárból!" })
      } else {
        res.status(404).json({ message: "A termék nem található a kosárban!" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Hiba van a szerverben!" })
    }
  }
  
  const updateCartItemQuantity = async (req, res) => {
    const { action } = req.body
    const id = req.params.id
  
    if (!["increase", "decrease"].includes(action)) {
      return res.status(400).json({ error: "Érvénytelen művelet!" })
    }
  
    try {
      await CartModel.updateCartItemQuantity(id, action)
      res.json({ message: "Mennyiség frissítve!", updatedId: id })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Hiba a frissítés során!" })
    }
  }
  
  describe("Kosár Controller Tests", () => {
    let req, res
  
    beforeEach(() => {
      jest.clearAllMocks()
  
      req = {
        body: {
          termekId: 1,
          nev: "Gyűrű",
          meret: "M",
          mennyiseg: 2,
          ar: 4990,
          kep: "gyuru.jpg",
          anyag: "ezüst"
        },
        params: {
          id: "1"
        }
      }
  
      res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis()
      }
  
      console.error = jest.fn()
    })
  
    test("sikeres termékhozzáadás a kosárhoz", async () => {
      CartModel.addToCart.mockResolvedValue({ insertId: 101 })
  
      await addToCart(req, res)
  
      expect(CartModel.addToCart).toHaveBeenCalledWith(req.body)
      expect(res.json).toHaveBeenCalledWith({
        message: "Termék sikeresen hozzáadva a kosárhoz!",
        termekId: 101
      })
    })
  
    test("sikertelen termékhozzáadás - hiányzó mező", async () => {
      req.body = { nev: "Hiányos termék" }
  
      await addToCart(req, res)
  
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Minden mező kötelező!" })
      expect(CartModel.addToCart).not.toHaveBeenCalled()
    })
  
    test("hiba kezelése termék hozzáadásakor", async () => {
      CartModel.addToCart.mockRejectedValue(new Error("DB error"))
  
      await addToCart(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: "Szerverhiba a termék kosárba helyezésekor." })
    })
  
    test("kosár lekérdezése", async () => {
      const mockCart = [
        { id: 1, nev: "Gyűrű", mennyiseg: 2 },
        { id: 2, nev: "Nyaklánc", mennyiseg: 1 }
      ]
      CartModel.getCart.mockResolvedValue(mockCart)
  
      await getCart(req, res)
  
      expect(CartModel.getCart).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(mockCart)
    })
  
    test("hiba kezelése kosár lekérdezésekor", async () => {
      CartModel.getCart.mockRejectedValue(new Error("DB error"))
  
      await getCart(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: "Hiba történt a kosár lekérdezésekor" })
    })
  
    test("termék sikeres eltávolítása a kosárból", async () => {
      CartModel.removeFromCart.mockResolvedValue({ affectedRows: 1 })
  
      await removeFromCart(req, res)
  
      expect(CartModel.removeFromCart).toHaveBeenCalledWith("1")
      expect(res.json).toHaveBeenCalledWith({ message: "Termék sikeresen törölve a kosárból!" })
    })
  
    test("termék nem található a törlésnél", async () => {
      CartModel.removeFromCart.mockResolvedValue({ affectedRows: 0 })
  
      await removeFromCart(req, res)
  
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: "A termék nem található a kosárban!" })
    })
  
    test("hiba a termék törlésekor", async () => {
      CartModel.removeFromCart.mockRejectedValue(new Error("DB error"))
  
      await removeFromCart(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: "Hiba van a szerverben!" })
    })
  
    test("mennyiség növelése/frissítése", async () => {
      req.body = { action: "increase" }
  
      CartModel.updateCartItemQuantity.mockResolvedValue({})
  
      await updateCartItemQuantity(req, res)
  
      expect(CartModel.updateCartItemQuantity).toHaveBeenCalledWith("1", "increase")
      expect(res.json).toHaveBeenCalledWith({ message: "Mennyiség frissítve!", updatedId: "1" })
    })
  
    test("érvénytelen művelet mennyiség frissítésénél", async () => {
      req.body = { action: "delete" }
  
      await updateCartItemQuantity(req, res)
  
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Érvénytelen művelet!" })
      expect(CartModel.updateCartItemQuantity).not.toHaveBeenCalled()
    })
  
    test("hiba a mennyiség frissítésekor", async () => {
      req.body = { action: "increase" }
      CartModel.updateCartItemQuantity.mockRejectedValue(new Error("DB error"))
  
      await updateCartItemQuantity(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: "Hiba a frissítés során!" })
    })
  })
  