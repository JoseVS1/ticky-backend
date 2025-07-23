const { param } = require("express-validator");

module.exports = [
    param("id")
        .isInt({ gt: 0 }).withMessage("ID must be a positive integer")
]