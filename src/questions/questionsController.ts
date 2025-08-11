import express, { Request, Response, NextFunction } from "express";
import questionsModel from "./questionsModel";
import createHttpError from "http-errors";
import solvedModel from "./solvedModel";
import { AuthRequest } from "../types/auth";

const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, labId, exInput, exOutput } = req.body;
  try {
    const newQuestion = await questionsModel.create({
      title,
      description,
      labId,
      exInput,
      exOutput,
    });
    if (!newQuestion) {
      return next(createHttpError(400, "Failed to create question"));
    }

    res.status(201).json(newQuestion);
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, description, exInput, exOutput } = req.body;

  try {
    const updatedQuestion = await questionsModel.findByIdAndUpdate(
      id,
      { title, description, exInput, exOutput },
      { new: true }
    );

    if (!updatedQuestion) {
      return next(createHttpError(404, "Question not found"));
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await questionsModel.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return next(createHttpError(404, "Question not found"));
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getQuestionByLabId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { labId } = req.params;

  try {
    const questions = await questionsModel.find({ labId });
    if (!questions || questions.length === 0) {
      return next(createHttpError(404, "No questions found for this lab"));
    }

    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

const questionSolved = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { questionId } = req.body;

  const _req = req as AuthRequest;
  try {
    const question = await questionsModel.findById(questionId);

    const labId = question?.labId;
    const existingSolved = await solvedModel.findOne({
      questionId,
      userId: _req.userId,
      labId,
    });

    if (existingSolved) {
      await solvedModel.updateOne(
        { _id: existingSolved._id },
        { solvedAt: new Date() }
      );

      return res.status(201).json(existingSolved);
    }

    if (!questionId || !_req.userId) {
      return next(createHttpError(400, "Question ID and User ID are required"));
    }

    const solvedQuestion = await solvedModel.create({
      questionId,
      userId: _req.userId,
      labId,
      solvedAt: new Date(),
    });

    res.status(201).json(solvedQuestion);
  } catch (error) {
    next(error);
  }
};

const getQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const question = await questionsModel.findById(id);
    if (!question) {
      return next(createHttpError(404, "Question not found"));
    }

    const data = {
      title: question.title,
      description: question.description,
      exInput: question.exInput,
      exOutput: question.exOutput,
    };

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestionByLabId,
  questionSolved,
};
