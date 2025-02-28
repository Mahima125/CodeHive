import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const languageMap = {
  javascript: 63,
  java: 62,
  cpp: 84,
  python: 71,
};

const Code = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here...");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [editorHeight, setEditorHeight] = useState("80vh");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.question) {
      setQuestion(location.state.question);
      sessionStorage.setItem("selectedQuestion", JSON.stringify(location.state.question));
    } else {
      const savedQuestion = sessionStorage.getItem("selectedQuestion");
      if (savedQuestion) {
        setQuestion(JSON.parse(savedQuestion));
      }
    }
  }, [location.state?.question]);

  if (!question) {
    return <p className="text-center mt-4 text-gray-500">No question selected.</p>;
  }

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setTestResults([]);

    try {
      const testCaseResults = await Promise.all(
        question.testCases.map(async (testCase) => {
          const response = await axios.post(
            "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
            {
              source_code: code.trim(),
              language_id: languageMap[language],
              stdin: testCase.input,
            },
            {
              headers: {
                "X-RapidAPI-Key": "93abed8707mshb01feb0a6b7e11cp178c61jsn60e107e0db56",
                "Content-Type": "application/json",
              },
            }
          );

          return {
            input: testCase.input,
            expectedOutput: testCase.expectedOutput.trim(),
            actualOutput: response.data.stdout
              ? response.data.stdout.trim()
              : response.data.stderr
                ? response.data.stderr.trim()
                : response.data.compile_output
                  ? response.data.compile_output.trim()
                  : "No Output",
            passed: response.data.stdout?.trim() === testCase.expectedOutput?.trim(),
          };
        })
      );

      setTestResults(testCaseResults);
      setEditorHeight("40vh");
    } catch (err) {
      setError("Failed to execute code. Please try again.");
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/code", {
        language,
        code,
        questionId: question._id,
      });

      alert(data.message);
    } catch (error) {
      console.error("Error saving code:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-1/2 p-6 bg-gray-100 border-r border-gray-300 overflow-auto flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-4">{question.name}</h1>
        <p className="text-gray-700 mb-4">{question.description}</p>

        <div className="mb-4">
          <h2 className="font-semibold">Input Format:</h2>
          <p className="text-gray-600">{question.inputFormat}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">Output Format:</h2>
          <p className="text-gray-600">{question.outputFormat}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">Constraints:</h2>
          <p className="text-gray-600">{question.constraints}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Test Cases:</h2>
          {question.testCases?.map((testCase, index) => (
            <div key={index} className="p-2 bg-white shadow-sm rounded mb-2">
              <p className="text-gray-600"><strong>Input:</strong> {testCase.input}</p>
              <p className="text-gray-600"><strong>Expected Output:</strong> {testCase.expectedOutput}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-4 bg-gray-800 text-white flex flex-col h-full">
        <div className="mb-2 flex justify-end">
          <label className="mr-2">Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>
        <Editor
          height={editorHeight}
          width="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          options={{ fontSize: 16, minimap: { enabled: false }, wordWrap: "on", lineNumbers: "on", automaticLayout: true }}
        />

        <div className="flex gap-4 mt-4 justify-center">
          <button onClick={handleRun} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Run
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Submit
          </button>
        </div>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500 text-white rounded shadow-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        { testResults.length > 0 && (
          <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-md flex-1 overflow-auto">
            <h2 className="text-lg font-semibold mb-2 text-center">Test Case Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-700">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="border border-gray-700 px-4 py-2">#</th>
                    <th className="border border-gray-700 px-4 py-2">Input</th>
                    <th className="border border-gray-700 px-4 py-2">Expected</th>
                    <th className="border border-gray-700 px-4 py-2">Actual</th>
                    <th className="border border-gray-700 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((test, index) => (
                    <tr key={index} className="text-white">
                      <td className="border border-gray-700 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-700 px-4 py-2">{test.input}</td>
                      <td className="border border-gray-700 px-4 py-2">{test.expectedOutput}</td>
                      <td className="border border-gray-700 px-4 py-2">{test.actualOutput}</td>
                      <td className={`border border-gray-700 px-4 py-2 font-semibold ${test.passed ? "text-green-400" : "text-red-400"}`}>{test.passed ? "✅ Passed" : "❌ Failed"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Code;
