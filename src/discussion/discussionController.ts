import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/auth";
import discussionModel from "./discussionModel";
import createHttpError from "http-errors";
import { io } from "../app";

const createDiscussion = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const _req = req as AuthRequest;
        const newDiscussion = await discussionModel.create({...req.body,author:_req.userId});

        const populatedDiscussion = await newDiscussion.populate('author','userDetails')
        io.emit('newQuestion', populatedDiscussion);
        res.json({message:"Created discussion successfully", discussion: newDiscussion})

    } catch (error) {
        return next(createHttpError(500, "Error while creating a discussion"));
    }
};


const fetchDiscussion = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const discussion = await discussionModel.find().populate('author','userDetails').populate({
            path: 'replies.author',
            select: 'userDetails'
        }).exec();
        res.status(200).json(discussion)
    } catch (error) {
        return next(createHttpError(500, "Error fetching the discussions"));
    }
};

const createreply = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.params.id;

        const _req = req as AuthRequest;

        const discussion = await discussionModel.findOne({_id:id});

        if(!discussion){
            return next(createHttpError(404, "Discussion not found"));
        }

        discussion.replies.push({...req.body,author:_req.userId});
        await discussion.save();

        const replies = await discussionModel.find({_id:id}).populate('author','userDetails').populate({
            path: 'replies.author',
            select: 'userDetails'
        }).exec();

        io.emit('newReply', { questionId: id, reply: replies});
        res.status(201).json(discussion);
        
    } catch (error) {
        return next(createHttpError(500, "Error while adding reply to the discussion"));
    }
};

export {createDiscussion, fetchDiscussion, createreply}