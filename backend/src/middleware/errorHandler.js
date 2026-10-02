import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function notFound(req, res) {
  res
    .status(404)
    .json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let status = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let code = error.code || 'INTERNAL_ERROR';

  if (error.code === '23505') {
    status = 409;
    message = 'A record with this value already exists.';
    code = 'DUPLICATE_RESOURCE';
  }

  if (error.code === '23503') {
    status = 400;
    message = 'The related record does not exist.';
    code = 'INVALID_REFERENCE';
  }

  if (error instanceof AppError) {
    status = error.statusCode;
    message = error.message;
    code = error.code;
  }

  if (env.nodeEnv !== 'test') console.error(error);

  res.status(status).json({
    success: false,
    code,
    message,
    ...(env.nodeEnv === 'development' ? { stack: error.stack } : {}),
  });
}
