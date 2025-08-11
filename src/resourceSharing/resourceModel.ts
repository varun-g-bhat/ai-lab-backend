import mongoose from "mongoose";
import { Resource } from "../types/resourceSharing";

const resourceSchema = new mongoose.Schema<Resource>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            require: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        file: {
            type: String,
            requied: true,
        },
        tags: [{
            type: String,
            required: true,
        }],
    },
    { timestamps: true }
);

export default mongoose.model<Resource>("Resource", resourceSchema);