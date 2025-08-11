import mongoose from "mongoose";

export interface Resource {
  _id: string;
  title: string;
  description: string;
  author: mongoose.Schema.Types.ObjectId;
  tags: string[];
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}