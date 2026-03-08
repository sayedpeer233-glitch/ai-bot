require('dotenv').config();
const express = require('express');
const winston = require('winston');
const { askAI } = require('./ai');
const { createWhatsAppClient } = require('./whatsapp');
const { getContext, addMessage } = require('./memory');

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('WhatsApp AI Chatbot is running.');
});

app.listen(PORT, () => {
  logger.info(`Express server running on port ${PORT}`);
});

const helpText = `Available commands:\n!help - Show this help\n!ai <message> - Ask AI a question`;

function isGroup(msg) {
  return msg.from.endsWith('@g.us');
}

async function handleMessage(msg) {
  const chatId = msg.from;
  const text = msg.body.trim();

  if (text === '!help') {
    await msg.reply(helpText);
    return;
  }

  if (text.startsWith('!ai ')) {
    const prompt = text.slice(4).trim();
    if (!prompt) {
      await msg.reply('Usage: !ai <your question>');
      return;
    }
    addMessage(chatId, 'user', prompt);
    const context = getContext(chatId);
    const aiReply = await askAI(prompt, context);
    addMessage(chatId, 'assistant', aiReply);
    await msg.reply(aiReply);
    return;
  }

  // Default: respond to all messages
  addMessage(chatId, 'user', text);
  const context = getContext(chatId);
  const aiReply = await askAI(text, context);
  addMessage(chatId, 'assistant', aiReply);
  await msg.reply(aiReply);
}

createWhatsAppClient(handleMessage);
