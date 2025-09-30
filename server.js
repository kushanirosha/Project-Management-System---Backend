const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Connect to MongoDB ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("MongoDB Error ❌", err));

// ---------------- User Schema ----------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // should be hashed in production
  role: { type: String, enum: ["admin", "client"], default: "client" },
  avatar: String
});

const User = mongoose.model("User", userSchema);

// ---------------- Register Route ----------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      name,
      email,
      password, // TODO: hash in production
      role,
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
    });

    await newUser.save();

    res.json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- Login Route ----------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- Project Schema ----------------
const projectSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  category: { type: String, enum: ["web", "graphic"] },
  deadline: Date,
  status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  client: {
    name: String,
    email: String,
  },
  createdAt: { type: Date, default: Date.now },
  description: String,
  resources: {
    images: [String],
    documents: [String],
    links: [String],
  },
});

const Project = mongoose.model("Project", projectSchema);

// ---------------- Kanban Schema ----------------
const kanbanSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  stage: { type: String, enum: ["to do", "in progress", "done"], default: "to do" },
  resources: {
    images: [String],
    documents: [String],
    links: [String],
  },
  comments: [
    {
      text: String,
      user: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Kanban = mongoose.model("Kanban", kanbanSchema);

// ---------------- Create Project + Kanban ----------------
app.post("/api/projects", async (req, res) => {
  try {
    const { topic, description, resources, deadline, category, clientId } = req.body;

    if (!clientId) return res.status(400).json({ message: "Client ID is required" });

    const client = await User.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const projectId = `project-${Date.now()}`;

    // 1️⃣ Create Project
    const newProject = new Project({
      id: projectId,
      name: topic,
      category,
      deadline,
      status: "ongoing",
      clientId,
      client: { name: client.name, email: client.email },
      createdAt: new Date(),
      description,
      resources: resources || { images: [], documents: [], links: [] },
    });
    await newProject.save();
    console.log("✅ Project created:", projectId);

    // 2️⃣ Create Kanban for the project
    const newKanban = new Kanban({
      projectId,
      name: topic,
      description,
      stage: "to do",
      resources: {
        images: resources?.images || [],
        documents: resources?.documents || [],
        links: resources?.links || [],
      },
      comments: [],
      createdAt: new Date(),
    });
    const savedKanban = await newKanban.save();
    console.log("✅ Kanban created for project:", projectId);

    res.json({ project: newProject, kanban: savedKanban });
  } catch (err) {
    console.error("❌ Project creation error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ---------------- Client's Projects ----------------
app.get("/api/projects/client", async (req, res) => {
  try {
    const { clientId } = req.query;
    if (!clientId) return res.status(400).json({ message: "clientId query parameter is required" });

    const projects = await Project.find({ clientId: clientId.toString() });

    const formattedProjects = projects.map(p => ({
      ...p.toObject(),
      payments: [],
      tasks: p.tasks || [],
      messages: p.messages || []
    }));

    res.json(formattedProjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- All Projects for Admin ----------------
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();

    const projectsWithClients = await Promise.all(
      projects.map(async (p) => {
        const client = await User.findById(p.clientId).lean();
        return { ...p, client: client ? { name: client.name, email: client.email } : null };
      })
    );

    res.json(projectsWithClients);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Server ----------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
