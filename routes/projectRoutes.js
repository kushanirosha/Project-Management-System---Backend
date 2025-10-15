const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Project routes
router.post("/", projectController.createProject);
router.get("/", projectController.getProjectsForAdmin);
router.get("/client", projectController.getProjectsByClient);
router.put("/:projectId", projectController.updateProjectStatus);
router.get("/:projectId", projectController.getProjectById);

module.exports = router;
