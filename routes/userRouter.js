const express = require("express");
const userController = require("../controllers/userController");
const validateId = require("../middleware/validateId");
const handleValidationErrors = require("../middleware/handleValidationErrors");

const userRouter = express.Router();

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", validateId, handleValidationErrors, userController.getUser);
userRouter.delete("/:id", validateId, handleValidationErrors, userController.deleteUser);

module.exports = userRouter;