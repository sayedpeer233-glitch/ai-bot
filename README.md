# WhatsApp AI Chatbot

A Node.js WhatsApp chatbot powered by local LLM (Ollama) and OpenAI GPT, with QR code login, group support, auto-reconnect, and simple memory.

## Features
- WhatsApp integration via whatsapp-web.js
- QR code generation in terminal
- AI responses via Ollama (local LLM) or OpenAI (fallback)
- Commands: !help, !ai <message>
- Group chat support
- Auto reconnect
- Simple memory for conversation context
- Error handling and logging

## Installation
1. Clone/download the project.
2. Navigate to the project directory.
3. Install dependencies:
   ```
   npm install
   ```
4. Copy `.env.example` to `.env` and fill in your OpenAI API key.

## Example .env
```
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
OLLAMA_URL=http://localhost:11434
```

## Usage
Start the bot:
```
node index.js
```

Scan the QR code with WhatsApp to connect.

## Available Commands
- `!help` — Show available commands
- `!ai <message>` — Ask the AI a question

---

See ai.js and whatsapp.js for implementation details.