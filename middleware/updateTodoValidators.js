const { body } = require("express-validator");

module.exports = [
    body("title")
        .trim()
        .escape(),
    body("description")
        .trim()
        .escape()
        .optional()
];