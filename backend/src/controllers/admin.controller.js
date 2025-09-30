import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import UserPolicy from "../models/UserPolicy.js";
import Claim from "../models/Claim.js";
import Payment from "../models/Payment.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(20);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    const policiesCount = await UserPolicy.countDocuments();
    const claimsPending = await Claim.countDocuments({ status: "PENDING" });
    const totalPayments = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      usersCount,
      policiesCount,
      claimsPending,
      totalPayments: totalPayments[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};
