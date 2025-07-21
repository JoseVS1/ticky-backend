const express = require("express");
const tagController = require("../controllers/tagController");

const tagRouter = express.Router();

tagRouter.get("/", tagController.getTags);
tagRouter.post("/", tagController.createTag);
tagRouter.delete("/:id", tagController.deleteTag);


module.exports = tagRouter;