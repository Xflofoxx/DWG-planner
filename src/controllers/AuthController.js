const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_super_secret_jwt_key_change_in_production";

const AuthController = {
  async register(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create(email, hashedPassword, role || "user");

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res
        .status(201)
        .json({
          user: { id: user.id, email: user.email, role: user.role },
          token,
        });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.json({
        user: { id: user.id, email: user.email, role: user.role },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = AuthController;
