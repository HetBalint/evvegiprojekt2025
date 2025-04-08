import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "kep") {
      cb(null, path.join(__dirname, "../../kepek"))
    } else if (file.fieldname === "haromD") {
      cb(null, path.join(__dirname, "../../3D")) 
    } else {
      cb(new Error("Invalid file fieldname")) 
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})

export const upload = multer({ storage })

