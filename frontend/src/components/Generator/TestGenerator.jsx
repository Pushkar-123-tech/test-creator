// components/Generator/TestGenerator.jsx
import React, { useState } from 'react';
import TestCaseCard from './TestCaseCard';
import AISettings from './AISettings';
import { Sparkles } from 'lucide-react';
import { aiClient } from '../../utils/aiClient';
import { useAppContext } from '../contexts/AppContext';

export function TestGenerator({ showToast }) {
  const { user } = useAppContext();
  const [requirement, setRequirement] = useState('');
  const [module, setModule] = useState('Authentication');
  const [testType, setTestType] = useState('Mixed');
  const [caseCount, setCaseCount] = useState('10');
  const [coverage, setCoverage] = useState('Standard');
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    edgeCases: true,
    negativeTests: true,
    autoPrioritize: true,
  });

  const handleGenerate = async () => {
    if (!requirement.trim()) {
      showToast('Please describe your feature');
      return;
    }

    setLoading(true);

    try {
      // Use real AI generation instead of mock
      const prompt = `
        Feature: ${requirement}
        Module: ${module}
        Test Type: ${testType}
        Number of cases: ${caseCount}
        Coverage: ${coverage}
        Settings: ${JSON.stringify(settings)}
      `;

      const response = await aiClient.generateTests(prompt, testType.toLowerCase(), user?.id);
      console.log("AI Response:", response);
      
      if (response.success && response.data && response.data.testCases) {
        // Map the AI response to the format expected by TestCaseCard
        const formattedCases = response.data.testCases.map((tc, index) => ({
          id: tc.id || index + 1,
          title: tc.description || `Test Case ${index + 1}`,
          description: tc.description,
          steps: tc.steps || [
            { step: 1, action: 'Input: ' + (tc.input || 'None'), expected: 'Output: ' + (tc.expectedOutput || 'None') }
          ],
          severity: tc.severity || (index % 3 === 0 ? 'Critical' : index % 2 === 0 ? 'High' : 'Medium'),
          type: testType !== 'Mixed' ? testType : (index % 3 === 0 ? 'Functional' : index % 2 === 0 ? 'Regression' : 'E2E'),
          coverage: coverage,
          module: module,
          testCode: tc.testCode
        }));
        
        setTestCases(formattedCases);
        showToast(`${formattedCases.length} test cases generated successfully!`);
      } else {
        const errorMessage = response.error || 'Invalid response format from AI';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error generating test cases:', error);
      showToast('Failed to generate test cases: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-2">
            AI Test Case Generator
          </h1>
          <p className="text-slate-400 text-lg">Describe your feature and let AI create comprehensive test cases.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-400">AI Online</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Input Section */}
          <div className="glass p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="text-primary-500" size={24} />
              Feature Requirements
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-3">Feature Description *</label>
                <textarea
                  className="ai-input"
                  rows="5"
                  placeholder="e.g. 'User login with email and password. Validate email format, password strength, rate limiting after 5 failed attempts, and 2FA option...'"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-3">Module</label>
                  <select className="ai-input py-3" value={module} onChange={(e) => setModule(e.target.value)}>
                    <option>Authentication</option>
                    <option>Payment</option>
                    <option>Database</option>
                    <option>API</option>
                    <option>UI/UX</option>
                    <option>Performance</option>
                    <option>Security</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-3">Test Type</label>
                  <select className="ai-input py-3" value={testType} onChange={(e) => setTestType(e.target.value)}>
                    <option>Mixed</option>
                    <option>Functional</option>
                    <option>Regression</option>
                    <option>Performance</option>
                    <option>Security</option>
                    <option>Integration</option>
                    <option>E2E</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-3">Number of Cases</label>
                  <select className="ai-input py-3" value={caseCount} onChange={(e) => setCaseCount(e.target.value)}>
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                    <option>25</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-3">Coverage Level</label>
                  <select className="ai-input py-3" value={coverage} onChange={(e) => setCoverage(e.target.value)}>
                    <option>Standard</option>
                    <option>Comprehensive</option>
                    <option>Edge Cases</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Test Cases */}
          <div className="glass p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Generated Test Cases</h2>
                <p className="text-sm text-slate-400">
                  <span id="tc-count">{testCases.length}</span> cases generated
                </p>
              </div>
              <span className="badge badge-purple flex items-center gap-2">
                <Sparkles size={14} />
                AI Generated
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="loading-spinner mb-4"></div>
                  <p className="text-slate-300 font-medium">AI is generating test cases...</p>
                  <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                </div>
              ) : testCases.length > 0 ? (
                testCases.map(testCase => (
                  <TestCaseCard key={testCase.id} testCase={testCase} />
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-slate-600" />
                  </div>
                  <p className="text-slate-300 font-medium">No test cases generated yet</p>
                  <p className="text-sm text-slate-500 mt-2">Fill in the requirements and click generate</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 sticky top-8">
          <AISettings settings={settings} setSettings={setSettings} />

          <button
            className={`btn-primary w-full py-5 text-lg font-semibold flex items-center justify-center gap-3 ${!loading ? 'animate-glow' : ''}`}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="loading-spinner"></div>
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles size={20} />
                <span>Generate Test Cases</span>
              </div>
            )}
          </button>


          {/* Stats Panel */}
          <div className="glass p-5">
            <div className="text-xs font-semibold text-[#a78bfa] tracking-wide uppercase mb-3.5">Quick Stats</div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-[#66667a]">Total Generated</span>
                <span className="syne text-[#a78bfa] font-bold">248</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66667a]">Saved Sets</span>
                <span className="syne text-[#a78bfa] font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66667a]">This Month</span>
                <span className="syne text-[#a78bfa] font-bold">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}