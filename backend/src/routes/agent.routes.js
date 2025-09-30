import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

// Admin-only: list agents
router.get("/", authMiddleware.requiredAuth, roleMiddleware("admin"), async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-passwordHash");
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching agents", error: err.message });
  }
});

export default router;
