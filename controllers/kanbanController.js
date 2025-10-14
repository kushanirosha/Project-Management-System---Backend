const Kanban = require("../models/Kanban");
const kanbanService = require("../services/kanbanService");

exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Parse form-data fields
    const title = req.body.title;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const description = req.body.description || "";
    const stage = req.body.stage || "to do";

    // Parse links
    let links = [];
    if (req.body.links) {
      try {
        links = JSON.parse(req.body.links);
        if (!Array.isArray(links)) links = [links];
      } catch {
        links = [req.body.links];
      }
    }

    // Files
    const images = req.files?.images?.map(f => `/uploads/${f.filename}`) || [];
    const documents = req.files?.documents?.map(f => `/uploads/${f.filename}`) || [];

    const task = await Kanban.create({
      projectId,
      title,
      description,
      stage,
      resources: { images, documents, links },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ message: "Server error creating task" });
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

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await kanbanService.getTasksByProject(req.params.projectId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
