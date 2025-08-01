import React, { useState, useEffect } from "react";

const ChatInterview = () => {
  const [interviewDetails, setInterviewDetails] = useState({
    company: "",
    jobRole: "Software Engineer",
    level: "mid",
    focusArea: "technical"
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStage, setInterviewStage] = useState("setup");
  const [feedback, setFeedback] = useState("");
  const [typingEffect, setTypingEffect] = useState("");

  // Typing animation
  useEffect(() => {
    let text = "";
    if (interviewStage === "interview" && questions.length > 0) {
      text = questions[currentQuestionIndex];
    } else if (interviewStage === "feedback" && feedback) {
      text = feedback;
    }
    
    let i = 0;
    const interval = setInterval(() => {
      setTypingEffect(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [currentQuestionIndex, interviewStage, questions, feedback]);

  // Generate interview questions using Gemini API
  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate exactly 5 interview questions for a ${interviewDetails.level}-level ${interviewDetails.jobRole} position${
        interviewDetails.company ? ` at ${interviewDetails.company}` : ""
      }. Focus on ${interviewDetails.focusArea} aspects. Return only the questions, one per line, without numbering.`;

      const API_KEY = "AIzaSyBHVJ6219_JNKkVGCkq9m47ABaCcJ181fc"; // Replace with your actual API key
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 2000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const qs = generatedText
        .split("\n")
        .map(q => q.replace(/^\d+\.?\s*/, "").trim())
        .filter(q => q.length > 0)
        .slice(0, 5);

      if (qs.length === 0) {
        throw new Error("No questions generated");
      }

      setQuestions(qs);
      setInterviewStage("interview");
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) {
      alert("Please provide an answer.");
      return;
    }
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(updatedAnswers);
    setCurrentAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Generate feedback using Gemini API
  const generateFeedback = async () => {
    setIsLoading(true);
    try {
      const prompt = `Act as an interview coach. Provide detailed feedback for these interview answers:
      
      Job Role: ${interviewDetails.jobRole}
      Experience Level: ${interviewDetails.level}
      Focus Area: ${interviewDetails.focusArea}
      
      ${questions.map((q, i) => `
      Question ${i+1}: ${q}
      Answer: ${answers[i] || "No answer provided"}
      `).join("\n")}
      
      Provide specific feedback on:
      1. Technical accuracy
      2. Communication skills
      3. Areas for improvement
      4. Overall rating out of 10
      5. Suggested next steps`;

      const API_KEY = "AIzaSyBHVJ6219_JNKkVGCkq9m47ABaCcJ181fc"; // Replace with your actual API key
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const generatedFeedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "No feedback generated";

      setFeedback(generatedFeedback);
      localStorage.setItem("interviewFeedback", generatedFeedback);
      setInterviewStage("feedback");
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback("Failed to generate feedback. Here's a basic analysis:\n\n" +
        questions.map((q, i) => `Q${i+1}: ${q}\nA: ${answers[i] || "No answer"}\n`).join("\n"));
      setInterviewStage("feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailChange = (field, value) => {
    setInterviewDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {interviewStage === "setup" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Interview Simulator</h1>
            
            <div className="grid gap-4 mb-6">
              <div>
                <label className="block mb-2 text-gray-300">Company (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon"
                  value={interviewDetails.company}
                  onChange={(e) => handleDetailChange("company", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-gray-300">Job Role</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={interviewDetails.jobRole}
                  onChange={(e) => handleDetailChange("jobRole", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-gray-300">Experience Level</label>
                <select
                  value={interviewDetails.level}
                  onChange={(e) => handleDetailChange("level", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-gray-300">Focus Area</label>
                <select
                  value={interviewDetails.focusArea}
                  onChange={(e) => handleDetailChange("focusArea", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="system-design">System Design</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={generateQuestions}
              disabled={isLoading}
              className="w-full bg-blue-600 py-3 rounded hover:bg-blue-500 disabled:opacity-50 transition-colors font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Questions...
                </span>
              ) : "Start Interview"}
            </button>
          </div>
        )}

        {interviewStage === "interview" && questions.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <div className="text-gray-400 text-sm">
                {interviewDetails.jobRole} ({interviewDetails.level})
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded mb-6 min-h-24 border border-gray-600">
              <p className="text-lg">{typingEffect || "Loading question..."}</p>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Your Answer:</label>
              <textarea
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                rows={6}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
              />
            </div>
            
            <div className="flex justify-between gap-4">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-500 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={submitAnswer}
                  className={`flex-1 bg-blue-600 py-2 rounded hover:bg-blue-500 transition-colors ${
                    currentQuestionIndex > 0 ? "" : "ml-auto"
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={generateFeedback}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 py-2 rounded hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Generating Feedback..." : "Submit Final Answer"}
                </button>
              )}
            </div>
          </div>
        )}

        {interviewStage === "feedback" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Interview Feedback</h1>
            
            <div className="bg-gray-700 p-4 rounded mb-6 border border-gray-600">
              <pre className="whitespace-pre-wrap font-sans">{typingEffect || "Generating feedback..."}</pre>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setInterviewStage("setup");
                  setQuestions([]);
                  setAnswers([]);
                  setCurrentQuestionIndex(0);
                  setFeedback("");
                }}
                className="flex-1 bg-blue-600 py-3 rounded hover:bg-blue-500 transition-colors font-medium"
              >
                New Interview
              </button>
              
              <button
                onClick={() => {
                  setInterviewStage("interview");
                  setCurrentQuestionIndex(0);
                }}
                className="flex-1 bg-gray-600 py-3 rounded hover:bg-gray-500 transition-colors font-medium"
              >
                Review Answers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterview;
