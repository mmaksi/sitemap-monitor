"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.requestValidator = void 0;
const express_validator_1 = require("express-validator");
exports.requestValidator = [
    // Check that `user` is an object
    (0, express_validator_1.body)("user").isObject().withMessage("User must be an object"),
    // Validate properties within `user`
    (0, express_validator_1.body)("user.id")
        .exists()
        .withMessage("User ID is required")
        .isString()
        .withMessage("User ID must be a string"),
    (0, express_validator_1.body)("user.email")
        .exists()
        .withMessage("User email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("user.firstName")
        .exists()
        .withMessage("First name is required")
        .isString()
        .withMessage("First name must be a string"),
    (0, express_validator_1.body)("urls").isArray().withMessage("URLs must be a string array"),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
