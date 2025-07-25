import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SideImage from '../assets/6073424 copy.jpg';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const tabContentVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: { x: 10, opacity: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-white font-[Poppins] bg-gradient-to-br from-[#1a1a2e] to-[#2e1a47] overflow-hidden">
      {/* Side Image - Hidden on mobile, visible on large screens */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-black relative overflow-hidden"
      >
        <motion.img
          src={SideImage} 
          alt="Brand"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-screen object-cover filter brightness-[0.95] contrast-[1.1] saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-20 left-10 right-10"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome to Mockneto</h2>
          <p className="text-gray-300">Your gateway to seamless digital experiences</p>
        </motion.div>
      </motion.div>

      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Mockneto
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {activeTab === 'login' 
                ? "Welcome back! Please sign in to your account." 
                : "Join us today! Create your account in seconds."}
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <div className="flex justify-between bg-[#2c2c2c] rounded-lg p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 sm:py-3 rounded-md transition-all duration-300 text-sm sm:text-base font-medium ${
                  activeTab === 'login'
                    ? 'bg-[#3f51b5] shadow-lg text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 sm:py-3 rounded-md transition-all duration-300 text-sm sm:text-base font-medium ${
                  activeTab === 'signup'
                    ? 'bg-[#3f51b5] shadow-lg text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>
          </motion.div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4 sm:space-y-6"
            >
              {activeTab === 'login' ? (
                <>
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm sm:text-base font-medium mb-2">Email address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-gray-700 hover:border-gray-600"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm sm:text-base font-medium mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-gray-700 hover:border-gray-600"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <label className="flex items-center text-xs sm:text-sm text-gray-400 cursor-pointer">
                      <input type="checkbox" className="mr-2 w-4 h-4 rounded bg-[#2c2c2c] border-gray-600 focus:ring-[#3f51b5]" />
                      Remember me
                    </label>
                    <a href="#" className="text-[#8ab4f8] text-xs sm:text-sm hover:underline transition-colors">Forgot password?</a>
                  </motion.div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-[#3f51b5] to-[#5a6fff] rounded-lg hover:shadow-lg transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                  >
                    Sign In
                  </motion.button>

                  <motion.div variants={itemVariants} className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-2 bg-gradient-to-br from-[#1a1a2e] to-[#2e1a47] text-gray-500">or continue with</span>
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ y: -2 }}
                    type="button"
                    className="w-full py-2 sm:py-3 flex justify-center items-center gap-2 border border-gray-600 bg-[#2c2c2c] rounded-lg hover:bg-[#3a3a3a] transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    Log in with Google
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm sm:text-base font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-gray-700 hover:border-gray-600"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm sm:text-base font-medium mb-2">Email address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-gray-700 hover:border-gray-600"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm sm:text-base font-medium mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="Create a password"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-gray-700 hover:border-gray-600"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm sm:text-base font-medium mb-2">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-gray-700 hover:border-gray-600"
                    />
                  </motion.div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-[#3f51b5] to-[#5a6fff] rounded-lg hover:shadow-lg transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                  >
                    Create Account
                  </motion.button>

                  <motion.p variants={itemVariants} className="text-xs text-gray-500 text-center">
                    By signing up, you agree to our <a href="#" className="text-[#8ab4f8] hover:underline">Terms</a> and <a href="#" className="text-[#8ab4f8] hover:underline">Privacy Policy</a>.
                  </motion.p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;