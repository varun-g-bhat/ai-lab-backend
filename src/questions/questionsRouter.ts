import express from "express";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionByLabId,
  questionSolved,
  getQuestionById,
} from "./questionsController";
import authenticate from "../middleware/authUser";

const questionsRouter = express.Router();

questionsRouter.post("/create", authenticate, createQuestion);
questionsRouter.put("/update/:id", authenticate, updateQuestion);
questionsRouter.delete("/delete/:id", authenticate, deleteQuestion);
questionsRouter.get("/lab/:labId", authenticate, getQuestionByLabId);
questionsRouter.post("/solve", authenticate, questionSolved);
questionsRouter.get("/:id", authenticate, getQuestionById);

export default questionsRouter;
