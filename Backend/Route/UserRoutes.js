const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../Middleware/UserMiddleware");

const validateSignup = (req, res, next) => {
  const { UserName, Email, Password } = req.body;
  if (!UserName || !Email || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  next();
};

router.post("/signup", validateSignup, createUser);
router.post("/signin", validateLogin, loginUser);

module.exports = router;