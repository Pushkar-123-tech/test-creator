// components/Dashboard/RecentTests.jsx
import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { aiClient } from '../../utils/aiClient';
import { useAppContext } from '../contexts/AppContext';

export default function RecentTests() {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await aiClient.request(`/api/ai/generations?userId=${user.id}&limit=5`);
        if (response.success) {
          setTests(response.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch recent tests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user]);

  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return 'bg-[#ff6b9d]';
      case 'high': return 'bg-[#f59e0b]';
      case 'medium': return 'bg-[#6c63ff]';
      default: return 'bg-[#6c63ff]';
    }
  };

  const handleView = (generation) => {
    setSelectedGeneration(generation);
  };

  const closeView = () => {
    setSelectedGeneration(null);
  };

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white m-0">Recent Generations</h2>
          <div className="flex gap-2">
            {['all', 'passed', 'failed'].map(tab => (
              <div
                key={tab}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {loading ? (
            <div className="text-center py-8">
              <div className="loading-spinner inline-block"></div>
              <p className="text-sm text-gray-400 mt-2">Loading your tests...</p>
            </div>
          ) : tests.length > 0 ? (
            tests.map((test, index) => (
              <div key={test.id || index} className="question-item flex items-center gap-3.5">
                <div className="w-9.5 h-9.5 bg-[#6c63ff]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} color="#a78bfa" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#e8e8f0] truncate">
                    {test.test_type.charAt(0).toUpperCase() + test.test_type.slice(1)} Test Cases
                  </div>
                  <div className="text-[11px] text-[#66667a] mt-0.5 truncate">
                    {test.requirement.substring(0, 50)}...
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${getSeverityColor('medium')}`}></div>
                    <span className="text-[11px] text-[#66667a] capitalize">{test.cases_count} cases</span>
                  </div>
                  <button 
                    className="btn-ghost px-3 py-1.5 text-xs"
                    onClick={() => handleView(test)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No test cases generated yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {selectedGeneration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Test Cases: {selectedGeneration.requirement.substring(0, 50)}...</h3>
                <button 
                  onClick={closeView}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {selectedGeneration.module} • {selectedGeneration.test_type} • {selectedGeneration.cases_count} cases
              </p>
            </div>
            <div className="p-6">
              {selectedGeneration.generated_tests && selectedGeneration.generated_tests.length > 0 ? (
                <div className="space-y-4">
                  {selectedGeneration.generated_tests.map((testCase, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{testCase.title || testCase.description}</h4>
                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                          {testCase.severity || 'Medium'}
                        </span>
                      </div>
                      {testCase.steps && testCase.steps.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-300 mb-1">Steps:</h5>
                          <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
                            {testCase.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>
                                <strong>{step.action}</strong> → {step.expected}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {testCase.testCode && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-1">Test Code:</h5>
                          <pre className="bg-gray-900 p-3 rounded text-xs text-green-400 overflow-x-auto">
                            {testCase.testCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No test cases available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}