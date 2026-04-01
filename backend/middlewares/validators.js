/**
 * Middleware to validate JSON payload
 */
export const validateJSON = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    if (!req.is("json")) {
      return res.status(400).json({
        success: false,
        message: "Content-Type must be application/json"
      });
    }
  }
  next();
};

/**
 * Middleware to validate API key (if using API key authentication)
 */
export const validateAPIKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or missing API key"
    });
  }
  next();
};

/**
 * Middleware to validate Gemini API configuration
 */
export const validateGeminiConfig = (req, res, next) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Gemini API key is not configured"
    });
  }
  next();
};

/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
};

/**
 * Rate limiting middleware (basic implementation)
 */
export const rateLimiter = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip).filter(timestamp => now - timestamp < windowMs);
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later"
      });
    }
    
    userRequests.push(now);
    requests.set(ip, userRequests);
    next();
  };
};

export default {
  validateJSON,
  validateAPIKey,
  validateGeminiConfig,
  errorHandler,
  rateLimiter
};
