const { body } = require("express-validator");

module.exports = [
    body("title")
        .exists({ checkFalsy: true }).withMessage("Title is required").bail()
        .trim()
        .escape(),
    body("description")
        .trim()
        .escape()
        .optional()
];