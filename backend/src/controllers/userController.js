import jwt from "jsonwebtoken"
import * as UserModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs';



export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers()
    return res.json(users)
  } catch (err) {
    return res.json({ Message: "Hiba van a szerverben!" })
  }
}

export const createUser = async (req, res) => {
  try {
    const { nev, email, jelszo, usertel } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(jelszo, salt);
    


    const userData = {
      nev,
      email,
      jelszo: hashedPassword,
      usertel,
    };

    const result = await UserModel.createUser(userData);

    return res.status(201).json({ Message: "Sikeres regisztráció!", result });
  } catch (err) {
    console.error("Hiba a regisztrációnál:", err);
    return res.status(500).json({ Message: "Hiba történt!" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, jelszo } = req.body;
    
    const data = await UserModel.loginUser(email);

    if (data.length > 0) {
      const { id, nev, email, usertel, jelszo: storedHash } = data[0];

      const isMatch = await bcrypt.compare(jelszo, storedHash);

      if (isMatch) {
        const token = jwt.sign({ id, nev, email, usertel }, "userSecretKey", { expiresIn: "1d" });

        res.cookie("userToken", token, {
          httpOnly: true,
          secure: false, 
          sameSite: "lax",
        });

        return res.json({ Status: "Success" });
      } else {
        return res.status(401).json({ Status: "Failed", Message: "Hibás jelszó!" });
      }
    } else {
      return res.status(404).json({ Status: "Failed", Message: "Felhasználó nem található!" });
    }
  } catch (err) {
    console.error("Hiba a bejelentkezésnél:", err);
    return res.status(500).json({ Status: "Error", Message: "Szerver hiba történt!" });
  }
};



export const logoutUser = (req, res) => {
  res.cookie("userToken", "", {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    expires: new Date(0), 
    path: "/",
  })

  res.clearCookie("userToken") 
  return res.json({ Status: "Success" })
}

export const getUserInfo = (req, res) => {
  return res.json({
    Status: "Success",
    id: req.id,
    nev: req.nev,
    email: req.email,
    usertel: req.usertel,
  })
}






export const updateCurrentUser = async (req, res) => {
  try {
    
    const userId = req.id; 

  
    if (!req.body.nev || !req.body.email || !req.body.usertel) {
      return res.status(400).json({ Message: "Hiányzó mezők az űrlapban!" });
    }

 
    const result = await UserModel.updateCurrentUser(userId, req.body);

    if (result.changedRows === 0) {
      return res.status(400).json({ Message: "Nem történt változás." });
    }

    return res.json({ Message: "Sikeres frissítés!" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ Message: "Hiba van a szerverben!", Error: err });
  }
};
