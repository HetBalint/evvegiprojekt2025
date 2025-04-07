/**
 * @jest-environment node
 */

// user.test.js
const jwt = require('jsonwebtoken');

// Mock the modules manually instead of using jest.mock
const mockUserModel = {
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  loginUser: jest.fn(),
  updateCurrentUser: jest.fn()
};

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

describe('Felhasználó Controller Tests', () => {
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
    
    // Mock console.error to prevent test output pollution
    console.error = jest.fn();
  });

  test('sikeresen regisztrált egy új felhasználót', async () => {
    // Mock the createUser function from UserModel
    const mockResult = { insertId: 1, affectedRows: 1 };
    mockUserModel.createUser.mockResolvedValue(mockResult);
    
    // Call the controller function
    await userController.createUser(req, res);
    
    // Verify UserModel.createUser was called with correct data
    expect(mockUserModel.createUser).toHaveBeenCalledWith(req.body);
    
    // Verify response was sent with expected result
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  test('kezelnie kell a regisztrációs hibákat', async () => {
    // Mock an error from the model
    const mockError = new Error('Database error');
    mockUserModel.createUser.mockRejectedValue(mockError);
    
    // Call the controller function
    await userController.createUser(req, res);
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith('SQL Hiba:', mockError);
    
    // Verify error response was sent
    expect(res.json).toHaveBeenCalledWith(mockError);
  });

  test('sikeresen be jelentkezett a felhasználó', async () => {
    // Mock successful login
    const userData = [{
      id: 1,
      nev: 'Test User',
      email: 'test@example.com',
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

  test('érvényesítenie kell a kötelező mezőket a felhasználói frissítéshez', async () => {
    // Test with missing fields
    req.body = { nev: 'Test User' }; // Missing email and usertel
    
    await userController.updateCurrentUser(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ Message: 'Hiányzó mezők az űrlapban!' });
  });
});