import { Router } from 'express';
import { login, signup, me, changePassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/security.js';
import { loginSchema, signupSchema, passwordSchema } from '../validators/auth.validators.js';

const router = Router();
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(login));
router.post('/signup', authLimiter, validate(signupSchema), asyncHandler(signup));
router.get('/me', authenticate, asyncHandler(me));
router.patch('/password', authenticate, validate(passwordSchema), asyncHandler(changePassword));
export default router;
