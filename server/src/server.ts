import express from "express"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser";

import { errorHandler } from "./interfaces/middleware/errorMiddleware";
import { config } from "./config/config";
import connectDB from "./infrastructure/database/mongodb"

import authRoutes from "./interfaces/routes/authRoutes"
import imageRoutes from "./interfaces/routes/imageRoutes"


const app = express();
const PORT = config.app.PORT || 5000
const FRONT_END_URL = config.cors.CLIENT_URL;

app.use(
    cors({
        origin: FRONT_END_URL,
        allowedHeaders: config.cors.ALLOWED_HEADERS,
        methods: config.cors.ALLOWED_METHODS,
        credentials: config.cors.CREDENTIALS
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

app.use('/api', authRoutes);
app.use('/api', imageRoutes);

app.use(errorHandler);

connectDB();
app.listen(PORT, () => {
      console.log(`Server Running on http://localhost:${PORT}`);
})