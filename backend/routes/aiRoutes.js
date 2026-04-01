import express from "express";
import {
  generateTestCases,
  analyzeCode,
  chatWithAI,
  generateDocumentation,
  generateCode,
  optimizeCode
} from "../services/geminiService.js";
import { saveTestCase, saveAnalysis, saveChatMessage, getTestCases, getAnalytics } from "../utils/supabaseUtils.js";

const router = express.Router();

/**
 * GET /api/ai/test-cases
 * Get user's test cases
 */
router.get("/test-cases", async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;
    const result = await getTestCases(userId, parseInt(limit));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ai/analytics
 * Get user's analytics
 */
router.get("/analytics", async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await getAnalytics(userId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai/generate-tests
 * Generate test cases for code snippet
 */
router.post("/generate-tests", async (req, res) => {
  try {
    const { code, testType = "unit", userId = null } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code snippet is required"
      });
    }

    const result = await generateTestCases(code, testType);
    
    // Save to database if result is successful and we have a userId
    if (result.success && userId) {
      await saveTestCase({
        code,
        testType,
        tests: result.data.testCases
      }, userId);
    }

    return res.json(result);
  } catch (error) {
    console.error("Error in /generate-tests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate test cases",
      error: error.message
    });
  }
});

/**
 * POST /api/ai/analyze
 * Analyze code for issues and improvements
 */
router.post("/analyze", async (req, res) => {
  try {
    const { code, userId = null } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code snippet is required"
      });
    }

    const result = await analyzeCode(code);

    // Save to database if result is successful and we have a userId
    if (result.success && userId) {
      await saveAnalysis({
        code,
        analysis: result.data,
        score: result.data.overallScore || 0
      }, userId);
    }

    return res.json(result);
  } catch (error) {
    console.error("Error in /analyze:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze code",
      error: error.message
    });
  }
});

/**
 * POST /api/ai/document
 * Generate documentation for code
 */
router.post("/document", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code snippet is required"
      });
    }

    const result = await generateDocumentation(code);
    return res.json(result);
  } catch (error) {
    console.error("Error in /document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate documentation",
      error: error.message
    });
  }
});

/**
 * POST /api/ai/generate-code
 * Generate code from requirements
 */
router.post("/generate-code", async (req, res) => {
  try {
    const { requirement, language = "javascript" } = req.body;

    if (!requirement) {
      return res.status(400).json({
        success: false,
        message: "Requirement is required"
      });
    }

    const result = await generateCode(requirement, language);
    return res.json(result);
  } catch (error) {
    console.error("Error in /generate-code:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate code",
      error: error.message
    });
  }
});

/**
 * POST /api/ai/optimize
 * Suggest code optimizations
 */
router.post("/optimize", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code snippet is required"
      });
    }

    const result = await optimizeCode(code);
    return res.json(result);
  } catch (error) {
    console.error("Error in /optimize:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to optimize code",
      error: error.message
    });
  }
});

/**
 * POST /api/ai/chat
 * Chat with AI about code or general questions
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, code = null, userId = null } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const result = await chatWithAI(message, code);

    // Save to database if result is successful and we have a userId
    if (result.success && userId) {
      await saveChatMessage({
        message,
        response: result.data.response || JSON.stringify(result.data),
        codeContext: code
      }, userId);
    }

    return res.json(result);
  } catch (error) {
    console.error("Error in /chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process chat",
      error: error.message
    });
  }
});

/**
 * GET /api/ai/health
 * Check if AI service is healthy
 */
router.get("/debug", async (req, res) => {
  try {
    const sampleCode = "function add(a, b) { return a + b; }";
    const result = await generateTestCases(sampleCode, "unit");
    return res.json({
      success: true,
      message: "Debug check for AI model call",
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash-002",
      result
    });
  } catch (error) {
    console.error("Error in /debug:", error);
    return res.status(500).json({ success: false, message: "Debug call failed", error: error.message });
  }
});

router.get("/health", (req, res) => {
  return res.json({
    success: true,
    message: "AI service is healthy",
    service: "Gemini API"
  });
});

export default router;
