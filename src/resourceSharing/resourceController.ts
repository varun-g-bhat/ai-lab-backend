import path from "node:path";
import fs from "node:fs";
import { Request, Response, NextFunction } from "express";
import resourceModel from "./resourceModel";
import { AuthRequest } from "../types/auth";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";


const createResource = async (req: Request, res: Response, next: NextFunction) => {
    const { title, tags, description } = req.body;

    console.log(req.body)


    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files.coverImage || !files.file) {
        return next(createHttpError(400, "Cover image or resource file is missing."));
    }

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
    );

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "resource-covers",
            format: coverImageMimeType,
        });

        const resourceFileName = files.file[0].filename;
        const resourceFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            resourceFileName
        );

        const resourceFileUploadResult = await cloudinary.uploader.upload(
            resourceFilePath,
            {
                resource_type:"raw",
                filename_override: resourceFileName,
                folder: "resource-pdfs",
                format: "pdf",
            }
        );
        const _req = req as AuthRequest;

        const newresource = await resourceModel.create({
            title,
            description,
            tags,
            author: _req.userId,
            coverImage: uploadResult.secure_url,
            file: resourceFileUploadResult.secure_url,
        });

        await fs.promises.unlink(filePath);
        await fs.promises.unlink(resourceFilePath);

        res.status(201).json({ message:"Resource uploaded successfully!", id: newresource._id});
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "Error while uploading the files."));
    }
};



const listResources = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const resource = await resourceModel.find().populate("author", "userDetails");
        res.json(resource);
    } catch (err) {
        return next(createHttpError(500, "Error while getting a resource"));
    }
};

const getSingleResource = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const resourceId = req.params.resourceId;

    try {
        const resource = await resourceModel
            .findOne({ _id: resourceId })
            .populate("author", "userDetails");
        if (!resource) {
            return next(createHttpError(404, "resource not found."));
        }

        return res.json(resource);
    } catch (err) {
        return next(createHttpError(500, "Error while getting a resource"));
    }
};

const deleteResource = async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = req.params.resourceId;

    const resource = await resourceModel.findOne({ _id: resourceId });
    if (!resource) {
        return next(createHttpError(404, "resource not found"));
    }
  
    const _req = req as AuthRequest;
    console.log(resource.author.toString(),_req.userId)
    if (resource.author.toString() !== _req.userId) {
        return next(createHttpError(403, "You can not update others resource."));
    }

    const coverFileSplits = resource.coverImage.split("/");
    const coverImagePublicId =
        coverFileSplits.at(-2) +
        "/" +
        coverFileSplits.at(-1)?.split(".").at(-2);

    const resourceFileSplits = resource.file.split("/");
    const resourceFilePublicId =
        resourceFileSplits.at(-2) + "/" + resourceFileSplits.at(-1);
  

    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(resourceFilePublicId, {
        resource_type: "raw",
    });

    await resourceModel.deleteOne({ _id: resourceId });

    res.status(204).json({message:"Resource deleted successfully!"});
};

export { createResource, listResources, getSingleResource, deleteResource };