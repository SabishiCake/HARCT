const fs = require('fs');
const logName = `${new Date().toISOString().slice(0, 10)}.log`;
const logFile = __dirname + '/../logs/' + logName;

/**
 * @name createFile
 * @description Creates a new log file if it doesn't already exist.
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
 * @description Middleware function for logging incoming requests.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @param {*} next - The next middleware function.
 */

const logRequest = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  // Check if the log file exists, if not, create it
  if (!fs.existsSync(logFile)) {
    createFile();
  }

  // Log request details to the log file
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
