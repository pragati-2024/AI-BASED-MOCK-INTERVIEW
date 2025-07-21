import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TypingText from '../components/TypingText.jsx'
import InterviewAnalytics from '../components/InterviewAnalytics.jsx'
import StartInterviewButton from '../components/StartInterviewButton.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { UploadCloud, FileText, ArrowLeft, Menu, X } from 'lucide-react';


const Dashboard = () => {
  const navigate = useNavigate()
   const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const StartInterviewButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
  >
    Start New Interview
  </button>
);
 const handleStartInterview = () => {
    setIsModalOpen(true);
  };

  // This function closes the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
            <StartInterviewButton onClick={handleStartInterview} />
          </div>
        </div>

        <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-8 shadow-lg mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">Your Last Interview Performance</h3>

          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <InterviewAnalytics />
            </div>
          </div>

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
      {isModalOpen && <InterviewModal onClose={closeModal} />}
    </div>
  )
}
const Step1Resume = ({ setResumeFile, resumeFile }) => {
    const fileInputRef = React.useRef(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setResumeFile(file);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) setResumeFile(file);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const openFileDialog = () => fileInputRef.current.click();

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Upload Your Resume</h2>
            <p className="text-center text-gray-500 mb-6">Please upload your resume in PDF or DOCX format.</p>
            <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors duration-300 bg-gray-50"
                onDrop={handleDrop} onDragOver={handleDragOver} onClick={openFileDialog}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
                {resumeFile ? (
                    <div className="flex flex-col items-center justify-center text-purple-700">
                        <FileText size={48} className="mb-3" />
                        <p className="font-semibold">{resumeFile.name}</p>
                        <p className="text-sm text-gray-500 mt-1">Click or drag to replace</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <UploadCloud size={48} className="mb-3 text-gray-400" />
                        <p className="font-semibold">Click to upload or drag and drop</p>
                        <p className="text-sm">PDF, DOC, DOCX (max. 5MB)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Step2JobDescription = ({ setJobDescription, jobDescription }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Job Description</h2>
            <p className="text-center text-gray-500 mb-6">Paste the job description for the role you are targeting.</p>
            <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-300 resize-none text-gray-800"
                placeholder="Paste job description here..."
            ></textarea>
        </div>
    );
};

const InterviewModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onClose(); // Finish the process
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const totalSteps = 4;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Resume setResumeFile={setResumeFile} resumeFile={resumeFile} />;
      case 2:
        return <Step2JobDescription setJobDescription={setJobDescription} jobDescription={jobDescription} />;
      case 3:
        return <div className="text-center p-8"><h2 className="text-xl font-semibold text-gray-700">Step 3: Configure Interview</h2><p className="text-gray-500 mt-2">Set interview type and difficulty.</p></div>;
      case 4:
        return <div className="text-center p-8"><h2 className="text-xl font-semibold text-gray-700">Step 4: Final Check</h2><p className="text-gray-500 mt-2">Review your details before starting.</p></div>;
      default:
        return null;
    }
  };
  
  const isNextDisabled = () => {
      if (step === 1 && !resumeFile) return true;
      if (step === 2 && jobDescription.trim() === '') return true;
      return false;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
             {step > 1 ? (
              <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="text-gray-600" />
              </button>
            ) : <div className="w-8"></div>}
            <p className="text-sm font-medium text-gray-500">
              Step {step} of {totalSteps}
            </p>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8 min-h-[300px] flex flex-col justify-center">
          {renderStep()}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end">
          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {step === totalSteps ? 'Finish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard
