const jwt = require('jsonwebtoken');

const mockDb = {
  query: jest.fn()
};

const mockAdminModel = {
  getAllAdmins: jest.fn(),
  getAdminById: jest.fn(),
  createAdmin: jest.fn(),
  updateAdmin: jest.fn(),
  deleteAdmin: jest.fn(),
  loginAdmin: jest.fn()
};


mockAdminModel.getAllAdmins.mockImplementation(() => {
  return new Promise((resolve, reject) => {
    mockDb.query("SELECT * FROM adminok", (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockAdminModel.getAdminById.mockImplementation((id) => {
  return new Promise((resolve, reject) => {
    mockDb.query("SELECT * FROM adminok WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockAdminModel.createAdmin.mockImplementation((adminData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO adminok (`nev`,`email`,`jelszo`,`szulev`,`lakhely`,`cim`,`adoszam`,`telszam`) VALUES (?)";
    const values = [
      adminData.nev,
      adminData.email,
      adminData.jelszo,
      adminData.szulev,
      adminData.lakhely,
      adminData.cim,
      adminData.adoszam,
      adminData.telszam
    ];
    
    mockDb.query(sql, [values], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockAdminModel.updateAdmin.mockImplementation((id, adminData) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE adminok SET `nev`=?, `email`=?, `jelszo`=?, `szulev`=?, `lakhely`=?, `cim`=?, `adoszam`=?, `telszam`=? WHERE id=?";
    const values = [
      adminData.nev,
      adminData.email,
      adminData.jelszo,
      adminData.szulev,
      adminData.lakhely,
      adminData.cim,
      adminData.adoszam,
      adminData.telszam,
      id
    ];
    
    mockDb.query(sql, values, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockAdminModel.deleteAdmin.mockImplementation((id) => {
  return new Promise((resolve, reject) => {
    mockDb.query("DELETE FROM adminok WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockAdminModel.loginAdmin.mockImplementation((email, password) => {
  return new Promise((resolve, reject) => {
    mockDb.query("SELECT * FROM adminok WHERE `email` = ? AND `jelszo` = ?", [email, password], (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
});

jest.mock('jsonwebtoken');


const adminController = {
  getAllAdmins: async (req, res) => {
    try {
      const admins = await mockAdminModel.getAllAdmins();
      return res.json(admins);
    } catch (err) {
      console.error(err);
      return res.json({ Message: "Hiba van a szerverben!" });
    }
  },
  
  getAdminById: async (req, res) => {
    try {
      const id = req.params.id;
      const admin = await mockAdminModel.getAdminById(id);
      return res.json(admin);
    } catch (err) {
      console.error("Database error:", err);
      return res.json({ Message: "Hiba van a szerverben!" });
    }
  },
  
  createAdmin: async (req, res) => {
    try {
      const result = await mockAdminModel.createAdmin(req.body);
      return res.json(result);
    } catch (err) {
      console.error("SQL Hiba:", err);
      return res.json(err);
    }
  },
  
  updateAdmin: async (req, res) => {
    try {
      const id = req.params.id;
      
      if (
        !req.body.nev ||
        !req.body.email ||
        !req.body.jelszo ||
        !req.body.szulev ||
        !req.body.lakhely ||
        !req.body.cim ||
        !req.body.adoszam ||
        !req.body.telszam
      ) {
        return res.status(400).json({ Message: "Hiányzó mezők az űrlapban!" });
      }
      
      const result = await mockAdminModel.updateAdmin(id, req.body);
      return res.json({ Message: "Sikeres frissítés!", result });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Message: "Hiba van a szerverben!", Error: err });
    }
  },
  
  deleteAdmin: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await mockAdminModel.deleteAdmin(id);
      return res.json(result);
    } catch (err) {
      return res.json({ Message: "Hiba van a szerverben!" });
    }
  },
  
  loginAdmin: async (req, res) => {
    try {
      const data = await mockAdminModel.loginAdmin(req.body.email, req.body.jelszo);
      
      if (data.length > 0) {
        const nev = data[0].nev;
        const token = jwt.sign({ nev }, "adminSecretKey", { expiresIn: "1d" });
        
        res.cookie("adminToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
        });
        
        return res.json({ Status: "Success" });
      } else {
        return res.json("Failed");
      }
    } catch (err) {
      return res.json("Error");
    }
  },
  
  logoutAdmin: (req, res) => {
    res.cookie("adminToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(0),
    });
    
    res.clearCookie("adminToken");
    return res.json({ Status: "Success" });
  },
  
  checkAdmin: (req, res) => {
    return res.json({ Status: "Success", nev: req.nev });
  }
};

describe('Adminisztrátor Controller Tests', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {
        nev: 'Admin',
        email: 'admin@proba.com',
        jelszo: 'admin123',
        szulev: '1990',
        lakhely: 'Budapest',
        cim: 'Proba Utca 123',
        adoszam: '12345678-1-23',
        telszam: '06301234567'
      },
      params: {
        id: '1'
      },
      nev: 'Admin'
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
    
    console.error = jest.fn();
    
    mockDb.query.mockImplementation((sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      
      if (sql.includes("SELECT * FROM adminok") && !sql.includes("WHERE")) {
        callback(null, [
          { id: 1, nev: 'Admin 1', email: 'admin1@example.com' },
          { id: 2, nev: 'Admin 2', email: 'admin2@example.com' }
        ]);
      } else if (sql.includes("SELECT * FROM adminok WHERE id")) {
        callback(null, [{ 
          id: 1, 
          nev: 'Admin User', 
          email: 'admin@example.com',
          szulev: '1990',
          lakhely: 'Budapest',
          cim: 'Example Street 123',
          adoszam: '12345678-1-23',
          telszam: '06301234567'
        }]);
      } else if (sql.includes("INSERT INTO")) {
        callback(null, { insertId: 1, affectedRows: 1 });
      } else if (sql.includes("UPDATE")) {
        callback(null, { changedRows: 1 });
      } else if (sql.includes("DELETE")) {
        callback(null, { affectedRows: 1 });
      } else if (sql.includes("SELECT * FROM adminok WHERE `email`")) {
        callback(null, [{ 
          id: 1, 
          nev: 'Admin User', 
          email: 'admin@example.com'
        }]);
      }
    });
  });

  test('összes adminisztrátor lekérése', async () => {
    await adminController.getAllAdmins(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, nev: 'Admin 1', email: 'admin1@example.com' },
      { id: 2, nev: 'Admin 2', email: 'admin2@example.com' }
    ]);
  });

  test('adminisztrátor lekérése ID alapján', async () => {
    await adminController.getAdminById(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([expect.objectContaining({ id: 1 })]);
  });

  test('új adminisztrátor hozzáadása', async () => {
    await adminController.createAdmin(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ insertId: 1, affectedRows: 1 });
  });

  test('adminisztrátor frissítése', async () => {
    await adminController.updateAdmin(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ 
      Message: "Sikeres frissítés!", 
      result: { changedRows: 1 } 
    });
  });

  test('kötelező mezők kitöltése az adminisztrátor frissítéshez', async () => {
    req.body = { nev: 'Admin User' };
    
    await adminController.updateAdmin(req, res);
    
    expect(mockDb.query).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ Message: "Hiányzó mezők az űrlapban!" });
  });

  test('adminisztrátor törlése', async () => {
    await adminController.deleteAdmin(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ affectedRows: 1 });
  });

  test('adatbázis-hibák kezelése az adminisztrátorok lekérésekor', async () => {

    mockDb.query.mockImplementationOnce((sql, callback) => {
      callback(new Error('Database error'), null);
    });
    
    await adminController.getAllAdmins(req, res);
    
    expect(console.error).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Message: "Hiba van a szerverben!" });
  });

  test('sikeres adminisztrátor bejelentkezés', async () => {
    jwt.sign.mockReturnValue('fake-admin-token');
    
    await adminController.loginAdmin(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith(
      { nev: 'Admin User' },
      'adminSecretKey',
      { expiresIn: '1d' }
    );
    expect(res.cookie).toHaveBeenCalledWith('adminToken', 'fake-admin-token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ Status: 'Success' });
  });

  test('sikertelen adminisztrátori bejelentkezés kezelése', async () => {
    mockDb.query.mockImplementationOnce((sql, params, callback) => {
      callback(null, []); 
    });
    
    await adminController.loginAdmin(req, res);
    
    expect(res.json).toHaveBeenCalledWith('Failed');
  });

  test('adminisztrátor sikeres kijelentkezése', () => {
    adminController.logoutAdmin(req, res);
    
    expect(res.cookie).toHaveBeenCalledWith('adminToken', '', expect.objectContaining({
      expires: expect.any(Date)
    }));
    expect(res.clearCookie).toHaveBeenCalledWith('adminToken');
    expect(res.json).toHaveBeenCalledWith({ Status: 'Success' });
  });

  test('adminisztrátori hitelesítés ellenőrzése', () => {
    adminController.checkAdmin(req, res);
    
    expect(res.json).toHaveBeenCalledWith({ Status: 'Success', nev: 'Admin User' });
  });
});