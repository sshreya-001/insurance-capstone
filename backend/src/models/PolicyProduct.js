import mongoose from "mongoose";

const policyProductSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    premium: { type: Number, required: true }, // unit: currency per term
    termMonths: { type: Number, required: true },
    minSumInsured: { type: Number, required: true },
  },
  { timestamps: true }
);

const PolicyProduct = mongoose.model("PolicyProduct", policyProductSchema);
export default PolicyProduct;
