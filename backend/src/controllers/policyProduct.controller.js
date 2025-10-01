// import PolicyProduct from "../models/PolicyProduct.js";

// // ✅ Admin-only: Create policy product
// export const createPolicyProduct = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

//     const { code, title, description, premium, termMonths, minSumInsured } = req.body;

//     const product = new PolicyProduct({ code, title, description, premium, termMonths, minSumInsured });
//     await product.save();

//     res.status(201).json(product);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating product", error: err.message });
//   }
// };

// // ✅ Public: List all products
// export const listPolicyProducts = async (req, res) => {
//   try {
//     const products = await PolicyProduct.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching products", error: err.message });
//   }
// };

// // ✅ Admin-only: Update product
// export const updatePolicyProduct = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

//     const { id } = req.params;
//     const updates = req.body;

//     const updated = await PolicyProduct.findByIdAndUpdate(id, updates, { new: true });
//     if (!updated) return res.status(404).json({ message: "Product not found" });

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating product", error: err.message });
//   }
// };

// // ✅ Admin-only: Delete product
// export const deletePolicyProduct = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

//     const { id } = req.params;

//     const deleted = await PolicyProduct.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting product", error: err.message });
//   }
// };









import PolicyProduct from "../models/PolicyProduct.js";
import Policy from "../models/Policy.js";
import UserPolicy from "../models/UserPolicy.js";
import User from "../models/User.js";

/**
 * Create a new Policy Product (Admin only)
 */
export const createPolicyProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create policies" });
    }

    const { code, title, description, premium, termMonths, minSumInsured } = req.body;

    const product = await PolicyProduct.create({
      code,
      title,
      description,
      premium,
      termMonths,
      minSumInsured,
    });

    res.status(201).json({
      message: "Policy product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Policy Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * List all Policy Products (Public)
 */
export const listPolicyProducts = async (req, res) => {
  try {
    const products = await PolicyProduct.find();
    res.json(products);
  } catch (error) {
    console.error("List Policy Products Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update Policy Product (Admin only)
 */
export const updatePolicyProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update policies" });
    }

    const { id } = req.params;
    const { code, title, description, premium, termMonths, minSumInsured } = req.body;

    const updatedProduct = await PolicyProduct.findByIdAndUpdate(
      id,
      { code, title, description, premium, termMonths, minSumInsured },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Policy product not found" });
    }

    res.json({
      message: "Policy product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Policy Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Delete Policy Product (Admin only)
 */
export const deletePolicyProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete policies" });
    }

    const { id } = req.params;
    const deleted = await PolicyProduct.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Policy product not found" });
    }

    res.json({ message: "Policy product deleted successfully" });
  } catch (error) {
    console.error("Delete Policy Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Purchase a Policy (Customer)
 */
export const purchasePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { termMonths, nominee } = req.body;

    // Check if product exists
    const product = await PolicyProduct.findById(policyId);
    if (!product) {
      return res.status(404).json({ message: "Policy product not found" });
    }

    const startDate = Date.now();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (termMonths || product.termMonths));
    
    // Create a Policy document for this customer (no agent assigned yet)
    const userPolicy = await UserPolicy.create({
      userId: req.user.id,
      policyProductId: policyId,
      startDate,
      endDate,
      premiumPaid: product.premium,
      nominee,
      status: "PENDING_AGENT", // New status for policies waiting for agent assignment
      assignedAgentId: null, // No agent assigned initially
      createdAt: new Date(),
    });

    // Populate the response with product details
    const populatedPolicy = await UserPolicy.findById(userPolicy._id)
      .populate('policyProductId', 'title code');

    res.status(201).json({
      message: "Policy purchased successfully. An admin will assign an agent to your policy shortly.",
      policy: populatedPolicy,
    });
  } catch (error) {
    console.error("Purchase Policy Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Automatically assign an agent to a policy
 * Uses round-robin or least-loaded agent strategy
 */
const assignAgentAutomatically = async () => {
  try {
    // Get all active agents
    const agents = await User.find({ 
      role: "agent", 
      isActive: true 
    }).select('_id name email');

    if (agents.length === 0) {
      console.log("No active agents found for auto-assignment");
      return null; // No agent assigned
    }

    // Get policy counts for each agent
    const agentPolicyCounts = await UserPolicy.aggregate([
      { $match: { assignedAgentId: { $exists: true, $ne: null } } },
      { $group: { _id: "$assignedAgentId", count: { $sum: 1 } } }
    ]);

    // Create a map of agent policy counts
    const policyCountMap = {};
    agentPolicyCounts.forEach(item => {
      policyCountMap[item._id.toString()] = item.count;
    });

    // Find the agent with the least policies
    let selectedAgent = agents[0];
    let minPolicies = policyCountMap[selectedAgent._id.toString()] || 0;

    for (const agent of agents) {
      const policyCount = policyCountMap[agent._id.toString()] || 0;
      if (policyCount < minPolicies) {
        selectedAgent = agent;
        minPolicies = policyCount;
      }
    }

    console.log(`Auto-assigned agent: ${selectedAgent.name} (${selectedAgent.email})`);
    return selectedAgent._id;
  } catch (error) {
    console.error("Error in auto-assignment:", error);
    return null;
  }
};

/**
 * Get available agents for policy assignment
 */
export const getAvailableAgents = async (req, res) => {
  try {
    // Get all agents (temporarily removing isActive filter to get it working)
    const agents = await User.find({ 
      role: "agent"
    }).select('_id name email');

    // Get policy counts for each agent
    const agentPolicyCounts = await UserPolicy.aggregate([
      { $match: { assignedAgentId: { $exists: true, $ne: null } } },
      { $group: { _id: "$assignedAgentId", count: { $sum: 1 } } }
    ]);

    // Add policy count to each agent
    const agentsWithCounts = agents.map(agent => {
      const policyCount = agentPolicyCounts.find(
        count => count._id.toString() === agent._id.toString()
      )?.count || 0;
      
      return {
        ...agent.toObject(),
        policiesCount: policyCount
      };
    });

    res.json(agentsWithCounts);
  } catch (error) {
    console.error("Error getting available agents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
