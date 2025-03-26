import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const deleteFile = (filePath, folderName) => {
  const fullPath = path.join(__dirname, `../../${folderName}`, filePath)

  return new Promise((resolve, reject) => {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`${folderName} törlés hiba:`, err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

