const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("./models");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    req.user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide name, email, and password" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ msg: "Registration successful", user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Login failed", error: error.message });
  }
};

module.exports = { register, login, authMiddleware };
