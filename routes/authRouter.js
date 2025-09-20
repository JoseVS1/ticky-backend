const express = require("express");
const authController = require("../controllers/authController");
const handleValidationErrors = require("../middleware/handleValidationErrors");
const signupValidators = require("../middleware/signupValidators");
const loginValidators = require("../middleware/loginValidators");
const authenticateToken = require("../middleware/authenticateToken");

const authRouter = express.Router();

authRouter.post("/signup", signupValidators, handleValidationErrors, authController.signup);
authRouter.post("/login", loginValidators, handleValidationErrors, authController.login);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/logout", authenticateToken, authController.logout);

module.exports = authRouter;