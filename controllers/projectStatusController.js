const kanbanRepo = require("../repositories/kanbanRepository");

exports.getProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await kanbanRepo.findTasksByProject(projectId);

    if (!tasks || tasks.length === 0) {
      return res.json({ projectId, stage: "to do", progress: 0 });
    }

    const total = tasks.length;
    const done = tasks.filter((t) => t.stage.toLowerCase() === "done").length;
    const review = tasks.filter((t) => t.stage.toLowerCase() === "review").length;
    const inProgress = tasks.filter((t) => t.stage.toLowerCase() === "in progress").length;

    let stage = "to do";
    if (done === total) stage = "done";
    else if (review > 0) stage = "review";
    else if (inProgress > 0) stage = "in progress";

    const progress = Math.round((done / total) * 100);

    res.json({ projectId, stage, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
