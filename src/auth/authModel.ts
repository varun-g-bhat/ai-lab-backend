import mongoose, { Document, Schema } from "mongoose";

interface UserDetails {
  name: string;
  profileUrl?: string;
  dob?: Date;
  role: "teacher" | "student" | "admin";
}

interface User extends Document {
  email: string;
  password: string;
  userDetails: UserDetails;
}

const userDetailSchema = new Schema<UserDetails>({
  name: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
  },
  dob: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["teacher", "student", "admin"],
    default: "student",
  },
});

const authSchema = new Schema<User>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userDetails: {
      type: userDetailSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<User>("User", authSchema);
