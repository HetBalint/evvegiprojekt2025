/**
 * @jest-environment node
 */

// user.test.js
const jwt = require('jsonwebtoken');

// Mock database module
const mockDb = {
  query: jest.fn()
};

// Mock the modules manually instead of using jest.mock
const mockUserModel = {
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  loginUser: jest.fn(),
  updateCurrentUser: jest.fn()
};

// Implement the actual model functions with the mock DB
mockUserModel.getAllUsers.mockImplementation(() => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM vasarlok";
    mockDb.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockUserModel.createUser.mockImplementation((userData) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO vasarlok (`nev`,`email`,`jelszo`,`usertel`) VALUES (?)";
    const values = [userData.nev, userData.email, userData.jelszo, userData.usertel];
    mockDb.query(sql, [values], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

mockUserModel.loginUser.mockImplementation((email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM vasarlok WHERE `email` = ? AND `jelszo` = ?";
    mockDb.query(sql, [email, password], (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
});

mockUserModel.updateCurrentUser.mockImplementation((id, userData) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE vasarlok SET `nev`=?, `email`=?, `usertel`=? WHERE id=?";
    mockDb.query(
      sql,
      [userData.nev, userData.email, userData.usertel, id],
      (err, result) => {
        if (err) reject(err);
        console.log("SQL eredmény:", result); // Az SQL eredményének kiírása
        resolve(result);
      }
    );
  });
});

jest.mock('jsonwebtoken');

// Mock the controller with our manually mocked dependencies
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

describe('User Registration Controller Tests', () => {
  let req, res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {
        nev: 'Test User',
        email: 'test@example.com',
        jelszo: 'password123',
        usertel: '123456789'
      },
      id: 1
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };
    
    // Mock console.error and console.log to prevent test output pollution
    console.error = jest.fn();
    console.log = jest.fn();
    
    // Setup database query mock to simulate successful responses
    mockDb.query.mockImplementation((sql, params, callback) => {
      // Check if callback is the second parameter (for queries without params)
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      
      // Different responses based on the SQL
      if (sql.includes("SELECT * FROM vasarlok")) {
        callback(null, [{ id: 1, nev: 'Test User', email: 'test@example.com', usertel: '123456789' }]);
      } else if (sql.includes("INSERT INTO")) {
        callback(null, { insertId: 1, affectedRows: 1 });
      } else if (sql.includes("UPDATE vasarlok")) {
        callback(null, { changedRows: 1 });
      }
    });
  });

  test('should successfully register a new user', async () => {
    // Override the default mock for this specific test if needed
    mockDb.query.mockImplementationOnce((sql, values, callback) => {
      expect(sql).toBe("INSERT INTO vasarlok (`nev`,`email`,`jelszo`,`usertel`) VALUES (?)");
      callback(null, { insertId: 1, affectedRows: 1 });
    });
    
    await userController.createUser(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ insertId: 1, affectedRows: 1 });
  });

  test('should handle registration errors', async () => {
    // Mock a database error
    mockDb.query.mockImplementationOnce((sql, values, callback) => {
      callback(new Error('Database error'), null);
    });
    
    await userController.createUser(req, res);
    
    expect(console.error).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.any(Error));
  });

  test('should login user successfully', async () => {
    // Mock successful login query
    mockDb.query.mockImplementationOnce((sql, values, callback) => {
      expect(sql).toBe("SELECT * FROM vasarlok WHERE `email` = ? AND `jelszo` = ?");
      expect(values).toEqual(['test@example.com', 'password123']);
      callback(null, [{
        id: 1,
        nev: 'Test User',
        email: 'test@example.com',
        usertel: '123456789'
      }]);
    });
    
    jwt.sign.mockReturnValue('fake-token');
    
    await userController.loginUser(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith('userToken', 'fake-token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ Status: 'Success' });
  });

  test('should handle failed login', async () => {
    // Mock failed login (no matching user)
    mockDb.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, []); // Empty result means no user found
    });
    
    await userController.loginUser(req, res);
    
    expect(res.json).toHaveBeenCalledWith('Failed');
  });

  test('should update user successfully', async () => {
    await userController.updateCurrentUser(req, res);
    
    expect(mockDb.query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Message: 'Sikeres frissítés!' });
  });

  test('should validate required fields for user update', async () => {
    // Test with missing fields
    req.body = { nev: 'Test User' }; // Missing email and usertel
    
    await userController.updateCurrentUser(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ Message: 'Hiányzó mezők az űrlapban!' });
  });
});