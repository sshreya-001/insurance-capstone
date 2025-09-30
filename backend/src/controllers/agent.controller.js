import User from "../models/User.js";
import UserPolicy from "../models/UserPolicy.js";
import Claim from "../models/Claim.js";

export const listAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-passwordHash");
    res.json(agents);
  } catch (err) {
    next(err);
  }
};

export const createAgent = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const agent = await User.create({
      name,
      email,
      passwordHash: password,
      role: "agent",
    });

    res.status(201).json({ message: "Agent created", agent });
  } catch (err) {
    next(err);
  }
};

export const assignAgent = async (req, res, next) => {
  try {
    const { type, targetId, agentId } = req.body;

    if (type === "policy") {
      const policy = await UserPolicy.findByIdAndUpdate(
        targetId,
        { assignedAgentId: agentId },
        { new: true }
      );
      return res.json(policy);
    }

    if (type === "claim") {
      const claim = await Claim.findByIdAndUpdate(
        targetId,
        { decidedByAgentId: agentId },
        { new: true }
      );
      return res.json(claim);
    }

    res.status(400).json({ message: "Invalid assignment type" });
  } catch (err) {
    next(err);
  }
};
