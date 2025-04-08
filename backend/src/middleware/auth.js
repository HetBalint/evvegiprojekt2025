import jwt from "jsonwebtoken"


export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.adminToken

  if (!token) {
    return res.status(401).json({ message: "Token nem egyezik" })
  }

  jwt.verify(token, "adminSecretKey", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Nincs hitelesítve" })
    }

    req.nev = decoded.nev
    next()
  })
}

export const verifyUser = (req, res, next) => {
  const token = req.cookies.userToken

  if (!token) {
    return res.status(401).json({ message: "Token nem egyezik" })
  }

  jwt.verify(token, "userSecretKey", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Nincs hitelesítve" })
    }

    req.id = decoded.id
    req.nev = decoded.nev
    req.email = decoded.email
    req.usertel = decoded.usertel
    next()
  })
}

