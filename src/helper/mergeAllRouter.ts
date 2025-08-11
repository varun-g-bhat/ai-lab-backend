import express from "express";
import { teacherDashboard } from "./mergeAll";

const mergeAllRouter = express.Router();

mergeAllRouter.get("/teacher-dashboard", teacherDashboard);

export default mergeAllRouter;
