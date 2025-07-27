const { body } = require("express-validator");

module.exports = [
    body("name")
        .exists({ checkFalsy: true }).withMessage("Name is required")
        .trim()
        .escape()
];