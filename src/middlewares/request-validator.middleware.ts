import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const requestValidator = [
  // Check that `user` is an object
  body("user").isObject().withMessage("User must be an object"),
  // Validate properties within `user`
  body("user.id")
    .exists()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string"),
  body("user.email")
    .exists()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("user.firstName")
    .exists()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string"),
  body("urls").isArray().withMessage("URLs must be a string array"),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
