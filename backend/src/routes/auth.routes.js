import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", authMiddleware.optionalAuth, register);
router.post("/login", login);

export default router;
