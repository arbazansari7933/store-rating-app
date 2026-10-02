import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
  }

  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    next(new AppError('Invalid or expired token.', 401, 'UNAUTHORIZED'));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission for this action.', 403, 'FORBIDDEN'));
    }
    next();
  };
}
