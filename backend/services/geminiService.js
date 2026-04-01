import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.0";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

const getResponseText = (aiResult) => {
  if (!aiResult || !aiResult.response) return null;
  const response = aiResult.response;
  if (typeof response.text === "function") {
    try {
      return response.text();
    } catch (error) {
      console.warn("Could not call response.text(), falling back", error);
    }
  }

  if (response.candidates && response.candidates.length > 0) {
    return response.candidates
      .map((candidate) =>
        candidate.content?.parts?.map((part) => part.text || "").join("")
      )
      .join("\n");
  }

  return JSON.stringify(response);
};

/**
 * Generate test cases using Gemini AI
 * @param {string} codeSnippet - The code to generate tests for
 * @param {string} testType - Type of tests (unit, integration, edge-case)
 * @returns {Promise<Object>} Generated test cases
 */
export const generateTestCases = async (codeSnippet, testType = "unit") => {
  try {
    const prompt = `
You are an expert software testing engineer. Generate comprehensive ${testType} test cases for the following code snippet.

Code to test:
\`\`\`
${codeSnippet}
\`\`\`

Please provide:
1. Test cases in a structured JSON format
2. Each test case should include: description, input, expectedOutput, and assertion
3. Cover happy path, edge cases, and error scenarios
4. Use common testing frameworks (Jest, Mocha, etc.)

IMPORTANT: Return ONLY the JSON object. Do not include any other text or markdown formatting before or after the JSON.

Return a valid JSON object with this structure:
{
  "testCases": [
    {
      "id": 1,
      "description": "Test description",
      "input": "input values",
      "expectedOutput": "expected output",
      "testCode": "test code snippet"
    }
  ],
  "summary": "Brief summary of test coverage"
}
`;

    const result = await model.generateContent(prompt);
    const text = getResponseText(result);

    if (!text) {
      return {
        success: false,
        error: "Empty response from Gemini model.",
        rawResponse: result,
        timestamp: new Date().toISOString()
      };
    }

    // Improved JSON extraction
    let testData;
    try {
      // Find the first { and the last }
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) {
        throw new Error("No JSON found in response");
      }
      const jsonStr = text.substring(start, end + 1);
      testData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text, parseError);
      return {
        success: false,
        error: "Failed to parse AI response. Please try again.",
        rawResponse: text,
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      success: true,
      testType,
      data: testData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating test cases:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Generate code documentation using Gemini AI
 * @param {string} code - Code to document
 * @returns {Promise<Object>} Generated documentation
 */
export const generateDocumentation = async (code) => {
  try {
    const prompt = `
You are a technical documentation expert. Generate clear and comprehensive documentation for the following code:

\`\`\`
${code}
\`\`\`

Please provide:
1. Function/Class description
2. Parameters and return types
3. Usage examples
4. Edge cases and limitations
5. Related functions (if any)

Format the response as JSON with keys: description, parameters, examples, edgeCases, notes
`;

    const result = await model.generateContent(prompt);
    const text = getResponseText(result);

    if (!text) {
      return {
        success: false,
        error: "Empty response from Gemini model.",
        rawResponse: result,
        timestamp: new Date().toISOString()
      };
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const docData = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };
    
    return {
      success: true,
      data: docData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating documentation:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Analyze code for potential issues
 * @param {string} code - Code to analyze
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeCode = async (code) => {
  try {
    const prompt = `
You are a code quality expert. Analyze the following code for:
1. Potential bugs or issues
2. Performance problems
3. Security vulnerabilities
4. Best practices violations
5. Refactoring suggestions

Code to analyze:
\`\`\`
${code}
\`\`\`

Return JSON with keys: issues, performance, security, bestPractices, suggestions, overallScore (1-10)
`;

    const result = await model.generateContent(prompt);
    const text = getResponseText(result);
    
    if (!text) {
      return {
        success: false,
        error: "Empty response from Gemini model.",
        rawResponse: result,
        timestamp: new Date().toISOString()
      };
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };
    
    return {
      success: true,
      data: analysisData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error analyzing code:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Generate code based on requirements
 * @param {string} requirement - Description of what to generate
 * @param {string} language - Programming language
 * @returns {Promise<Object>} Generated code
 */
export const generateCode = async (requirement, language = "javascript") => {
  try {
    const prompt = `
You are an expert ${language} developer. Generate clean, well-documented code based on the following requirement:

Requirement: ${requirement}

Please provide:
1. Complete, working code
2. Comments explaining key parts
3. Example usage
4. 2-3 basic test cases

Format response as JSON with keys: code, usage, tests, notes
`;

    const result = await model.generateContent(prompt);
    const text = getResponseText(result);

    if (!text) {
      return {
        success: false,
        error: "Empty response from Gemini model.",
        rawResponse: result,
        timestamp: new Date().toISOString()
      };
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const codeData = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };
    
    return {
      success: true,
      language,
      data: codeData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating code:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Generate performance optimization suggestions
 * @param {string} code - Code to optimize
 * @returns {Promise<Object>} Optimization suggestions
 */
export const optimizeCode = async (code) => {
  try {
    const prompt = `
You are a performance optimization expert. Analyze the following code and suggest optimizations:

\`\`\`
${code}
\`\`\`

Provide:
1. Time complexity analysis (before and after)
2. Space complexity analysis
3. Specific optimization techniques
4. Optimized code version
5. Expected performance improvement percentage

Return JSON with keys: timeComplexity, spaceComplexity, suggestions, optimizedCode, improvementPercentage
`;

    const result = await model.generateContent(prompt);
    const text = getResponseText(result);

    if (!text) {
      return {
        success: false,
        error: "Empty response from Gemini model.",
        rawResponse: result,
        timestamp: new Date().toISOString()
      };
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const optimizationData = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };
    
    return {
      success: true,
      data: optimizationData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error optimizing code:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Chat with AI about code
 * @param {string} message - User message
 * @param {string} context - Code context (optional)
 * @returns {Promise<Object>} AI response
 */
export const chatWithAI = async (message, context = "") => {
  try {
    const prompt = context 
      ? `Code Context:\n\`\`\`\n${context}\n\`\`\`\n\nUser Question: ${message}`
      : message;

    const result = await model.generateContent(prompt);
    const text = getResponseText(result);

    if (!text) {
      return {
        success: false,
        error: "Empty response from Gemini model.",
        rawResponse: result,
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: true,
      response: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in chat:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export default {
  generateTestCases,
  generateDocumentation,
  analyzeCode,
  generateCode,
  optimizeCode,
  chatWithAI
};
