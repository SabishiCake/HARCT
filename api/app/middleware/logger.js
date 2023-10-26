
const fs = require('fs');
const logName = `${new Date().toISOString().slice(0, 10)}.log`;
const logFile = __dirname + '/../logs/' + logName ;

const createFile = () => {
  fs.writeFile( logFile, '', (err) => {
    if (err) {
      console.error('Error creating log file:', err);
    }
  });
};

const logRequest = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!fs.existsSync(logFile)) {
    createFile();
  }
  const logMessage = `${new Date().toISOString()} - API Key: ${apiKey} - URL: ${req.originalUrl} - Method: ${req.method}\n`;
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
  next();
};

module.exports = logRequest;
