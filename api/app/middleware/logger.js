
const fs = require('fs');

const logRequest = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const logMessage = `${new Date().toISOString()} - API Key: ${apiKey} - URL: ${req.originalUrl} - Method: ${req.method}\n`;
  fs.appendFile('requests.log', logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
  next();
};

module.exports = logRequest;
