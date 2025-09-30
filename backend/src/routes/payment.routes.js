import express from "express";
import { makePayment, getMyPayments } from "../controllers/payment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Customer: make payment & view payments
router.post("/", authMiddleware.requiredAuth, makePayment);
router.get("/user", authMiddleware.requiredAuth, getMyPayments);

export default router;
