import { Router } from 'express';
import * as markerController from '../controllers/markerController';
import { protect } from '../middleware/authMiddleware';
import multer from 'multer';
function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  protect,
  upload.single('image'),
  asyncHandler(markerController.addMarker)
);
router.get('/me', protect, asyncHandler(markerController.getUserMarkers));
router.put('/:id', protect, asyncHandler(markerController.updateMarker));
router.patch('/:id', protect, asyncHandler(markerController.updateMarker));
router.delete('/:id', protect, asyncHandler(markerController.deleteMarker));
router.get('/nearby', asyncHandler(markerController.getMarkersNearby));
router.get('/:id', asyncHandler(markerController.getMarker));

export default router;
