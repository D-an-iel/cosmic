import { verifyToken } from '../utils/jwt.js';

export const protect = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('--- Protect Middleware Debug ---');
    console.log('Authorization Header:', req.headers.authorization);
    console.log('Extracted Token:', token ? token.substring(0, 10) + '...' : 'NONE');

    if (!token) {
      console.log('Result: No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    const decoded = verifyToken(token);
    console.log('Result: Token verified. Decoded:', decoded);
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Result: Token verification failed. Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};
