const crypto = require('crypto');

exports.generateRandomReqId = () => crypto.randomBytes(16).toString('hex');
