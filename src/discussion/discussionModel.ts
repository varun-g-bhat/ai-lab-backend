import mongoose, { Document, Schema } from "mongoose";


const replySchema = new mongoose.Schema({
    reply: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
},
{ timestamps: true })


const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Discussion", questionSchema);
