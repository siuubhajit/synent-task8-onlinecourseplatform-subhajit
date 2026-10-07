const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a given user id and role.
 */
const signToken = (userId, role = 'student') => {
  const secret = process.env.JWT_SECRET || 'learnpulse_fallback_secret_key_123';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

/**
 * Verify a token and return decoded payload.
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'learnpulse_fallback_secret_key_123';
  return jwt.verify(token, secret);
};

module.exports = {
  signToken,
  verifyToken
};
