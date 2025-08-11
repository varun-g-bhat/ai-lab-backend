import { body } from "express-validator";

export const validateDiscussion = () => {
    return [
      body('title')
        .notEmpty()
        .withMessage('Title is required'),
      body('description')
        .notEmpty()
        .withMessage('Description is required'),
      body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array of strings'),
      body('tags.*')
        .optional()
        .isString()
        .withMessage('Each tag must be a string')
    ];
  };
  

export const replyValidation = () => {
    return [
      body('reply')
        .notEmpty()
        .withMessage('Reply content is required'),
    ];
  };
  