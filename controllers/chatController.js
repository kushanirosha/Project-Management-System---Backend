const chatService = require("../services/chatService");
const path = require("path");

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
  try {
    const { projectId } = req.params;
    const { content, senderId, senderName, senderRole, replyTo } = req.body;

    let type = "text";
    let attachmentUrl = null;

    if (req.file) {
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(fileExt);
      type = isImage ? "image" : "document";
      attachmentUrl = `${req.protocol}://${req.get("host")}/uploads/chat/${req.file.filename}`;
    }

    const message = await chatService.addMessage({
      projectId,
      content: content || "",
      senderId,
      senderName,
      senderRole,
      type,
      attachmentUrl,
      replyTo: replyTo || null,
    });

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMessages,
  createMessage,
};
