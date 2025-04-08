const jwt = require('jsonwebtoken');

const mockUserModel = {
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  loginUser: jest.fn(),
  updateCurrentUser: jest.fn()
};

jest.mock('jsonwebtoken');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await mockUserModel.getAllUsers();
      return res.json(users);
    } catch (err) {
      return res.json({ Message: "Hiba van a szerverben!" });
    }
  },

  createUser: async (req, res) => {
    try {
      const result = await mockUserModel.createUser(req.body);
      return res.json(result);
    } catch (err) {
      console.error("SQL Hiba:", err);
      return res.json(err);
    }
  },

  loginUser: async (req, res) => {
    try {
      const data = await mockUserModel.loginUser(req.body.email, req.body.jelszo);

      if (data.length > 0) {
        const { id, nev, email, usertel } = data[0];
        const token = jwt.sign({ id, nev, email, usertel }, "userSecretKey", { expiresIn: "1d" });

        res.cookie("userToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });

        return res.json({ Status: "Success" });
      } else {
        return res.json("Failed");
      }
    } catch (err) {
      return res.json("Error");
    }
  },

  updateCurrentUser: async (req, res) => {
    try {
      const userId = req.id;

      if (!req.body.nev || !req.body.email || !req.body.usertel) {
        return res.status(400).json({ Message: "Hiányzó mezők az űrlapban!" });
      }

      const result = await mockUserModel.updateCurrentUser(userId, req.body);

      if (result.changedRows === 0) {
        return res.status(400).json({ Message: "Nem történt változás." });
      }

      return res.json({ Message: "Sikeres frissítés!" });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Message: "Hiba van a szerverben!", Error: err });
    }
  }
};

describe('Felhasználó Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        nev: 'Teszt Felhasznalo',
        email: 'teszt@pelda.com',
        jelszo: 'jelszo123',
        usertel: '123456789'
      },
      id: 1
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };

    console.error = jest.fn();
  });

  test('sikeresen lekéri az összes felhasználót', async () => {
    const users = [{ id: 1, nev: 'Teszt' }];
    mockUserModel.getAllUsers.mockResolvedValue(users);

    await userController.getAllUsers(req, res);

    expect(mockUserModel.getAllUsers).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(users);
  });

  test('kezeli a hibát ha nem sikerül lekérni az összes felhasználót', async () => {
    mockUserModel.getAllUsers.mockRejectedValue(new Error("DB hiba"));

    await userController.getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith({ Message: "Hiba van a szerverben!" });
  });

  test('sikeresen regisztrál egy új felhasználót', async () => {
    const mockResult = { insertId: 1, affectedRows: 1 };
    mockUserModel.createUser.mockResolvedValue(mockResult);

    await userController.createUser(req, res);

    expect(mockUserModel.createUser).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  test('kezelnie kell a regisztrációs hibákat', async () => {
    const mockError = new Error('Database error');
    mockUserModel.createUser.mockRejectedValue(mockError);

    await userController.createUser(req, res);

    expect(console.error).toHaveBeenCalledWith('SQL Hiba:', mockError);
    expect(res.json).toHaveBeenCalledWith(mockError);
  });

  test('sikeresen bejelentkezik a felhasználó', async () => {
    const userData = [{
      id: 1,
      nev: 'Teszt',
      email: 'teszt@proba.com',
      usertel: '123456789'
    }];

    mockUserModel.loginUser.mockResolvedValue(userData);
    jwt.sign.mockReturnValue('fake-token');

    await userController.loginUser(req, res);

    expect(mockUserModel.loginUser).toHaveBeenCalledWith(req.body.email, req.body.jelszo);
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith('userToken', 'fake-token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ Status: 'Success' });
  });

  test('nem található felhasználó bejelentkezéskor', async () => {
    mockUserModel.loginUser.mockResolvedValue([]);

    await userController.loginUser(req, res);

    expect(res.json).toHaveBeenCalledWith("Failed");
  });

  test('hibás bejelentkezés kezelése', async () => {
    mockUserModel.loginUser.mockRejectedValue(new Error("Auth hiba"));

    await userController.loginUser(req, res);

    expect(res.json).toHaveBeenCalledWith("Error");
  });

  test('érvényesíti a kötelező mezőket frissítésnél', async () => {
    req.body = { nev: 'Teszt' };

    await userController.updateCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ Message: 'Hiányzó mezők az űrlapban!' });
  });

  test('sikeresen frissíti a felhasználót', async () => {
    const mockResult = { changedRows: 1 };
    mockUserModel.updateCurrentUser.mockResolvedValue(mockResult);

    await userController.updateCurrentUser(req, res);

    expect(mockUserModel.updateCurrentUser).toHaveBeenCalledWith(req.id, req.body);
    expect(res.json).toHaveBeenCalledWith({ Message: 'Sikeres frissítés!' });
  });

  test('nem történik változás frissítéskor', async () => {
    const mockResult = { changedRows: 0 };
    mockUserModel.updateCurrentUser.mockResolvedValue(mockResult);

    await userController.updateCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ Message: 'Nem történt változás.' });
  });
});
