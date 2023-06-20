const crypto = require('crypto');

exports.generateRandomId = () => crypto.randomBytes(16).toString('hex');
