import * as user from '../services/user.service.js';
import { success } from '../utils/response.js';

export async function me(req, res) {
  return success(res, await user.profile(req.user.id));
}
