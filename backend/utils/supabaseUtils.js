import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Save generated test cases to database
 */
export const saveTestCase = async (testData, userId = null) => {
  try {
    const { data, error } = await supabase
      .from("test_cases")
      .insert([
        {
          code: testData.code,
          test_type: testData.testType,
          generated_tests: testData.tests,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving test case:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Retrieve test cases from database
 */
export const getTestCases = async (userId = null, limit = 10) => {
  try {
    let query = supabase
      .from("test_cases")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error retrieving test cases:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Save code analysis to database
 */
export const saveAnalysis = async (analysisData, userId = null) => {
  try {
    const { data, error } = await supabase
      .from("code_analysis")
      .insert([
        {
          code: analysisData.code,
          analysis_result: analysisData.analysis,
          score: analysisData.score,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving analysis:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get analytics data
 */
export const getAnalytics = async (userId = null) => {
  try {
    let testQuery = supabase.from("test_cases").select("*");
    let analysisQuery = supabase.from("code_analysis").select("*");

    if (userId) {
      testQuery = testQuery.eq("user_id", userId);
      analysisQuery = analysisQuery.eq("user_id", userId);
    }

    const { data: testData, error: testError } = await testQuery;
    const { data: analysisData, error: analysisError } = await analysisQuery;

    if (testError) throw testError;
    if (analysisError) throw analysisError;

    return {
      success: true,
      data: {
        totalTestCases: testData?.length || 0,
        totalAnalyses: analysisData?.length || 0,
        recentTests: testData?.slice(0, 5) || [],
        recentAnalyses: analysisData?.slice(0, 5) || []
      }
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Save chat history
 */
export const saveChatMessage = async (messageData, userId = null) => {
  try {
    const { data, error } = await supabase
      .from("chat_history")
      .insert([
        {
          message: messageData.message,
          response: messageData.response,
          code_context: messageData.codeContext || null,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving chat message:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get chat history
 */
export const getChatHistory = async (userId = null, limit = 20) => {
  try {
    let query = supabase
      .from("chat_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    return { success: false, error: error.message };
  }
};

export default {
  saveTestCase,
  getTestCases,
  saveAnalysis,
  getAnalytics,
  saveChatMessage,
  getChatHistory
};
