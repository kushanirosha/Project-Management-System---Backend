const projectService = require("../services/projectService");

exports.createProject = async (req, res) => {
  try {
    const result = await projectService.createProjectWithInitialTask(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectsForAdmin = async (req, res) => {
  try {
    const projects = await projectService.getProjectsForAdmin();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectsByClient = async (req, res) => {
  try {
    const { clientId } = req.query;
    if (!clientId) return res.status(400).json({ message: "clientId is required" });
    const projects = await projectService.getProjectsByClient(clientId);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
