
import path from "node:path";
import express from "express";
import multer from "multer";
import authenticate from "../middleware/authUser";
import { createResource, deleteResource, getSingleResource, listResources } from "./resourceController";

const resourceRouter = express.Router();


const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, 
});


resourceRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createResource
);
resourceRouter.get("/",listResources);
resourceRouter.get("/:resourceId", getSingleResource);
resourceRouter.delete("/:resourceId", authenticate, deleteResource);


export default resourceRouter;
