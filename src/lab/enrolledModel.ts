import mongoose from "mongoose";

interface EnrolledDetails {
  userId: mongoose.Schema.Types.ObjectId;
  labId: mongoose.Schema.Types.ObjectId;
  status: "requested" | "approved" | "rejected";
}

const enrolledSchema = new mongoose.Schema<EnrolledDetails>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected"],
      default: "requested",
    },
  },
  { timestamps: true }
);

export default mongoose.model<EnrolledDetails>("EnrolledModel", enrolledSchema);
