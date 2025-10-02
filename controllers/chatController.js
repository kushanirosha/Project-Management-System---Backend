const chatService = require("../services/chatService");

const getMessages = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const messages = await chatService.getProjectMessages(projectId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const createMessage = async (req, res, next) => {
  const { projectId } = req.params;
  const { content, senderId, senderName, senderRole, type, replyTo } = req.body;
  let attachmentUrl = null;

  if (req.file) {
    attachmentUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  }

  try {
    const message = await chatService.addMessage({
      projectId: req.params.projectId,
      content: req.body.content,
      senderId: req.body.senderId,
      senderName: req.body.senderName, 
      senderRole: req.body.senderRole, 
      type: req.body.type || "text",
      attachmentUrl: req.file ? `/uploads/${req.file.filename}` : null,
      replyTo: req.body.replyTo || null,
    });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMessages,
  createMessage,
};
