import express from "express"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser";

import { config } from "./config/config";
import connectDB from "./infrastructure/database/mongodb"

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
  res.send("API running...");
});

connectDB();
app.listen(PORT, () => {
      console.log(`Server Running on http://localhost:${PORT}`);
})