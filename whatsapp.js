const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const winston = require('winston');

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

function createWhatsAppClient(onMessage) {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
  });

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    logger.info('Scan QR code with WhatsApp to connect.');
  });

  client.on('ready', () => {
    logger.info('WhatsApp bot is ready!');
  });

  client.on('message', async msg => {
    try {
      await onMessage(msg);
    } catch (err) {
      logger.error('Error handling message:', err);
    }
  });

  client.on('disconnected', reason => {
    logger.warn('WhatsApp disconnected:', reason);
    logger.info('Attempting to reconnect...');
    client.initialize();
  });

  client.on('auth_failure', msg => {
    logger.error('Auth failure:', msg);
  });

  client.initialize();
  return client;
}

module.exports = { createWhatsAppClient };
