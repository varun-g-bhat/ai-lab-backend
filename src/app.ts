import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRouter from "./auth/authRoutes";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import aiTutorRouter from "./aiTutor/aiTutorRoutes";
import resourceRouter from "./resourceSharing/resourceRoute";
import compileRouter from "./codeCompiler/codeCompilerRoutes";
import labRouter from "./lab/labRoutes";
import questionsRouter from "./questions/questionsRouter";
import mergeAllRouter from "./helper/mergeAllRouter";

config();

const app = express();

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//   },
// });

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to AI Lab Companion Express Backend - Developed By MY3S",
  });
});

app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/discussion", discussionRouter);
app.use("/api/v1/ai-tutor", aiTutorRouter);
app.use("/api/v1/resource", resourceRouter);
app.use("/api/v1/compiler", compileRouter);
app.use("/api/v1/lab", labRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/merge-all", mergeAllRouter);

app.use(globalErrorHandler);

export { server };

