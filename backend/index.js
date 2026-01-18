import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import connectDB from "./mongo.config.js";
import shortenUrl_routes from "./routes/shortUrl.route.js";
import auth_routes from "./routes/auth.route.js";
import user_routes from "./routes/user.route.js";
import { redirectFromShortUrl } from "./controllers/shortUrl.controller.js";
import { errorHandler } from "./utils/errorHandler.util.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// ✅ Vercel-safe DB connection
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
});

app.use("/api/create", shortenUrl_routes);
app.use("/api/auth", auth_routes);
app.use("/api/user", user_routes);

app.get("/:id", redirectFromShortUrl);

app.use(errorHandler);

// ✅ REQUIRED for Vercel
module.exports = app;
