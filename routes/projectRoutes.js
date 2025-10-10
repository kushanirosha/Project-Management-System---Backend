const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const kanbanController = require("../controllers/kanbanController");

// Projects
router.post("/", projectController.createProject);
router.get("/", projectController.getProjectsForAdmin);
router.get("/client", projectController.getProjectsByClient);

// Tasks
router.post("/:projectId/tasks", kanbanController.createTask);
router.get("/:projectId/tasks", kanbanController.getTasksByProject);

module.exports = router;
