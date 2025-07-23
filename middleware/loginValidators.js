const { body } = require('express-validator');

module.exports = [
    body("email")
        .exists({ checkFalsy: true }).withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail({ all_lowercase: true }),
    body("password")
        .exists({ checkFalsy: true }).withMessage("Password is required")
];