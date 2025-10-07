const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const kanbanController = require("../controllers/kanbanController");
const projectStatusController = require("../controllers/projectStatusController");

// Projects
router.post("/", projectController.createProject);
router.get("/", projectController.getProjectsForAdmin);
router.get("/client", projectController.getProjectsByClient);

// Tasks
router.post("/:projectId/tasks", kanbanController.createTask);
router.get("/:projectId/tasks", kanbanController.getTasksByProject);
router.get("/:projectId/status", projectStatusController.getProjectStatus);

module.exports = router;
