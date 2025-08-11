import express from "express";
import validate from "../middleware/validate";
import { createDiscussion, createreply, fetchDiscussion } from "./discussionController";
import { replyValidation, validateDiscussion } from "../validator/discussionValidator";
import authenticate from "../middleware/authUser";



const discussionRouter = express.Router();

// Discussion Routes
discussionRouter.post("/",validateDiscussion(),validate,authenticate,createDiscussion);
discussionRouter.get("/",fetchDiscussion);
discussionRouter.post("/:id/replies",replyValidation(),validate,authenticate,createreply);


export default discussionRouter;
