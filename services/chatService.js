const chatRepository = require("../repositories/chatRepository");

const getProjectMessages = async (projectId) => {
  return await chatRepository.getMessagesByProjectId(projectId);
};

const addMessage = async (messageData) => {
  return await chatRepository.createMessage(messageData);
};

module.exports = {
  getProjectMessages,
  addMessage,
};
