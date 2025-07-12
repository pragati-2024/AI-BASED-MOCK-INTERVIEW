import React, { useState } from 'react';
import SideImage from '../assets/6073424 copy.jpg';
const Login = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen flex text-white font-[Poppins]">

      <div className="w-1/2 hidden md:flex items-center justify-center bg-black">
        <img
            src={SideImage} 
            alt="Brand"
            className="w-full h-screen object-cover filter brightness-[0.95] contrast-[1.1] saturate-[1.2]"
        />
 

      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#2e1a47] px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-3xl font-semibold text-center">Mockneto</h1>


          <div className="flex justify-between mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 border-b-2 transition ${
                activeTab === 'login'
                  ? 'border-[#3f51b5] text-white'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 border-b-2 transition ${
                activeTab === 'signup'
                  ? 'border-[#3f51b5] text-white'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              Sign Up
            </button>
          </div>


          {activeTab === 'login' ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <label>
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-[#8ab4f8]">Forgot password?</a>
              </div>

              <button className="w-full py-3 bg-[#3f51b5] rounded-md hover:bg-[#5a6fff] transition">
                Sign In
              </button>

              <div className="text-center text-gray-500">or</div>

              <button
                type="button"
                className="w-full py-3 flex justify-center items-center gap-2 border border-gray-600 bg-[#2c2c2c] rounded-md hover:bg-[#3a3a3a]"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Log in with Google
              </button>
            </form>
          ) : (
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <button className="w-full py-3 bg-[#3f51b5] rounded-md hover:bg-[#5a6fff] transition">
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
