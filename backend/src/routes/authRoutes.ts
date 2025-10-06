import { Router } from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
const router = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/profile', protect, asyncHandler(authController.getProfile));
router.post('/token/refresh', asyncHandler(authController.refreshToken));
router.post('/logout', protect, asyncHandler(authController.logout));
export default router;
