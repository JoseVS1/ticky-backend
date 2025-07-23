const express = require("express");
const authController = require("../controllers/authController");
const { body } = require("express-validator");
const validate = require("../middleware/handleValidationErrors");

const authRouter = express.Router();

const signupValidators = [
    body("email")
        .exists({ checkFalsy: true }).withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail({ all_lowercase: true }),
    body("password")
        .exists({ checkFalsy: true }).withMessage("Password is required").bail()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long").bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/).withMessage("Password must include uppercase, lowercase, number, and special character."),
    body("confirmPassword")
        .exists({ checkFalsy: true }).withMessage("Confirm password is required").bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
            }),
    body("name")
        .trim()
        .escape()
        .optional()
        .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters").bail()
        .matches(/^[\p{L}\p{N}_-]+$/u).withMessage("Username can only contain letters, numbers, underscores, or hyphens")
];

const loginValidators = [
    body("email")
        .exists({ checkFalsy: true }).withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail({ all_lowercase: true }),
    body("password")
        .exists({ checkFalsy: true }).withMessage("Password is required")
];

authRouter.post("/signup", signupValidators, validate, authController.signup);
authRouter.post("/login", loginValidators, validate, authController.login);

module.exports = authRouter;