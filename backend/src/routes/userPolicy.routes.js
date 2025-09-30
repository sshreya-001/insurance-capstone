import express from "express";
import { buyPolicy, getMyPolicies } from "../controllers/userPolicy.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", authMiddleware.requiredAuth, buyPolicy);
router.get("/", authMiddleware.requiredAuth, getMyPolicies);

export default router;
