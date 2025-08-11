import express from "express";
import { fetchContent, fetchRoadmap, fetchRoadmapById, generate_Roadmap, generate_content } from "./aiTutorControllers";
import authenticate from "../middleware/authUser";


const aiTutorRouter = express.Router();

// Ai Tutor Routes
aiTutorRouter.post("/roadmap/:topic",authenticate,generate_Roadmap);
aiTutorRouter.get("/roadmap",authenticate,fetchRoadmap);
aiTutorRouter.get("/roadmap/:id",authenticate,fetchRoadmapById);
aiTutorRouter.post("/generatecontent",authenticate,generate_content);
aiTutorRouter.get("/getcontent/:id",authenticate,fetchContent);

export default aiTutorRouter;
