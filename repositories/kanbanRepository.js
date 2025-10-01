const Kanban = require("../models/Kanban");

exports.createTask = (taskData) => new Kanban(taskData).save();
exports.updateTask = (taskId, updates) => Kanban.findByIdAndUpdate(taskId, updates, { new: true });
exports.getTasksByProject = (projectId) => Kanban.find({ projectId });
exports.findTaskById = (taskId) => Kanban.findById(taskId);
