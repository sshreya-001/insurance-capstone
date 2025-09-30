import express from "express";
import { submitClaim, reviewClaim, getClaims, getClaimDetails } from "../controllers/claim.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Customer: submit claim
router.post("/", authMiddleware.requiredAuth, submitClaim);

// Agent/Admin: review claim
router.put("/:id/status", authMiddleware.requiredAuth, reviewClaim);

// Get all claims (role-based)
router.get("/", authMiddleware.requiredAuth, getClaims);

// Get claim details by ID
router.get("/:id", authMiddleware.requiredAuth, getClaimDetails);

export default router;
