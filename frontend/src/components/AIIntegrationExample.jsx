import { useState } from 'react';
import { aiClient } from '../utils/aiClient';

/**
 * Example component showing how to use the AI Client
 * This demonstrates integration with all AI features
 */
export const AIIntegrationExample = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateTests = async () => {
    if (!code.trim()) {
      setError('Please enter code first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiClient.generateTests(code, 'unit');
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      setError('Please enter code first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiClient.analyzeCode(code);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!code.trim()) {
      setError('Please enter code first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiClient.optimizeCode(code);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocumentation = async () => {
    if (!code.trim()) {
      setError('Please enter code first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiClient.generateDocumentation(code);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">AI Code Assistant</h2>
      
      {/* Code Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Your Code
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="function add(a, b) { return a + b; }"
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleGenerateTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Tests'}
        </button>
        
        <button
          onClick={handleAnalyzeCode}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze Code'}
        </button>
        
        <button
          onClick={handleOptimize}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Optimizing...' : 'Optimize Code'}
        </button>
        
        <button
          onClick={handleGenerateDocumentation}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
        >
          {loading ? 'Documenting...' : 'Generate Docs'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AIIntegrationExample;
