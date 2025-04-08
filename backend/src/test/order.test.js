const OrderModel = {
    createOrder: jest.fn(),
    addOrderItems: jest.fn(),
    getUserOrders: jest.fn(),
    getOrderItems: jest.fn(),
    getAllOrders: jest.fn(),
    updateOrderStatus: jest.fn()
  }
  
  const CartModel = {
    clearCart: jest.fn()
  }
  
  const ProductModel = {
    updateProductStock: jest.fn()
  }
  const createOrder = async (req, res) => {
    try {
      const userID = req.id
      const { items, total } = req.body
  
      if (!items || items.length === 0) {
        return res.status(400).json({ error: "A kosár üres!" })
      }
  
      const result = await OrderModel.createOrder(userID, total)
      const orderID = result.insertId
  
      await OrderModel.addOrderItems(orderID, items)
  
      for (const item of items) {
        await ProductModel.updateProductStock(item.termekID, item.dbszam)
      }
  
      await CartModel.clearCart(userID)
  
      res.json({ message: "Rendelés sikeres!" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Rendelés feldolgozási hiba" })
    }
  }
  
  const getUserOrders = async (req, res) => {
    try {
      const userID = req.id
      const orders = await OrderModel.getUserOrders(userID)
      const ids = orders.map(o => o.id)
      const items = await OrderModel.getOrderItems(ids)
  
      const withItems = orders.map(order => ({
        ...order,
        tetelek: items.filter(i => i.rendeles_id === order.id)
      }))
  
      res.json(withItems)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: "Hiba a rendelesek lekérésekor!" })
    }
  }
  
  const getAllOrders = async (req, res) => {
    try {
      const orders = await OrderModel.getAllOrders()
      const ids = orders.map(o => o.id)
      const items = await OrderModel.getOrderItems(ids)
  
      const withItems = orders.map(order => ({
        ...order,
        tetelek: items.filter(i => i.rendeles_id === order.id)
      }))
  
      res.json(withItems)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: "Hiba a rendelesek lekérésekor!" })
    }
  }
  
  const updateOrderStatus = async (req, res) => {
    try {
      const orderID = req.params.id
      const { statusz } = req.body
  
      await OrderModel.updateOrderStatus(orderID, statusz)
      res.json({ message: "Statusz sikeresen frissítve!" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Statusz frissítési hiba" })
    }
  }
  
  describe("Rendelés Controller Tests", () => {
    let req, res
  
    beforeEach(() => {
      jest.clearAllMocks()
      req = {
        id: 1,
        body: {
          items: [
            { termekID: 1, dbszam: 2, termekAr: 5000 },
            { termekID: 2, dbszam: 1, termekAr: 10000 }
          ],
          total: 20000
        },
        params: { id: "5" }
      }
  
      res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis()
      }
  
      console.error = jest.fn()
    })
  
    test("sikeres rendelés létrehozás", async () => {
      OrderModel.createOrder.mockResolvedValue({ insertId: 101 })
      OrderModel.addOrderItems.mockResolvedValue()
      ProductModel.updateProductStock.mockResolvedValue()
      CartModel.clearCart.mockResolvedValue()
  
      await createOrder(req, res)
  
      expect(OrderModel.createOrder).toHaveBeenCalledWith(1, 20000)
      expect(OrderModel.addOrderItems).toHaveBeenCalled()
      expect(ProductModel.updateProductStock).toHaveBeenCalledTimes(2)
      expect(CartModel.clearCart).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ message: "Rendelés sikeres!" })
    })
  
    test("sikertelen rendelés - üres kosár", async () => {
      req.body.items = []
  
      await createOrder(req, res)
  
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "A kosár üres!" })
      expect(OrderModel.createOrder).not.toHaveBeenCalled()
    })
  
    test("hiba rendelés közben", async () => {
      OrderModel.createOrder.mockRejectedValue(new Error("DB error"))
  
      await createOrder(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: "Rendelés feldolgozási hiba" })
    })
  
    test("felhasználói rendelések lekérdezése", async () => {
      OrderModel.getUserOrders.mockResolvedValue([{ id: 1 }, { id: 2 }])
      OrderModel.getOrderItems.mockResolvedValue([
        { rendeles_id: 1, termek: "Gyűrű" },
        { rendeles_id: 2, termek: "Nyaklánc" }
      ])
  
      await getUserOrders(req, res)
  
      expect(OrderModel.getUserOrders).toHaveBeenCalledWith(1)
      expect(OrderModel.getOrderItems).toHaveBeenCalledWith([1, 2])
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, tetelek: [{ rendeles_id: 1, termek: "Gyűrű" }] },
        { id: 2, tetelek: [{ rendeles_id: 2, termek: "Nyaklánc" }] }
      ])
    })
  
    test("hiba felhasználói rendelések lekérdezésekor", async () => {
      OrderModel.getUserOrders.mockRejectedValue(new Error("DB error"))
  
      await getUserOrders(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: "Hiba a rendelesek lekérésekor!" })
    })
  
    test("összes rendelés lekérdezése", async () => {
      OrderModel.getAllOrders.mockResolvedValue([{ id: 1 }, { id: 2 }])
      OrderModel.getOrderItems.mockResolvedValue([
        { rendeles_id: 1, termek: "Gyűrű" },
        { rendeles_id: 2, termek: "Nyaklánc" }
      ])
  
      await getAllOrders(req, res)
  
      expect(OrderModel.getAllOrders).toHaveBeenCalled()
      expect(OrderModel.getOrderItems).toHaveBeenCalledWith([1, 2])
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, tetelek: [{ rendeles_id: 1, termek: "Gyűrű" }] },
        { id: 2, tetelek: [{ rendeles_id: 2, termek: "Nyaklánc" }] }
      ])
    })
  
    test("hiba összes rendelés lekérdezésekor", async () => {
      OrderModel.getAllOrders.mockRejectedValue(new Error("DB error"))
  
      await getAllOrders(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: "Hiba a rendelesek lekérésekor!" })
    })
  
    test("rendelés státusz frissítése", async () => {
      req.body = { statusz: "teljesítve" }
  
      await updateOrderStatus(req, res)
  
      expect(OrderModel.updateOrderStatus).toHaveBeenCalledWith("5", "teljesítve")
      expect(res.json).toHaveBeenCalledWith({ message: "Statusz sikeresen frissítve!" })
    })
  
    test("hiba a rendelés státusz frissítésekor", async () => {
      req.body = { statusz: "feldolgozás alatt" }
      OrderModel.updateOrderStatus.mockRejectedValue(new Error("DB error"))
  
      await updateOrderStatus(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: "Statusz frissítési hiba" })
    })
  })
  