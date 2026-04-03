import dotenv from "dotenv";
import vm from "node:vm";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODEL_CANDIDATES = [
  GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-flash-latest",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001"
].filter((modelName, index, arr) => modelName && arr.indexOf(modelName) === index);

const isModelNotFoundError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("404") || message.includes("not found") || message.includes("models/");
};

const generateWithModelFallback = async (prompt) => {
  let lastError;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const response = await fetch(
        `${GEMINI_API_BASE}/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 404) {
          throw new Error(`Model ${modelName} not found: ${errorText}`);
        }

        if (response.status === 429 || response.status === 503) {
          throw new Error(
            `Retryable Gemini error on ${modelName} (HTTP ${response.status}): ${errorText}`
          );
        }

        throw new Error(`Gemini API error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return { result, modelName };
    } catch (error) {
      lastError = error;
      const message = String(error?.message || "");
      const isRetryable = message.includes("Retryable Gemini error");

      if (isModelNotFoundError(error) || isRetryable) {
        console.warn(`Gemini model unavailable: ${modelName}. Trying next model.`);
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    `No supported Gemini model found. Checked: ${MODEL_CANDIDATES.join(", ")}. Last error: ${lastError?.message || "Unknown error"}`
  );
};

const getResponseText = (aiResult) => {
  if (!aiResult) return null;
  const response = aiResult.response || aiResult;
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

const parseLooseJsonObject = (text) => {
  const cleanedText = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleanedText.indexOf("{");
  const end = cleanedText.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in AI response");
  }

  const jsonLike = cleanedText.substring(start, end + 1);

  try {
    return JSON.parse(jsonLike);
  } catch {
    // Gemini can return JS-style object literals (Number.*, NaN, Infinity, undefined).
    // Evaluate in a sandboxed context to coerce into a plain object.
    return vm.runInNewContext(`(${jsonLike})`, {}, { timeout: 1000 });
  }
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
2. Each test case MUST include: description, input, expectedOutput, and testCode
3. The description should clearly state the exact possible inputs and expected outputs
4. Cover happy path, edge cases, and error scenarios
5. Use common testing frameworks (Jest, Mocha, etc.)

CRITICAL REQUIREMENTS:
- Every test case MUST have an "input" field describing the exact input values/parameters
- Every test case MUST have an "expectedOutput" field describing the exact expected result
- The description should include the input and expected output details
- Do not skip these fields under any circumstances

Return ONLY the JSON object. Do not include any other text or markdown formatting before or after the JSON.

Return a valid JSON object with this structure:
{
  "testCases": [
    {
      "id": 1,
      "description": "Test description including exact input and expected output",
      "input": "Exact input values or parameters (REQUIRED)",
      "expectedOutput": "Exact expected output or result (REQUIRED)",
      "testCode": "test code snippet"
    }
  ],
  "summary": "Brief summary of test coverage"
}
`;

    const { result, modelName } = await generateWithModelFallback(prompt);
    const text = getResponseText(result);

    if (!text) {
      return {
        success: false,
        error: "Empty response from Gemini model.",
        rawResponse: result,
        timestamp: new Date().toISOString()
      };
    }

    let testData;
    try {
      testData = parseLooseJsonObject(text);
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
      model: modelName,
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

    const { result, modelName } = await generateWithModelFallback(prompt);
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
      model: modelName,
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

    const { result, modelName } = await generateWithModelFallback(prompt);
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
      model: modelName,
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

    const { result, modelName } = await generateWithModelFallback(prompt);
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
      model: modelName,
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

    const { result, modelName } = await generateWithModelFallback(prompt);
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
      model: modelName,
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

    const { result, modelName } = await generateWithModelFallback(prompt);
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
      model: modelName,
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
