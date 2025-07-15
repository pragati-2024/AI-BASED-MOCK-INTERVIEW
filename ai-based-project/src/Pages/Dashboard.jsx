import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TypingText from '../components/TypingText'
import InterviewAnalytics from '../components/InterviewAnalytics.jsx'
import StartInterviewButton from '../components/StartInterviewButton'
import React from 'react';

const Dashboard = () => {
  const navigate = useNavigate()
  const [showAnalysis, setShowAnalysis] = useState(false)

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

  const handleStartInterview = () => {
    navigate('/interview')
  }

  return (
    <div className="p-8 flex flex-col items-center min-h-screen">
      {/* TypingText Component at the top */}
      <div className="mb-12 text-center">
        <TypingText phrases={['Ready for interview', 'Practice makes perfect', 'Ace your next interview']} />
      </div>

      {/* Motivational Quote Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-2xl font-light italic text-purple-300 mb-8">
          "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
        </h2>
        
        {/* Start Interview Button */}
        <div className="my-8">
          <StartInterviewButton onClick={handleStartInterview} />
        </div>
      </div>

      {/* Previous Performance Section */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-center">Your Last Interview Performance</h3>
        
        {/* Analytics Chart */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <InterviewAnalytics />
          </div>
        </div>
        
        {/* Performance Feedback */}
        {showAnalysis && (
          <div className="mt-6 p-6 bg-gray-700 rounded-lg">
            <h4 className="text-lg font-medium mb-4 text-purple-300">Analysis of Your Performance:</h4>
            <ul className="space-y-3">
              {performanceFeedback.map((feedback, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-300">{feedback}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Toggle Analysis Button */}
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            {showAnalysis ? 'Hide Analysis' : 'Show Detailed Analysis'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard