const Kanban = require("../models/Kanban");

exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const title = req.body.title;
    const description = req.body.description || "";
    const stage = req.body.stage || "to do";
    const links = req.body.links ? JSON.parse(req.body.links) : [];

    if (!title) return res.status(400).json({ message: "Title is required" });

    // ✅ Store files & links inside `resources`
    const newTask = new Kanban({
      projectId,
      title,
      description,
      stage,
      resources: {
        images: req.files?.images?.map((file) => file.filename) || [],
        documents: req.files?.documents?.map((file) => file.filename) || [],
        links: links,
      },
      comments: [],
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("❌ Server error creating task:", err);
    res.status(500).json({ message: "Server error creating task", error: err });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Kanban.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const task = await Kanban.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Match frontend data
    const comment = {
      author: req.body.author || "unknown",
      content: req.body.content || "",
      type: req.body.type || "comment",
      createdAt: new Date(),
    };

    task.comments.push(comment);
    await task.save();

    // Return the saved comment with MongoDB _id
    res.status(201).json(task.comments[task.comments.length - 1]);
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Kanban.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
