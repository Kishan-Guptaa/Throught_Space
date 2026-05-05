import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { connectDB } from "./db/mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

// Route Imports
import authRoutes from "./routes/auth.routes";
import folderRoutes from "./routes/folder.routes";
import blogRoutes from "./routes/blog.routes";
import socialRoutes from "./routes/social.routes";
import aiRoutes from "./routes/ai.routes";
import pageRoutes from "./routes/page.routes";


// Routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pages", pageRoutes);


// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
