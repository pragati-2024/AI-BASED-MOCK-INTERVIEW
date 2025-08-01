import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TypingText from '../components/TypingText.jsx'
import StartInterviewButton from '../components/StartInterviewButton.jsx'
import Sidebar from '../components/Sidebar.jsx'

const Dashboard = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [interviewFeedback, setFeedbackHistory] = useState([]);

  // useEffect(() => {
  //   // Get stored feedback from localStorage
  //   const stored = localStorage.getItem("interviewFeedback");
  //   if (stored) {
  //     setFeedbackHistory(JSON.parse(stored)); // Convert back to array
  //   }
  // }, []);
  
  const motivationalQuotes = [
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Your limitation—it's only your imagination. - Unknown"
  ]

  const performanceFeedback = [
    "You hesitated frequently during technical questions - practice more coding problems",
    "Your answers were sometimes too brief - expand on your thought process",
    "You scored lower on system design - review architectural patterns",
    "Your confidence improved throughout - keep building on this momentum",
    "You excelled at behavioral questions - this is a strong area for you"
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="mb-12 text-center">
          <TypingText phrases={['Ready for interview', 'Practice makes perfect', 'Ace your next interview']} />
        </div>

        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-light italic text-purple-300 mb-8">
            "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
          </h2>

          <div className="my-8">
            <StartInterviewButton />
          </div>
        </div>

        <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-8 shadow-lg mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">Your Interview History</h3>

          {interviewFeedback.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No interview history yet. Complete your first interview to see feedback!</p>
          ) : (
            <div className="space-y-4">
              {interviewFeedback.map((interviewFeedback, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                >
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(interviewFeedback.date).toLocaleString()}
                  </p>
                  <pre className="whitespace-pre-wrap text-gray-100">{interviewFeedback.text}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard