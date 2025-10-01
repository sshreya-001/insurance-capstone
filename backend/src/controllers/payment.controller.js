import Payment from "../models/Payment.js";
import UserPolicy from "../models/UserPolicy.js";

// ✅ Customer: Pay premium
export const makePayment = async (req, res) => {
  try {
    const { userPolicyId, method, reference } = req.body;

    const policy = await UserPolicy.findById(userPolicyId);
    if (!policy || policy.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized or policy not found" });
    }

    const payment = new Payment({
      userId: req.user.id,
      userPolicyId,
      amount: policy.premiumPaid,
      method,
      reference,
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error('Payment creation error:', err);
    res.status(500).json({ message: "Error making payment", error: err.message });
  }
};

// ✅ Customer: View payment history
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate({
        path: 'userPolicyId',
        populate: {
          path: 'policyProductId',
          select: 'title code'
        }
      });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
};
