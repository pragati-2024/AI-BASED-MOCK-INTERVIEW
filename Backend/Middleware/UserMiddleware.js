const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hardcoded JWT secret (✔ for dev, ❌ for production — use .env)
const JWT_SECRET = "myverysecretkey123";

// Helper: Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

// ✅ User Registration
exports.createUser = async (req, res) => {
  const { UserName, Email, Password } = req.body;

  if (!UserName || !Email || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await User.create({
      UserName,
      Email,
      Password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        UserName: user.UserName,
        Email: user.Email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ User Login
exports.loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        UserName: user.UserName,
        Email: user.Email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
