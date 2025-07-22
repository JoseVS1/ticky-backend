const express = require("express");
const todoController = require("../controllers/todoController");
const authenticateToken = require("../middleware/authenticateToken");

const todoRouter = express.Router();

todoRouter.get("/", todoController.getTodos);
todoRouter.get("/:id", todoController.getTodo);
todoRouter.post("/", authenticateToken, todoController.createTodo);
todoRouter.put("/:id", todoController.updateTodo);
todoRouter.delete("/:id", todoController.deleteTodo);

module.exports = todoRouter;