const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("MongoDB Error ❌", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // should be hashed in production
  role: { type: String, enum: ["admin", "client"], default: "client" },
  avatar: String
});

const User = mongoose.model("User", userSchema);

// Register Route
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

// Login Route
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

// Project Schema
const projectSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  category: { type: String, enum: ["web", "graphic"] },
  deadline: Date,
  status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
  clientId: String,
  createdAt: { type: Date, default: Date.now },
  description: String,
  resources: {
    images: [String],
    documents: [String],
    links: [String],
  },
});

const Project = mongoose.model("Project", projectSchema);

// Create Project
app.post("/api/projects", async (req, res) => {
  try {
    const { topic, description, resources, deadline, category, clientId } = req.body;

    if (!clientId) return res.status(400).json({ message: "Client ID is required" });

    const newProject = new Project({
      id: `project-${Date.now()}`,
      name: topic,
      category,
      deadline,
      status: "ongoing",
      clientId,
      createdAt: new Date(),
      description,
      resources,
    });

    await newProject.save();
    res.json(newProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Projects for a Client
app.get("/api/projects", async (req, res) => {
  try {
    const { clientId } = req.query;
    if (!clientId) return res.status(400).json({ message: "clientId query parameter is required" });

    const projects = await Project.find({ clientId: clientId.toString() });

    // Add payments field as empty array if not present
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

app.get('/api/projects', async (req, res) => {
  try {
    // Fetch all projects (admin view)
    const projects = await Project.find().sort({ createdAt: -1 }); // sort newest first
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
