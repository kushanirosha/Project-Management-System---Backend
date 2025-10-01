const Project = require("../models/Project");

exports.createProject = (projectData) => new Project(projectData).save();
exports.findProjectById = (id) => Project.findOne({ id });
exports.findProjectsByClient = (clientId) => Project.find({ clientId });
exports.findAllProjects = () => Project.find().sort({ createdAt: -1 });
