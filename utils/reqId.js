const crypto = require('crypto');

exports.generateRandomReqId = () => {
    return crypto.randomBytes(16).toString('hex')
}