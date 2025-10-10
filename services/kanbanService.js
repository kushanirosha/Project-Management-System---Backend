const kanbanRepo = require("../repositories/kanbanRepository");

exports.createTask = (taskData) => kanbanRepo.createTask(taskData);
exports.updateTask = (taskId, updates) => kanbanRepo.updateTask(taskId, updates);
exports.getTasksByProject = (projectId) => kanbanRepo.getTasksByProject(projectId);

exports.addCommentToTask = async (taskId, comment) => {
  const task = await kanbanRepo.findTaskById(taskId);
  if (!task) throw new Error("Task not found");
  task.comments.push(comment);
  await task.save();
  return comment;
};
