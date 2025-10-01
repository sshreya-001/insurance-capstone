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

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
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
    next(err);
  }
};