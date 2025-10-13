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

exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const project = await projectService.updateProjectStatus(projectId, status);

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectService.findProjectById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Optionally populate client info
    const client = await require("../repositories/userRepository").findUserById(project.clientId);
    res.json({ ...project.toObject(), client: client ? client.toObject() : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


