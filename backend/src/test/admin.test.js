const jwt = require('jsonwebtoken');

const mockDb = {
  query: jest.fn()
};

const mockUserModel = {
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  loginUser: jest.fn()
};

mockUserModel.getAllUsers.mockImplementation(() => {
  return new Promise((resolve, reject) => {
    mockDb.query("SELECT * FROM users", (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockUserModel.getUserById.mockImplementation((id) => {
  return new Promise((resolve, reject) => {
    mockDb.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockUserModel.createUser.mockImplementation((userData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO users (nev, email, jelszo, lakcim) VALUES (?)";
    const values = [
      userData.nev,
      userData.email,
      userData.jelszo,
      userData.lakcim
    ];
    mockDb.query(sql, [values], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockUserModel.updateUser.mockImplementation((id, userData) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET nev=?, email=?, jelszo=?, lakcim=? WHERE id=?";
    const values = [
      userData.nev,
      userData.email,
      userData.jelszo,
      userData.lakcim,
      id
    ];
    mockDb.query(sql, values, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockUserModel.deleteUser.mockImplementation((id) => {
  return new Promise((resolve, reject) => {
    mockDb.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockUserModel.loginUser.mockImplementation((email, password) => {
  return new Promise((resolve, reject) => {
    mockDb.query("SELECT * FROM users WHERE email = ? AND jelszo = ?", [email, password], (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
});

jest.mock('jsonwebtoken');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await mockUserModel.getAllUsers();
      return res.json(users);
    } catch {
      return res.json({ Message: "Hiba van a szerverben!" });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await mockUserModel.getUserById(req.params.id);
      return res.json(user);
    } catch {
      return res.json({ Message: "Hiba van a szerverben!" });
    }
  },
  createUser: async (req, res) => {
    try {
      const result = await mockUserModel.createUser(req.body);
      return res.json(result);
    } catch (err) {
      return res.json(err);
    }
  },
  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      const { nev, email, jelszo, lakcim } = req.body;
      if (!nev || !email || !jelszo || !lakcim) {
        return res.status(400).json({ Message: "Hiányzó mezők!" });
      }
      const result = await mockUserModel.updateUser(id, req.body);
      return res.json({ Message: "Sikeres frissítés!", result });
    } catch (err) {
      return res.status(500).json({ Message: "Hiba van a szerverben!", Error: err });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const result = await mockUserModel.deleteUser(req.params.id);
      return res.json(result);
    } catch {
      return res.json({ Message: "Hiba van a szerverben!" });
    }
  },
  loginUser: async (req, res) => {
    try {
      const data = await mockUserModel.loginUser(req.body.email, req.body.jelszo);
      if (data.length > 0) {
        const nev = data[0].nev;
        const token = jwt.sign({ nev }, "userSecretKey", { expiresIn: "1d" });
        res.cookie("userToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/"
        });
        return res.json({ Status: "Success" });
      } else {
        return res.json("Failed");
      }
    } catch {
      return res.json("Error");
    }
  },
  logoutUser: (req, res) => {
    res.cookie("userToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(0)
    });
    res.clearCookie("userToken");
    return res.json({ Status: "Success" });
  },
  checkUser: (req, res) => {
    return res.json({ Status: "Success", nev: req.nev });
  }
};

describe('Felhasználó Controller Tesztek', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        nev: 'Teszt Elek',
        email: 'teszt@user.com',
        jelszo: 'user123',
        lakcim: '1111 Budapest, Próba u. 1.'
      },
      params: {
        id: '1'
      },
      nev: 'Teszt Elek'
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };

    mockDb.query.mockImplementation((sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }

      if (sql.includes("SELECT * FROM users") && !sql.includes("WHERE")) {
        callback(null, [{ id: 1, nev: 'User1' }, { id: 2, nev: 'User2' }]);
      } else if (sql.includes("SELECT * FROM users WHERE id")) {
        callback(null, [{ id: 1, nev: 'Teszt Elek' }]);
      } else if (sql.includes("INSERT")) {
        callback(null, { insertId: 1, affectedRows: 1 });
      } else if (sql.includes("UPDATE")) {
        callback(null, { changedRows: 1 });
      } else if (sql.includes("DELETE")) {
        callback(null, { affectedRows: 1 });
      } else if (sql.includes("SELECT * FROM users WHERE email")) {
        callback(null, [{ id: 1, nev: 'Teszt Elek' }]);
      }
    });
  });

  test('összes user lekérése', async () => {
    await userController.getAllUsers(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, nev: 'User1' }, { id: 2, nev: 'User2' }]);
  });

  test('user lekérése ID alapján', async () => {
    await userController.getUserById(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, nev: 'Teszt Elek' }]);
  });

  test('user létrehozása', async () => {
    await userController.createUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ insertId: 1, affectedRows: 1 });
  });

  test('user frissítése', async () => {
    await userController.updateUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ Message: "Sikeres frissítés!", result: { changedRows: 1 } });
  });

  test('kötelező mezők validálása frissítéskor', async () => {
    req.body = { nev: 'Csak Név' };
    await userController.updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ Message: "Hiányzó mezők!" });
  });

  test('user törlése', async () => {
    await userController.deleteUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ affectedRows: 1 });
  });

  test('sikeres user login', async () => {
    jwt.sign.mockReturnValue('fake-user-token');
    await userController.loginUser(req, res);
    expect(res.cookie).toHaveBeenCalledWith('userToken', 'fake-user-token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ Status: 'Success' });
  });

  test('sikertelen user login', async () => {
    mockDb.query.mockImplementationOnce((sql, params, cb) => cb(null, []));
    await userController.loginUser(req, res);
    expect(res.json).toHaveBeenCalledWith("Failed");
  });

  test('user kijelentkezés', () => {
    userController.logoutUser(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith("userToken");
    expect(res.json).toHaveBeenCalledWith({ Status: "Success" });
  });

  test('user hitelesítés ellenőrzés', () => {
    userController.checkUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ Status: "Success", nev: "Teszt Elek" });
  });
});
