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
      projectId,
      content,
      senderId,
      senderName,
      senderRole,
      type: req.file ? (req.file.mimetype.startsWith("image/") ? "image" : "document") : type,
      attachmentUrl,
      replyTo: replyTo || null,
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
