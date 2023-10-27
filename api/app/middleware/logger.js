const fs = require('fs');
const logName = `${new Date().toISOString().slice(0, 10)}.log`;
const logFile = __dirname + '/../logs/' + logName;

/**
 * @name createFile
 * @description Creates log file
 */

const createFile = () => {
  fs.writeFile(logFile, '', (err) => {
    if (err) {
      console.error('Error creating log file:', err);
    }
  });
};

/**
 * @name logRequest
 * @description Middleware to log requests
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const logRequest = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!fs.existsSync(logFile)) {
    createFile();
  }

  const logMessage = `${new Date().toISOString()} - API Key: ${apiKey} - URL: ${
    req.originalUrl
  } - Method: ${req.method}`;
  res.on('finish', () => {
    const statusCode = res.statusCode;
    const granted =
      statusCode >= 200 && statusCode < 300 ? 'Granted' : 'Denied';
    const logWithStatus = `${logMessage} - Status: ${statusCode} - Access: ${granted}\n`;
    fs.appendFile(logFile, logWithStatus, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  });
  next();
};

module.exports = logRequest;
