const kanbanService = require("../services/kanbanService");

exports.createTask = async (req, res) => {
  try {
    const task = await kanbanService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await kanbanService.updateTask(req.params.taskId, req.body);
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = await kanbanService.addCommentToTask(req.params.taskId, req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks for a project
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await kanbanService.getTasksByProject(req.params.projectId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};