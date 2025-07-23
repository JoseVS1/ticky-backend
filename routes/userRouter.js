const express = require("express");
const userController = require("../controllers/userController");
const validateUserId = require("../middleware/validateId");
const handleValidationErrors = require("../middleware/handleValidationErrors");

const userRouter = express.Router();

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", validateUserId, handleValidationErrors, userController.getUser);
userRouter.delete("/:id", validateUserId, handleValidationErrors, userController.deleteUser);

module.exports = userRouter;