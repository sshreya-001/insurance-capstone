import express from "express";
import User from "../models/User.js";
import UserPolicy from "../models/UserPolicy.js";
import Claim from "../models/Claim.js";
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

// Agent dashboard data
router.get("/dashboard", authMiddleware.requiredAuth, roleMiddleware("agent"), async (req, res) => {
  try {
    const agentId = req.user.id;
    
    // Get agent's customers (users who have policies)
    const customers = await User.find({ role: "customer" }).select("-passwordHash");
    
    // Get pending claims
    const pendingClaims = await Claim.find({ status: "PENDING" })
      .populate("userId", "name email")
      .populate("userPolicyId");
    
    // Get total policies sold by this agent (if we track this)
    const totalPolicies = await UserPolicy.countDocuments();
    
    // Get total revenue (sum of all premiums)
    const revenueData = await UserPolicy.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$premiumPaid" } } }
    ]);
    
    const summary = {
      totalCustomers: customers.length,
      pendingClaims: pendingClaims.length,
      totalPolicies,
      totalRevenue: revenueData[0]?.totalRevenue || 0
    };
    
    res.json(summary);
  } catch (err) {
    console.error("Agent dashboard error:", err);
    res.status(500).json({ message: "Error loading dashboard data", error: err.message });
  }
});

// Agent's customers
router.get("/customers", authMiddleware.requiredAuth, roleMiddleware("agent"), async (req, res) => {
  try {
    const agentId = req.user.id;
    console.log('Agent ID for customers:', agentId);
    
    // Get customers assigned to this agent
    const customers = await User.find({ role: "customer" }).select("-passwordHash");
    console.log('Total customers found:', customers.length);
    
    // Get policies for each customer that are assigned to this agent
    const customersWithPolicies = await Promise.all(
      customers.map(async (customer) => {
        const policies = await UserPolicy.find({ 
          userId: customer._id,
          assignedAgentId: agentId 
        }).populate("policyProductId", "title code premium");
        
        console.log(`Customer ${customer.name} has ${policies.length} policies assigned to agent ${agentId}`);
        
        // Only return customers who have policies assigned to this agent
        if (policies.length > 0) {
          return {
            ...customer.toObject(),
            policies
          };
        }
        return null;
      })
    );
    
    // Filter out null values (customers with no assigned policies)
    const assignedCustomers = customersWithPolicies.filter(customer => customer !== null);
    console.log('Assigned customers:', assignedCustomers.length);
    
    res.json(assignedCustomers);
  } catch (err) {
    console.error("Agent customers error:", err);
    res.status(500).json({ message: "Error loading customers", error: err.message });
  }
});

// Assign agent to policy (Admin only)
router.post("/assign", authMiddleware.requiredAuth, roleMiddleware("admin"), async (req, res) => {
  try {
    const { policyId, agentId } = req.body;
    
    if (!policyId || !agentId) {
      return res.status(400).json({ message: "Policy ID and Agent ID are required" });
    }
    
    // Verify agent exists
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(400).json({ message: "Invalid agent ID" });
    }
    
    // Assign agent to policy and activate it
    const policy = await UserPolicy.findByIdAndUpdate(
      policyId,
      { 
        assignedAgentId: agentId,
        status: "ACTIVE" // Change status from PENDING_AGENT to ACTIVE
      },
      { new: true }
    ).populate("userId", "name email")
     .populate("policyProductId", "title code")
     .populate("assignedAgentId", "name email");
    
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    
    res.json({
      message: "Agent assigned successfully",
      policy
    });
  } catch (err) {
    console.error("Agent assignment error:", err);
    res.status(500).json({ message: "Error assigning agent", error: err.message });
  }
});

// Get unassigned policies (Admin only)
router.get("/unassigned-policies", authMiddleware.requiredAuth, roleMiddleware("admin"), async (req, res) => {
  try {
    const unassignedPolicies = await UserPolicy.find({ 
      $or: [
        { assignedAgentId: { $exists: false } },
        { assignedAgentId: null },
        { status: "PENDING_AGENT" }
      ]
    })
    .populate("userId", "name email")
    .populate("policyProductId", "title code")
    .sort({ createdAt: -1 }); // Most recent first
    
    res.json(unassignedPolicies);
  } catch (err) {
    console.error("Unassigned policies error:", err);
    res.status(500).json({ message: "Error loading unassigned policies", error: err.message });
  }
});

// Get agent's assigned policies
router.get("/my-policies", authMiddleware.requiredAuth, roleMiddleware("agent"), async (req, res) => {
  try {
    const agentId = req.user.id;
    console.log('Getting policies for agent:', agentId);
    
    const policies = await UserPolicy.find({ assignedAgentId: agentId })
      .populate("userId", "name email")
      .populate("policyProductId", "title code premium");
    
    console.log('Found policies for agent:', policies.length);
    res.json(policies);
  } catch (err) {
    console.error("Agent policies error:", err);
    res.status(500).json({ message: "Error loading agent policies", error: err.message });
  }
});

// Create new agent (Admin only)
router.post("/", authMiddleware.requiredAuth, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    
    // Create new agent
    const agent = await User.create({
      name,
      email,
      passwordHash: password, // In production, hash this password
      role: "agent",
      isActive: true
    });
    
    res.status(201).json({
      message: "Agent created successfully",
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        isActive: agent.isActive,
        createdAt: agent.createdAt
      }
    });
  } catch (err) {
    console.error("Create agent error:", err);
    res.status(500).json({ message: "Error creating agent", error: err.message });
  }
});

export default router;
