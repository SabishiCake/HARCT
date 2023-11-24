const crypto = require('crypto');
const db = require(__dirname + '/db');

/**
 * Generates a random API key.
 * @returns {string} The generated API key.
 */

const generateApiKey = () => {
  return crypto.randomBytes(20).toString('hex');
};

/**
 * Saves the API key along with the description and type to the database.
 * @param {string} apiKey - The API key to be saved.
 * @param {string} description - The description of the API key.
 * @param {string} keyType - The type of the API key (e.g., 'free', 'paid').
 */

const saveApiKeyToDatabase = (apiKey, description, keyType) => {
  if (!keyType) {
    keyType = 'free';
  }
  const sql =
    'INSERT INTO api_keys (api_key, Description, Type) VALUES (?, ?, ?)';
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

// Generate and save API key, this can be all be removed if you don't want to use it
const apiKey = generateApiKey();
const description = 'Description of your API key'; // Change this to your desired description
const keyType = 'free'; // Change this to 'free' or 'paid' or Whatever you want

saveApiKeyToDatabase(apiKey, description, keyType);
