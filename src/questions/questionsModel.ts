import mongoose from "mongoose";

interface Question {
  title: string;
  description: string;
  labId: mongoose.Schema.Types.ObjectId;
  exInput: string;
  exOutput: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new mongoose.Schema<Question>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
    exInput: { type: String, required: true },
    exOutput: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Question>("Question", questionSchema);
