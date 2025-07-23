const { param } = require("express-validator");

module.exports = [
    param("id")
        .isInt({ gt: 0 }).withMessage("User ID must be a positive integer")
]