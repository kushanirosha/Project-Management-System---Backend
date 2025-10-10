const express = require("express");
const router = express.Router();
const kanbanController = require("../controllers/kanbanController");

router.get("/project/:projectId", kanbanController.getTasksByProject); 
router.put("/:taskId", kanbanController.updateTask);
router.post("/:taskId/comments", kanbanController.addComment);

module.exports = router;
