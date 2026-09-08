import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
