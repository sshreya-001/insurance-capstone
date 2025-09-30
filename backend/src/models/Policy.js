import mongoose from "mongoose";

const nomineeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
});

const policySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyProduct",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    termMonths: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
    },
    nominee: nomineeSchema,
    status: {
      type: String,
      enum: ["active", "expired", "terminated"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Auto-calculate endDate when saving
policySchema.pre("save", function (next) {
  if (this.startDate && this.termMonths) {
    const end = new Date(this.startDate);
    end.setMonth(end.getMonth() + this.termMonths);
    this.endDate = end;
  }
  next();
});

const Policy = mongoose.model("Policy", policySchema);

export default Policy;
