/**
 * Test Types
 */
export const TEST_TYPES = {
  UNIT: "unit",
  INTEGRATION: "integration",
  EDGE_CASE: "edge-case",
  PERFORMANCE: "performance",
  SECURITY: "security"
};

/**
 * Programming Languages
 */
export const LANGUAGES = {
  JAVASCRIPT: "javascript",
  PYTHON: "python",
  JAVA: "java",
  CSHARP: "csharp",
  TYPESCRIPT: "typescript",
  GO: "go",
  RUST: "rust",
  CPP: "cpp"
};

/**
 * API Response Status
 */
export const RESPONSE_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  PENDING: "pending"
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  INVALID_CODE: "Code snippet is required",
  MISSING_API_KEY: "Gemini API key is not configured",
  INVALID_REQUEST: "Invalid request format",
  RATE_LIMITED: "Too many requests, please try again later",
  INTERNAL_ERROR: "Internal server error",
  UNAUTHORIZED: "Unauthorized access"
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  TESTS_GENERATED: "Test cases generated successfully",
  CODE_ANALYZED: "Code analyzed successfully",
  DOCUMENTATION_GENERATED: "Documentation generated successfully",
  CODE_GENERATED: "Code generated successfully",
  CODE_OPTIMIZED: "Code optimization suggestions provided"
};

/**
 * Default Configuration
 */
export const CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MAX_REQUEST_SIZE: "10mb",
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  },
  TIMEOUT: 30000 // 30 seconds
};

export default {
  TEST_TYPES,
  LANGUAGES,
  RESPONSE_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CONFIG
};
