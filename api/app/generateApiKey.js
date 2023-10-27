const crypto = require('crypto');
const db = require(__dirname + '/db');

/**
 * @name generateApiKey
 * @description Generates API key
 * @returns {string} API key
 */

const generateApiKey = () => {
  return crypto.randomBytes(20).toString('hex');
};

/**
 * @name saveApiKeyToDatabase
 * @description Generate and Saves API key to database
 *
 * @param {*} apiKey
 * @param {*} description
 * @param {*} keyType
 */

const saveApiKeyToDatabase = (apiKey, description, keyType) => {
  if (!keyType) {
    keyType = 'free';
  }
  const sql =
    'INSERT INTO APIKeys (APIKey, Description, Type) VALUES (?, ?, ?)';
  db.query(sql, [apiKey, description, keyType], (err, result) => {
    if (err) {
      console.error('Error saving API key to database:', err);
    } else {
      console.log('API key saved to database');
      console.log('API key:', apiKey);
      console.log('Copy this Key and save it somewhere safe.');
    }
  });
};

// Generate and save API key
const apiKey = generateApiKey();
const description = 'Description of your API key'; // Change this to your desired description
const keyType = 'free'; // Change this to 'free' or 'paid' or Whatever you want
saveApiKeyToDatabase(apiKey, description, keyType);
