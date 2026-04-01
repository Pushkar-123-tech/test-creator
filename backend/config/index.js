import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // 🔥 Gemini AI
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",
    timeout: 30000
  },

  // 🔥 Supabase (FIXED)
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  },

  // Logging
  logging: {
    format: "dev"
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100
  }
};

export default config;