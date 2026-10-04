import { Router } from 'express';
import * as controller from '../controllers/store.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listQuerySchema } from '../validators/query.validators.js';
import { ratingSchema } from '../validators/rating.validators.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  validate((body, query) => listQuerySchema(query)),
  asyncHandler(controller.list)
);

router.post(
  '/:storeId/ratings',
  validate(ratingSchema),
  authorize('USER'),
  asyncHandler(controller.rate)
);

router.get(
  '/owner/dashboard',
  authorize('OWNER'),
  validate((body, query) => listQuerySchema(query)),
  asyncHandler(controller.ownerDashboard)
);

export default router;
