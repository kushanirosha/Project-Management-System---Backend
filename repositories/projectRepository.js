const Project = require("../models/Project");

exports.createProject = (projectData) => new Project(projectData).save();
exports.findProjectById = (id) => Project.findOne({ id });
exports.findProjectsByClient = (clientId) => Project.find({ clientId });
exports.findAllProjects = () => Project.find().sort({ createdAt: -1 });

exports.updateProject = (projectId, updateData) => {
  return Project.findOneAndUpdate({ id: projectId }, updateData, { new: true });
};
