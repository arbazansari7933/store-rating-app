import { Router } from 'express';
import * as controller from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUserSchema, createStoreSchema } from '../validators/admin.validators.js';
import { listQuerySchema } from '../validators/query.validators.js';

const router = Router();
router.use(authenticate, authorize('ADMIN'));
router.get('/stats', asyncHandler(controller.stats));
router.get(
  '/users',
  validate((body, query) => listQuerySchema(query)),
  asyncHandler(controller.users)
);
router.get('/users/:id', asyncHandler(controller.userDetails));
router.post(
  '/users',
  validate((body) => createUserSchema(body)),
  asyncHandler(controller.createUser)
);
router.get(
  '/stores',
  validate((body, query) => listQuerySchema(query)),
  asyncHandler(controller.stores)
);
router.post(
  '/stores',
  validate((body) => createStoreSchema(body)),
  asyncHandler(controller.createStore)
);
export default router;
