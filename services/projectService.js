const projectRepo = require("../repositories/projectRepository");
const userRepo = require("../repositories/userRepository");
const kanbanRepo = require("../repositories/kanbanRepository");

/*Create project with initial task*/
exports.createProjectWithInitialTask = async ({ topic, description, resources, deadline, category, clientId }) => {
  if (!clientId) throw new Error("Client ID is required");

  const client = await userRepo.findUserById(clientId);
  if (!client) throw new Error("Client not found");

  const projectId = `project-${Date.now()}`;

  const project = await projectRepo.createProject({
    id: projectId,
    name: topic,
    category,
    deadline,
    status: "ongoing",
    clientId, // keep reference
    createdAt: new Date(),
    description,
    resources: resources || { images: [], documents: [], links: [] },
  });

  const task = await kanbanRepo.createTask({
    projectId,
    title: `${topic} - Initial Task`,
    description: description || "Initial project setup task",
    stage: "to do",
    resources: resources || { images: [], documents: [], links: [] },
    comments: [],
  });

  // Attach client info to project for frontend convenience
  return { project: { ...project.toObject(), client: client.toObject() }, task };
};

/*Get all projects for admin, including full client details*/
exports.getProjectsForAdmin = async () => {
  const projects = await projectRepo.findAllProjects();

  return Promise.all(
    projects.map(async (p) => {
      const client = await userRepo.findUserById(p.clientId);
      return { ...p.toObject(), client: client ? client.toObject() : null };
    })
  );
};

/* Get projects by client*/
exports.getProjectsByClient = async (clientId) => {
  const projects = await projectRepo.findProjectsByClient(clientId);

  return Promise.all(
    projects.map(async (p) => {
      const client = await userRepo.findUserById(p.clientId);
      return { ...p.toObject(), client: client ? client.toObject() : null };
    })
  );
};
