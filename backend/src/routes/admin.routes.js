import express from "express";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import UserPolicy from "../models/UserPolicy.js";
import Payment from "../models/Payment.js";

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

export default router;
