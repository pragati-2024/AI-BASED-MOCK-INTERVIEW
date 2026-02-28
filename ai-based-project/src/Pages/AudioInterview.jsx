import React, { useState, useRef } from "react";
import { fetchWithWarmupRetry } from "../utils/backendWarmup.js";

const AudioInterview = () => {
  const [interviewDetails, setInterviewDetails] = useState({
    company: "",
    jobRole: "Software Engineer",
    level: "mid",
    focusArea: "Technical",
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStage, setInterviewStage] = useState("setup");
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobs, setAudioBlobs] = useState([]);
  const [audioURLs, setAudioURLs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token && token.trim() ? token.trim() : null;
  };

  const getQuestionText = (item) => {
    if (typeof item === "string") return item;
    return item?.question ? String(item.question) : "";
  };

  // Generate interview questions via backend (do not call Gemini from frontend)
  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert("Please login to start the interview.");
        return;
      }

      const response = await fetchWithWarmupRetry(
        "/api/interview/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company: interviewDetails.company,
            jobRole: interviewDetails.jobRole,
            level: interviewDetails.level,
            focusArea: interviewDetails.focusArea,
            count: 5,
          }),
        },
        { retries: 1 },
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json().catch(() => ({}));
      const qsRaw = Array.isArray(data?.questions) ? data.questions : [];
      const qs = qsRaw.map(getQuestionText).filter(Boolean).slice(0, 5);

      if (qs.length === 0) {
        throw new Error("No questions generated");
      }

      setQuestions(qs);
      setInterviewStage("interview");
      setAudioBlobs([]);
      setAudioURLs([]);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);

        setAudioBlobs((prev) => [...prev, audioBlob]);
        setAudioURLs((prev) => [...prev, audioURL]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // Play audio
  const playAudio = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioURLs[index]);
    audioRef.current = audio;

    audio.onplay = () => {
      setIsPlaying(true);
      setCurrentPlayingIndex(index);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentPlayingIndex(null);
    };

    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  // Stop audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentPlayingIndex(null);
    }
  };

  // Submit answer and move to next question
  const submitAnswer = () => {
    stopRecording();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Generate feedback via backend (no frontend API keys)
  const generateFeedback = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert("Please login to generate feedback.");
        return;
      }

      const answers = questions.map((_, i) =>
        audioURLs[i]
          ? `Audio answer recorded (local playback URL): ${audioURLs[i]}`
          : "Audio answer recorded",
      );

      const response = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: interviewDetails.company,
          jobRole: interviewDetails.jobRole,
          level: interviewDetails.level,
          focusArea: interviewDetails.focusArea,
          questions,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json().catch(() => ({}));
      setFeedback(String(data?.feedback || "No feedback generated"));
      setInterviewStage("feedback");
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback(
        "Failed to generate detailed feedback. Here are the questions:\n\n" +
          questions.map((q, i) => `Q${i + 1}: ${q}\n`).join("\n"),
      );
      setInterviewStage("feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailChange = (field, value) => {
    setInterviewDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:bg-gray-900 dark:text-gray-100 p-4 md:p-6 radial-background">
      <div className="max-w-4xl mx-auto">
        {interviewStage === "setup" && (
          <div className="bg-white/70 dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-slate-200/70 dark:border-gray-700 backdrop-blur">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Audio Interview Simulator
            </h1>

            <div className="grid gap-4 mb-6">
              <div>
                <label className="block mb-2 text-slate-600 dark:text-gray-300">
                  Company (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon"
                  value={interviewDetails.company}
                  onChange={(e) =>
                    handleDetailChange("company", e.target.value)
                  }
                  className="w-full p-3 bg-white/80 dark:bg-gray-700 rounded border border-slate-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-600 dark:text-gray-300">
                  Job Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={interviewDetails.jobRole}
                  onChange={(e) =>
                    handleDetailChange("jobRole", e.target.value)
                  }
                  className="w-full p-3 bg-white/80 dark:bg-gray-700 rounded border border-slate-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-600 dark:text-gray-300">
                  Experience Level
                </label>
                <select
                  value={interviewDetails.level}
                  onChange={(e) => handleDetailChange("level", e.target.value)}
                  className="w-full p-3 bg-white/80 dark:bg-gray-700 rounded border border-slate-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none"
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
                  onChange={(e) =>
                    handleDetailChange("focusArea", e.target.value)
                  }
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
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Questions...
                </span>
              ) : (
                "Start Interview"
              )}
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
              <p className="text-lg">{questions[currentQuestionIndex]}</p>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-gray-300">
                Your Audio Answer:
              </label>

              {audioURLs[currentQuestionIndex] ? (
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() =>
                      currentPlayingIndex === currentQuestionIndex
                        ? stopAudio()
                        : playAudio(currentQuestionIndex)
                    }
                    className={`px-4 py-2 rounded ${currentPlayingIndex === currentQuestionIndex ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"} transition-colors`}
                  >
                    {currentPlayingIndex === currentQuestionIndex
                      ? "Stop"
                      : "Play"}
                  </button>
                  <span className="text-gray-300">Answer recorded</span>
                </div>
              ) : (
                <div className="text-gray-400 italic mb-4">
                  No answer recorded yet
                </div>
              )}

              <div className="flex gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 bg-red-600 py-3 rounded hover:bg-red-500 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Record Answer
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex-1 bg-gray-600 py-3 rounded hover:bg-gray-500 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Stop Recording
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-4">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => {
                    stopRecording();
                    stopAudio();
                    setCurrentQuestionIndex((prev) => prev - 1);
                  }}
                  className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-500 transition-colors"
                >
                  Previous
                </button>
              )}

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={submitAnswer}
                  disabled={!audioURLs[currentQuestionIndex]}
                  className={`flex-1 bg-blue-600 py-2 rounded hover:bg-blue-500 transition-colors ${
                    currentQuestionIndex > 0 ? "" : "ml-auto"
                  } ${!audioURLs[currentQuestionIndex] ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    stopRecording();
                    stopAudio();
                    generateFeedback();
                  }}
                  disabled={!audioURLs[currentQuestionIndex] || isLoading}
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
            <h1 className="text-2xl font-bold mb-6 text-center">
              Interview Feedback
            </h1>

            <div className="bg-gray-700 p-4 rounded mb-6 border border-gray-600">
              <pre className="whitespace-pre-wrap font-sans">
                {feedback || "Generating feedback..."}
              </pre>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setInterviewStage("setup");
                  setQuestions([]);
                  setCurrentQuestionIndex(0);
                  setFeedback("");
                  setAudioBlobs([]);
                  setAudioURLs([]);
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

export default AudioInterview;
