import { AppError } from '../utils/AppError.js';

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema(req.body, req.query, req.params);
    if (error) return next(new AppError(error, 400, 'VALIDATION_ERROR'));
    req.validated = value;
    next();
  };
}
