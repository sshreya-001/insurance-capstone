import UserPolicy from "../models/UserPolicy.js";
import PolicyProduct from "../models/PolicyProduct.js";

// ✅ Customer: Buy a policy
export const buyPolicy = async (req, res) => {
  try {
    const { policyProductId, startDate, nominee } = req.body;

    const product = await PolicyProduct.findById(policyProductId);
    if (!product) return res.status(404).json({ message: "Policy product not found" });

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + product.termMonths);

    const userPolicy = new UserPolicy({
      userId: req.user.id,
      policyProductId,
      startDate,
      endDate,
      premiumPaid: product.premium,
      nominee,
    });

    await userPolicy.save();
    res.status(201).json(userPolicy);
  } catch (err) {
    res.status(500).json({ message: "Error buying policy", error: err.message });
  }
};

// ✅ User: Get their policies
export const getMyPolicies = async (req, res) => {
  try {
    const policies = await UserPolicy.find({ userId: req.user.id })
      .populate("policyProductId")
      .populate("assignedAgentId", "name email");

    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: "Error fetching policies", error: err.message });
  }
};
