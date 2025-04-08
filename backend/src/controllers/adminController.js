import jwt from "jsonwebtoken"
import * as AdminModel from "../models/adminModel.js"
import bcrypt from 'bcryptjs';

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.getAllAdmins()
    return res.json(admins)
  } catch (err) {
    console.error(err)
    return res.json({ Message: "Hiba van a szerverben!" })
  }
}

export const getAdminById = async (req, res) => {
  try {
    const id = req.params.id
    const admin = await AdminModel.getAdminById(id)
    return res.json(admin)
  } catch (err) {
    console.error("Database error:", err)
    return res.json({ Message: "Hiba van a szerverben!" })
  }
}

export const createAdmin = async (req, res) => {
  try {
    
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.jelszo, salt);

    
    const adminData = {
      nev: req.body.nev,
      email: req.body.email,
      jelszo: hashedPassword,
      szulev: req.body.szulev,
      lakhely: req.body.lakhely,
      cim: req.body.cim,
      adoszam: req.body.adoszam,
      telszam: req.body.telszam,
    };

    const result = await AdminModel.createAdmin(adminData);
    return res.json(result);
  } catch (err) {
    console.error("SQL Hiba:", err);
    return res.json({ Message: "Hiba történt a regisztrációnál!", Error: err });
  }
};


export const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;

   
    if (
      !req.body.nev ||
      !req.body.email ||
      !req.body.szulev ||
      !req.body.lakhely ||
      !req.body.cim ||
      !req.body.adoszam ||
      !req.body.telszam
    ) {
      return res.status(400).json({ Message: "Hiányzó mezők az űrlapban!" });
    }

    let updatedData = {
      nev: req.body.nev,
      email: req.body.email,
      szulev: new Date(req.body.szulev).toISOString().slice(0, 10), 
      lakhely: req.body.lakhely,
      cim: req.body.cim,
      adoszam: req.body.adoszam,
      telszam: req.body.telszam,
    };

    
    if (req.body.jelszo) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(req.body.jelszo, salt);
      updatedData.jelszo = hashedPassword;
    }

    const result = await AdminModel.updateAdmin(id, updatedData);
    return res.json({ Message: "Sikeres frissítés!", result });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ Message: "Hiba van a szerverben!", Error: err });
  }
};


export const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    
    const admins = await AdminModel.getAllAdmins();

    
    if (admins.length <= 1) {
      return res.status(400); 
    }

    
    await AdminModel.deleteAdmin(id);
    return res.status(200).end(); 
  } catch (err) {
    return res.status(500).end(); 
  }
}



export const loginAdmin = async (req, res) => {
  try {
    
    const data = await AdminModel.loginAdmin(req.body.email);

    if (data.length > 0) {
      
      const storedPassword = data[0].jelszo;

      
      const isPasswordValid = await bcrypt.compare(req.body.jelszo, storedPassword);

      if (isPasswordValid) {
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
        return res.json({ Status: "Failed", Message: "Hibás jelszó!" });
      }
    } else {
      return res.json({ Status: "Failed", Message: "Nincs ilyen admin!" });
    }
  } catch (err) {
    return res.json({ Status: "Error", Message: "Hiba történt a bejelentkezésnél!", Error: err });
  }
};


export const logoutAdmin = (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    expires: new Date(0), 
  })

  res.clearCookie("adminToken") 
  return res.json({ Status: "Success" })
}

export const checkAdmin = (req, res) => {
  return res.json({ Status: "Success", nev: req.nev })
}

