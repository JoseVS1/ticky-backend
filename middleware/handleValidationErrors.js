const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            message: err.msg,
            param: err.param,
            location: err.location,
            value: err.value
        }));

        return res.status(400).json({ errors: formattedErrors });
    }
    next();
};