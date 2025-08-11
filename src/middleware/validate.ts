import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";
import createHttpError from 'http-errors';


const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: { [x: string]: string; }[] = [];
  errors.array().map(err => extractedErrors.push({ [err.type]: err.msg }));
  console.log(extractedErrors[0])
  return next(createHttpError(422, extractedErrors[0].field));
};

export default validate;
