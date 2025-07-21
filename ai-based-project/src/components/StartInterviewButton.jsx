import React from 'react'
const StartInterviewButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
  >
    Start New Interview
  </button>
);

export default StartInterviewButton