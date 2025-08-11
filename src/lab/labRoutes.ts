import express from "express";
import {
  createLab,
  getLabById,
  requestEnrollment,
  changeEnrollment,
  getAllEnrollments,
  getEnrolledLabs,
  getAllLabs,
  getLabCreatedBy,
} from "./labController";
import authenticate from "../middleware/authUser";
import { get } from "http";

const labRouter = express.Router();

labRouter.post("/create", authenticate, createLab);
labRouter.get("/", authenticate, getLabById);
labRouter.post("/enroll", authenticate, requestEnrollment);
labRouter.put("/enrollment/change", authenticate, changeEnrollment);
labRouter.get("/enrollments", authenticate, getAllEnrollments);
labRouter.get("/enrolled", authenticate, getEnrolledLabs);
labRouter.get("/all", authenticate, getAllLabs);
labRouter.get("/created", authenticate, getLabCreatedBy);

export default labRouter;
