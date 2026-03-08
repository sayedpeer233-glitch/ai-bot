# WhatsApp AI Chatbot Project

## Folder Structure

```
ai/
├── .github/
│   └── copilot-instructions.md
├── ai.js
├── whatsapp.js
├── index.js
├── memory.js
├── .env.example
├── package.json
├── README.md
```

## Installation Steps

1. Clone/download the project to your machine.
2. Navigate to the project directory.
3. Install dependencies:
   ```
   npm install
   ```
4. Copy `.env.example` to `.env` and fill in your OpenAI API key.

## Example .env file
```
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
OLLAMA_URL=http://localhost:11434
```

## Commands to Run the Bot
```
node index.js
```

## Features
- WhatsApp integration via whatsapp-web.js
- QR code generation in terminal
- AI responses via Ollama (local LLM) or OpenAI (fallback)
- Commands: !help, !ai <message>
- Group chat support
- Auto reconnect
- Simple memory for conversation context
- Error handling and logging

---

See README.md for more details.