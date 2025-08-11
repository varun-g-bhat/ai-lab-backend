import mongoose from "mongoose";

interface SolvedQuestion {
  questionId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  labId: mongoose.Schema.Types.ObjectId;
  solvedAt: Date;
}

const solvedQuestionSchema = new mongoose.Schema<SolvedQuestion>(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
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
    solvedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<SolvedQuestion>(
  "SolvedQuestion",
  solvedQuestionSchema
);
