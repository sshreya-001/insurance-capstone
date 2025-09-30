// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "Email already registered" });

//     const hash = await bcrypt.hash(password, 10);

//     // Default role: customer; only admin can create agent
//     let finalRole = "customer";
//     if (role === "agent" || role === "admin") {
//       if (req.user?.role === "admin") {
//         finalRole = role;
//       } else {
//         return res.status(403).json({ message: "Only admin can assign agent/admin role" });
//       }
//     }

//     const user = new User({
//       name,
//       email,
//       passwordHash: hash,
//       role: finalRole,
//     });

//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const valid = await bcrypt.compare(password, user.passwordHash);
//     if (!valid) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };





import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

/**
 * Register User
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    if (!["customer", "agent", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 🚨 TEMPORARY FIX: allow only first admin to be created via register
    if (role === "admin") {
      const existingAdmins = await User.findOne({ role: "admin" });
      if (existingAdmins) {
        return res.status(403).json({ message: "Only existing admin can create another admin" });
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (notice we use passwordHash here)
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Login User
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
