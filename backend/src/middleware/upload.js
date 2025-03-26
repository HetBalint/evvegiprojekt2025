import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "kep") {
      cb(null, path.join(__dirname, "../../kepek")) // Kép mentése a "kepek" mappába
    } else if (file.fieldname === "haromD") {
      cb(null, path.join(__dirname, "../../3D")) // 3D fájl mentése a "3D" mappába
    } else {
      cb(new Error("Invalid file fieldname")) // Hiba, ha más mezőnevet használ
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})

// Create multer middleware
export const upload = multer({ storage })

