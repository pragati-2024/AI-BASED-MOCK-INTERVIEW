import React from 'react'

const  Page = () => {
  return (
    <div className='bg-white/5 min-h-screen w-full fixed top-0 left-0 '>
            <div className="h-min w-full py-4 px-8 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex justify-between items-center shadow-md rounded-b-lg">
            <h1 className="text-white text-2xl font-bold">Mockneto</h1>

            <div className="text-white font-medium flex flex-row gap-6 items-center">
              <h3 className="hover:text-purple-300 transition">Home</h3>
              <h3 className="hover:text-purple-300 transition">Practice Interview</h3>
              <h3 className="hover:text-purple-300 transition">Interview Tips</h3>
              <h3 className="hover:text-purple-300 transition">Contact Us</h3>

              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-1 rounded-md shadow-sm transition">
                Login
              </button>
            </div>
          </div>
          <div className='hero-wrapper w-full bg-transparent text-white px-20 py-24 flex items-center justify-between gap-12'>
                <div className="max-w-xl">
                <div className="mb-4">
                  <span className="inline-block bg-white/10 text-white text-sm font-medium px-4 py-1 rounded-full backdrop-blur-sm">
                    🤖 Ai Based Mock Interview 🚀
                  </span>
                </div>
                <h1 className="text-5xl font-bold leading-tight">
                  Accelerate <br />
                  Your <br />
                  <span className="text-purple-400">Interview</span><span className="animate-pulse">|</span>
                </h1>
                <p className="mt-6 text-lg text-white/80">
                  Prepare like a pro with intelligent mock interviews, adaptive questioning, and actionable insights — everything you need to stand out and get hired.
                </p>
              </div>
          </div>
    </div>
  )
}

export default Page
