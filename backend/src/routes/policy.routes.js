// import express from "express";
// import {
//   createPolicyProduct,
//   listPolicyProducts,
//   updatePolicyProduct,
//   deletePolicyProduct,
// } from "../controllers/policyProduct.controller.js";

// import authMiddleware from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // Public: list policies
// router.get("/", listPolicyProducts);

// // Admin-only: CRUD
// router.post("/", authMiddleware.requiredAuth, createPolicyProduct);
// router.put("/:id", authMiddleware.requiredAuth, updatePolicyProduct);
// router.delete("/:id", authMiddleware.requiredAuth, deletePolicyProduct);

// export default router;




import express from "express";
import {
  createPolicyProduct,
  listPolicyProducts,
  updatePolicyProduct,
  deletePolicyProduct,
  purchasePolicy,
} from "../controllers/policyProduct.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: list all policies
router.get("/", listPolicyProducts);

// Admin-only: create/update/delete policy products
router.post("/", authMiddleware.requiredAuth, createPolicyProduct);
router.put("/:id", authMiddleware.requiredAuth, updatePolicyProduct);
router.delete("/:id", authMiddleware.requiredAuth, deletePolicyProduct);

// Customer: purchase a policy
router.post("/:policyId/purchase", authMiddleware.requiredAuth, purchasePolicy);

export default router;
