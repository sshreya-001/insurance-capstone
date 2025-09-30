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

/**
 * Create a new Policy Product (Admin only)
 */
export const createPolicyProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create policies" });
    }

    const { name, description, premium, coverageAmount } = req.body;

    const product = await PolicyProduct.create({
      name,
      description,
      premium,
      coverageAmount,
    });

    res.status(201).json({
      message: "Policy product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Policy Product Error:", error);
    res.status(500).json({ message: "Server error" });
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
    const { name, description, premium, coverageAmount } = req.body;

    const updatedProduct = await PolicyProduct.findByIdAndUpdate(
      id,
      { name, description, premium, coverageAmount },
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
    res.status(500).json({ message: "Server error" });
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
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Purchase a Policy (Customer)
 */
export const purchasePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const {  termMonths, nominee } = req.body;

    // Check if product exists
    const product = await PolicyProduct.findById(policyId);
    if (!product) {
      return res.status(404).json({ message: "Policy product not found" });
    }
    const startDate = Date.now();
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth()+(termMonths || product.termMonths))
    // Create a Policy document for this customer
    const userPolicy = await UserPolicy.create({
      userId: req.user.id,
      policyProductId: policyId,
      startDate,
      endDate,
      premiumPaid: product.premium,
      nominee,
      status: "ACTIVE",
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Policy purchased successfully",
      policy: userPolicy,
    });
  } catch (error) {
    // console.error("Purchase Policy Error:", error);
    res.status(500).json({ message: "Server error"+error });
  }
};
