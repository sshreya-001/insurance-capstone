import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import userPolicyRoutes from "./routes/userPolicy.routes.js";
import claimRoutes from "./routes/claim.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import auditMiddleware from "./middlewares/audit.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(auditMiddleware);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/policies", policyRoutes);
app.use("/api/v1/user/policies", userPolicyRoutes);
app.use("/api/v1/claims", claimRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/agents", agentRoutes);
app.use("/api/v1/admin", adminRoutes);

// Error handler
app.use(errorMiddleware);

export default app;
