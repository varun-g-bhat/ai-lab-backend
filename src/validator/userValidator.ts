import { body } from 'express-validator';

const userValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('userDetails.name')
      .notEmpty()
      .withMessage('Name is required'),
    body('userDetails.profileUrl')
      .optional()
      .isURL()
      .withMessage('Must be a valid URL'),
    body('userDetails.dob')
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('Must be a valid date')
  ];
};

export default userValidationRules;
