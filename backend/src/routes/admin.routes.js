import express from "express";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import UserPolicy from "../models/UserPolicy.js";
import Payment from "../models/Payment.js";
import Claim from "../models/Claim.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

// Admin-only: audit logs
router.get("/audit", authMiddleware.requiredAuth, roleMiddleware("admin"), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching audit logs", error: err.message });
  }
});

// Admin-only: summary KPIs
router.get("/summary", authMiddleware.requiredAuth, roleMiddleware("admin"), async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const policiesSold = await UserPolicy.countDocuments();
    const claimsPending = await UserPolicy.countDocuments({ status: "ACTIVE" });
    const totalPayments = await Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

    res.json({
      users: userCount,
      policiesSold,
      claimsPending,
      totalPayments: totalPayments[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching summary", error: err.message });
  }
});

// Admin-only: get all users
router.get("/users", authMiddleware.requiredAuth, roleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find({}).select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// Admin-only: delete user
router.delete("/users/:userId", authMiddleware.requiredAuth, roleMiddleware("admin"), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    // Prevent deletion of the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin user" });
      }
    }

    // Delete related data first
    await UserPolicy.deleteMany({ userId: userId });
    await Claim.deleteMany({ userId: userId });
    await Payment.deleteMany({ userId: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Log the action
    await AuditLog.create({
      action: 'DELETE_USER',
      userId: req.user.id,
      details: `Deleted user: ${user.name} (${user.email})`,
      timestamp: new Date()
    });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

export default router;
