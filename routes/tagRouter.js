const express = require("express");
const tagController = require("../controllers/tagController");
const authenticateToken = require('../middleware/authenticateToken');
const tagValidators = require("../middleware/tagValidators");
const validateId = require("../middleware/validateId");
const handleValidationErrors = require("../middleware/handleValidationErrors");

const tagRouter = express.Router();

tagRouter.get("/", authenticateToken, tagController.getTags);
tagRouter.post("/", authenticateToken, tagValidators, handleValidationErrors, tagController.createTag);
tagRouter.delete("/:id", authenticateToken, validateId, handleValidationErrors, tagController.deleteTag);


module.exports = tagRouter;