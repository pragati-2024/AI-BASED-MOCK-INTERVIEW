import React, { useState, useEffect } from 'react';

function InterviewSetup() {
  const [formData, setFormData] = useState({
    company: '',
    jobRole: 'Software Engineer',
    jobType: 'Full-time',
    level: 'mid',
    method: 'video',
    duration: '45',
    focusArea: 'technical',
    difficulty: 'medium'
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your interview start logic here
    alert(`Starting ${formData.difficulty} ${formData.level}-level ${formData.jobRole} interview for ${formData.company}`);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 py-2 tracking-tight">
            Ace Your Dream Interview
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mx-auto">
            Craft your perfect interview scenario and get ready to impress
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className={`bg-gray-800/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/50 shadow-xl shadow-blue-900/10 transition-all duration-700 delay-200 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Company Field */}
              <div className={`transition-all duration-500 delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}>
                <label className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-wider">TARGET COMPANY</label>
                <div className="relative">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all duration-300 hover:border-blue-500/30 pl-10"
                    required
                    placeholder="e.g. Google, Amazon"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Employment Type */}
              <div className={`transition-all duration-500 delay-450 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <label className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-wider">EMPLOYMENT TYPE</label>
                <div className="relative">
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full appearance-none bg-gray-700/40 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all duration-300 hover:border-blue-500/30 pl-10 pr-8"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Difficulty */}
              <div className={`transition-all duration-500 delay-550 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <label className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-wider">DIFFICULTY</label>
                <div className="relative">
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full appearance-none bg-gray-700/40 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all duration-300 hover:border-blue-500/30 pl-10 pr-8"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Job Role */}
              <div className={`transition-all duration-500 delay-350 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}>
                <label className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-wider">JOB ROLE</label>
                <div className="relative">
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    className="w-full bg-gray-700/40 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all duration-300 hover:border-blue-500/30 pl-10"
                    required
                    placeholder="e.g. Frontend Developer"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Experience Level */}
              <div className={`transition-all duration-500 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <label className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-wider">EXPERIENCE LEVEL</label>
                <div className="relative">
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full appearance-none bg-gray-700/40 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all duration-300 hover:border-blue-500/30 pl-10 pr-8"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v16m6-16v16m-10-4h4a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Interview Format */}
              <div className={`transition-all duration-500 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <label className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-wider">INTERVIEW FORMAT</label>
                <div className="relative">
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    className="w-full appearance-none bg-gray-700/40 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all duration-300 hover:border-blue-500/30 pl-10 pr-8"
                  >
                    <option value="video">Video Call</option>
                    <option value="audio">Audio Only</option>
                    <option value="text">Text Based</option>
                    <option value="whiteboard">Whiteboard</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Full Width */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className={`transition-all duration-500 delay-650 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              <label className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-wider">FOCUS AREA</label>
              <div className="relative">
                <select
                  name="focusArea"
                  value={formData.focusArea}
                  onChange={handleChange}
                  className="w-full appearance-none bg-gray-700/40 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/70 focus:outline-none transition-all duration-300 hover:border-blue-500/30 pl-10 pr-8"
                >
                  <option value="technical">Technical Skills</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="system-design">System Design</option>
                  <option value="case-study">Case Study</option>
                  <option value="mixed">Mixed</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={`pt-2 transition-all duration-700 delay-700 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <button
              type="submit"
              className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 rounded-xl font-medium text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center space-x-2"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                Begin Interview Session →
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewSetup;