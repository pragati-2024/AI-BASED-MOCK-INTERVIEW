import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { signIn, signInWithGoogle, signUp } from "../auth";
import { GoogleLogin } from "@react-oauth/google";
import SideImage from "../assets/6073424 copy.jpg";
import { useTheme } from "../context/ThemeContext.jsx";
import { warmupBackend } from "../utils/backendWarmup.js";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [backendWarmup, setBackendWarmup] = useState("idle"); // idle | warming | ready | failed
  const [sessionUser, setSessionUser] = useState(null);
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    setBackendWarmup("warming");

    warmupBackend()
      .then((ok) => {
        if (cancelled) return;
        setBackendWarmup(ok ? "ready" : "failed");
      })
      .catch(() => {
        if (cancelled) return;
        setBackendWarmup("failed");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // If already logged in, show quick actions (don’t force redirect)
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setSessionUser(JSON.parse(userData));
      } catch {
        setSessionUser({ UserName: "User" });
      }
    } else {
      setSessionUser(null);
    }
  }, [navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event("user-updated"));
    setSessionUser(null);
    setActiveTab("login");
    setInfo("Logged out successfully.");
  };

  const handleBack = () => {
    try {
      if (window.history.length > 1) navigate(-1);
      else navigate("/");
    } catch {
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      if (activeTab === "login") {
        // Login logic
        const response = await signIn({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.dispatchEvent(new Event("user-updated"));

        // Apply user's persisted theme if available; otherwise keep current preference
        const persistedTheme = response?.user?.settings?.theme;
        if (
          persistedTheme &&
          ["light", "dark", "system"].includes(persistedTheme)
        ) {
          setTheme(persistedTheme);
        }
        navigate("/dashboard");
      } else {
        // Signup logic
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const { name, email, password } = formData;
        const response = await signUp({
          name: name,
          email: email,
          password: password,
        });
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.dispatchEvent(new Event("user-updated"));

        const persistedTheme = response?.user?.settings?.theme;
        if (
          persistedTheme &&
          ["light", "dark", "system"].includes(persistedTheme)
        ) {
          setTheme(persistedTheme);
        }
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err?.message || "An error occurred. Please try again.";
      setError(message);

      if (String(message).toLowerCase().includes("already registered")) {
        setActiveTab("login");
        setInfo("This email is already registered. Please log in instead.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleError = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setInfo("");
    setError(
      `Google login is not allowed for this domain${origin ? ` (${origin})` : ""}. ` +
        `Fix: Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID → ` +
        `add this to Authorized JavaScript origins: ${origin || "<your-frontend-origin>"}.`,
    );
  };

  const finishLogin = (response) => {
    window.dispatchEvent(new Event("user-updated"));

    const persistedTheme = response?.user?.settings?.theme;
    if (
      persistedTheme &&
      ["light", "dark", "system"].includes(persistedTheme)
    ) {
      setTheme(persistedTheme);
    }
    navigate("/dashboard");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setInfo("");
    setGoogleLoading(true);
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) throw new Error("Google credential missing");
      const response = await signInWithGoogle(idToken);
      finishLogin(response);
    } catch (err) {
      setError(err?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const tabContentVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { x: 10, opacity: 0 },
  };

  return (
    <div className="min-h-screen pt-24 flex flex-col lg:flex-row text-slate-900 dark:text-white font-[Poppins] radial-background overflow-hidden">
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
          className="w-full h-full min-h-screen object-cover filter brightness-[0.95] contrast-[1.1] saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-20 left-10 right-10"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome to Mockneto</h2>
          <p className="text-gray-300">
            Your gateway to seamless digital experiences
          </p>
        </motion.div>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-start lg:items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8 bg-white/70 dark:bg-black/10 backdrop-blur rounded-2xl border border-slate-200/70 dark:border-white/10 p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-black/10 hover:bg-white/70 dark:hover:bg-black/20 transition text-sm"
            >
              Back
            </button>

            {sessionUser && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-purple-600 dark:hover:bg-purple-700 hover:bg-slate-800 transition text-sm"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Mockneto
            </h1>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
              {activeTab === "login"
                ? "Welcome back! Please sign in to your account."
                : "Join us today! Create your account in seconds."}
            </p>
          </motion.div>

          {sessionUser && (
            <div className="rounded border border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-black/10 px-4 py-3 text-sm text-slate-700 dark:text-gray-200">
              You are already logged in as{" "}
              <span className="font-semibold">
                {sessionUser?.UserName || "User"}
              </span>
              .
              <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Use Dashboard or Logout buttons above.
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/40 text-red-700 dark:text-red-300 px-4 py-3 rounded relative whitespace-pre-line"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          {/* Info Message */}
          {info && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/10 border border-blue-500/40 text-blue-700 dark:text-blue-200 px-4 py-3 rounded relative whitespace-pre-line"
              role="status"
            >
              <strong className="font-bold">Info: </strong>
              <span className="block sm:inline">{info}</span>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <div className="flex justify-between bg-slate-100/80 dark:bg-[#2c2c2c] rounded-lg p-1 border border-slate-200/70 dark:border-transparent">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 sm:py-3 rounded-md transition-all duration-300 text-sm sm:text-base font-medium ${
                  activeTab === "login"
                    ? "bg-[#3f51b5] shadow-lg text-white"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 sm:py-3 rounded-md transition-all duration-300 text-sm sm:text-base font-medium ${
                  activeTab === "signup"
                    ? "bg-[#3f51b5] shadow-lg text-white"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-300"
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
              <form onSubmit={handleSubmit}>
                {activeTab === "login" ? (
                  <>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm sm:text-base font-medium mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/70 dark:bg-[#2c2c2c] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-slate-300/70 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-600"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm sm:text-base font-medium mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/70 dark:bg-[#2c2c2c] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-slate-300/70 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-600"
                      />
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0"
                    >
                      <label className="flex items-center text-xs sm:text-sm text-slate-600 dark:text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 rounded bg-white dark:bg-[#2c2c2c] border-slate-300 dark:border-gray-600 focus:ring-[#3f51b5]"
                        />
                        Remember me
                      </label>
                      <Link
                        to="/contactus"
                        className="text-[#8ab4f8] text-xs sm:text-sm hover:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 sm:py-3 bg-gradient-to-r from-[#3f51b5] to-[#5a6fff] rounded-lg hover:shadow-lg transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-[#1a1a2e] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Signing In...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm sm:text-base font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/70 dark:bg-[#2c2c2c] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-slate-300/70 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-600"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm sm:text-base font-medium mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/70 dark:bg-[#2c2c2c] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-slate-300/70 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-600"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm sm:text-base font-medium mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/70 dark:bg-[#2c2c2c] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-slate-300/70 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-600"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm sm:text-base font-medium mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/70 dark:bg-[#2c2c2c] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200 border border-slate-300/70 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-600"
                      />
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 sm:py-3 bg-gradient-to-r from-[#3f51b5] to-[#5a6fff] rounded-lg hover:shadow-lg transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-[#1a1a2e] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Creating Account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </motion.button>
                  </>
                )}
              </form>

              {activeTab === "login" && (
                <>
                  <motion.div variants={itemVariants} className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300/70 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-2 bg-white/70 dark:bg-transparent text-slate-500 dark:text-gray-500">
                        or continue with
                      </span>
                    </div>
                  </motion.div>

                  {googleClientId ? (
                    <motion.div
                      variants={itemVariants}
                      className="w-full flex justify-center"
                      style={{
                        opacity: googleLoading ? 0.7 : 1,
                        pointerEvents: googleLoading ? "none" : "auto",
                      }}
                    >
                      <div className="w-full flex flex-col items-center gap-2">
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleError}
                          theme="outline"
                          size="large"
                          shape="pill"
                          text="signin_with"
                        />
                        {backendWarmup === "warming" && (
                          <div className="text-xs text-slate-500 dark:text-gray-400 text-center">
                            Starting server… first Google login can take 10–20s.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ y: -2 }}
                      type="button"
                      onClick={() => {
                        setError("");
                        setInfo(
                          "Set VITE_GOOGLE_CLIENT_ID in ai-based-project/.env to enable Google login.",
                        );
                      }}
                      className="w-full py-2 sm:py-3 flex justify-center items-center gap-2 border border-slate-300/70 dark:border-gray-600 bg-white/60 dark:bg-[#2c2c2c] rounded-lg transition-all duration-200 text-sm sm:text-base font-medium opacity-70 cursor-not-allowed"
                      disabled
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        alt="Google"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      Log in with Google
                    </motion.button>
                  )}
                </>
              )}

              {activeTab === "signup" && (
                <motion.p
                  variants={itemVariants}
                  className="text-xs text-slate-600 dark:text-gray-500 text-center"
                >
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="text-[#8ab4f8] hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#8ab4f8] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
