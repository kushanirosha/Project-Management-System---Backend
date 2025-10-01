const Chat = require("../models/Chat");

const getMessagesByProjectId = async (projectId) => {
  return await Chat.find({ projectId }).sort({ createdAt: 1 });
};

const createMessage = async (messageData) => {
  const message = new Chat(messageData);
  return await message.save();
};

module.exports = {
  getMessagesByProjectId,
  createMessage,
};
