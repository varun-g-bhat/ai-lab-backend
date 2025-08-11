import express, { NextFunction, Request, Response } from "express";
import labModel from "./labModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../types/auth";
import randomstring from "randomstring";
import enrolledModel from "./enrolledModel";

const createLab = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, sec, subject } = req.body;
  const _req = req as AuthRequest;

  console.log("body", req.body);

  if (!title || !description || !sec || !subject) {
    return next(createHttpError(400, "All fields are required"));
  }
  const labCode = randomstring.generate({
    length: 10,
    charset: "alphabetic",
  });

  console.log("_req", _req);
  try {
    const lab = await labModel.create({
      title,
      description,
      sec,
      subject,
      labcode: labCode,
      createdBy: _req.userId,
    });
    res.status(201).json(lab);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error while creating lab"));
  }
};

const getLabById = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest;

  try {
    const lab = await labModel.findOne({ createdBy: _req.userId });
    if (!lab) {
      return next(createHttpError(404, "Lab not found"));
    }
    res.status(200).json(lab);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching lab details"));
  }
};

const requestEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { labId } = req.body;
  const _req = req as AuthRequest;

  if (!labId) {
    return next(createHttpError(400, "Lab ID is required"));
  }

  try {
    const enrollment = await enrolledModel.create({
      userId: _req.userId,
      labId,
      status: "requested",
    });
    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error requesting enrollment"));
  }
};

const changeEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { enrollmentId, status } = req.body;
  const _req = req as AuthRequest;
  if (!enrollmentId) {
    return next(createHttpError(400, "Enrollment ID is required"));
  }
  try {
    const enrollment = await enrolledModel.findByIdAndUpdate(
      enrollmentId,
      { status },
      { new: true }
    );
    if (!enrollment) {
      return next(createHttpError(404, "Enrollment not found"));
    }
    res.status(200).json(enrollment);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error approving enrollment"));
  }
};

const getAllEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;

  try {
    const lab = await labModel.findOne({ createdBy: _req.userId });

    if (!lab) {
      return next(createHttpError(404, "Lab not found"));
    }

    const enrollments = await enrolledModel.find({ labId: lab._id });

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({ message: "No enrollments found" });
    }

    res.status(200).json(enrollments);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching enrollments"));
  }
};

const getEnrolledLabs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;

  try {
    const enrollments = await enrolledModel.find({ userId: _req.userId });
    const labIds = enrollments.map((enrollment) => enrollment.labId);
    const labs = await labModel.find({ _id: { $in: labIds } });
    res.status(200).json(labs);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching enrolled labs"));
  }
};

const getAllLabs = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest;

  try {
    const labs = await labModel.find();
    res.status(200).json(labs);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching labs"));
  }
};

const getLabCreatedBy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;

  try {
    const labs = await labModel.find({ createdBy: _req.userId });
    if (!labs || labs.length === 0) {
      return next(createHttpError(404, "No labs found"));
    }
    res.status(200).json(labs);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching lab details"));
  }
};

const getLabCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;
  const { labId } = req.body;

  try {
    const lab = await labModel.findOne({ _id: labId });
    if (!lab) {
      return next(createHttpError(404, "Lab not found"));
    }

    res.status(200).json(lab.createdBy);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching lab creator"));
  }
};

export {
  createLab,
  getLabById,
  requestEnrollment,
  changeEnrollment,
  getAllEnrollments,
  getEnrolledLabs,
  getAllLabs,
  getLabCreatedBy,
  getLabCreator,
};
