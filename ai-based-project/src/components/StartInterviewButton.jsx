import React from 'react'
const StartInterviewButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-all transform hover:scale-105 group"
    >
      Start Your Interview
      <span className="absolute -bottom-1 left-1/2 w-3/4 h-1 bg-purple-400 rounded-full transform -translate-x-1/2 group-hover:w-full transition-all duration-300"></span>
    </button>
  )
}

export default StartInterviewButton