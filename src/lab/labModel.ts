import mongoose from "mongoose";

interface LabDetails {
  title: string;
  description: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  sec: string;
  subject: string;
  labcode: string;
}

const labSchema = new mongoose.Schema<LabDetails>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    sec: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    labcode: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<LabDetails>("Lab", labSchema);
