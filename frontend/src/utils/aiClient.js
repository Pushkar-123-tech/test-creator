

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class AIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Generate test cases for code
   */
  async generateTests(code, testType = 'unit', userId = null) {
    return this.request('/api/ai/generate-tests', {
      method: 'POST', 
      body: JSON.stringify({ code, testType, userId })
    });
  }

  /**
   * Analyze code
   */
  async analyzeCode(code, userId = null) {
    return this.request('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ code, userId })
    });
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(code) {
    return this.request('/api/ai/document', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  /**
   * Generate code from requirements
   */
  async generateCode(requirement, language = 'javascript') {
    return this.request('/api/ai/generate-code', {
      method: 'POST',
      body: JSON.stringify({ requirement, language })
    });
  }

  /**
   * Optimize code
   */
  async optimizeCode(code) {
    return this.request('/api/ai/optimize', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  /**
   * Chat with AI
   */
  async chat(message, code = null, userId = null) {
    return this.request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, code, userId })
    });
  }

  /**
   * Check API health
   */
  async health() {
    return this.request('/api/ai/health');
  }

  /**
   * Check server health
   */
  async serverHealth() {
    return this.request('/health');
  }
}

// Export singleton instance
export const aiClient = new AIClient();

// Also export the class for custom instances
export default AIClient;
