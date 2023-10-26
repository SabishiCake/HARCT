// Generates a reversible 8-digit ID from a UUID
// This 8-digit ID configuration won't last long lmao
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const generateUniqueID = () => {
    const uuid = uuidv4();
    const hash = crypto.createHash('sha1').update(uuid).digest('hex');
    const truncatedHash = hash.substring(0, 6);
    const numericID = parseInt(truncatedHash, 16);
    console.log(`Generated ID: ${numericID}`);
    return numericID;
};


module.exports = generateUniqueID;