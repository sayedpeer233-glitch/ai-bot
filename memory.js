// Simple in-memory conversation context
const memory = {};

function getContext(chatId) {
  return memory[chatId] || [];
}

function addMessage(chatId, role, content) {
  if (!memory[chatId]) memory[chatId] = [];
  memory[chatId].push({ role, content });
  // Limit context size
  if (memory[chatId].length > 10) memory[chatId] = memory[chatId].slice(-10);
}

module.exports = { getContext, addMessage };
