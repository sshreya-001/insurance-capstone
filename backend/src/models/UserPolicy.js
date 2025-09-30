import mongoose from "mongoose";

const userPolicySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    policyProductId: { type: mongoose.Schema.Types.ObjectId, ref: "PolicyProduct", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    premiumPaid: { type: Number, required: true },
    status: { type: String, enum: ["ACTIVE", "CANCELLED", "EXPIRED"], default: "ACTIVE" },
    assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    nominee: {
      name: { type: String },
      relation: { type: String },
    },
  },
  { timestamps: true }
);

const UserPolicy = mongoose.model("UserPolicy", userPolicySchema);
export default UserPolicy;
