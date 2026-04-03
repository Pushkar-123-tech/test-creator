import express from "express"
import cors from "cors"
import morgan from "morgan"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import aiRoutes from "./routes/aiRoutes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app=express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://test-creator-9pk1.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));


const frontendDistPath = path.join(__dirname, "../frontend/dist")

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API running" });
});

// AI Routes
app.use("/api/ai", aiRoutes);

// Dashboard endpoint
app.get("/dashboard", (req, res) => {
    res.json({
        success: true,
        message: "Dashboard endpoint"
    });
});

// Catch-all route to serve the frontend app
app.get("*all", (req, res) => {
    // If the request is for an API route that wasn't matched, it will still fall through here
    // But we want to exclude /api routes from this catch-all if possible
    if (req.path.startsWith("/api")) {
        return res.status(404).json({
            success: false,
            message: "API endpoint not found"
        });
    }

    const indexPath = path.join(frontendDistPath, "index.html");
    if (!fs.existsSync(indexPath)) {
        return res.status(404).json({
            success: false,
            message: "Frontend build not found. Please run 'npm run build' in the frontend folder or start the frontend dev server.",
            expectedPath: indexPath
        });
    }

    res.sendFile(indexPath);
});

export default app;
