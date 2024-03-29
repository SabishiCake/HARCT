const fs = require('fs');
const path = require('path');
const logName = `${new Date().toISOString().slice(0, 10)}.log`;
const logFolder = path.join(__dirname, '../../app/logs');
const logFile = path.join(logFolder, logName);
const db = require('../db');
/**
 * @name createFile
 * @description Creates a new log file if it doesn't already exist.
 */

const createFile = () => {
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder, { recursive: true });
  }

  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '', 'utf8');
  }
};

const getApiKeyType = async (apiKey) => {
  const sql = `SELECT type FROM api_keys WHERE api_key = ?`;
  const params = [apiKey];
  const rows = await db.query(sql, params);
  if (rows.length > 0) {
    const apiKeyType = rows[0].type;
    return apiKeyType;
  }
  return null; // Return null if no matching API key is found
};

/**
 * @name logRequest
 * @description Middleware function for logging incoming requests.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @param {*} next - The next middleware function.
 */

const logRequest = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  // const apiKeyType = await getApiKeyType(apiKey);
  createFile();
  // Log request details to the log file
  const logMessage = `${new Date().toISOString()} - API Key: ${apiKey} - - URL: ${
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
