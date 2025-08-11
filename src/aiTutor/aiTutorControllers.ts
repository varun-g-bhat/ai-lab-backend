import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import axios from "axios";
import { config } from "dotenv";
import roadmapModel from "./roadmapModel";
import { AuthRequest } from "../types/auth";
import contentModel from "./contentModel";

config();

const generate_Roadmap = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _req = req as AuthRequest;
    const { topic } = req.params;
    const response = await axios.post(
      `${process.env.PYTHON_BACKEND_URL}/aitutor/roadmap`,
      {},
      {
        params: {
          topic,
        },
      }
    );
    const roadmap = await roadmapModel.create({
      ...response.data,
      userId: _req.userId,
    });
    res.send(roadmap);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while creating a roadmap"));
  }
};

const fetchRoadmap = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _req = req as AuthRequest;
    const roadmap = await roadmapModel.find({ userId: _req.userId });
    res.status(200).json(roadmap);
  } catch (error) {
    return next(createHttpError(500, "Error fetching the roadmap"));
  }
};

const fetchRoadmapById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const roadmap = await roadmapModel.findOne({ _id: id });
    res.status(200).json(roadmap);
  } catch (error) {
    return next(createHttpError(500, "Error fetching the roadmap"));
  }
};

const generate_content = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, roadMapId } = req.body;
    console.log(req.body);
    const _req = req as AuthRequest;
    const content = await contentModel.findOne({ lessonId: _id });

    if (!content) {
      const response = await axios.post(
        `${process.env.PYTHON_BACKEND_URL}/aitutor/roadmap/generatecontent`,
        req.body
      );
      const createContent = await contentModel.create({
        roadMapId: roadMapId,
        lessonId: _id,
        content: response.data.content,
        userId: _req.userId,
      });
      console.log(response.data.content);
      return res.status(200).json(createContent);
    }

    res.status(200).json(content);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error generating the content"));
  }
};

const fetchContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const content = await contentModel.findOne({ _id: id });
    res.status(200).json(content);
  } catch (error) {
    return next(createHttpError(500, "Error fetching the roadmap"));
  }
};

export {
  generate_Roadmap,
  fetchRoadmap,
  fetchRoadmapById,
  generate_content,
  fetchContent,
};
