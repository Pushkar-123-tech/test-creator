// components/Generator/TestGenerator.jsx
import React, { useState, useEffect } from 'react';
import TestCaseCard from './TestCaseCard';
import AISettings from './AISettings';
import { Sparkles } from 'lucide-react';
import { aiClient } from '../../utils/aiClient';
import { useAppContext } from '../contexts/AppContext';

export function TestGenerator({ showToast, selectedTemplate, onTemplateUsed }) {
  const { user } = useAppContext();
  const [requirement, setRequirement] = useState(selectedTemplate?.requirement || '');
  const [module, setModule] = useState(selectedTemplate?.title?.toLowerCase().includes('auth') ? 'Authentication' : 'Other');
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

  // Effect to update requirement when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      setRequirement(selectedTemplate.requirement);
      // Set module based on template
      if (selectedTemplate.title.toLowerCase().includes('auth')) setModule('Authentication');
      else if (selectedTemplate.title.toLowerCase().includes('payment')) setModule('Payment');
      else if (selectedTemplate.title.toLowerCase().includes('database')) setModule('Database');
      else if (selectedTemplate.title.toLowerCase().includes('api')) setModule('API');
      else if (selectedTemplate.title.toLowerCase().includes('ui')) setModule('UI/UX');
      else if (selectedTemplate.title.toLowerCase().includes('performance')) setModule('Performance');
      else setModule('Other');
      
      // Clear the template after use
      if (onTemplateUsed) onTemplateUsed();
    }
  }, [selectedTemplate, onTemplateUsed]);

  const handleGenerate = async () => {
    if (!requirement.trim()) {
      showToast('Please describe your feature');
      return;
    }

    setLoading(true);

    try {
      const response = await aiClient.generateFromRequirement(requirement, module, testType, caseCount, coverage, settings, user?.id);
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-2">
            AI Test Case Generator
          </h1>
          <p className="text-slate-400 text-base lg:text-lg">Describe your feature and let AI create comprehensive test cases.</p>
        </div>
        <div className="flex items-center gap-4 lg:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-400">AI Online</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Input Section */}
          <div className="glass p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-3">
              <Sparkles className="text-primary-500" size={20} lg:size={24} />
              Feature Requirements
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-3">Feature Description *</label>
                <textarea
                  className="ai-input"
                  rows="4"
                  placeholder="e.g. 'User login with email and password. Validate email format, password strength, rate limiting after 5 failed attempts, and 2FA option...'"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="glass p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Generated Test Cases</h2>
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
                <div className="flex flex-col items-center justify-center py-12 lg:py-16">
                  <div className="loading-spinner mb-4"></div>
                  <p className="text-slate-300 font-medium">AI is generating test cases...</p>
                  <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                </div>
              ) : testCases.length > 0 ? (
                testCases.map(testCase => (
                  <TestCaseCard key={testCase.id} testCase={testCase} />
                ))
              ) : (
                <div className="text-center py-12 lg:py-16">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={20} lg:size={24} className="text-slate-600" />
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
            className={`btn-primary w-full py-4 lg:py-5 text-base lg:text-lg font-semibold flex items-center justify-center gap-3 ${!loading ? 'animate-glow' : ''}`}
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
                <Sparkles size={18} lg:size={20} />
                <span>Generate Test Cases</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}