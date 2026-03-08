const translate = require('google-translate-api-x');
const franc = require('franc');
const axios = require('axios');
const winston = require('winston');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

async function askOllama(prompt, context = []) {
  try {
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama2';
    // For llama3, use /api/generate endpoint and prompt format
    let ollamaPayload;
    let endpoint = `${OLLAMA_URL}/api/chat`;
    if (ollamaModel === 'llama3') {
      endpoint = `${OLLAMA_URL}/api/generate`;
      ollamaPayload = {
        model: ollamaModel,
        prompt,
        stream: false
      };
    } else {
      ollamaPayload = {
        model: ollamaModel,
        messages: [...context, { role: 'user', content: prompt }]
      };
    }
    const response = await axios.post(endpoint, ollamaPayload);
    if (ollamaModel === 'llama3') {
      if (response.data && response.data.response) {
        return response.data.response;
      }
    } else {
      if (response.data && response.data.message) {
        return response.data.message.content;
      }
    }
    throw new Error('No Ollama response');
  } catch (err) {
    logger.warn('Ollama unavailable, falling back to OpenAI:', err.message);
    throw err;
  }
}

async function askOpenAI(prompt, context = []) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: [...context, { role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    }
    throw new Error('No OpenAI response');
  } catch (err) {
    logger.error('OpenAI error:', err.message);
    return 'Sorry, AI is currently unavailable.';
  }
}

async function askAI(prompt, context = []) {
  // Detect language
  let detectedLang = franc(prompt, { minLength: 3 });
  let translatedPrompt = prompt;
  // If Urdu, translate to English for AI
  if (detectedLang === 'urd') {
    try {
      const translation = await translate(prompt, { to: 'en' });
      translatedPrompt = translation.text;
    } catch (err) {
      logger.warn('Translation to English failed:', err.message);
    }
  }
  // AI response
  let aiResponse;
  try {
    aiResponse = await askOllama(translatedPrompt, context);
  } catch (_) {
    aiResponse = await askOpenAI(translatedPrompt, context);
  }
  // If original was Urdu, translate back
  if (detectedLang === 'urd') {
    try {
      const translation = await translate(aiResponse, { to: 'ur' });
      aiResponse = translation.text;
    } catch (err) {
      logger.warn('Translation to Urdu failed:', err.message);
    }
  }
  return aiResponse;
}

module.exports = { askAI };
