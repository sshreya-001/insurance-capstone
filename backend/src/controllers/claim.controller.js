import Claim from "../models/Claim.js";
import UserPolicy from "../models/UserPolicy.js";

// ✅ Customer: Submit a claim
export const submitClaim = async (req, res) => {
  try {
    const { userPolicyId, incidentDate, description, amountClaimed } = req.body;
    if (!req.user) {
      return res.status(403).json({ message: "Not found" });
    }

    const userId = req.user.id;
    const policy = await UserPolicy.findOne({ _id: userPolicyId, userId });
    if (!policy) {
      return res.status(403).json({ message: "Unauthorized or policy not found" });
    }

    const claim = new Claim({
      userId,
      userPolicyId,
      incidentDate,
      description,
      amountClaimed,
    });

    await claim.save();
    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: "Error submitting claim", error: err.message });
  }
};

// ✅ Agent/Admin: Review a claim
export const reviewClaim = async (req, res) => {
  try {
    if (req.user.role !== "agent" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    const claim = await Claim.findById(id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = status;
    claim.decisionNotes = notes;
    claim.decidedByAgentId = req.user.id;

    await claim.save();
    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: "Error reviewing claim", error: err.message });
  }
};

// ✅ Get all claims (role-based)
export const getClaims = async (req, res) => {
  try {
    let claims;
    if (req.user.role === "admin" || req.user.role === "agent") {
      // Admin/Agent sees all claims
      claims = await Claim.find().populate("userId", "name email").populate("userPolicyId");
    } else {
      // Customer sees only their claims
      claims = await Claim.find({ userId: req.user.id }).populate("userPolicyId");
    }

    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Error fetching claims", error: err.message });
  }
};

// ✅ Get claim details by ID (role-based)
export const getClaimDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findById(id)
      .populate("userId", "name email role")
      .populate("userPolicyId");

    if (!claim) return res.status(404).json({ message: "Claim not found" });

    // Customer can view only their own claim
    if (req.user.role === "customer" && claim.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: "Error fetching claim details", error: err.message });
  }
};
