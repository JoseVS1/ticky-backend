const express = require("express");
const todoController = require("../controllers/todoController");
const authenticateToken = require("../middleware/authenticateToken");
const validateId = require("../middleware/validateId");
const handleValidationErrors = require("../middleware/handleValidationErrors");
const todoValidators = require("../middleware/todoValidators");

const todoRouter = express.Router();

todoRouter.get("/", authenticateToken, todoController.getTodos);
todoRouter.get("/:id", authenticateToken, validateId, handleValidationErrors, todoController.getTodo);
todoRouter.post("/", authenticateToken, todoValidators, handleValidationErrors, todoController.createTodo);
todoRouter.put("/:id", authenticateToken, validateId, todoValidators, handleValidationErrors, todoController.updateTodo);
todoRouter.delete("/:id", authenticateToken, validateId, handleValidationErrors, todoController.deleteTodo);

module.exports = todoRouter;