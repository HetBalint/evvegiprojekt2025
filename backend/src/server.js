import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

// Import routes
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

// Middleware
app.use(cookieParser())
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST, GET, PUT, DELETE"],
    credentials: true,
  }),
)
app.use(express.json())

// Static file serving
app.use("/kepek", express.static(path.join(__dirname, "../kepek")))
app.use("/3D", express.static(path.join(__dirname, "../3D")))

// Routes
app.use("/admin", adminRoutes)
app.use("/", userRoutes)
app.use("/", productRoutes)
app.use("/", cartRoutes)
app.use("/", orderRoutes)

// Server start
const port = process.env.PORT || 8081
app.listen(port, () => {
  console.log(`A szerver fut a http://localhost:${port}`)
})

