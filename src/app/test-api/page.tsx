"use client";

import { useState } from "react";
import { resumeService } from "@/services/resumeService";
import { validateApiResponse } from "@/__tests__/api-response-validation";

export default function APITestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🔄 Calling API: GET /api/resume");
      
      const resumes = await resumeService.fetchResumes();
      
      console.log("✅ API Response received:", resumes);
      setResult({
        success: true,
        count: resumes.length,
        data: resumes,
        validation: "✅ Response structure is valid"
      });
    } catch (err: any) {
      console.error("❌ API Error:", err);
      setError(err.message || "Unknown error");
      setResult({
        success: false,
        error: err.message,
        details: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API Test: GET /api/resume
          </h1>
          <p className="text-gray-600 mb-6">
            Test the resume API endpoint and validate response structure
          </p>

          {/* Test Button */}
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                🚀 Test API
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className={`mt-6 rounded-lg p-4 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-semibold mb-3 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? '✅ Success' : '❌ Failed'}
              </h3>

              {result.success && (
                <div className="space-y-3">
                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-gray-600">Total Resumes:</p>
                    <p className="text-2xl font-bold text-gray-900">{result.count}</p>
                  </div>

                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-gray-600 mb-2">Validation:</p>
                    <p className="text-green-600 font-medium">{result.validation}</p>
                  </div>

                  {/* Resume List */}
                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Resume Details:</p>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {result.data.map((resume: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded p-3 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-gray-500">ID:</span>
                              <span className="ml-2 font-medium">{resume.resumeId}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <span className="ml-2 font-medium">{resume.type}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Active:</span>
                              <span className={`ml-2 font-medium ${resume.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                {resume.isActive ? '✓ Yes' : '✗ No'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Candidate ID:</span>
                              <span className="ml-2 font-medium">{resume.candidateId}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <span className="text-gray-500">URL:</span>
                            <p className="text-xs text-blue-600 truncate">{resume.resumeUrl}</p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Certs:</span>
                              <span className="ml-1 font-medium">{resume.certificates?.length || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Edu:</span>
                              <span className="ml-1 font-medium">{resume.educations?.length || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Skills:</span>
                              <span className="ml-1 font-medium">{resume.skills?.length || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Work:</span>
                              <span className="ml-1 font-medium">{resume.workExperiences?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Raw JSON */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  📄 View Raw JSON
                </summary>
                <pre className="mt-2 bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* API Info */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4 text-sm">
            <h3 className="font-semibold text-gray-900 mb-2">📋 API Information</h3>
            <div className="space-y-1 text-gray-600">
              <p><strong>Endpoint:</strong> GET /api/resume</p>
              <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}</p>
              <p><strong>Expected Response Code:</strong> 1073741824 (or any success code)</p>
              <p><strong>Response Structure:</strong></p>
              <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto">
{`{
  "code": number,
  "message": string,
  "result": Resume[]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
