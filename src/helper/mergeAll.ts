import express, { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth";
import enrolledModel from "../lab/enrolledModel";
import createHttpError from "http-errors";
import solvedModel from "../questions/solvedModel";
import mongoose from "mongoose";
import authModel from "../auth/authModel";

const teacherDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;
  const { labId } = req.query;

  if (
    !labId ||
    typeof labId !== "string" ||
    !mongoose.Types.ObjectId.isValid(labId)
  ) {
    return next(createHttpError(400, "Invalid or missing labId"));
  }

  const labObjectId = new mongoose.Types.ObjectId(labId);

  try {
    const enrollers = await enrolledModel.find({
      labId: labId,
      status: "approved",
    });

    if (!enrollers || enrollers.length === 0) {
      return next(
        createHttpError(404, "No approved enrollers found for this lab")
      );
    }

    // Extract userIds of approved enrollers
    const userIds = enrollers.map((enroller) => enroller.userId);

    console.log("Approved enroller userIds:", userIds);

    // Perform an aggregation to count solved questions for each user
    const solvedQuestionCounts = await solvedModel.aggregate([
      {
        $match: {
          userId: { $in: userIds }, // Ensure userIds are properly matched as ObjectId
          labId: new mongoose.Types.ObjectId(labId), // Ensure labId is matched as ObjectId
        },
      },
      {
        $group: {
          _id: "$userId", // Group by userId
          solvedCount: { $sum: 1 }, // Count the number of solved questions
        },
      },
      {
        $project: {
          userId: "$_id", // Renaming _id to userId
          solvedCount: 1, // Include the solvedCount in the result
          _id: 0, // Exclude the _id field from the result
        },
      },
    ]);
    console.log("Solved Question Counts:", solvedQuestionCounts);

    // Updated query to fetch the nested userDetails.name field
    const users = await authModel.find(
      { _id: { $in: userIds } },
      { _id: 1, "userDetails.name": 1, email: 1 } // Fetch nested name field
    );

    // Debug: Log userIds and fetched users
    console.log("userIds:", userIds);
    console.log("Fetched users:", users);

    // Create a map of userId to username (access nested userDetails.name)
    const userIdToUsername: Record<string, string> = {};
    users.forEach((u) => {
      const id = (u as any)._id?.toString?.() || "";
      let name = (u as any).userDetails?.name; // Access nested name
      if (!name) name = (u as any).email; // Fallback to email if name is missing
      userIdToUsername[id] = name || null;
    });

    // Debug: Log the userIdToUsername map
    console.log("userIdToUsername map:", userIdToUsername);

    // Attach username to each solvedQuestionCounts entry
    const solvedWithNames = solvedQuestionCounts.map((user) => {
      const key = user.userId?.toString?.() || "";
      const foundUsername = userIdToUsername[key] || null;
      if (!foundUsername) {
        console.warn(`No username found for userId: ${key}`);
      }
      return {
        ...user,
        username: foundUsername,
      };
    });

    // Debug: Log the final solvedWithNames array
    console.log("solvedWithNames:", solvedWithNames);
    res.status(200).json(solvedWithNames);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching labs"));
  }
};

export { teacherDashboard };
